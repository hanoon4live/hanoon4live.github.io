/* Cheer-up box: after the password a gift box appears. She opens it, pops the gloomy clouds
   (each one shows a line from you), the sky turns to sunshine, then she can enter the site. */
(function () {
  /* ===== اكتب كلامك هنا ===== */
  var TITLE  = "ليكي يا حنون";
  var HINT   = "فيه غيوم مخنوقة، دوسي عليها وفرقعيها";
  var LINES  = [                      /* كل سطر = غيمة. من 3 لـ 8 أسطر */
    "يعني يا حنون مش هتضحكي كده تفضلي زعلانة منا بحبك يا حنون ومش عايزك تبقي كده.",
    "والله اي حاجة هنعديها مع بعض والله افضل صدقي ان جنبك ديما وخنقتك دي مخلياني مش طايق اي حاجة.",
    "يا حنين انت افضل حاجة حصلتلي شيلتي و بتشيليها ديما في لحظة وديما معايا وعمرك مسيبتيني لوحدي ابدا وانا كمان هفضل جنبك لان بحبك اوي .",
    "بحبك من قلبي يا حنين هفضل كده اقولك انك افضل حاجة حصلتلي انت ديما معايا وانا هفضل معاكي لحد متزهقي مني كده يا روحي ",
    "اقسم بالله قلبي متقطع عشانك يا جميلتي يارب تبقي احسن يا رب يا رب افضل ديما شايفك في احسن حال وعمري مشوفك ابداشايلة الهم "
  ];
  var FINAL  = "انا عارف الكلام مش هيهديكي 100% بس انا بحاول على قد مقدر والله اخليكي احسن يا حياتي بحبك يا حنونتي بحبك من كل قلبي";   /* بتظهر لما الغيوم كلها تخلص */
  var BUTTON = "كمّلي للموقع يا روحي يا عقلي كله";
  var MOODS  = ["مخنوقة", "بتهدى", "بتتحسن", "بتضحك", "مبسوطة", "قمر"];
  /* ========================= */

  /* shows only once per device. To test: open the site with ?box at the end of the link */
  var KEY = 'hn_box_seen2';
  var force = /[?&]box(=|&|$)/.test(location.search);
  try { if (!force && localStorage.getItem(KEY)) return; } catch (e) {}

  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var N = Math.max(1, Math.min(8, LINES.length));

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
    '#msgbox .sun{position:fixed;left:50%;bottom:0;width:130vmax;height:130vmax;border-radius:50%;pointer-events:none;z-index:0;' +
    'background:radial-gradient(circle,#fff0c8 0%,#f2b868 22%,#d4a26a66 42%,#d4a26a00 66%);' +
    'transform:translate(-50%,calc(100% - var(--s,0)*56%));transition:transform 1.6s cubic-bezier(.2,.8,.3,1)}' +
    '#msgbox .gloom{position:fixed;inset:0;pointer-events:none;z-index:1;background:linear-gradient(#15141b,#2a2028 70%,#3a2a2c);' +
    'opacity:var(--g,0);transition:opacity 1.6s ease}' +
    '#msgbox .in{position:relative;z-index:2;margin:auto;padding:28px 20px;width:100%;max-width:560px;text-align:center}' +
    '#msgbox .gift{display:inline-block;background:none;border:0;padding:0;cursor:pointer;width:min(260px,64vw);' +
    'filter:drop-shadow(0 0 36px #e8c4a077);animation:mbob 3.2s ease-in-out infinite;-webkit-tap-highlight-color:transparent}' +
    '#msgbox .gift:focus-visible,#msgbox .cloud:focus-visible{outline:2px solid #fff;outline-offset:6px;border-radius:12px}' +
    '#msgbox .gift svg{display:block;width:100%;height:auto}' +
    '#msgbox .lid{transform-box:fill-box;transform-origin:50% 100%;transition:transform .6s cubic-bezier(.3,1.5,.5,1)}' +
    '#msgbox.opening .lid{transform:translateY(-34px) rotate(-14deg)}#msgbox.opening .gift{animation:none}' +
    '@keyframes mbob{50%{transform:translateY(-10px)}}' +
    '#msgbox .hint{margin:22px 0 0;font-size:1.25rem;font-weight:500;color:#e8c4a0;animation:mpulse 2s ease-in-out infinite}' +
    '@keyframes mpulse{50%{opacity:.55}}' +
    '#msgbox .card{display:none}#msgbox.read .card{display:block}#msgbox.read .stage1{display:none}' +
    '#msgbox h2{margin:0 0 .8rem;font-size:clamp(1.8rem,7vw,2.5rem);font-weight:700;color:#fff}' +
    '#msgbox .meter{max-width:300px;margin:0 auto 1rem}' +
    '#msgbox .bar{height:10px;border-radius:99px;background:#ffffff26;overflow:hidden}' +
    '#msgbox .bar i{display:block;height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,#8f86b0,#e8c4a0,#ffe2a8);transition:width .9s ease}' +
    '#msgbox .ml{margin-top:.35rem;font-weight:700;color:#e8c4a0;font-size:1.05rem}' +
    '#msgbox .sub{margin:0 0 .6rem;color:#d9ccd0;font-size:1.1rem}' +
    '#msgbox .sky{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 10px;min-height:20px;margin-bottom:.6rem}' +
    '#msgbox .cloud{background:none;border:0;padding:0;width:min(112px,27vw);cursor:pointer;animation:mfloat 3.6s ease-in-out infinite;' +
    'transition:transform .35s ease,opacity .35s ease;-webkit-tap-highlight-color:transparent}' +
    '#msgbox .cloud:nth-child(2n){animation-duration:4.4s;animation-delay:-1s}#msgbox .cloud:nth-child(3n){animation-duration:3.1s;animation-delay:-2s}' +
    '#msgbox .cloud svg{display:block;width:100%;height:auto;filter:drop-shadow(0 4px 10px #0006)}' +
    '#msgbox .cloud.pop{transform:scale(1.5);opacity:0;pointer-events:none;animation:none}' +
    '@keyframes mfloat{50%{transform:translateY(-9px)}}' +
    '#msgbox .ln{display:none;margin:0 0 .9rem;font-size:clamp(1.15rem,4.4vw,1.4rem);line-height:1.9;color:#fff;text-shadow:0 1px 8px #0008}' +
    '#msgbox .ln.on{display:block;animation:mfade .9s ease both}' +
    '#msgbox .fin{display:none;margin:1rem 0 0;font-size:clamp(1.3rem,5vw,1.7rem);font-weight:700;line-height:1.8;color:#fff3d6;text-shadow:0 1px 10px #0009}' +
    '#msgbox .fin.on{display:block;animation:mfade 1s ease both}' +
    '@keyframes mfade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}' +
    '#msgbox .enter{display:none;margin-top:1.3rem;font:700 1.15rem "Tajawal",system-ui,sans-serif;padding:14px 36px;border-radius:999px;border:0;' +
    'background:#e8c4a0;color:#1c110c;cursor:pointer;box-shadow:0 0 36px #ffe2a899}' +
    '#msgbox .enter.on{display:inline-block;animation:mfade 1s ease both}#msgbox .enter:focus-visible{outline:2px solid #fff;outline-offset:3px}' +
    '#msgbox .sp{position:fixed;z-index:5;pointer-events:none;font-size:20px;animation:msp .9s ease-out forwards}' +
    '@keyframes msp{to{transform:translate(var(--dx),var(--dy)) scale(.3) rotate(240deg);opacity:0}}' +
    '#msgbox .cf{position:fixed;top:-30px;z-index:5;pointer-events:none;animation:mcf linear forwards}' +
    '@keyframes mcf{to{transform:translate(var(--dx),112vh) rotate(540deg);opacity:.9}}' +
    '@media (prefers-reduced-motion:reduce){#msgbox .gift,#msgbox .hint,#msgbox .cloud{animation:none}#msgbox .lid,#msgbox .sun,#msgbox .gloom,#msgbox .bar i{transition:none}' +
    '#msgbox .ln.on,#msgbox .fin.on,#msgbox .enter.on{animation:none}}';
  document.head.appendChild(st);

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }

  var box = el('div'); box.id = 'msgbox'; box.setAttribute('dir', 'rtl'); box.setAttribute('lang', 'ar');
  box.appendChild(el('div', 'sun')); box.appendChild(el('div', 'gloom'));
  var inn = el('div', 'in'); box.appendChild(inn);

  /* stage 1: the gift */
  var s1 = el('div', 'stage1');
  s1.innerHTML =
    '<button type="button" class="gift" aria-label="افتحي الصندوق"><svg viewBox="0 0 200 200" aria-hidden="true">' +
    '<rect x="38" y="98" width="124" height="84" rx="6" fill="#8a5a3a"/><rect x="92" y="98" width="16" height="84" fill="#e8c4a0"/>' +
    '<g class="lid"><rect x="28" y="70" width="144" height="32" rx="6" fill="#a8714a"/><rect x="92" y="70" width="16" height="32" fill="#e8c4a0"/>' +
    '<ellipse cx="82" cy="62" rx="22" ry="13" fill="none" stroke="#e8c4a0" stroke-width="8" transform="rotate(-18 82 62)"/>' +
    '<ellipse cx="118" cy="62" rx="22" ry="13" fill="none" stroke="#e8c4a0" stroke-width="8" transform="rotate(18 118 62)"/>' +
    '<circle cx="100" cy="68" r="8" fill="#d4a26a"/></g></svg></button><p class="hint">دوسي على الصندوق</p>';
  inn.appendChild(s1);

  /* stage 2: pop the clouds */
  var card = el('div', 'card'); inn.appendChild(card);
  card.appendChild(el('h2', '', TITLE));
  var meter = el('div', 'meter'), bar = el('div', 'bar'), fill = el('i'), ml = el('div', 'ml', MOODS[0]);
  bar.appendChild(fill); meter.appendChild(bar); meter.appendChild(ml); card.appendChild(meter);
  card.appendChild(el('p', 'sub', HINT));
  var sky = el('div', 'sky'); card.appendChild(sky);
  var lines = el('div', 'lines'); card.appendChild(lines);
  var lnEls = [];
  for (var i = 0; i < N; i++) { var p = el('p', 'ln', LINES[i]); lines.appendChild(p); lnEls.push(p); }
  var fin = el('p', 'fin', FINAL); card.appendChild(fin);
  var enter = el('button', 'enter', BUTTON); enter.type = 'button'; card.appendChild(enter);

  var CLOUD =
    '<svg viewBox="0 0 100 62" aria-hidden="true"><path d="M25 56a16 16 0 0 1-1-32 22 22 0 0 1 42-6 18 18 0 0 1 10 38z" fill="#7d7886"/>' +
    '<circle cx="42" cy="36" r="2.6" fill="#35313d"/><circle cx="58" cy="36" r="2.6" fill="#35313d"/>' +
    '<path d="M43 48q7-6 14 0" fill="none" stroke="#35313d" stroke-width="2.4" stroke-linecap="round"/></svg>';

  var popped = 0;
  function burst(x, y, chars, n) {
    if (calm) return;
    for (var k = 0; k < n; k++) {
      var s = el('span', 'sp', chars[k % chars.length]);
      var a = Math.random() * 6.283, d = 50 + Math.random() * 90;
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px');
      s.style.color = ['#ffe2a8', '#e8c4a0', '#fff', '#f2b868'][k % 4];
      box.appendChild(s); (function (n2) { setTimeout(function () { n2.remove(); }, 950); })(s);
    }
  }
  function confetti() {
    if (calm) return;
    for (var k = 0; k < 46; k++) (function (k) {
      setTimeout(function () {
        var c = el('span', 'cf', ['♥', '✦', '♥', '✿'][k % 4]);
        c.style.left = Math.random() * 100 + 'vw'; c.style.fontSize = (16 + Math.random() * 22) + 'px';
        c.style.color = ['#ffe2a8', '#e8c4a0', '#fff', '#f2b868', '#ff9fb0'][k % 5];
        c.style.setProperty('--dx', (Math.random() - .5) * 140 + 'px');
        c.style.animationDuration = (3 + Math.random() * 2.5) + 's';
        box.appendChild(c); setTimeout(function () { c.remove(); }, 5600);
      }, k * 70);
    })(k);
  }
  function progress() {
    var f = popped / N;
    fill.style.width = (f * 100) + '%';
    ml.textContent = MOODS[Math.min(MOODS.length - 1, Math.floor(f * (MOODS.length - 1) + 0.001))] + (f === 1 ? ' ♥' : '');
    box.style.setProperty('--g', (0.96 * (1 - f)).toFixed(2));
    box.style.setProperty('--s', f.toFixed(2));
  }
  for (var c = 0; c < N; c++) {
    var cb = el('button', 'cloud'); cb.type = 'button'; cb.setAttribute('aria-label', 'غيمة'); cb.innerHTML = CLOUD;
    cb.addEventListener('click', function () {
      if (this.classList.contains('pop')) return;
      var r = this.getBoundingClientRect();
      this.classList.add('pop');
      burst(r.left + r.width / 2, r.top + r.height / 2, ['✦', '✧', '♥'], 12);
      lnEls[popped].classList.add('on');
      popped++; progress();
      var me = this; setTimeout(function () { me.style.display = 'none'; }, 400);
      if (popped === N) setTimeout(function () {
        sky.style.display = 'none'; card.querySelector('.sub').style.display = 'none';
        fin.classList.add('on'); enter.classList.add('on'); confetti();
        enter.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' });
      }, 900);
    });
    sky.appendChild(cb);
  }
  document.body.appendChild(box);

  var opened = false, closed = false, root = document.documentElement, prevOverflow = root.style.overflow;
  s1.querySelector('.gift').addEventListener('click', function () {
    if (opened) return; opened = true;
    box.classList.add('opening');
    setTimeout(function () { box.classList.add('read'); box.scrollTop = 0; box.style.setProperty('--g', '.96'); }, calm ? 0 : 650);
  });
  enter.addEventListener('click', function () {
    if (closed) return; closed = true;
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    box.classList.add('out'); root.style.overflow = prevOverflow;
    setTimeout(function () { box.remove(); st.remove(); }, 900);
  });

  /* stay hidden while the password screen is up, then show and lock the page */
  (function wait() {
    if (document.getElementById('gate')) { setTimeout(wait, 40); return; }
    prevOverflow = root.style.overflow; root.style.overflow = 'hidden';
    box.classList.add('show');
    var g = s1.querySelector('.gift'); if (g) g.focus({ preventScroll: true });
  })();
})();
