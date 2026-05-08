// ============================================================
// 효과음 - Web Audio API 합성
// ============================================================

const Sound = {
  _ctx: null,

  ctx() {
    if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this._ctx.state === 'suspended') this._ctx.resume();
    return this._ctx;
  },

  _play(fn) {
    try { fn(this.ctx()); } catch {}
  },

  // ── 버튼 터치 ──
  tap() {
    this._play(ctx => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(800, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + 0.1);
    });
  },

  // ── 선택 (옵션 클릭) ──
  select() {
    this._play(ctx => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(500, ctx.currentTime);
      o.frequency.setValueAtTime(700, ctx.currentTime + 0.06);
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + 0.12);
    });
  },

  // ── 정답 🎵 ──
  correct() {
    this._play(ctx => {
      const notes = [523, 659, 784]; // C5 E5 G5 (도미솔)
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        const t = ctx.currentTime + i * 0.1;
        o.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.2, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.start(t);
        o.stop(t + 0.25);
      });
    });
  },

  // ── 오답 ──
  wrong() {
    this._play(ctx => {
      const notes = [311, 277]; // Eb4 C#4 (불협화음 하강)
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'square';
        const t = ctx.currentTime + i * 0.15;
        o.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.start(t);
        o.stop(t + 0.25);
      });
    });
  },

  // ── 레슨 완료 🎉 (팡파레) ──
  complete() {
    this._play(ctx => {
      // 도미솔도~ 팡파레
      const melody = [
        { f: 523, t: 0,    d: 0.15 },  // C5
        { f: 659, t: 0.12, d: 0.15 },  // E5
        { f: 784, t: 0.24, d: 0.15 },  // G5
        { f: 1047,t: 0.38, d: 0.4  },  // C6 (길게)
      ];
      melody.forEach(n => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        const t = ctx.currentTime + n.t;
        o.frequency.setValueAtTime(n.f, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.22, t + 0.03);
        g.gain.setValueAtTime(0.22, t + n.d * 0.6);
        g.gain.exponentialRampToValueAtTime(0.001, t + n.d);
        o.start(t);
        o.stop(t + n.d);
      });

      // 하모니 레이어
      const harmony = [
        { f: 392, t: 0.38, d: 0.4 },  // G4
        { f: 523, t: 0.38, d: 0.4 },  // C5
      ];
      harmony.forEach(n => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'triangle';
        const t = ctx.currentTime + n.t;
        o.frequency.setValueAtTime(n.f, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.1, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t + n.d);
        o.start(t);
        o.stop(t + n.d);
      });
    });
  },

  // ── 하트 잃음 💔 ──
  heartLost() {
    this._play(ctx => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(400, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + 0.3);
    });
  },

  // ── XP 획득 ⭐ ──
  xp() {
    this._play(ctx => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(880, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + 0.15);
    });
  },

  // ── 카드 뒤집기 / 학습 카드 등장 ──
  flip() {
    this._play(ctx => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(440, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
      g.gain.setValueAtTime(0.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + 0.12);
    });
  },

  // ── 게임오버 (하트 0) ──
  gameOver() {
    this._play(ctx => {
      const notes = [392, 349, 311, 261]; // G4 F4 Eb4 C4 하강
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'triangle';
        const t = ctx.currentTime + i * 0.2;
        o.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.start(t);
        o.stop(t + 0.3);
      });
    });
  },
};
