// Sonido de la web, todo sintetizado con WebAudio (sin ficheros):
//  - ambiente: un pad suave que va cambiando de acorde, con filtro que respira,
//    reverb y alguna nota aguda suelta de vez en cuando. Nunca suena igual.
//  - tics: clic corto al cambiar de proyecto y otro más leve al pasar por enlaces.

let ctx: AudioContext | null = null;
let master: GainNode;
let fx: GainNode; // tics, sin reverb
let padBus: BiquadFilterNode; // entrada del pad (filtro → seco + reverb)
let sparkBus: GainNode; // notas sueltas → reverb
let enabled = false;
let timers: number[] = [];

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

// Acordes abiertos en Re mayor: Dmaj9 · Bm11 · Gmaj7(#11) · A6/9
const CHORDS = [
  [50, 57, 64, 66, 69],
  [47, 54, 62, 64, 69],
  [43, 50, 59, 66, 69],
  [45, 52, 61, 64, 71],
];
const SPARKLE = [74, 76, 78, 81, 83, 86, 88]; // pentatónica aguda
const CHORD_EVERY = 9; // segundos
const FADE_IN = 2.5;

function impulse(c: AudioContext, seconds: number, decay: number) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

function build() {
  const c = new AudioContext();
  master = c.createGain();
  master.gain.value = 0;
  const comp = c.createDynamicsCompressor();
  master.connect(comp).connect(c.destination);

  fx = c.createGain();
  fx.gain.value = 1;
  fx.connect(comp);

  const reverb = c.createConvolver();
  reverb.buffer = impulse(c, 5, 2.6);
  const wet = c.createGain();
  wet.gain.value = 0.55;
  reverb.connect(wet).connect(master);

  // Filtro paso bajo que «respira» despacio.
  padBus = c.createBiquadFilter();
  padBus.type = 'lowpass';
  padBus.frequency.value = 900;
  padBus.Q.value = 0.6;
  const lfo = c.createOscillator();
  const lfoAmt = c.createGain();
  lfo.frequency.value = 0.05;
  lfoAmt.gain.value = 450;
  lfo.connect(lfoAmt).connect(padBus.frequency);
  lfo.start();
  const dry = c.createGain();
  dry.gain.value = 0.7;
  padBus.connect(dry).connect(master);
  padBus.connect(reverb);

  sparkBus = c.createGain();
  sparkBus.gain.value = 0.5;
  sparkBus.connect(reverb);
  sparkBus.connect(master);

  return c;
}

/** Un acorde que entra despacio, se sostiene y se apaga solapándose con el siguiente. */
function playChord(notes: number[], at: number) {
  const c = ctx!;
  const hold = CHORD_EVERY + 1;
  for (const n of notes) {
    for (const [type, detune] of [
      ['sine', -6],
      ['triangle', 6],
    ] as const) {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      o.frequency.value = midi(n);
      o.detune.value = detune;
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(type === 'sine' ? 0.035 : 0.014, at + 3);
      g.gain.setValueAtTime(type === 'sine' ? 0.035 : 0.014, at + hold);
      g.gain.linearRampToValueAtTime(0, at + hold + 4);
      o.connect(g).connect(padBus);
      o.start(at);
      o.stop(at + hold + 4.2);
    }
  }
}

function playSparkle(at: number) {
  const c = ctx!;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = 'sine';
  o.frequency.value = midi(SPARKLE[Math.floor(Math.random() * SPARKLE.length)]);
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(0.03, at + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, at + 3.5);
  o.connect(g).connect(sparkBus);
  o.start(at);
  o.stop(at + 3.6);
}

function startAmbient() {
  const c = ctx!;
  let chord = Math.floor(Math.random() * CHORDS.length);
  const nextChord = () => {
    if (!enabled) return;
    playChord(CHORDS[chord], c.currentTime + 0.05);
    chord = (chord + 1) % CHORDS.length;
    timers.push(window.setTimeout(nextChord, CHORD_EVERY * 1000));
  };
  const nextSparkle = () => {
    if (!enabled) return;
    if (Math.random() < 0.7) playSparkle(c.currentTime + 0.05);
    timers.push(window.setTimeout(nextSparkle, 2500 + Math.random() * 4500));
  };
  nextChord();
  timers.push(window.setTimeout(nextSparkle, 3000));
}

function stopAmbient() {
  timers.forEach(clearTimeout);
  timers = [];
}

export function setSound(on: boolean) {
  if (on === enabled) return;
  enabled = on;
  if (on) {
    ctx ??= build();
    void ctx.resume();
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(1, t + FADE_IN);
    startAmbient();
  } else if (ctx) {
    stopAmbient();
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0, t + 1.2);
    const c = ctx;
    window.setTimeout(() => !enabled && c.suspend(), 1400);
  }
}

// Si la pestaña se oculta, se pausa; al volver, sigue.
document.addEventListener('visibilitychange', () => {
  if (!ctx || !enabled) return;
  if (document.hidden) void ctx.suspend();
  else void ctx.resume();
});

function blip(freq: number, to: number, peak: number, len: number) {
  if (!enabled || !ctx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(to, t + len * 0.7);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  o.connect(g).connect(fx);
  o.start(t);
  o.stop(t + len + 0.01);
}

/** Clic al cambiar de proyecto. */
export function tick(pitch = 1) {
  blip(1400 * pitch, 600 * pitch, 0.08, 0.07);
}

/** Toque muy leve al pasar el ratón por un enlace o botón. */
export function hoverTick() {
  blip(2400, 1800, 0.025, 0.04);
}
