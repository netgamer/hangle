// ============================================================
// 2단계: 모음 - 듀오링고 플로우
// ============================================================

const Step2 = {
  items: DATA.vowels,
  exercises: [], idx: 0, total: 0, selected: null, cursor: 0,

  init() {
    this.cursor = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (SRS.isLearned(`v_${this.items[i].char}`)) this.cursor = i + 1;
      else break;
    }
    this.buildExercises();
  },

  buildExercises() {
    this.exercises = [];
    if (this.cursor >= this.items.length) {
      App.shuffle([...this.items]).slice(0, 8).forEach(item => this.exercises.push({ type: 'quiz', item }));
    } else {
      const newItems = this.items.slice(this.cursor, this.cursor + 3);
      newItems.forEach(item => {
        this.exercises.push({ type: 'learn', item });
        this.exercises.push({ type: 'quiz', item });
      });
    }
    this.idx = 0; this.total = this.exercises.length;
    this.run();
  },

  run() {
    App.hideFeedback();
    if (App.hearts <= 0) { this.showEnd('fail'); return; }
    if (this.idx >= this.exercises.length) { this.showEnd('done'); return; }
    App.updateTopBar(this.idx, this.total);
    const ex = this.exercises[this.idx];
    if (ex.type === 'learn') this.showLearn(ex.item); else this.showQuiz(ex.item);
  },

  showLearn(item) {
    const area = document.getElementById('lesson-area');
    const emoji = item.hint.split(' ').pop();
    area.innerHTML = `
      <div class="q-prompt">새로운 모음이에요!</div>
      <div class="learn-card" onclick="App.speak('${item.char}')">
        <div class="lc-emoji">${emoji}</div>
        <div class="lc-char" style="color:var(--blue)">${item.char}</div>
        <div class="lc-sub">${item.name} · ${item.roman}</div>
        <div class="lc-hint">${item.hint}</div>
        <div class="lc-tap">👆 터치하면 소리가 나요</div>
      </div>
    `;
    Sound.flip();
    setTimeout(() => App.speak(item.char), 400);
    SRS.markLearned(`v_${item.char}`);
    App.showContinue('Step2.advance()');
  },

  advance() { this.idx++; this.run(); },

  showQuiz(item) {
    this.selected = null;
    const area = document.getElementById('lesson-area');
    const allChars = this.items.map(v => v.char);
    const opts = App.genOpts(item.char, allChars, 4);
    const listen = Math.random() > 0.4;

    area.innerHTML = `
      ${listen ? `
        <div class="q-prompt">들리는 소리의 모음을 골라요</div>
        <button class="q-listen" onclick="App.speak('${item.char}')">🔊 듣기</button>
      ` : `
        <div class="q-prompt">"${item.name}" (${item.roman}) 은 어떤 글자?</div>
      `}
      <div class="opts">
        ${opts.map(o => `<button class="opt" data-v="${o}" onclick="Step2.select(this)">${o}</button>`).join('')}
      </div>
    `;
    App.showCheckDisabled();
    this._correct = item.char; this._item = item;
    if (listen) setTimeout(() => App.speak(item.char), 300);
  },

  select(btn) {
    Sound.select();
    document.querySelectorAll('.opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.selected = btn.dataset.v;
    App.showCheckReady('Step2.check()');
  },

  check() {
    const c = this._correct, ok = this.selected === c;
    document.querySelectorAll('.opt').forEach(b => {
      if (b.dataset.v === c) b.classList.add('correct-show');
      else if (b.classList.contains('selected') && !ok) b.classList.add('wrong-show');
      else b.classList.add('dim');
      b.style.pointerEvents = 'none';
    });
    SRS.record(`v_${c}`, ok);
    if (ok) {
      App.showCorrectFeedback(() => { this.idx++; this.run(); });
    } else {
      this.exercises.push({ type: 'quiz', item: this._item });
      this.total = this.exercises.length;
      App.showWrongFeedback(`${c} (${this._item.name})`, () => { this.idx++; this.run(); });
    }
  },

  showEnd(type) {
    App.hideBottom();
    const area = document.getElementById('lesson-area');
    if (type === 'fail') {
      Sound.gameOver();
      area.innerHTML = `<div class="done-screen"><div class="d-emoji">💔</div><h2>하트가 없어요!</h2><p>다시 도전해요</p><button class="d-btn green" onclick="App.startLesson(2)">다시 하기</button><button class="d-btn blue" onclick="App.goHome()" style="margin-top:0.4rem">홈으로</button></div>`;
      return;
    }
    Sound.complete();
    this.cursor = Math.min(this.cursor + 3, this.items.length);
    SRS.setProgress(2, Math.round((this.cursor / this.items.length) * 100));
    SRS.bumpStreak();
    const allDone = this.cursor >= this.items.length;
    area.innerHTML = `
      <div class="done-screen">
        <div class="d-emoji">${allDone ? '🌈' : '👏'}</div>
        <h2>${allDone ? '모음 완료!' : '잘했어요!'}</h2>
        <div class="d-xp">+${this.exercises.filter(e => e.type === 'quiz').length * 10} ⭐</div>
        <p>${allDone ? '모음을 모두 익혔어요!' : `${this.cursor}/${this.items.length} 모음 학습 완료`}</p>
        ${allDone ? '' : `<button class="d-btn green" onclick="Step2.buildExercises()">계속 배우기</button>`}
        <button class="d-btn blue" onclick="App.goHome()" style="margin-top:0.4rem">홈으로</button>
      </div>`;
  },
};
