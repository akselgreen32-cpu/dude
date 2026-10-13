// ---------- Dude v2 background: time tracking + reminders ----------
const MS = [30, 60, 120, 180, 240];          // session reminders (minutes), then hourly after 4h
const DMS = [60, 120, 240, 360, 480, 600];   // total-today reminders (minutes), then every 2h
const BREAK = 10;                            // minutes away that count as a real break
const LATE_FROM = 23, LATE_TO = 5;           // "go rest" window (local time)

const nextMs = m => { for (const x of MS) if (x > m) return x; return 240 + (Math.floor((m - 240) / 60) + 1) * 60; };
const lastMs = m => { let b = 0; for (const x of MS) if (x <= m) b = x; if (m > 240) b = 240 + Math.floor((m - 240) / 60) * 60; return b; };
const lastDms = m => { let b = 0; for (const x of DMS) if (x <= m) b = x; if (m > 600) b = 600 + Math.floor((m - 600) / 120) * 120; return b; };
const dayKey = d => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
const nightKey = d => dayKey(new Date(d.getTime() - 5 * 3600e3));
const isLate = d => d.getHours() >= LATE_FROM || d.getHours() < LATE_TO;
const fmt = m => { const h = Math.floor(m / 60), r = m % 60; return h ? (r ? h + 'h ' + r + 'm' : h + 'h') : m + 'm'; };

const getState = async () => {
  const { dudeTime } = await chrome.storage.local.get('dudeTime');
  return Object.assign({ day: '', today: 0, session: 0, away: 0, milestone: 0, dayMs: 0, hosts: {}, lateAt: 0, lateN: 0, nk: '' }, dudeTime || {});
};

const idleState = () => new Promise(r => chrome.idle.queryState(900, st => { void chrome.runtime.lastError; r(st); }));
const winFocused = () => new Promise(r => chrome.windows.getLastFocused(w => { void chrome.runtime.lastError; r(!!(w && w.focused)); }));

async function tick() {
  const s = await getState(), now = new Date(), dk = dayKey(now);
  if (s.day !== dk) { s.day = dk; s.today = 0; s.hosts = {}; s.dayMs = 0; }

  const [st, focused] = await Promise.all([idleState(), winFocused()]);
  const active = focused && st === 'active';
  let ev = null;

  if (active) {
    let back = null;
    if (s.away >= BREAK) {                       // returning from a real break
      if (s.session >= 30) back = { type: 'back', was: s.session, away: s.away };
      s.session = 0; s.milestone = 0;
    }
    s.away = 0; s.session++; s.today++;

    try {
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      let host = 'browser pages';
      if (tab && tab.url && /^https?:/.test(tab.url)) host = new URL(tab.url).hostname.replace(/^www\./, '');
      s.hosts[host] = (s.hosts[host] || 0) + 1;
    } catch (_) {}

    if (isLate(now)) {
      if (s.nk !== nightKey(now)) { s.nk = nightKey(now); s.lateN = 0; s.lateAt = 0; }
      if (now - s.lateAt >= 30 * 60e3) {
        const h = now.getHours();
        const level = Math.max(Math.min(3, s.lateN + 1), h >= 2 && h < 5 ? 3 : h < 5 ? 2 : 1);
        s.lateAt = +now; s.lateN++;
        ev = { type: 'late', level, minutes: s.session };
      }
    }
    if (!ev) { const m = lastMs(s.session); if (m > s.milestone) { s.milestone = m; ev = { type: 'session', minutes: m }; } }
    if (!ev && back) ev = back;
    if (!ev) { const d = lastDms(s.today); if (d > s.dayMs) { s.dayMs = d; ev = { type: 'day', minutes: d }; } }
  } else {
    s.away++;
  }

  await chrome.storage.local.set({ dudeTime: s });
  if (ev) deliver(ev);
}

function deliver(ev) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    void chrome.runtime.lastError;
    const t = tabs && tabs[0];
    if (!t) return note(ev);
    chrome.tabs.sendMessage(t.id, { type: 'remind', ev }, resp => {
      if (chrome.runtime.lastError || !resp || !resp.ok) note(ev);   // page can't show Dude -> system notification
    });
  });
}

function note(ev) {
  let msg = null;
  if (ev.type === 'late') msg = ['It is getting late. Wrap up and rest.', 'It is very late. The rest can wait until tomorrow.', 'Seriously, go to sleep. Tomorrow-you needs it.'][ev.level - 1];
  else if (ev.type === 'session') msg = 'You have been going for ' + fmt(ev.minutes) + '. Stand up, stretch, drink some water.';
  else if (ev.type === 'day') msg = 'That is ' + fmt(ev.minutes) + ' in the browser today.';
  if (msg) chrome.notifications.create({ type: 'basic', iconUrl: 'icons/128.png', title: 'Dude', message: msg });
}

// ---------- alarms ----------
const ensureAlarm = () => chrome.alarms.get('tick', a => { void chrome.runtime.lastError; if (!a) chrome.alarms.create('tick', { periodInMinutes: 1 }); });
chrome.runtime.onInstalled.addListener(ensureAlarm);
chrome.runtime.onStartup.addListener(ensureAlarm);
ensureAlarm();
chrome.alarms.onAlarm.addListener(a => { if (a.name === 'tick') tick(); });

// ---------- messages from the pals ----------
chrome.runtime.onMessage.addListener((m, sender, send) => {
  if (m.type === 'newtab') chrome.tabs.create({});
  else if (m.type === 'close' && sender.tab) chrome.tabs.remove(sender.tab.id);
  else if (m.type === 'stats') {
    getState().then(s => {
      const ses = s.away >= BREAK ? 0 : s.session;
      send({
        session: ses, today: s.today, next: nextMs(ses),
        hosts: Object.entries(s.hosts).sort((a, b) => b[1] - a[1]).slice(0, 5),
        late: isLate(new Date())
      });
    });
    return true;
  }
});

// ---------- toolbar button: show / hide all pals ----------
chrome.action.onClicked.addListener(async () => {
  const { dudeHidden } = await chrome.storage.local.get('dudeHidden');
  await chrome.storage.local.set({ dudeHidden: !dudeHidden });
});
