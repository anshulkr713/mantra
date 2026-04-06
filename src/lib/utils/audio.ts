/**
 * Web Audio API sound generator for meditation counter.
 * Generates sounds programmatically — no external audio files needed.
 */

let audioContext: AudioContext | null = null;
let audioReadyPromise: Promise<AudioContext | null> | null = null;
let audioUnlocked = false;

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function createAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextConstructor();
  }

  return audioContext;
}

function unlockAudioOutput(ctx: AudioContext): void {
  if (audioUnlocked) {
    return;
  }

  const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();

  source.buffer = buffer;
  gain.gain.value = 0;

  source.connect(gain).connect(ctx.destination);
  source.start();

  audioUnlocked = true;
}

async function ensureAudioContext(): Promise<AudioContext | null> {
  const ctx = createAudioContext();

  if (!ctx) {
    return null;
  }

  if (ctx.state === 'running') {
    unlockAudioOutput(ctx);
    return ctx;
  }

  if (!audioReadyPromise) {
    audioReadyPromise = ctx.resume()
      .then(() => {
        if (ctx.state === 'running') {
          unlockAudioOutput(ctx);
          return ctx;
        }

        return null;
      })
      .catch(() => null)
      .finally(() => {
        audioReadyPromise = null;
      });
  }

  return audioReadyPromise;
}

function withAudio(playback: (ctx: AudioContext) => void): void {
  void ensureAudioContext().then((ctx) => {
    if (!ctx) {
      return;
    }

    playback(ctx);
  });
}

export function primeAudio(): void {
  void ensureAudioContext();
}

/**
 * Play a soft singing bowl / bell tone
 */
export function playBellSound(): void {
  withAudio((ctx) => {
    const now = ctx.currentTime + 0.01;

    // Fundamental tone
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(528, now); // 528Hz — healing frequency

    // Harmonic overtone
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1056, now);

    // Sub-harmonic warmth
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(264, now);

    // Gain envelopes
    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.05, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    const gain3 = ctx.createGain();
    gain3.gain.setValueAtTime(0.08, now);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    // Connect
    osc1.connect(gain1).connect(ctx.destination);
    osc2.connect(gain2).connect(ctx.destination);
    osc3.connect(gain3).connect(ctx.destination);

    // Play
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    osc1.stop(now + 2.0);
    osc2.stop(now + 1.5);
    osc3.stop(now + 2.5);
  });
}

/**
 * Play a subtle click/tap sound
 */
export function playClickSound(): void {
  withAudio((ctx) => {
    const now = ctx.currentTime + 0.01;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  });
}

/**
 * Play a completion chime (round complete)
 */
export function playCompletionSound(): void {
  withAudio((ctx) => {
    const now = ctx.currentTime + 0.01;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.15 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 1.5);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 2);
    });
  });
}
