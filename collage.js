/* Faded photo collage for every page.
   Put your collage photos next to the pages, named: bg1.jpeg, bg2.jpeg, bg3.jpeg ...
   (01 style names also work; jpeg, jpg, png, webp all work; any number). */
(function () {
  var PREFIX = 'bg';
  var EXTS = ['jpeg', 'jpg', 'png', 'webp'];

  var st = document.createElement('style');
  st.textContent =
    '#collage{position:fixed;inset:-24px;z-index:-1;overflow:hidden;pointer-events:none;display:grid;' +
    'grid-template-columns:repeat(auto-fill,minmax(170px,1fr));grid-auto-rows:210px;gap:12px;opacity:0;transition:opacity 2s ease}' +
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

  function fill() {
    if (!urls.length) return;
    var cols = Math.ceil((innerWidth + 48) / 182), rows = Math.ceil((innerHeight + 48) / 222);
    var want = Math.min(cols * rows, 120);
    for (; built < want; built++) {
      var t = new Image();
      t.alt = '';
      t.src = urls[(built * 7 + Math.floor(built / cols) * 4) % urls.length];
      t.style.transform = 'rotate(' + (((built * 37) % 9) - 4) + 'deg) scale(1.04)';
      box.appendChild(t);
    }
    box.classList.add('on');
  }

  window.addEventListener('resize', fill);
  next(1, 0);
})();
