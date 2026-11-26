/* Message box: after the password, a gift box appears. She must tap it, read your message,
   and press the button before she can enter the site. */
(function () {
  /* ===== اكتب كلامك هنا ===== */
  var TITLE = "ليكي يا هنون";
  var LINES = [
    "هنا هتكتب أول سطر.",
    "وهنا السطر التاني.",
    "وهنا السطر التالت، وزوّد أو امسح براحتك."
  ];
  var BUTTON = "كمّلي للموقع";
  /* ========================= */

  /* shows only once: after she presses the last button it never appears again on that device.
     To test it yourself, open the site with ?box at the end of the link (index.html?box). */
  var KEY = 'hn_box_seen';
  var force = /[?&]box(=|&|$)/.test(location.search);
  try { if (!force && localStorage.getItem(KEY)) return; } catch (e) {}

  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap';
  document.head.appendChild(font);

  var st = document.createElement('style');
  st.textContent =
    '#msgbox{position:fixed;inset:0;z-index:85000;display:none;overflow-y:auto;overscroll-behavior:contain;' +
    'background:radial-gradient(ellipse at 50% 60%,#5a3a26 0%,#2b1a11 58%,#140b07 100%);color:#eadccf;' +
    'font-family:"Tajawal",system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif;opacity:1;transition:opacity .8s ease}' +
    '#msgbox.show{display:flex}#msgbox.out{opacity:0;pointer-events:none}' +
    '#msgbox .in{margin:auto;padding:32px 24px;width:100%;max-width:560px;text-align:center}' +
    '#msgbox .gift{display:inline-block;background:none;border:0;padding:0;cursor:pointer;width:min(260px,64vw);' +
    'filter:drop-shadow(0 0 36px #e8c4a077);animation:mbob 3.2s ease-in-out infinite;-webkit-tap-highlight-color:transparent}' +
    '#msgbox .gift:focus-visible{outline:2px solid #fff;outline-offset:6px;border-radius:12px}' +
    '#msgbox .gift svg{display:block;width:100%;height:auto}' +
    '#msgbox .lid{transform-box:fill-box;transform-origin:50% 100%;transition:transform .6s cubic-bezier(.3,1.5,.5,1)}' +
    '#msgbox.opening .lid{transform:translateY(-34px) rotate(-14deg)}' +
    '#msgbox.opening .gift{animation:none}' +
    '@keyframes mbob{50%{transform:translateY(-10px)}}' +
    '#msgbox .hint{margin:22px 0 0;font-size:1.25rem;font-weight:500;color:#e8c4a0;animation:mpulse 2s ease-in-out infinite}' +
    '@keyframes mpulse{50%{opacity:.55}}' +
    '#msgbox .card{display:none}#msgbox.read .card{display:block}#msgbox.read .stage1{display:none}' +
    '#msgbox h2{margin:0 0 1.2rem;font-size:clamp(1.9rem,7vw,2.6rem);font-weight:700;color:#fff}' +
    '#msgbox .ln{margin:0 0 1rem;font-size:clamp(1.15rem,4.4vw,1.4rem);line-height:2;opacity:0;transform:translateY(10px)}' +
    '#msgbox.read .ln{animation:mfade .9s ease forwards}' +
    '@keyframes mfade{to{opacity:1;transform:none}}' +
    '#msgbox .enter{margin-top:1.4rem;font:700 1.15rem "Tajawal",system-ui,sans-serif;padding:14px 36px;border-radius:999px;' +
    'border:0;background:#e8c4a0;color:#1c110c;cursor:pointer;opacity:0;pointer-events:none}' +
    '#msgbox.read .enter{animation:mfade .9s ease forwards}' +
    '#msgbox .enter:focus-visible{outline:2px solid #fff;outline-offset:3px}' +
    '@media (prefers-reduced-motion:reduce){#msgbox .gift,#msgbox .hint{animation:none}#msgbox .lid{transition:none}' +
    '#msgbox .ln,#msgbox .enter{opacity:1;transform:none;animation:none!important}#msgbox .enter{pointer-events:auto}}';
  document.head.appendChild(st);

  var box = document.createElement('div');
  box.id = 'msgbox';
  box.setAttribute('dir', 'rtl');
  box.setAttribute('lang', 'ar');
  box.innerHTML =
    '<div class="in">' +
      '<div class="stage1">' +
        '<button type="button" class="gift" aria-label="افتحي الصندوق">' +
          '<svg viewBox="0 0 200 200" aria-hidden="true">' +
            '<rect x="38" y="98" width="124" height="84" rx="6" fill="#8a5a3a"/>' +
            '<rect x="92" y="98" width="16" height="84" fill="#e8c4a0"/>' +
            '<g class="lid">' +
              '<rect x="28" y="70" width="144" height="32" rx="6" fill="#a8714a"/>' +
              '<rect x="92" y="70" width="16" height="32" fill="#e8c4a0"/>' +
              '<ellipse cx="82" cy="62" rx="22" ry="13" fill="none" stroke="#e8c4a0" stroke-width="8" transform="rotate(-18 82 62)"/>' +
              '<ellipse cx="118" cy="62" rx="22" ry="13" fill="none" stroke="#e8c4a0" stroke-width="8" transform="rotate(18 118 62)"/>' +
              '<circle cx="100" cy="68" r="8" fill="#d4a26a"/>' +
            '</g>' +
          '</svg>' +
        '</button>' +
        '<p class="hint">دوسي على الصندوق</p>' +
      '</div>' +
      '<div class="card"><h2></h2><div class="lines"></div><button type="button" class="enter"></button></div>' +
    '</div>';
  document.body.appendChild(box);

  box.querySelector('h2').textContent = TITLE;
  var wrap = box.querySelector('.lines');
  LINES.forEach(function (t, i) {
    var p = document.createElement('p'); p.className = 'ln'; p.textContent = t;
    p.style.animationDelay = (0.3 + i * 0.9) + 's';
    wrap.appendChild(p);
  });
  var enter = box.querySelector('.enter');
  enter.textContent = BUTTON;
  var enterDelay = 0.3 + LINES.length * 0.9 + 0.3;
  enter.style.animationDelay = enterDelay + 's';
  if (!calm) setTimeout(function () { enter.style.pointerEvents = 'auto'; }, enterDelay * 1000);

  var opened = false, closed = false, root = document.documentElement;
  box.querySelector('.gift').addEventListener('click', function () {
    if (opened) return; opened = true;
    box.classList.add('opening');
    setTimeout(function () { box.classList.add('read'); box.scrollTop = 0; }, calm ? 0 : 650);
  });
  enter.addEventListener('click', function () {
    if (closed) return; closed = true;
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    box.classList.add('out');
    root.style.overflow = prevOverflow;
    setTimeout(function () { box.remove(); st.remove(); }, 900);
  });

  /* stay hidden while the password screen is up, then show and lock the page */
  var prevOverflow = root.style.overflow;
  (function wait() {
    if (document.getElementById('gate')) { setTimeout(wait, 40); return; }
    prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    box.classList.add('show');
    var g = box.querySelector('.gift'); if (g) g.focus({ preventScroll: true });
  })();
})();
