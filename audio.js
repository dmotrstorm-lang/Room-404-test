(function () {
  // Optional real files: R404.audio.files.click = 'assets/audio/effects/click.mp3'
  const A = {
    ctx: null, master: null, files: {}, set: R404.save.settings(),
    init() {
      if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      this.ctx = new C(); this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination);
      this.apply(); this.hum();
    },
    apply() { if (this.master) this.master.gain.value = this.set.muted ? 0 : this.set.vol; R404.save.saveSettings(this.set); },
    hum() {
      const c = this.ctx, g = c.createGain(); g.gain.value = 0.07;
      const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 160;
      [48, 50.2, 96.5].forEach((fr, i) => { const o = c.createOscillator(); o.frequency.value = fr; o.type = i === 2 ? 'triangle' : 'sine'; o.connect(f); o.start(); });
      const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 0.03; lfo.connect(lg); lg.connect(g.gain); lfo.start();
      f.connect(g); g.connect(this.master);
    },
    tone(fr, d, type, vol, to) {
      const c = this.ctx, o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
      o.type = type || 'sine'; o.frequency.setValueAtTime(fr, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
      g.gain.setValueAtTime(vol || 0.1, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(this.master); o.start(t); o.stop(t + d);
    },
    noise(d, cut, vol) {
      const c = this.ctx, n = c.sampleRate * d, b = c.createBuffer(1, n, c.sampleRate), data = b.getChannelData(0);
      for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      f.type = 'lowpass'; f.frequency.value = cut; g.gain.value = vol; s.buffer = b; s.connect(f); f.connect(g); g.connect(this.master); s.start();
    },
    play(name) {
      if (!this.ctx || this.set.muted) return;
      if (this.files[name]) { try { const a = new Audio(this.files[name]); a.volume = this.set.vol; a.play(); return; } catch (e) {} }
      switch (name) {
        case 'click': this.tone(900, 0.04, 'square', 0.04); break;
        case 'door': this.noise(0.5, 400, 0.5); this.tone(70, 0.4, 'sine', 0.2, 40); break;
        case 'pickup': this.tone(520, 0.12, 'triangle', 0.1); setTimeout(() => this.tone(780, 0.2, 'triangle', 0.1), 110); break;
        case 'shift': this.tone(220, 1.2, 'sawtooth', 0.06, 40); this.noise(0.9, 900, 0.25); break;
        case 'note': this.tone(330, 0.8, 'sine', 0.07); this.tone(392, 1, 'sine', 0.05); break;
        case 'deny': this.tone(140, 0.15, 'square', 0.06); break;
        case 'boot': this.noise(0.6, 2000, 0.15); this.tone(60, 0.6, 'sine', 0.1); break;
      }
    }
  };
  R404.audio = A;
})();
