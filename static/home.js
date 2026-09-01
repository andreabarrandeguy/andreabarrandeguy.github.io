// ---------- dark / light toggle ----------
(function () {
  var modeBtn = document.getElementById('modeToggle');
  function setMode(dark) {
    document.body.classList.toggle('dark-mode', dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  }
  modeBtn.addEventListener('click', function () {
    setMode(!document.body.classList.contains('dark-mode'));
  });
})();

// ---------- nav identity reveal on scroll ----------
(function () {
  var heroName = document.getElementById('heroName');
  var navIdentity = document.getElementById('navIdentity');
  var rafId = null;

  function update() {
    rafId = null;
    var visible = heroName.getBoundingClientRect().bottom < 70;
    navIdentity.classList.toggle('visible', visible);
  }
  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(update);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();

// ---------- copy email to clipboard ----------
(function () {
  var copyBtn = document.getElementById('copyEmailBtn');
  var toast = document.getElementById('copyToast');
  var toastTimer = null;

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  copyBtn.addEventListener('click', function () {
    var text = 'andreabarrandeguy@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () { fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('visible'); }, 2000);
  });
})();

// ---------- view CV ----------
(function () {
  document.getElementById('viewCvBtn').addEventListener('click', function () {
    window.open('./img/Andrea Barrandeguy_en.pdf', '_blank');
  });
})();

// ---------- phone scroll-flight animation (hero -> work slots) ----------
(function () {
  var HERO_FRAC = [
    { x: 0.63, y: 0.58, rot: -12, scale: 1.3 },
    { x: 0.71, y: 0.4, rot: 2, scale: 1.3 },
    { x: 0.79, y: 0.62, rot: 10, scale: 1.3 },
  ];
  var HERO_Z = [2, 3, 2];
  var PARAGRAPH_RIGHT = 624;
  var FINAL_ROT = [-5, 0, 5];
  var FINAL_SCALE = [1, 1.08, 1];

  function PhoneFlight() {
    this.hero = document.getElementById('hero');
    this.slots = [0, 1, 2].map(function (i) { return document.getElementById('slot-' + i); });
    this.overlays = [0, 1, 2].map(function (i) { return document.getElementById('phone-' + i); });
    this.ready = false;
    this.metrics = { heroRect: null, slots: [null, null, null] };
    this.scrollRAF = null;
    this.resizeTimer = null;
    this.mq = window.matchMedia('(min-width: 1301px)');
    this.enabled = this.mq.matches;

    var self = this;
    this.measure = this.measure.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);

    if (!this.hero || this.slots.some(function (s) { return !s; }) || this.overlays.some(function (o) { return !o; })) {
      return;
    }

    if (this.mq.addEventListener) {
      this.mq.addEventListener('change', function (e) {
        self.enabled = e.matches;
        if (self.enabled) {
          self.attach();
        } else {
          self.detach();
        }
      });
    }

    if (this.enabled) this.attach();
  }

  PhoneFlight.prototype.attach = function () {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize);
    requestAnimationFrame(this.measure);
    setTimeout(this.measure, 300);
  };

  PhoneFlight.prototype.detach = function () {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    if (this.scrollRAF) cancelAnimationFrame(this.scrollRAF);
    clearTimeout(this.resizeTimer);
    this.ready = false;
    this.overlays.forEach(function (el) {
      el.style.cssText = 'position:fixed; left:-9999px; top:-9999px; width:220px; height:478px; opacity:0; pointer-events:none;';
    });
  };

  PhoneFlight.prototype.measure = function () {
    var scrollY = window.scrollY;
    var hr = this.hero.getBoundingClientRect();
    this.metrics.heroRect = { left: hr.left, top: hr.top + scrollY, width: hr.width, height: hr.height };
    this.metrics.slots = this.slots.map(function (n) {
      var r = n.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + scrollY + r.height / 2 };
    });
    this.ready = true;
    this.render();
  };

  PhoneFlight.prototype.onScroll = function () {
    if (this.scrollRAF) return;
    var self = this;
    this.scrollRAF = requestAnimationFrame(function () {
      self.scrollRAF = null;
      self.render();
    });
  };

  PhoneFlight.prototype.onResize = function () {
    clearTimeout(this.resizeTimer);
    var self = this;
    this.resizeTimer = setTimeout(function () { self.measure(); }, 150);
  };

  PhoneFlight.prototype.clusterShift = function () {
    var m = this.metrics;
    var shiftX = 0, shiftY = 0;
    HERO_FRAC.forEach(function (f) {
      var rad = (f.rot * Math.PI) / 180;
      var w = 220 * f.scale, h = 478 * f.scale;
      var halfW = (Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad))) / 2;
      var halfH = (Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad))) / 2;
      var textSafeX = m.heroRect.left + PARAGRAPH_RIGHT + halfW + 20;
      var fracX = m.heroRect.left + m.heroRect.width * f.x;
      shiftX = Math.max(shiftX, textSafeX - fracX);
      var navSafeTop = m.heroRect.top + halfH + 90;
      var fracY = m.heroRect.top + m.heroRect.height * f.y;
      shiftY = Math.max(shiftY, navSafeTop - fracY);
    });
    return { shiftX: shiftX, shiftY: shiftY };
  };

  PhoneFlight.prototype.styleFor = function (i) {
    var m = this.metrics;
    if (!this.ready) {
      return 'position:fixed; left:-9999px; top:-9999px; width:220px; height:478px; opacity:0; pointer-events:none;';
    }
    var f = HERO_FRAC[i];
    var shift = this.clusterShift();
    var fracX = m.heroRect.left + m.heroRect.width * f.x;
    var heroX = fracX + shift.shiftX;
    var fracY = m.heroRect.top + m.heroRect.height * f.y;
    var heroY = fracY + shift.shiftY;
    var finalPos = m.slots[i];
    var scrollY = window.scrollY;
    var rangeEnd = Math.max(finalPos.y - window.innerHeight * 0.5, 300);
    var progress = Math.min(1, Math.max(0, scrollY / rangeEnd));
    var docX = heroX + (finalPos.x - heroX) * progress;
    var docY = heroY + (finalPos.y - heroY) * progress;
    var rot = f.rot + (FINAL_ROT[i] - f.rot) * progress;
    var scale = f.scale + (FINAL_SCALE[i] - f.scale) * progress;
    var pinned = progress >= 1;
    var top = pinned ? finalPos.y : (docY - scrollY);
    var left = pinned ? finalPos.x : docX;
    var position = pinned ? 'absolute' : 'fixed';
    return 'position:' + position + '; left:' + left + 'px; top:' + top + 'px; width:220px; height:478px; ' +
      'transform:translate(-50%,-50%) rotate(' + rot + 'deg) scale(' + scale + '); ' +
      'z-index:' + HERO_Z[i] + '; pointer-events:auto; opacity:1;';
  };

  PhoneFlight.prototype.render = function () {
    var self = this;
    this.overlays.forEach(function (el, i) {
      el.style.cssText = self.styleFor(i);
    });
  };

  new PhoneFlight();
})();
