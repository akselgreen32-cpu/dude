// ---------- Dude v2: the stage, the pals, the brains ----------
(() => {
  'use strict';
  if (window.top !== window || document.getElementById('dude-root')) return;
  const D = window.DUDE;
  if (!D || !D.CHARS || !D.STYLES) return;

  const HW = 36, HH = 42;                                   // half sprite width / height
  const CHARS = D.CHARS, BYID = Object.fromEntries(CHARS.map(c => [c.id, c]));
  const STYLES = D.STYLES, STY = Object.fromEntries(STYLES.map(s => [s.id, s]));
  const DEFAULT_CAST = ['spiderman', 'naruto', 'baymax', 'flash'];
  const LV = [0, 6, 20, 50, 100], TITLES = ['Stranger', 'Pal', 'Buddy', 'Best friend', 'Family'];
  const NAVSAY = { top: 'Up we go!', bottom: 'Down we go!', back: 'Rewinding.', reload: 'Fresh start!', newtab: 'New tab, new adventure.', close: 'Bye bye, tab.' };

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const safe = fn => { try { return fn(); } catch (_) {} };
  const hr = () => new Date().getHours();
  const isNight = () => hr() >= 23 || hr() < 5;
  const isMorning = () => hr() >= 5 && hr() < 11;
  const timeStr = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const fmt = m => { m = Math.round(m); const h = Math.floor(m / 60), r = m % 60; return h ? (r ? `${h}h ${r}m` : `${h}h`) : `${m}m`; };
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  // ---------------- state ----------------
  let cast = DEFAULT_CAST.slice(), hidden = false, quiet = false, bond = {}, pending = {};
  let lastSpeak = 0, lastBanter = 0, popFor = null, popView = 'main', flushT = 0;
  const actors = [];

  // ---------------- DOM ----------------
  const CSS = `
*{box-sizing:border-box}
.stage{position:fixed;inset:0;pointer-events:none;overflow:hidden;font:13px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif}
.actor{position:absolute;left:0;top:0;width:0;height:0}
.sprite{position:absolute;left:-36px;top:-42px;width:72px;height:84px;pointer-events:auto;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none}
.sprite.clone{opacity:.9}
.flip{position:relative;width:100%;height:100%}
.flip svg{width:100%;height:100%;overflow:visible;display:block;filter:drop-shadow(0 3px 3px rgba(0,0,0,.35))}
.fig{transform-origin:36px 80px}
.legL{transform-origin:30.5px 62px}.legR{transform-origin:41.5px 62px}
.armL{transform-origin:19px 47px}.armR{transform-origin:53px 47px}
.cape{transform-origin:36px 44px}
.c-batman .cape{animation:cape 2.2s ease-in-out infinite alternate}
@keyframes cape{from{transform:skewX(-4deg) scaleX(.97)}to{transform:skewX(5deg) scaleX(1.06)}}
.st-idle .fig{animation:breathe 3s ease-in-out infinite}
@keyframes breathe{50%{transform:scaleY(.975)}}
.sprite:is(.st-walk,.st-run,.st-climb,.st-zip) :is(.legL,.armR){animation:sw var(--cyc,.5s) ease-in-out infinite}
.sprite:is(.st-walk,.st-run,.st-climb,.st-zip) :is(.legR,.armL){animation:sw var(--cyc,.5s) ease-in-out infinite reverse}
.st-run,.st-zip{--cyc:.26s}
@keyframes sw{0%,100%{transform:rotate(-30deg)}50%{transform:rotate(30deg)}}
.sprite:is(.st-walk,.st-run,.st-climb) .fig{animation:bob calc(var(--cyc,.5s)/2) ease-in-out infinite}
@keyframes bob{50%{transform:translateY(-2px)}}
.c-naruto.st-run .fig{animation:none;transform:rotate(14deg)}
.st-zip .fig{animation:none;transform:skewX(-14deg)}
.c-spiderman.st-jump .fig{transform-origin:36px 52px;animation:spin .7s linear}
@keyframes spin{to{transform:rotate(360deg)}}
.st-hug .armL{animation:none;transform:rotate(130deg)}
.st-hug .armR{animation:none;transform:rotate(-130deg)}
.st-jit .fig{animation:jit .25s ease-in-out infinite}
@keyframes jit{50%{transform:translateY(-5px) scale(1.04,.96)}}
.st-sway .fig{animation:sway 2s ease-in-out infinite}
@keyframes sway{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
.st-dance .fig{animation:dance .5s ease-in-out infinite alternate}
@keyframes dance{from{transform:rotate(-8deg)}to{transform:rotate(8deg) translateY(-4px)}}
.st-dance .armR{animation:wave .5s ease-in-out infinite alternate}
.st-dance .armL{animation:waveL .5s ease-in-out infinite alternate}
.st-brood .cape{animation:cape 1.1s ease-in-out infinite alternate}
.st-nap .fig{animation:none;transform:rotate(-14deg) translateY(8px)}
.talk .armR{animation:wave .45s ease-in-out infinite alternate}
@keyframes wave{from{transform:rotate(-20deg)}to{transform:rotate(-150deg)}}
@keyframes waveL{from{transform:rotate(20deg)}to{transform:rotate(150deg)}}
.zzz{position:absolute;left:46px;top:-10px;font-weight:700;color:#fff;text-shadow:0 1px 3px #000;opacity:0;pointer-events:none}
.st-nap .zzz{opacity:1;animation:zz 2s ease-in-out infinite}
@keyframes zz{50%{transform:translateY(-8px)}}
.beam{position:absolute;left:-6px;right:-6px;top:0;height:3px;border-radius:2px;background:#5de0ff;box-shadow:0 0 8px 2px #5de0ff;opacity:0}
.st-scan .beam{opacity:.9;animation:scan 1.1s linear infinite}
@keyframes scan{from{top:2%}to{top:98%}}
.streak{position:absolute;right:62%;top:30%;width:110px;height:26px;border-radius:20px;background:linear-gradient(90deg,transparent,rgba(255,214,10,.95));opacity:0;pointer-events:none}
.st-zip .streak{opacity:1}
.bubble{position:absolute;min-width:60px;max-width:230px;width:max-content;padding:8px 11px;background:#fff;color:#1b1b22;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,.28);opacity:0;transform:scale(.92);transition:opacity .18s,transform .18s;pointer-events:none;z-index:2}
.bubble.show{opacity:1;transform:none}
.bubble .who{font-size:10.5px;font-weight:700;margin-bottom:2px;opacity:.65}
.bubble.alert{pointer-events:auto;cursor:pointer;border:2px solid #ffb703;box-shadow:0 0 0 3px rgba(255,183,3,.25),0 6px 18px rgba(0,0,0,.3)}
.poof{position:absolute;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,255,255,.7) 55%,transparent 70%);animation:poof .6s ease-out forwards;pointer-events:none}
@keyframes poof{from{transform:scale(.3);opacity:1}to{transform:scale(1.8);opacity:0}}
:where(.pop button,.pop input){appearance:none;border:0;background:none;padding:0;margin:0;font:inherit;color:inherit;cursor:pointer;text-align:inherit}
.pop{--bg:#17171d;--ac:#ffd43b;--on:#111;position:absolute;width:312px;color:#ececf1;background:var(--bg);border:1px solid rgba(255,255,255,.09);border-radius:20px;box-shadow:0 18px 50px rgba(0,0,0,.5),0 2px 8px rgba(0,0,0,.3);pointer-events:auto;display:none;z-index:5;font-size:13px}
.pop.open{display:block;animation:popin .18s cubic-bezier(.2,.9,.3,1.15)}
@keyframes popin{from{opacity:0;transform:translateY(6px) scale(.96)}}
.pop :focus-visible{outline:2px solid var(--ac);outline-offset:2px}
.arrow{position:absolute;width:14px;height:14px;background:var(--bg);border:1px solid rgba(255,255,255,.09);transform:rotate(45deg);border-radius:3px;z-index:0}
.card{position:relative;z-index:1;border-radius:20px;overflow:hidden;background:var(--bg)}
.ph{position:relative;display:flex;gap:12px;align-items:center;padding:14px 40px 12px 14px;background:linear-gradient(135deg,color-mix(in srgb,var(--ac) 26%,transparent),transparent 70%)}
.av{position:relative;width:60px;height:60px;flex:none}
.ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(var(--ac) calc(var(--p,0)*1%),rgba(255,255,255,.14) 0)}
.face{position:absolute;inset:4px;border-radius:50%;background:#262630;overflow:hidden}
.face svg,.mini svg{width:100%;height:100%;display:block}
.lv{position:absolute;right:-4px;bottom:-4px;min-width:22px;height:22px;padding:0 4px;border-radius:11px;background:var(--ac);color:var(--on);font-weight:700;font-size:11px;display:grid;place-items:center;border:2px solid var(--bg)}
.nm{font-size:16px;font-weight:700;line-height:1.2}
.tg{font-size:12px;opacity:.7;margin-top:2px}
.q{margin-top:6px;font-size:12px;font-style:italic;opacity:.85;line-height:1.35}
.cls{position:absolute;top:10px;right:10px;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.08)}
.cls:hover{background:rgba(255,255,255,.2)}
.cls .ic{width:14px;height:14px}
.tabs{display:flex;padding:0 6px;border-bottom:1px solid rgba(255,255,255,.08)}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 0 7px;font-size:10.5px;opacity:.6;border-bottom:2px solid transparent;margin-bottom:-1px;text-align:center}
.tab:hover{opacity:.9}
.tab.on{opacity:1;color:var(--ac);border-bottom-color:var(--ac)}
.body{height:min(272px,calc(100vh - 240px));overflow:auto;padding:12px 14px 14px;scrollbar-width:thin}
.body>*{animation:fadein .16s ease-out}
@keyframes fadein{from{opacity:0;transform:translateY(3px)}}
.ic{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}
.tab .ic{width:18px;height:18px}
.acts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.act{display:flex;flex-direction:column;align-items:center;gap:7px;padding:13px 4px 10px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.06);font-size:11.5px;transition:background .12s,transform .12s}
.act .ic{width:22px;height:22px}
.act:hover{background:var(--ac);color:var(--on);transform:translateY(-1px)}
.act.danger:hover{background:#e5484d;color:#fff}
.cta{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:10px;padding:11px;border-radius:14px;background:var(--ac);color:var(--on);font-weight:700;transition:filter .12s}
.cta:hover{filter:brightness(1.1)}
.cta .ic{width:18px;height:18px}
.hint{opacity:.55;font-size:11.5px;text-align:center;margin-top:10px;line-height:1.4}
.sb{width:100%;padding:9px 12px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08);outline:none;cursor:text}
.sb:focus{border-color:var(--ac)}
.pills{display:flex;gap:6px;overflow-x:auto;padding:9px 0;scrollbar-width:none}
.pill{flex:none;padding:5px 11px;border-radius:999px;background:rgba(255,255,255,.07);font-size:11.5px}
.pill.on{background:var(--ac);color:var(--on);font-weight:600}
.list{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.chip{display:flex;gap:6px;align-items:center;padding:8px 9px;border-radius:11px;background:rgba(255,255,255,.06);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:background .12s}
.chip:hover{background:var(--ac);color:var(--on)}
.list .hint{grid-column:1/-1}
.ringw{position:relative;width:132px;height:132px;margin:0 auto 12px}
.ringw svg{position:absolute;inset:0;width:100%;height:100%}
.trk{fill:none;stroke:rgba(255,255,255,.12);stroke-width:9}
.prg{fill:none;stroke:var(--ac);stroke-width:9;stroke-linecap:round}
.ringc{position:absolute;inset:0;display:grid;place-content:center;text-align:center}
.big{font-size:26px;font-weight:800;line-height:1.1}
.sm{font-size:11px;opacity:.6}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.st{padding:10px;border-radius:12px;background:rgba(255,255,255,.06);text-align:center}
.st b{display:block;font-size:17px}
.st span{font-size:11px;opacity:.6}
.rest{display:flex;gap:8px;align-items:center;margin-top:10px;padding:9px 11px;border-radius:12px;background:rgba(255,255,255,.05);font-size:12px;opacity:.8}
.rest .ic{width:16px;height:16px}
.rest.on{background:color-mix(in srgb,var(--ac) 18%,transparent);opacity:1}
.sec{margin:14px 0 6px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;opacity:.55;font-weight:700}
.sn{display:flex;justify-content:space-between;gap:8px;font-size:12.5px}
.site{margin-top:8px}
.bar{height:6px;border-radius:4px;background:rgba(255,255,255,.1);overflow:hidden;margin-top:5px}
.bar>div{height:100%;background:var(--ac);border-radius:4px}
.tag{display:inline-block;padding:3px 9px;border-radius:999px;background:rgba(255,255,255,.1);font-size:11.5px;margin:0 5px 5px 0}
.p{line-height:1.5;opacity:.92;margin:0 0 8px}
.dim{opacity:.6;font-size:12px}
.mem{margin-top:8px;padding:9px 11px;border-left:3px solid var(--ac);border-radius:6px 12px 12px 6px;background:rgba(255,255,255,.06);line-height:1.45;font-size:12.5px}
.mem.lock{display:flex;gap:8px;align-items:center;border-left-color:rgba(255,255,255,.2);opacity:.5}
.mem .ic{width:15px;height:15px}
.cg{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.cc{position:relative;display:flex;align-items:center;gap:8px;padding:8px;border-radius:14px;background:rgba(255,255,255,.06);border:1.5px solid transparent;transition:background .12s}
.cc:hover{background:rgba(255,255,255,.1)}
.cc.on{border-color:var(--ac);background:rgba(255,255,255,.1)}
.mini{width:36px;height:36px;border-radius:50%;background:#262630;overflow:hidden;flex:none}
.ct b{display:block;font-size:12.5px}
.ct small{opacity:.6;font-size:11px}
.ck{position:absolute;top:6px;right:6px;width:16px;height:16px;border-radius:50%;background:var(--ac);color:var(--on);display:none;place-items:center}
.cc.on .ck{display:grid}
.ck .ic{width:11px;height:11px;stroke-width:3}
.sr{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.08)}
.sr small{display:block;opacity:.55;font-size:11px}
.sw2{position:relative;flex:none;width:40px;height:23px;border-radius:12px;background:rgba(255,255,255,.2);transition:background .15s}
.sw2::after{content:'';position:absolute;top:3px;left:3px;width:17px;height:17px;border-radius:50%;background:#fff;transition:transform .15s}
.sw2.on{background:var(--ac)}
.sw2.on::after{transform:translateX(17px);background:var(--on)}
.frozen,.frozen *{animation-play-state:paused!important}
`;

  const host = document.createElement('div');
  host.id = 'dude-root';
  host.style.cssText = 'all:initial;position:fixed;inset:0;pointer-events:none;z-index:2147483647;';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = '<div class="stage"></div>';
  try { const sh = new CSSStyleSheet(); sh.replaceSync(CSS); root.adoptedStyleSheets = [sh]; }
  catch (_) { const st = document.createElement('style'); st.textContent = CSS; root.prepend(st); }
  const stage = root.querySelector('.stage');
  const pop = document.createElement('div');
  pop.className = 'pop';
  stage.appendChild(pop);

  // ---------------- voice / lines ----------------
  function voice(c, t) {
    const v = c.voice; if (!v) return t;
    if (v.wrap) return v.wrap(t);
    const r = Math.random();
    if (r < 0.34 && v.pre) {
      const p = pick(v.pre), low = /[,:]\s*$/.test(p) && /^(?!I[' ])[A-Z](?=[a-z])/.test(t);
      return p + (low ? t[0].toLowerCase() + t.slice(1) : t);
    }
    if (r < 0.68 && v.post) return t + ' ' + pick(v.post);
    return t;
  }
  const fmtSay = (c, t) => (c.sayWrap ? c.voice.wrap(t) : t);

  // ---------------- bond / character development ----------------
  const xpOf = id => (bond[id] || 0) + (pending[id] || 0);
  const lvl = x => { let l = 1; LV.forEach((v, i) => { if (x >= v) l = i + 1; }); return l; };
  const levelOf = a => lvl(xpOf(a.c.id));
  function addXp(id, n) {
    const before = lvl(xpOf(id));
    pending[id] = (pending[id] || 0) + n;
    const after = lvl(xpOf(id));
    if (after > before) { const a = actors.find(x => x.c.id === id && !x.clone); if (a) levelUp(a, after); }
    clearTimeout(flushT); flushT = setTimeout(flush, 15000);
  }
  function flush() {
    if (!Object.keys(pending).length) return;
    safe(() => chrome.storage.local.get('dudeBond', r => {
      const b = r.dudeBond || {};
      for (const k in pending) b[k] = (b[k] || 0) + pending[k];
      pending = {}; bond = b;
      chrome.storage.local.set({ dudeBond: b });
    }));
  }
  function levelUp(a, l) {
    const line = a.c.deep[l - 2];
    say(a, `\u{1F389} Bond level ${l} \u00B7 ${TITLES[l - 1]}! ` + (line ? fmtSay(a.c, line) : ''), { ms: 9000 });
    start(a, 'jump');
  }

  // ---------------- actors ----------------
  function mk(c, o = {}) {
    const el = document.createElement('div');
    el.className = 'actor';
    el.style.setProperty('--cyc', c.cyc + 's');
    el.innerHTML = `<div class="sprite c-${c.id}"><div class="flip">${c.draw()}${c.id === 'flash' ? '<i class="streak"></i>' : ''}${c.id === 'baymax' ? '<i class="beam"></i>' : ''}</div><span class="zzz">z Z</span></div><div class="bubble"><div class="who"></div><div class="msg"></div></div>`;
    stage.insertBefore(el, pop);
    const a = {
      c, el, sp: el.firstChild, fl: el.querySelector('.flip'), bub: el.querySelector('.bubble'),
      who: el.querySelector('.who'), msg: el.querySelector('.msg'),
      s: 'floor', p: rnd(HW + 10, Math.max(HW + 11, innerWidth - HW - 10)), lift: 0, dir: Math.random() < 0.5 ? -1 : 1,
      state: 'idle', t: rnd(1, 3), clone: !!o.clone, ttl: o.ttl || 0, hold: false, talking: false,
      vy: 0, cx: 0, cy: 0, rot: 0, ph: '', hopT: 0, ft: null, bt: 0, plat: null, lo: 0, hi: 0, ly: 0, sub: 0, subT: 0, lp: null, quip: ''
    };
    actors.push(a);
    a.bub.addEventListener('click', () => hideBubble(a));
    wire(a); paint(a); pos(a);
    return a;
  }

  function paint(a) {
    let st = a.state;
    if (st === 'perch') st = a.ph === 'roam' ? (a.sub ? 'walk' : 'idle') : 'jump';
    a.sp.className = `sprite c-${a.c.id} st-${st}${a.talking ? ' talk' : ''}${a.clone ? ' clone' : ''}${a.hold && a.s !== 'floor' ? ' frozen' : ''}`;
  }
  const setState = (a, s, t) => { a.state = s; a.t = t; paint(a); };

  function pos(a) {
    const vw = innerWidth, vh = innerHeight;
    switch (a.s) {
      case 'floor': a.cx = a.p; a.cy = vh - HH - a.lift; a.rot = 0; break;
      case 'ceil': a.cx = a.p; a.cy = HH + a.lift; a.rot = 180; break;
      case 'wl': a.cx = HH + a.lift; a.cy = a.p; a.rot = 90; break;
      case 'wr': a.cx = vw - HH - a.lift; a.cy = a.p; a.rot = -90; break;
      case 'ledge': a.cx = Math.max(a.lo, Math.min(a.hi, a.p)); a.cy = a.ly - a.lift; a.rot = 0; break;
      default: a.rot = 0;
    }
    a.el.style.transform = `translate(${a.cx | 0}px,${a.cy | 0}px)`;
    a.sp.style.transform = a.rot ? `rotate(${a.rot}deg)` : '';
    const f = (a.s === 'ceil' || a.s === 'wr') ? -a.dir : a.dir, ft = f < 0 ? 'scaleX(-1)' : '';
    if (a.ft !== ft) { a.fl.style.transform = ft; a.ft = ft; }
    if (a.talking) placeBubble(a);
  }

  function placeBubble(a) {
    const b = a.bub.style, vw = innerWidth;
    b.left = b.right = b.top = b.bottom = 'auto'; b.transform = 'none';
    let side = a.s === 'wl' || a.s === 'wr' || a.s === 'ceil' ? a.s : 'floor';
    if (side === 'floor' && a.cy < 110) side = 'ceil';
    const xAlign = () => { if (a.cx < 120) b.left = '-40px'; else if (a.cx > vw - 120) b.right = '-40px'; else { b.left = '0'; b.transform = 'translateX(-50%)'; } };
    if (side === 'floor') { b.bottom = (HH + 8) + 'px'; xAlign(); }
    else if (side === 'ceil') { b.top = (HH + 8) + 'px'; xAlign(); }
    else if (side === 'wl') { b.left = (HH + 8) + 'px'; b.top = '-24px'; }
    else { b.right = (HH + 8) + 'px'; b.top = '-24px'; }
  }

  function poof(x, y) {
    const p = document.createElement('div');
    p.className = 'poof'; p.style.left = x + 'px'; p.style.top = y + 'px';
    stage.appendChild(p); setTimeout(() => p.remove(), 650);
  }
  function removeActor(a, fx) {
    const i = actors.indexOf(a); if (i < 0) return;
    actors.splice(i, 1);
    if (popFor === a) closePop();
    if (fx) poof(a.cx, a.cy);
    a.el.remove();
  }

  // ---------------- speech ----------------
  function say(a, text, o = {}) {
    clearTimeout(a.bt);
    a.msg.textContent = text; a.who.textContent = o.who || a.c.short;
    a.bub.classList.toggle('alert', !!o.alert);
    placeBubble(a); a.bub.classList.add('show');
    a.talking = true; paint(a); lastSpeak = Date.now();
    a.bt = setTimeout(() => hideBubble(a), o.ms || Math.max(4200, text.length * 75));
  }
  function hideBubble(a) { clearTimeout(a.bt); a.bub.classList.remove('show', 'alert'); a.talking = false; paint(a); }

  function chooseStyle(a) {
    const night = isNight(), morn = isMorning();
    if (night && Math.random() < 0.4) return pick(STYLES.filter(s => s.f === 'n'));
    if (Math.random() < 0.18) return STY.sig;
    if (levelOf(a) >= 2 && Math.random() < 0.1) return STY.deep;
    return pick(STYLES.filter(s => !s.special && (!s.f || (s.f === 'n' && night) || (s.f === 'm' && morn))));
  }
  function styleText(a, st) {
    if (st.id === 'deep') { const pool = a.c.deep.slice(0, Math.max(0, levelOf(a) - 1)); return pool.length ? fmtSay(a.c, pick(pool)) : null; }
    if (st.id === 'sig') return fmtSay(a.c, pick(a.c.says.idle));
    return voice(a.c, pick(st.lines).replace('{time}', timeStr()));
  }
  function speakStyle(a, id) {
    let st = id ? STY[id] : chooseStyle(a), t = styleText(a, st);
    if (!t) { st = STY.sig; t = styleText(a, st); }
    say(a, t, { who: `${a.c.short} \u00B7 ${st.e} ${st.n}` });
  }

  // ---------------- behaviour ----------------
  function think(a) {
    const m = Object.assign({}, a.c.moves);
    if (a.clone) delete m.clone;
    if (isNight() && !a.clone) m.nap = (m.nap || 0) + 3;
    const names = Object.keys(m);
    let r = Math.random() * names.reduce((s, k) => s + m[k], 0), n = 'idle';
    for (const k of names) { r -= m[k]; if (r <= 0) { n = k; break; } }
    start(a, n);
  }
  function start(a, n) {
    if (a.s !== 'floor') return;
    a.lift = 0;
    switch (n) {
      case 'walk': a.dir = Math.random() < 0.5 ? -1 : 1; setState(a, 'walk', rnd(3, 8)); break;
      case 'run': a.dir = Math.random() < 0.5 ? -1 : 1; setState(a, 'run', rnd(2, 4)); break;
      case 'zip': a.dir = Math.random() < 0.5 ? -1 : 1; setState(a, 'zip', 0.8); break;
      case 'jump': a.hopT = 0; setState(a, 'jump', 0.7); break;
      case 'climb': a.ph = 'toWall'; a.dir = a.p < innerWidth / 2 ? -1 : 1; setState(a, 'climb', 999); break;
      case 'perch': {
        const L = pickLedge();
        if (!L) { setState(a, 'walk', rnd(3, 6)); break; }
        const tx = Math.min(innerWidth - HW, Math.max(HW, rnd(L.left + HW, Math.max(L.left + HW, L.right - HW))));
        const ty = L.top - HH + 3;
        a.plat = L.el; a.ph = 'leap'; a.sub = 0;
        a.lp = { x0: a.cx, y0: a.cy, x1: tx, y1: ty, t: 0, d: 0.45 + Math.hypot(tx - a.cx, ty - a.cy) / 1500 };
        a.dir = tx >= a.cx ? 1 : -1; a.s = 'free'; setState(a, 'perch', 999); break;
      }
      case 'scan': setState(a, 'scan', 3.4); if (!a.clone && !quiet) say(a, 'Scanning...', { ms: 1800 }); break;
      case 'hug': setState(a, 'hug', 3); break;
      case 'clone': setState(a, 'idle', 1.4); spawnClones(a); break;
      case 'nap': setState(a, 'nap', rnd(8, 16)); break;
      default: setState(a, n, rnd(2, 4.5));
    }
  }
  function endState(a) {
    if (a.state === 'scan' && !a.clone && !quiet && a.c.says.scan) say(a, pick(a.c.says.scan), { who: `${a.c.short} \u00B7 \u{1FA7A} Scan` });
    if (a.state === 'hug' && !a.clone && !quiet) speakStyle(a, 'self-kindness');
  }
  function spawnClones(a) {
    if (a.clone) return;
    if (!quiet) say(a, 'Shadow clone jutsu!', { ms: 1800 });
    for (const off of [-70, 70]) {
      const k = mk(a.c, { clone: true, ttl: 7 });
      k.p = Math.max(HW, Math.min(innerWidth - HW, a.p + off)); k.dir = off < 0 ? -1 : 1;
      start(k, 'run'); pos(k); poof(k.cx, k.cy);
    }
  }

  function bounds(a) { if (a.s === 'ledge') return [a.lo, a.hi]; return (a.s === 'wl' || a.s === 'wr') ? [HW, innerHeight - HW] : [HW, innerWidth - HW]; }
  function move(a, d) {
    a.p += a.dir * d;
    const [lo, hi] = bounds(a);
    if (a.p < lo) { a.p = lo; a.dir = 1; } else if (a.p > hi) { a.p = hi; a.dir = -1; }
  }
  function drop(a) { a.s = 'free'; a.vy = 0; a.lift = 0; a.ph = ''; a.plat = null; setState(a, 'fall', 99); }
  function climbStep(a, dt) {
    const sp = a.c.speed * 1.1, [lo, hi] = bounds(a);
    if (a.ph === 'toWall') {
      a.p += a.dir * sp * dt;
      if (a.p <= lo || a.p >= hi) { a.s = a.dir < 0 ? 'wl' : 'wr'; a.p = innerHeight - HW; a.dir = -1; a.ph = 'up'; }
    } else if (a.ph === 'up') {
      a.p += a.dir * sp * dt;
      if (a.p <= HW) { const left = a.s === 'wl'; a.s = 'ceil'; a.p = left ? HW : innerWidth - HW; a.dir = left ? 1 : -1; a.ph = 'ceil'; a.t = rnd(7, 15); }
    } else {
      a.p += a.dir * sp * dt;
      if (a.p < lo) { a.p = lo; a.dir = 1; } else if (a.p > hi) { a.p = hi; a.dir = -1; }
      a.t -= dt; if (a.t <= 0) drop(a);
    }
  }

  function step(a, dt) {
    if (a.state === 'held') return;
    if (a.ttl) { a.ttl -= dt; if (a.ttl <= 0) return removeActor(a, true); }
    if (a.s === 'ledge' && !syncLedge(a)) drop(a);
    if (a.state === 'fall') {
      a.vy += 1900 * dt; a.cy += a.vy * dt;
      const fy = innerHeight - HH;
      if (a.cy >= fy) {
        a.cy = fy; a.s = 'floor'; a.p = Math.max(HW, Math.min(innerWidth - HW, a.cx)); a.lift = 0; a.vy = 0;
        setState(a, 'idle', rnd(1, 2.5));
        if (a.sp.animate) a.sp.animate([{ transform: 'scale(1.15,.85)' }, { transform: 'scale(1)' }], { duration: 180 });
      }
      return pos(a);
    }
    if (a.hold) { if (a.s === 'floor' && a.state !== 'idle') setState(a, 'idle', 1); return pos(a); }
    const busy = a.state === 'climb' || a.state === 'perch';
    if (!busy) a.t -= dt;
    const sp = a.c.speed;
    switch (a.state) {
      case 'walk': move(a, sp * dt); break;
      case 'run': move(a, sp * 2.3 * dt); break;
      case 'zip': move(a, 900 * dt); break;
      case 'climb': climbStep(a, dt); break;
      case 'perch': perchStep(a, dt); break;
      case 'jump': { a.hopT += dt; const u = Math.min(1, a.hopT / 0.7); a.lift = 4 * 52 * u * (1 - u); move(a, sp * 0.9 * dt); break; }
    }
    if (!busy && a.t <= 0) { a.lift = 0; endState(a); think(a); }
    pos(a);
  }

  // ---------------- perching on top of page elements ----------------
  function pickLedge() {
    const vw = innerWidth, vh = innerHeight, list = [];
    const els = document.querySelectorAll('h1,h2,h3,h4,img,video,button,input,textarea,select,nav,header,footer,section,article,aside,figure,pre,table,blockquote,li,p,a');
    let n = 0;
    for (const el of els) {
      if (++n > 600) break;
      const r = el.getBoundingClientRect();
      if (r.width < 120 || r.height < 18 || r.top < HH * 2 + 20 || r.top > vh - 150 || r.left > vw - 120 || r.right < 120) continue;
      list.push({ el, r });
    }
    for (let i = 0; i < 8 && list.length; i++) {
      const { el, r } = list.splice(Math.floor(Math.random() * list.length), 1)[0];
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.2) continue;
      const px = Math.min(Math.max((r.left + r.right) / 2, 0), vw - 1), hit = document.elementFromPoint(px, Math.min(vh - 1, r.top + 3));
      if (!hit || !(hit === el || el.contains(hit) || hit.contains(el))) continue;
      return { el, left: Math.max(r.left, 0), right: Math.min(r.right, vw), top: r.top };
    }
    return null;
  }
  function syncLedge(a) {
    const e = a.plat; if (!e || !e.isConnected) return false;
    const r = e.getBoundingClientRect();
    if (r.width < 90 || r.top < HH + 8 || r.top > innerHeight - HH || r.bottom < 0) return false;
    a.lo = Math.max(r.left, 0) + HW * 0.8; a.hi = Math.min(r.right, innerWidth) - HW * 0.8; a.ly = r.top - HH + 3;
    return a.hi - a.lo > 10;
  }
  function perchStep(a, dt) {
    if (a.ph === 'leap') {
      const q = a.lp, e = a.plat;
      if (!e || !e.isConnected) return drop(a);
      q.y1 = e.getBoundingClientRect().top - HH + 3;
      q.t += dt; const u = Math.min(1, q.t / q.d);
      a.cx = q.x0 + (q.x1 - q.x0) * u; a.cy = q.y0 + (q.y1 - q.y0) * u - 4 * 45 * u * (1 - u);
      if (u >= 1) {
        if (syncLedge(a)) { a.s = 'ledge'; a.p = q.x1; a.ph = 'roam'; a.t = rnd(7, 15); a.sub = 0; a.subT = rnd(1, 2.5); paint(a); }
        else drop(a);
      }
      return;
    }
    a.t -= dt; a.subT -= dt;
    if (a.subT <= 0) { a.sub = a.sub ? 0 : 1; if (a.sub) a.dir = Math.random() < 0.5 ? -1 : 1; a.subT = a.sub ? rnd(1.5, 4) : rnd(1, 3); paint(a); }
    if (a.sub) { a.p += a.dir * a.c.speed * 0.8 * dt; if (a.p < a.lo) { a.p = a.lo; a.dir = 1; } else if (a.p > a.hi) { a.p = a.hi; a.dir = -1; } }
    if (a.t <= 0) drop(a);
  }

  // ---------------- drag, drop, click ----------------
  function wire(a) {
    let sx = 0, sy = 0, down = false, moved = false;
    a.sp.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sy = e.clientY;
      safe(() => a.sp.setPointerCapture(e.pointerId)); e.preventDefault();
    });
    a.sp.addEventListener('pointermove', e => {
      if (!down) return;
      if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) > 6) {
        moved = true; if (popFor === a) closePop(); hideBubble(a); a.s = 'free'; a.lift = 0; setState(a, 'held', 99);
      }
      if (moved) { a.cx = e.clientX; a.cy = e.clientY; pos(a); }
    });
    a.sp.addEventListener('pointerup', () => {
      if (!down) return; down = false;
      if (moved) { a.vy = 0; setState(a, 'fall', 99); } else onClick(a);
    });
  }
  function onClick(a) {
    if (a.clone) { removeActor(a, true); return; }
    addXp(a.c.id, 2);
    hideBubble(a); openPop(a);
  }

  // ---------------- popup ----------------
  const NAV = {
    top: () => scrollTo({ top: 0, behavior: 'smooth' }),
    bottom: () => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }),
    back: () => history.back(),
    reload: () => location.reload(),
    newtab: () => safe(() => chrome.runtime.sendMessage({ type: 'newtab' })),
    close: () => safe(() => chrome.runtime.sendMessage({ type: 'close' }))
  };
  const ICON = {
    up: '<path d="M12 19V5M5 12l7-7 7 7"/>', down: '<path d="M12 5v14M5 12l7 7 7-7"/>', back: '<path d="M19 12H5M12 5l-7 7 7 7"/>',
    reload: '<path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"/>', plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M18 6L6 18M6 6l12 12"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M17 4.5a3.5 3.5 0 0 1 0 7M22 20a6 6 0 0 0-4-5.6"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>', lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    check: '<path d="M5 12l5 5 9-10"/>', moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>'
  };
  const ic = k => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;
  const ACTS = [['top', 'up', 'Top'], ['bottom', 'down', 'Bottom'], ['back', 'back', 'Back'], ['reload', 'reload', 'Reload'], ['newtab', 'plus', 'New tab'], ['close', 'x', 'Close tab']];
  const TABS = [['act', 'grid', 'Actions'], ['talk', 'chat', 'Talk'], ['time', 'clock', 'Time'], ['profile', 'user', 'Profile'], ['cast', 'users', 'Cast']];
  const CATS = {
    Care: ['health-tip', 'posture-check', 'hydration', 'eye-rest', 'stretch', 'breathing', 'mini-meditation', 'self-kindness', 'mood-check', 'gratitude', 'cheer-up', 'overthinking-stopper', 'sleep-nudge', 'bedtime-story', 'night-sky', 'good-morning'],
    Focus: ['motivation', 'study-tip', 'productivity', 'procrastination', 'focus-coach', 'pomodoro-push', 'deal-maker', 'life-hack', 'tab-callout', 'exam-pep-talk', 'mini-challenge', 'time-perspective', 'hype-man'],
    Fun: ['dad-joke', 'riddle', 'knock-knock', 'pun', 'tongue-twister', 'would-you-rather', 'fun-fact', 'trivia', 'fortune-cookie', 'silly-conspiracy', 'hot-take', 'light-roast', 'sassy', 'snack-idea', 'music-idea', 'movie-night', 'game-idea'],
    Roleplay: ['announcer', 'detective-noir', 'sports-commentator', 'cooking-show', 'nature-documentary', 'pirate', 'shakespearean', 'robot-mode', 'grandpa-wisdom', 'poem', 'haiku', 'deep-thought', 'compliment']
  };
  const catOf = {};
  Object.entries(CATS).forEach(([k, l]) => l.forEach(id => { catOf[id] = k; }));
  STYLES.forEach(s => { catOf[s.id] = s.special ? 'Me' : (catOf[s.id] || 'Fun'); });
  const lum = h => { const n = parseInt(h.slice(1), 16); return (0.2126 * (n >> 16 & 255) + 0.7152 * (n >> 8 & 255) + 0.0722 * (n & 255)) / 255; };
  const face = c => c.draw().replace('viewBox="0 0 72 84"', 'viewBox="6 -8 60 60"');
  let popTab = 'act', talkCat = 'All', talkQ = '';

  const B = {
    act: () => `<div class="acts">${ACTS.map(([k, i, l]) => `<button class="act${k === 'close' ? ' danger' : ''}" data-a="nav" data-v="${k}">${ic(i)}<span>${l}</span></button>`).join('')}</div>` +
      `<button class="cta" data-a="surprise">${ic('spark')}Say something</button><div class="hint">Drag me anywhere. I will drop back down.</div>`,
    talk: () => `<input class="sb" data-search placeholder="Search ${STYLES.length} conversation styles" value="${esc(talkQ)}" autocomplete="off" spellcheck="false">` +
      `<div class="pills">${['All', 'Care', 'Focus', 'Fun', 'Roleplay', 'Me'].map(k => `<button class="pill${k === talkCat ? ' on' : ''}" data-a="cat" data-v="${k}">${k}</button>`).join('')}</div><div class="list" id="ls"></div>`,
    time: () => '<div class="hint" id="tm">Loading...</div>',
    profile: a => {
      const c = a.c, xp = xpOf(c.id), L = lvl(xp), nx = LV[L], pct = nx ? ((xp - LV[L - 1]) / (nx - LV[L - 1])) * 100 : 100;
      return `<div class="p">${esc(c.bio)}</div><div>${c.traits.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div><div class="p dim">Likes: ${esc(c.likes)}</div>` +
        `<div class="sec">Bond</div><div class="sn"><span><b>${TITLES[L - 1]}</b> \u00B7 Level ${L}</span><span>${Math.floor(xp)}${nx ? ' / ' + nx : ''} xp</span></div><div class="bar"><div data-w="${pct.toFixed(0)}"></div></div>` +
        `<div class="sec">Memories</div>` + c.deep.map((d, i) => L >= i + 2 ? `<div class="mem">${esc(d)}</div>` : `<div class="mem lock">${ic('lock')}Unlocks at level ${i + 2}</div>`).join('');
    },
    cast: () => `<div class="cg">${CHARS.map(c => `<button class="cc${cast.includes(c.id) ? ' on' : ''}" data-a="toggle" data-v="${c.id}"><span class="mini">${face(c)}</span><span class="ct"><b>${esc(c.short)}</b><small>Level ${lvl(xpOf(c.id))}</small></span><span class="ck">${ic('check')}</span></button>`).join('')}</div>` +
      `<div class="sr"><span>Quiet mode<small>Fewer chats. Reminders stay on.</small></span><button class="sw2${quiet ? ' on' : ''}" role="switch" aria-checked="${quiet}" aria-label="Quiet mode" data-a="quiet"></button></div>`
  };

  function post() {
    pop.querySelectorAll('[data-w]').forEach(e => { e.style.width = e.dataset.w + '%'; });
    pop.querySelectorAll('[data-p]').forEach(e => e.style.setProperty('--p', e.dataset.p));
  }
  function fillList() {
    const ls = pop.querySelector('#ls'); if (!ls) return;
    const q = talkQ.trim().toLowerCase(), a = popFor;
    const items = STYLES.filter(s => (talkCat === 'All' || catOf[s.id] === talkCat) && (!q || s.n.toLowerCase().includes(q)));
    ls.innerHTML = items.length ? items.map(s => `<button class="chip" data-a="style" data-v="${s.id}"><span>${s.e}</span>${esc(s.n)}${s.id === 'deep' && a && levelOf(a) < 2 ? ' \u{1F512}' : ''}</button>`).join('') : '<div class="hint">No styles match.</div>';
  }
  function fillTime() {
    safe(() => chrome.runtime.sendMessage({ type: 'stats' }, r => {
      const el = pop.querySelector('#tm'); if (!el || popTab !== 'time') return;
      if (chrome.runtime.lastError || !r) { el.textContent = 'Cannot reach the timer right now.'; return; }
      const pct = r.next ? Math.min(1, r.session / r.next) : 0, len = 2 * Math.PI * 52, max = Math.max(1, ...r.hosts.map(h => h[1]));
      el.className = '';
      el.innerHTML = `<div class="ringw"><svg viewBox="0 0 128 128"><circle class="trk" cx="64" cy="64" r="52"/><circle class="prg" cx="64" cy="64" r="52" stroke-dasharray="${(len * pct).toFixed(1)} ${len.toFixed(1)}" transform="rotate(-90 64 64)"/></svg><div class="ringc"><div class="big">${fmt(r.session)}</div><div class="sm">this session</div></div></div>` +
        `<div class="stats"><div class="st"><b>${fmt(r.today)}</b><span>today</span></div><div class="st"><b>${fmt(Math.max(0, r.next - r.session))}</b><span>to next nudge</span></div></div>` +
        `<div class="rest${r.late ? ' on' : ''}">${ic('moon')}<span>Rest window 11 PM to 5 AM \u00B7 ${r.late ? 'active now' : 'off right now'}</span></div>` +
        (r.hosts.length ? '<div class="sec">Top sites today</div>' + r.hosts.map(([h, m]) => `<div class="site"><div class="sn"><span>${esc(h)}</span><span>${fmt(m)}</span></div><div class="bar"><div data-w="${Math.round(m / max * 100)}"></div></div></div>`).join('') : '') +
        '<div class="hint">A 10-minute break resets your session.</div>';
      post();
    }));
  }
  function fillBody() {
    const a = popFor; if (!a) return;
    pop.querySelectorAll('.tab').forEach(t => t.classList.toggle('on', t.dataset.v === popTab));
    const bd = pop.querySelector('#bd'); bd.innerHTML = B[popTab](a); bd.scrollTop = 0;
    if (popTab === 'talk') fillList();
    if (popTab === 'time') fillTime();
    post();
  }
  function renderPop() {
    const a = popFor, c = a.c, xp = xpOf(c.id), L = lvl(xp), nx = LV[L], pct = nx ? ((xp - LV[L - 1]) / (nx - LV[L - 1])) * 100 : 100;
    pop.style.setProperty('--ac', c.color); pop.style.setProperty('--on', lum(c.color) > 0.6 ? '#111' : '#fff');
    pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', c.name + ' menu');
    pop.innerHTML = `<i class="arrow"></i><div class="card"><div class="ph"><div class="av"><div class="ring" data-p="${pct.toFixed(0)}"></div><div class="face">${face(c)}</div><span class="lv" title="Bond level">${L}</span></div>` +
      `<div><div class="nm">${esc(c.name)}</div><div class="tg">${esc(c.tagline)}</div><div class="q">\u201C${esc(a.quip)}\u201D</div></div><button class="cls" data-a="close" aria-label="Close">${ic('x')}</button></div>` +
      `<div class="tabs" role="tablist">${TABS.map(([k, i, l]) => `<button class="tab" role="tab" data-a="tab" data-v="${k}">${ic(i)}<span>${l}</span></button>`).join('')}</div><div class="body" id="bd"></div></div>`;
    fillBody();
  }
  function placePop() {
    const a = popFor; if (!a) return;
    const r = pop.getBoundingClientRect(), ar = pop.querySelector('.arrow'), vw = innerWidth, vh = innerHeight;
    let x, y, side = 'bottom';
    if (a.s === 'wl') { x = a.cx + HH + 14; y = a.cy - r.height / 2; side = 'left'; }
    else if (a.s === 'wr') { x = a.cx - HH - 14 - r.width; y = a.cy - r.height / 2; side = 'right'; }
    else if (a.s === 'ceil') { x = a.cx - r.width / 2; y = a.cy + HH + 14; side = 'top'; }
    else { x = a.cx - r.width / 2; y = a.cy - HH - 14 - r.height; if (y < 8) { y = a.cy + HH + 14; side = 'top'; } }
    x = Math.max(8, Math.min(vw - r.width - 8, x)); y = Math.max(8, Math.min(vh - r.height - 8, y));
    pop.style.left = x + 'px'; pop.style.top = y + 'px';
    if (ar) {
      ar.style.left = ar.style.right = ar.style.top = ar.style.bottom = 'auto';
      if (side === 'bottom' || side === 'top') {
        ar.style.left = Math.max(20, Math.min(r.width - 34, a.cx - x - 7)) + 'px';
        ar.style[side === 'bottom' ? 'bottom' : 'top'] = '-7px';
      } else {
        ar.style.top = Math.max(20, Math.min(r.height - 34, a.cy - y - 7)) + 'px';
        ar.style[side === 'left' ? 'left' : 'right'] = '-7px';
      }
    }
  }
  function openPop(a) {
    if (popFor) { popFor.hold = false; paint(popFor); }
    popFor = a; a.hold = true; a.quip = pick(a.c.says.click); popTab = 'act';
    paint(a); renderPop(); pop.classList.add('open'); placePop();
  }
  function closePop() { if (popFor) { popFor.hold = false; paint(popFor); } popFor = null; pop.classList.remove('open'); }

  pop.addEventListener('click', e => {
    const t = e.target.closest('[data-a]'); if (!t || !popFor) return;
    const a = popFor, k = t.dataset.a, v = t.dataset.v;
    if (k === 'close') closePop();
    else if (k === 'tab') { popTab = v; fillBody(); }
    else if (k === 'cat') { talkCat = v; pop.querySelectorAll('.pill').forEach(p => p.classList.toggle('on', p.dataset.v === v)); fillList(); }
    else if (k === 'nav') { closePop(); say(a, voice(a.c, NAVSAY[v]), { ms: 2200 }); setTimeout(NAV[v], 250); }
    else if (k === 'style') { closePop(); speakStyle(a, v); addXp(a.c.id, 1); }
    else if (k === 'surprise') { closePop(); speakStyle(a); addXp(a.c.id, 1); }
    else if (k === 'toggle') {
      const s = new Set(cast); s.has(v) ? s.delete(v) : s.add(v);
      cast = CHARS.map(c => c.id).filter(id => s.has(id));
      safe(() => chrome.storage.local.set({ dudeCast: cast }));
      t.classList.toggle('on', s.has(v)); syncCast();
    } else if (k === 'quiet') {
      quiet = !quiet; safe(() => chrome.storage.local.set({ dudeQuiet: quiet }));
      t.classList.toggle('on', quiet); t.setAttribute('aria-checked', String(quiet));
    }
  });
  pop.addEventListener('input', e => { if (e.target.dataset && e.target.dataset.search !== undefined) { talkQ = e.target.value; fillList(); } });
  ['keydown', 'keyup', 'keypress'].forEach(ev => pop.addEventListener(ev, e => { e.stopPropagation(); if (ev === 'keydown' && e.key === 'Escape') closePop(); }));
  document.addEventListener('pointerdown', e => { if (popFor && !e.composedPath().includes(host)) closePop(); }, true);

  
// ---------------- cast ----------------
  function syncCast() {
    for (const a of actors.slice()) if (!a.clone && !cast.includes(a.c.id)) removeActor(a, true);
    for (const id of cast) {
      if (BYID[id] && !actors.some(a => !a.clone && a.c.id === id)) { const a = mk(BYID[id]); poof(a.cx, a.cy); }
    }
  }

  // ---------------- reminders from the timer ----------------
  function remind(ev) {
    if (host.style.display === 'none') return false;
    const alive = actors.filter(a => !a.clone && a.s !== 'free');
    if (!alive.length) return false;
    const a = pick(alive), c = a.c;
    let text = null, who = '';
    if (ev.type === 'session') {
      const m = ev.minutes, k = m <= 30 ? 'r30' : m <= 60 ? 'r60' : m <= 120 ? 'r120' : 'rN';
      text = fmtSay(c, pick(c.says[k]).replace('{t}', fmt(m))); who = `${c.short} \u00B7 \u23F0 ${fmt(m)} session`;
    } else if (ev.type === 'late') {
      text = fmtSay(c, c.says.late[Math.min(3, ev.level) - 1]); who = `${c.short} \u00B7 \u{1F319} Time to rest`;
    } else if (ev.type === 'day') {
      text = voice(c, pick(D.DAY).replace('{t}', fmt(ev.minutes))); who = `${c.short} \u00B7 \u{1F4C5} Today`;
    } else if (ev.type === 'back') {
      text = fmtSay(c, pick(c.says.back)); who = `${c.short} \u00B7 \u{1F44B} Welcome back`;
    } else return false;
    start(a, 'jump');
    say(a, text, { who, alert: ev.type !== 'back', ms: ev.type === 'back' ? 6000 : 14000 });
    if (ev.type !== 'back' && alive.length > 1) {
      const b = pick(alive.filter(x => x !== a));
      setTimeout(() => say(b, voice(b.c, pick(D.AGREE)), { ms: 3800 }), 3200);
    }
    return true;
  }
  safe(() => chrome.runtime.onMessage.addListener((m, _s, send) => {
    if (m.type === 'remind') send({ ok: remind(m.ev) });
  }));

  // ---------------- idle chatter, banter, presence xp ----------------
  const visible = () => document.visibilityState === 'visible' && host.style.display !== 'none';
  setInterval(() => {
    if (!visible() || quiet || Date.now() - lastSpeak < 40000 || Math.random() > 0.28) return;
    const c = actors.filter(a => !a.clone && !a.hold && !a.talking && a.state !== 'held' && a.state !== 'fall');
    if (c.length) speakStyle(pick(c));
  }, 6000);

  setInterval(() => {
    if (!visible() || quiet || Date.now() - lastSpeak < 30000 || Date.now() - lastBanter < 75000) return;
    const f = actors.filter(a => !a.clone && a.s === 'floor' && !a.talking && !a.hold && (a.state === 'idle' || a.state === 'walk'));
    for (let i = 0; i < f.length; i++) for (let j = i + 1; j < f.length; j++) {
      const A = f[i], B = f[j];
      if (Math.abs(A.p - B.p) > 190) continue;
      const ex = D.BANTER[[A.c.id, B.c.id].sort().join('|')];
      if (ex && Math.random() < 0.6) {
        const [x, y] = A.c.id < B.c.id ? [A, B] : [B, A], line = pick(ex);
        x.dir = x.p < y.p ? 1 : -1; y.dir = -x.dir; setState(x, 'idle', 6); setState(y, 'idle', 6);
        say(x, line[0], { ms: 3600 }); setTimeout(() => say(y, line[1], { ms: 3800 }), 2600);
        lastBanter = Date.now(); return;
      }
    }
  }, 5000);

  setInterval(() => { if (visible()) actors.forEach(a => { if (!a.clone) addXp(a.c.id, 0.2); }); }, 60000);

  // ---------------- storage sync ----------------
  safe(() => chrome.storage.onChanged.addListener(ch => {
    if (ch.dudeHidden) {
      hidden = !!ch.dudeHidden.newValue; host.style.display = hidden ? 'none' : 'block';
      if (hidden) closePop(); else { const a = actors.find(x => !x.clone); if (a) say(a, voice(a.c, 'Miss me?'), { ms: 2500 }); }
    }
    if (ch.dudeCast) { cast = ch.dudeCast.newValue || DEFAULT_CAST.slice(); syncCast(); }
    if (ch.dudeQuiet) quiet = !!ch.dudeQuiet.newValue;
    if (ch.dudeBond) bond = ch.dudeBond.newValue || {};
  }));

  addEventListener('resize', () => actors.forEach(a => { const [lo, hi] = bounds(a); if (a.s !== 'free') a.p = Math.max(lo, Math.min(hi, a.p)); pos(a); }));

  // ---------------- main loop ----------------
  let last = performance.now();
  function frame(t) {
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (host.style.display !== 'none') for (const a of actors.slice()) step(a, dt);
    requestAnimationFrame(frame);
  }

  // ---------------- boot ----------------
  safe(() => chrome.storage.local.get(['dudeCast', 'dudeHidden', 'dudeQuiet', 'dudeBond', 'dudeGreet'], s => {
    cast = Array.isArray(s.dudeCast) ? s.dudeCast : DEFAULT_CAST.slice();
    hidden = !!s.dudeHidden; quiet = !!s.dudeQuiet; bond = s.dudeBond || {};
    document.documentElement.appendChild(host);
    host.style.display = hidden ? 'none' : 'block';
    syncCast();
    if (!hidden && !quiet && Date.now() - (s.dudeGreet || 0) > 20 * 60000) {
      safe(() => chrome.storage.local.set({ dudeGreet: Date.now() }));
      setTimeout(() => { const a = actors.find(x => !x.clone); if (a) say(a, pick(a.c.says.greet), { ms: 4500 }); }, 700);
    }
    requestAnimationFrame(frame);
  }));
})();
