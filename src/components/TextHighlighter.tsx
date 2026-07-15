import { useCallback, useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { annotate } from 'rough-notation';
import type { RoughAnnotation } from 'rough-notation/lib/model';
import { useReveal } from '../hooks/useReveal';

type AnnotationAction = 'highlight' | 'underline' | 'box' | 'circle' | 'strike-through' | 'crossed-off' | 'bracket';

interface TextHighlighterProps {
  children: ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
  className?: string;
}

export function TextHighlighter({
  children,
  action = 'highlight',
  color = '#e7e9f4',
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  className,
}: TextHighlighterProps) {
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const { ref: revealRef, visible } = useReveal<HTMLSpanElement>(0.1);

  const setRefs = useCallback(
    (node: HTMLSpanElement | null) => {
      elementRef.current = node;
      revealRef.current = node;
    },
    [revealRef],
  );

  const shouldShow = !isView || visible;

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!shouldShow || !element) return;

    let annotation: RoughAnnotation | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let showTimeout: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const draw = () => {
      if (cancelled || !element) return;
      annotation = annotate(element, {
        type: action,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      });
      annotation.show();

      resizeObserver = new ResizeObserver(() => {
        annotation?.hide();
        annotation?.show();
      });
      resizeObserver.observe(element);
      resizeObserver.observe(document.body);
    };

    // Web fonts (e.g. Manrope) load asynchronously and the parent Reveal
    // wrapper animates opacity/transform on mount, both of which can shift
    // the text after paint. Wait for both to settle before drawing the
    // stroke once, instead of drawing early and having it jump into place.
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => {
      if (cancelled) return;
      showTimeout = setTimeout(draw, 850);
    });

    return () => {
      cancelled = true;
      if (showTimeout) clearTimeout(showTimeout);
      annotation?.remove();
      resizeObserver?.disconnect();
    };
  }, [shouldShow, action, color, strokeWidth, animationDuration, iterations, padding, multiline]);

  return (
    <span ref={setRefs} className={`text-highlighter${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  );
}
