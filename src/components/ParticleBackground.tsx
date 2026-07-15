import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COLORS = [0xffffff, 0xf3f4f8, 0xe7e9f4, 0xe5e7eb];
const LINE_COLOR = 0xe5e7eb;
const CURSOR_LINE_COLOR = 0xc7cbe0;
const MAX_LINK_DISTANCE = 130;
const CURSOR_RADIUS = 160;
const DRIFT_SPEED = 0.05;

function getParticleCount(width: number) {
  const cores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 8;
  const lowPower = cores <= 4;

  let base: number;
  if (width < 560) base = 34;
  else if (width < 900) base = 52;
  else base = 78;

  return lowPower ? Math.round(base * 0.65) : base;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function ParticleBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, width, 0, height, -10, 10);
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const count = getParticleCount(width);
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * DRIFT_SPEED,
      vy: (Math.random() - 0.5) * DRIFT_SPEED,
    }));

    const pointGeometry = new THREE.BufferGeometry();
    const pointPositions = new Float32Array(count * 3);
    const pointColors = new Float32Array(count * 3);
    const colorObj = new THREE.Color();
    for (let i = 0; i < count; i++) {
      colorObj.setHex(PARTICLE_COLORS[i % PARTICLE_COLORS.length]);
      pointColors[i * 3] = colorObj.r;
      pointColors[i * 3 + 1] = colorObj.g;
      pointColors[i * 3 + 2] = colorObj.b;
    }
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    pointGeometry.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));
    const pointMaterial = new THREE.PointsMaterial({
      size: 3.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      sizeAttenuation: false,
    });
    const points = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(points);

    const maxLinkSegments = count * 6;
    const linePositions = new Float32Array(maxLinkSegments * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setDrawRange(0, 0);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: LINE_COLOR,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    const cursorLinePositions = new Float32Array(count * 2 * 3);
    const cursorLineGeometry = new THREE.BufferGeometry();
    cursorLineGeometry.setAttribute('position', new THREE.BufferAttribute(cursorLinePositions, 3));
    cursorLineGeometry.setDrawRange(0, 0);
    const cursorLineMaterial = new THREE.LineBasicMaterial({
      color: CURSOR_LINE_COLOR,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const cursorLines = new THREE.LineSegments(cursorLineGeometry, cursorLineMaterial);
    scene.add(cursorLines);

    const pointer = { x: -9999, y: -9999, active: false };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const handlePointerLeave = () => {
      pointer.active = false;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    let running = false;
    let frameId = 0;

    const step = () => {
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_RADIUS && dist > 0.001) {
            const force = ((CURSOR_RADIUS - dist) / CURSOR_RADIUS) * 0.03;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = DRIFT_SPEED * 2.5;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }

        pointPositions[i * 3] = p.x;
        pointPositions[i * 3 + 1] = p.y;
      }
      pointGeometry.attributes.position.needsUpdate = true;

      let segmentIndex = 0;
      for (let i = 0; i < count && segmentIndex < maxLinkSegments; i++) {
        for (let j = i + 1; j < count && segmentIndex < maxLinkSegments; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_LINK_DISTANCE) {
            const base = segmentIndex * 6;
            linePositions[base] = a.x;
            linePositions[base + 1] = a.y;
            linePositions[base + 2] = 0;
            linePositions[base + 3] = b.x;
            linePositions[base + 4] = b.y;
            linePositions[base + 5] = 0;
            segmentIndex++;
          }
        }
      }
      lineGeometry.setDrawRange(0, segmentIndex * 2);
      lineGeometry.attributes.position.needsUpdate = true;

      let cursorSegmentIndex = 0;
      if (pointer.active) {
        for (let i = 0; i < count; i++) {
          const p = particles[i];
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_RADIUS) {
            const base = cursorSegmentIndex * 6;
            cursorLinePositions[base] = p.x;
            cursorLinePositions[base + 1] = p.y;
            cursorLinePositions[base + 2] = 0;
            cursorLinePositions[base + 3] = pointer.x;
            cursorLinePositions[base + 4] = pointer.y;
            cursorLinePositions[base + 5] = 0;
            cursorSegmentIndex++;
          }
        }
      }
      cursorLineGeometry.setDrawRange(0, cursorSegmentIndex * 2);
      cursorLineGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);

      if (running) {
        frameId = requestAnimationFrame(step);
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      frameId = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frameId);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else if (intersecting) {
        start();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let intersecting = true;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        container.style.opacity = intersecting ? '1' : '0';
        if (intersecting && !document.hidden) {
          start();
        } else {
          stop();
        }
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(container);

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = container.clientWidth;
        height = container.clientHeight;
        camera.right = width;
        camera.bottom = height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    start();

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      intersectionObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      pointGeometry.dispose();
      pointMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      cursorLineGeometry.dispose();
      cursorLineMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={`particle-background${className ? ` ${className}` : ''}`} aria-hidden="true" />;
}
