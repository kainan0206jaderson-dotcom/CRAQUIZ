/* CRAQUIZ — sons da abertura: torcida sintetizada (sem arquivos), palmas e um apito no pouso.
   O navegador só libera som após um toque ou tecla: o som da abertura espera o primeiro gesto e toca
   o que restar da animação. Mudo fica salvo no navegador (localStorage 'mf10:sound'). */
(() => {
  const KEY = 'mf10:sound';
  let muted = false;
  try { muted = localStorage.getItem(KEY) === '0'; } catch (e) { /* sem armazenamento */ }
  let ctx = null, master = null, pending = null, playing = [];

  // ruído de torcida: banda média que sobe e desce, com um "ôôô" leve no meio
  function crowd(c, dest, t0, dur, level) {
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.7;
    bp.frequency.setValueAtTime(700, t0);
    bp.frequency.linearRampToValueAtTime(1500, t0 + dur * 0.55);
    bp.frequency.linearRampToValueAtTime(900, t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(level, t0 + dur * 0.35);
    g.gain.exponentialRampToValueAtTime(level * 0.7, t0 + dur * 0.75);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp).connect(g).connect(dest);
    src.start(t0); src.stop(t0 + dur + 0.05);
  }
  // palmas: estalos curtos de ruído agudo, mais densos perto do fim da animação
  function claps(c, dest, t0, dur, level) {
    const n = Math.round(dur * 5);
    for (let k = 0; k < n; k++) {
      const u = Math.sqrt(Math.random());           // concentra as palmas no fim
      const t = t0 + u * dur * 0.9;
      const len = Math.floor(c.sampleRate * 0.05);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const src = c.createBufferSource(); src.buffer = buf;
      const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800;
      const g = c.createGain(); g.gain.value = level * (0.5 + Math.random() * 0.5);
      src.connect(hp).connect(g).connect(dest);
      src.start(t);
    }
  }
  // apito curto de árbitro (duas notas)
  function whistle(c, dest, t0, level) {
    [[0, 0.22], [0.3, 0.55]].forEach(([s, e]) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 2700;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t0 + s);
      g.gain.exponentialRampToValueAtTime(level, t0 + s + 0.02);
      g.gain.setValueAtTime(level, t0 + e - 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + e);
      o.connect(g).connect(dest); o.start(t0 + s); o.stop(t0 + e + 0.02);
    });
  }
  // monta a trilha inteira num contexto (usado ao vivo e nos testes offline)
  function build(c, dest, t0, dur) {
    crowd(c, dest, t0, dur, 0.22);
    claps(c, dest, t0, dur, 0.09);
    whistle(c, dest, t0 + dur - 0.9, 0.16);
  }
  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.8;
    master.connect(comp).connect(ctx.destination);
    return ctx;
  }
  function unlock() {
    const c = ensure();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    if (pending) {
      const left = pending.dur - (performance.now() - pending.at);
      pending = null;
      if (left > 900) play(left / 1000);
    }
  }
  function play(seconds) {
    const c = ensure();
    if (!c || muted) return;
    const t0 = c.currentTime + 0.05;
    build(c, master, t0, seconds);
    playing.push(master);
  }
  // chamado pela abertura: toca agora se já houve gesto; senão, guarda e toca no primeiro toque
  MF.sound = {
    intro(durMs) {
      if (muted) return;
      if (ctx && ctx.state === 'running') play(durMs / 1000);
      else pending = { at: performance.now(), dur: durMs };
    },
    stop() {
      pending = null;
      if (ctx && master) {
        const t = ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(master.gain.value, t);
        master.gain.linearRampToValueAtTime(0.0001, t + 0.5);
        setTimeout(() => { if (master) master.gain.value = muted ? 0 : 0.8; }, 600);
      }
    },
    isMuted: () => muted,
    toggle() {
      muted = !muted;
      try { localStorage.setItem(KEY, muted ? '0' : '1'); } catch (e) { /* ignora */ }
      if (muted) MF.sound.stop(); else ensure();
      if (master) master.gain.value = muted ? 0 : 0.8;
      return muted;
    },
    _build: build,           // para testes offline
  };
  ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => addEventListener(ev, unlock, { capture: true, passive: true }));
})();
