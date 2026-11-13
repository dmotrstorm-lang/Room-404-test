(function () {
  const box = () => document.getElementById('dialogue'), txt = () => document.getElementById('dlg-text');
  const D = { q: [], i: 0, timer: null, typing: false, done: null,
    say(lines, done) {
      this.q = Array.isArray(lines) ? lines.slice() : [lines]; this.i = 0; this.done = done || null; this.show();
    },
    show() {
      const line = this.q[this.i], el = txt(); clearInterval(this.timer); el.textContent = ''; this.typing = true;
      let n = 0; box().classList.remove('more');
      this.timer = setInterval(() => { el.textContent = line.slice(0, ++n); if (n >= line.length) this.finish(); }, 16);
    },
    finish() {
      clearInterval(this.timer); this.typing = false; txt().textContent = this.q[this.i];
      box().classList.toggle('more', this.i < this.q.length - 1 || !!this.done);
    },
    advance() {
      if (!this.q.length) return;
      if (this.typing) return this.finish();
      if (this.i < this.q.length - 1) { this.i++; this.show(); }
      else if (this.done) { const d = this.done; this.done = null; box().classList.remove('more'); d(); }
    },
    clear() { clearInterval(this.timer); this.q = []; this.done = null; txt().textContent = ''; box().classList.remove('more'); }
  };
  R404.dialogue = D;
})();
