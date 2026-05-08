// ============================================================
// 간격 반복 + 진행 상태 관리 + 클라우드 동기화
// ============================================================

const SRS = {
  _d() { try { return JSON.parse(localStorage.getItem('hg_srs')) || {}; } catch { return {}; } },
  _s(d) { localStorage.setItem('hg_srs', JSON.stringify(d)); this._syncDebounced(); },

  // 클라우드 동기화 (디바운스: 2초 뒤 한 번만)
  _syncTimer: null,
  _syncDebounced() {
    clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(() => {
      if (typeof SB !== 'undefined' && SB.isLoggedIn()) {
        SB.pushToCloud();
      }
    }, 2000);
  },

  // 학습 완료 기록
  markLearned(id) {
    const d = this._d(); d[id] = d[id] || { ok: 0, no: 0 }; d[id].learned = true; this._s(d);
  },
  isLearned(id) { return this._d()[id]?.learned || false; },

  // 정답/오답
  record(id, correct) {
    const d = this._d();
    d[id] = d[id] || { ok: 0, no: 0, learned: false };
    correct ? d[id].ok++ : d[id].no++;
    this._s(d);
  },

  // 진행률
  getProgress() {
    try { return JSON.parse(localStorage.getItem('hg_prog')) || {}; } catch { return {}; }
  },
  setProgress(step, val) {
    const p = this.getProgress(); p[step] = Math.max(p[step] || 0, val);
    localStorage.setItem('hg_prog', JSON.stringify(p));
    this._syncDebounced();
  },

  // streak
  getStreak() {
    try {
      const s = JSON.parse(localStorage.getItem('hg_streak')) || { c: 0, d: '' };
      const t = new Date().toISOString().slice(0,10);
      const y = new Date(Date.now()-864e5).toISOString().slice(0,10);
      if (s.d === t || s.d === y) return s.c;
      return 0;
    } catch { return 0; }
  },
  bumpStreak() {
    const t = new Date().toISOString().slice(0,10);
    let s;
    try { s = JSON.parse(localStorage.getItem('hg_streak')) || { c:0, d:'' }; } catch { s = {c:0,d:''}; }
    if (s.d === t) return s.c;
    const y = new Date(Date.now()-864e5).toISOString().slice(0,10);
    s.c = s.d === y ? s.c + 1 : 1;
    s.d = t;
    localStorage.setItem('hg_streak', JSON.stringify(s));
    this._syncDebounced();
    return s.c;
  },
};
