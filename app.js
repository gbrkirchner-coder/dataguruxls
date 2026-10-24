(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };

  var nav = d.getElementById('nav');
  var heroDev = d.getElementById('heroDevice');
  var stage = d.getElementById('buehne');
  var stageDev = d.getElementById('stageDevice');
  var shots = [].slice.call(d.querySelectorAll('.shot'));
  var chapters = [].slice.call(d.querySelectorAll('.chapter'));
  var dots = [].slice.call(d.querySelectorAll('.dots li'));
  var par = [].slice.call(d.querySelectorAll('[data-par]'));
  var words = d.getElementById('words');
  var wordEls = [];
  var current = -1;

  // Aussage Wort für Wort aufteilen
  if (words) {
    var txt = words.textContent.trim().split(/\s+/);
    words.setAttribute('aria-label', words.textContent.trim());
    words.textContent = '';
    txt.forEach(function (t, i) {
      var s = d.createElement('span');
      s.className = 'w'; s.setAttribute('aria-hidden', 'true');
      s.textContent = t + (i < txt.length - 1 ? ' ' : '');
      words.appendChild(s); wordEls.push(s);
    });
  }

  // Einblenden beim Scrollen
  var rv = [].slice.call(d.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    rv.forEach(function (el, i) { el.style.transitionDelay = (el.parentElement && el.parentElement.classList.contains('gr-grid') ? (i % 4) * 90 : 0) + 'ms'; io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  function setChapter(i) {
    if (i === current) return; current = i;
    shots.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
    chapters.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
    dots.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
  }

  function frame() {
    var y = window.scrollY, vh = window.innerHeight;
    nav.classList.toggle('solid', y > 12);
    if (reduce.matches) return;
    // Hero-Tablet richtet sich auf
    if (heroDev) heroDev.style.setProperty('--p', ease(clamp(y / (vh * .75), 0, 1)).toFixed(3));
    // Produktbühne
    if (stage) {
      var r = stage.getBoundingClientRect();
      var total = r.height - vh;
      var t = clamp(-r.top / total, 0, .9999);
      var n = chapters.length;
      setChapter(Math.floor(t * n));
      // Einflug: Tablet kippt beim Eintritt flach, am Ende leicht zurück
      var enter = clamp((vh - r.top) / vh, 0, 1);
      stageDev.style.setProperty('--s', ease(enter).toFixed(3));
    }
    // Wörter
    if (wordEls.length) {
      var wr = words.getBoundingClientRect();
      var p = clamp((vh * .85 - wr.top) / (vh * .55 + wr.height), 0, 1);
      var k = Math.round(p * wordEls.length * 1.15);
      wordEls.forEach(function (w, i) { w.classList.toggle('on', i < k); });
    }
    // Leichte Parallaxe in den Kacheln
    par.forEach(function (img) {
      var b = img.getBoundingClientRect();
      var c = (b.top + b.height / 2 - vh / 2) / vh;
      img.style.setProperty('--y', (clamp(c, -1, 1) * -18).toFixed(1) + 'px');
    });
  }
  var tick = false;
  function on() { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; frame(); }); } }
  window.addEventListener('scroll', on, { passive: true });
  window.addEventListener('resize', on);
  reduce.addEventListener && reduce.addEventListener('change', function () { location.reload(); });
  frame();

  // Karussell-Pfeile
  var rail = d.getElementById('rail');
  function step(dir) { var li = rail.querySelector('li'); rail.scrollBy({ left: dir * (li.offsetWidth + 20), behavior: reduce.matches ? 'auto' : 'smooth' }); }
  var pv = d.getElementById('railPrev'), nx = d.getElementById('railNext');
  if (pv) pv.addEventListener('click', function () { step(-1); });
  if (nx) nx.addEventListener('click', function () { step(1); });
})();
