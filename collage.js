/* Faded photo collage for every page.
   Put your collage photos next to the pages, named: bg1.jpeg, bg2.jpeg, bg3.jpeg ...
   (01 style names also work; jpeg, jpg, png, webp all work; any number). */
(function () {
  var PREFIX = 'bg';
  var EXTS = ['jpeg', 'jpg', 'png', 'webp'];

  var st = document.createElement('style');
  st.textContent =
    '#collage{position:fixed;inset:-24px;z-index:-1;overflow:hidden;pointer-events:none;display:grid;' +
    'grid-template-columns:repeat(auto-fill,minmax(210px,1fr));grid-auto-rows:260px;gap:12px;opacity:0;transition:opacity 2s ease}' +
    '#collage.on{opacity:1}' +
    '#collage img{width:100%;height:100%;object-fit:cover;border-radius:10px;opacity:.38;filter:sepia(.8) saturate(.9) brightness(.85)}' +
    '#collage::after{content:"";position:absolute;inset:0;background:linear-gradient(#1c110c73,#3b24188c)}';
  document.head.appendChild(st);

  var box = document.createElement('div');
  box.id = 'collage';
  box.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(box, document.body.firstChild);

  var urls = [], built = 0;

  function candidates(i) {
    var nums = i < 10 ? [String(i), '0' + i] : [String(i)], out = [];
    nums.forEach(function (n) { EXTS.forEach(function (e) { out.push(PREFIX + n + '.' + e); }); });
    return out;
  }
  function tryList(list, k, ok, fail) {
    if (k >= list.length) { fail(); return; }
    var im = new Image();
    im.onload = function () { ok(im); };
    im.onerror = function () { tryList(list, k + 1, ok, fail); };
    im.src = list[k];
  }
  function next(i, misses) {
    if (misses >= 3 || i > 300) { fill(); return; }
    tryList(candidates(i), 0,
      function (im) { urls.push(im.src); next(i + 1, 0); },
      function () { next(i + 1, misses + 1); });
  }

  var picks = [], bag = [];
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  // Uses every photo evenly, and never puts the same photo next to or under itself.
  function pick(i, cols) {
    var left = i % cols ? picks[i - 1] : -1, up = i >= cols ? picks[i - cols] : -1;
    if (!bag.length) bag = shuffle(urls.map(function (_, k) { return k; }));
    for (var k = 0; k < bag.length; k++) {
      if (bag[k] !== left && bag[k] !== up) return bag.splice(k, 1)[0];
    }
    for (var j = 0; j < urls.length; j++) if (j !== left && j !== up) return j;
    return 0;
  }

  function fill() {
    if (!urls.length) return;
    var cols = getComputedStyle(box).gridTemplateColumns.split(' ').length || 2;
    var rows = Math.ceil((innerHeight + 48) / 272);
    var want = Math.min(cols * rows, 120);
    for (; built < want; built++) {
      var p = pick(built, cols);
      picks.push(p);
      var t = new Image();
      t.alt = '';
      t.src = urls[p];
      t.style.transform = 'rotate(' + (((built * 37) % 9) - 4) + 'deg) scale(1.04)';
      box.appendChild(t);
    }
    box.classList.add('on');
  }

  window.addEventListener('resize', fill);
  next(1, 0);
})();
