// CultureHub — Shared Utilities

// ── Theme System ───────────────────────────────────────────────────────────────
const Theme = (() => {
  const KEY = 'culturehub_theme';

  function get() {
    return localStorage.getItem(KEY) || 'dark';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    // Update all toggle buttons on the page
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  }

  function toggle() {
    const next = get() === 'dark' ? 'light' : 'dark';
    apply(next);
    return next;
  }

  function init() {
    // Apply immediately to avoid flash
    apply(get());
    // Re-apply after nav is injected
    document.addEventListener('DOMContentLoaded', () => apply(get()));
  }

  return { get, apply, toggle, init };
})();

// Init theme before anything renders
Theme.init();

// ── Toast ──────────────────────────────────────────────────────────────────────
function toast(msg, type = 'info', duration = 3000) {
  let wrap = document.getElementById('ch-toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'ch-toast-wrap';
    document.body.appendChild(wrap);
  }
  const t = document.createElement('div');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || '•'}</span><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

// ── Modal helpers ──────────────────────────────────────────────────────────────
function openModal(html, options = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal ${options.lg ? 'modal-lg' : ''}">${html}</div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay); });
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  return overlay;
}
function closeModal(el) {
  const overlay = el.closest ? el.closest('.modal-overlay') : el;
  if (overlay) { overlay.remove(); document.body.style.overflow = ''; }
}
function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
  document.body.style.overflow = '';
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
function confirmDialog(message, title = 'Confirm') {
  return new Promise(resolve => {
    const overlay = openModal(`
      <div class="modal-header">
        <span class="modal-title">⚠️ ${title}</span>
        <button class="modal-close" onclick="closeModal(this)">✕</button>
      </div>
      <p style="color:var(--text2);margin-bottom:24px;">${message}</p>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="conf-no">Cancel</button>
        <button class="btn btn-danger" id="conf-yes">Confirm</button>
      </div>
    `);
    overlay.querySelector('#conf-yes').onclick = () => { closeModal(overlay); resolve(true); };
    overlay.querySelector('#conf-no').onclick = () => { closeModal(overlay); resolve(false); };
  });
}

// ── Avatar initials ───────────────────────────────────────────────────────────
function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}

// ── Color from string (consistent) ───────────────────────────────────────────
function avatarColor(name = '') {
  const colors = [
    'linear-gradient(135deg,#6c63ff,#a855f7)',
    'linear-gradient(135deg,#36d399,#06b6d4)',
    'linear-gradient(135deg,#f59e0b,#fb923c)',
    'linear-gradient(135deg,#f87171,#ec4899)',
    'linear-gradient(135deg,#60a5fa,#818cf8)',
    'linear-gradient(135deg,#34d399,#6ee7b7)',
  ];
  let hash = 0;
  for (let c of name) hash = ((hash << 5) - hash + c.charCodeAt(0)) | 0;
  return colors[Math.abs(hash) % colors.length];
}

function avatarEl(name, size = '') {
  return `<div class="avatar ${size}" style="background:${avatarColor(name)}">${initials(name)}</div>`;
}

// ── Date formatting ───────────────────────────────────────────────────────────
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return dateStr; }
}

function fmtDateShort(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

function isUpcoming(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr + 'T12:00:00') >= new Date();
}

// ── Event type badge ──────────────────────────────────────────────────────────
function eventTypeBadge(type) {
  const t = (type || 'General').toLowerCase().replace(/\s+/g, '');
  const map = {
    game: 'game', social: 'social', teambuilding: 'team', holiday: 'holiday',
    charity: 'charity', general: 'general', 'team building': 'team'
  };
  const cls = map[t] || 'general';
  return `<span class="badge chip type-${cls}">${type || 'General'}</span>`;
}

// ── Points display ────────────────────────────────────────────────────────────
function pointsBadge(pts, isWinner) {
  if (isWinner) return `<span class="badge badge-gold">🏆 ${pts}pts</span>`;
  if (pts > 0) return `<span class="badge badge-accent">⭐ ${pts}pt</span>`;
  return `<span class="badge badge-gray">—</span>`;
}

// ── Nav active state ──────────────────────────────────────────────────────────
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.ch-nav nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === page);
  });
}

// ── PDF Report (client-side via print / jsPDF) ────────────────────────────────
function generateReport(type, id) {
  // Use print-friendly popup
  const data = CH.load();

  if (type === 'overview') {
    const lb = CH.getLeaderboard();
    const events = data.events;
    const html = buildOverviewReportHTML(lb, events, data.settings);
    printHTML(html);
  } else if (type === 'event' && id) {
    const event = data.events.find(e => e.id === id);
    if (!event) return;
    const people = data.people;
    const html = buildEventReportHTML(event, people);
    printHTML(html);
  } else if (type === 'person' && id) {
    const stats = CH.getPersonStats(id);
    if (!stats) return;
    const html = buildPersonReportHTML(stats);
    printHTML(html);
  }
}

function printHTML(html) {
  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 400);
}

function buildOverviewReportHTML(lb, events, settings) {
  const top10 = lb.slice(0, 10);
  const rows = top10.map((e, i) => `
    <tr>
      <td style="font-weight:700;color:${i<3?'#c0960c':'#333'}">#${i+1}</td>
      <td style="font-weight:600">${e.person.name}</td>
      <td>${e.person.team || '—'}</td>
      <td style="font-weight:700;color:#6c63ff">${e.points}</td>
      <td>${e.events}</td>
      <td>${e.wins}</td>
    </tr>`).join('');

  return `<!DOCTYPE html><html><head><title>CultureHub Report</title>
  <style>
    body{font-family:Arial,sans-serif;margin:40px;color:#1a1a2e}
    h1{color:#6c63ff;border-bottom:3px solid #6c63ff;padding-bottom:12px}
    h2{color:#333;margin-top:32px;margin-bottom:12px}
    table{width:100%;border-collapse:collapse;margin-bottom:24px}
    th{background:#6c63ff;color:#fff;padding:10px 14px;text-align:left;font-size:12px;text-transform:uppercase}
    td{padding:9px 14px;border-bottom:1px solid #eee}
    tr:hover td{background:#f5f3ff}
    .meta{color:#666;font-size:13px;margin-bottom:24px}
    .stat-row{display:flex;gap:24px;margin-bottom:28px;flex-wrap:wrap}
    .stat{background:#f5f3ff;border-radius:8px;padding:16px 24px;text-align:center}
    .stat-n{font-size:2rem;font-weight:800;color:#6c63ff}
    .stat-l{font-size:12px;color:#666;text-transform:uppercase}
  </style></head><body>
  <h1>🎯 ${settings.orgName || 'CultureHub'} — Culture Report</h1>
  <p class="meta">Generated: ${new Date().toLocaleString()}</p>
  <div class="stat-row">
    <div class="stat"><div class="stat-n">${lb.length}</div><div class="stat-l">Members</div></div>
    <div class="stat"><div class="stat-n">${events.length}</div><div class="stat-l">Events</div></div>
    <div class="stat"><div class="stat-n">${lb.reduce((s,e)=>s+e.points,0)}</div><div class="stat-l">Total Points</div></div>
  </div>
  <h2>🏆 Top 10 Leaderboard</h2>
  <table><thead><tr><th>Rank</th><th>Name</th><th>Team</th><th>Points</th><th>Events</th><th>Wins</th></tr></thead>
  <tbody>${rows}</tbody></table>
  <h2>📅 Events</h2>
  <table><thead><tr><th>Event</th><th>Date</th><th>Type</th><th>Attendees</th></tr></thead>
  <tbody>${events.map(e=>`<tr><td>${e.title}</td><td>${e.date||'—'}</td><td>${e.type||'—'}</td><td>${e.attendees.filter(a=>a.checkedIn).length}</td></tr>`).join('')}</tbody></table>
  </body></html>`;
}

function buildEventReportHTML(event, people) {
  const attended = event.attendees.filter(a => a.checkedIn);
  const rows = attended.map(a => {
    const p = people.find(x => x.id === a.personId);
    return `<tr><td>${p ? p.name : '—'}</td><td>${p ? p.team || '—' : '—'}</td>
      <td>${a.isWinner ? '🏆 Winner' : '✅ Attended'}</td>
      <td style="font-weight:700;color:#6c63ff">${a.points}</td></tr>`;
  }).join('');
  return `<!DOCTYPE html><html><head><title>${event.title} Report</title>
  <style>
    body{font-family:Arial,sans-serif;margin:40px;color:#1a1a2e}
    h1{color:#6c63ff;border-bottom:3px solid #6c63ff;padding-bottom:12px}
    table{width:100%;border-collapse:collapse}
    th{background:#6c63ff;color:#fff;padding:10px 14px;text-align:left;font-size:12px;text-transform:uppercase}
    td{padding:9px 14px;border-bottom:1px solid #eee}
    .meta{color:#666;font-size:13px;margin-bottom:24px}
    .info{background:#f5f3ff;border-radius:8px;padding:16px 24px;margin-bottom:24px}
  </style></head><body>
  <h1>📅 ${event.title}</h1>
  <div class="info">
    <strong>Date:</strong> ${event.date || '—'} &nbsp;|&nbsp;
    <strong>Type:</strong> ${event.type || '—'} &nbsp;|&nbsp;
    <strong>Location:</strong> ${event.location || '—'}<br>
    <strong>Total Checked In:</strong> ${attended.length} &nbsp;|&nbsp;
    <strong>Total Points Awarded:</strong> ${attended.reduce((s,a)=>s+a.points,0)}
  </div>
  <table><thead><tr><th>Name</th><th>Team</th><th>Status</th><th>Points</th></tr></thead>
  <tbody>${rows || '<tr><td colspan="4" style="text-align:center;color:#999">No check-ins</td></tr>'}</tbody></table>
  <p class="meta" style="margin-top:16px">Generated: ${new Date().toLocaleString()}</p>
  </body></html>`;
}

function buildPersonReportHTML(stats) {
  const rows = stats.eventsAttended.map(ea => `
    <tr><td>${ea.event.title}</td><td>${ea.event.date||'—'}</td>
    <td>${ea.attendance.isWinner ? '🏆 Winner' : '✅ Attended'}</td>
    <td style="font-weight:700;color:#6c63ff">${ea.attendance.points}</td></tr>`).join('');
  return `<!DOCTYPE html><html><head><title>${stats.person.name} Report</title>
  <style>
    body{font-family:Arial,sans-serif;margin:40px;color:#1a1a2e}
    h1{color:#6c63ff;border-bottom:3px solid #6c63ff;padding-bottom:12px}
    table{width:100%;border-collapse:collapse}
    th{background:#6c63ff;color:#fff;padding:10px 14px;text-align:left;font-size:12px;text-transform:uppercase}
    td{padding:9px 14px;border-bottom:1px solid #eee}
    .meta{color:#666;font-size:13px;margin-bottom:24px}
    .info{background:#f5f3ff;border-radius:8px;padding:16px 24px;margin-bottom:24px;display:flex;gap:32px}
    .stat-n{font-size:2rem;font-weight:800;color:#6c63ff}
    .stat-l{font-size:12px;color:#666;text-transform:uppercase}
  </style></head><body>
  <h1>👤 ${stats.person.name}</h1>
  <div class="info">
    <div><div class="stat-n">${stats.totalPoints}</div><div class="stat-l">Total Points</div></div>
    <div><div class="stat-n">${stats.eventsAttended.length}</div><div class="stat-l">Events</div></div>
    <div><div class="stat-n">${stats.wins}</div><div class="stat-l">Wins</div></div>
  </div>
  <table><thead><tr><th>Event</th><th>Date</th><th>Status</th><th>Points</th></tr></thead>
  <tbody>${rows || '<tr><td colspan="4" style="text-align:center;color:#999">No events yet</td></tr>'}</tbody></table>
  <p class="meta" style="margin-top:16px">Generated: ${new Date().toLocaleString()}</p>
  </body></html>`;
}

// ── Nav HTML ──────────────────────────────────────────────────────────────────
function navHTML() {
  const s = CH.getSettings();
  return `
  <header class="ch-nav">
    <a href="index.html" class="logo">
      <div class="logo-icon">🎯</div>
      Culture<span>Hub</span>
    </a>
    <nav>
      <a href="index.html">🏠 Home</a>
      <a href="events.html">📅 Events</a>
      <a href="roster.html">👥 Roster</a>
      <a href="checkin.html">✅ Check-In</a>
      <a href="dashboard.html">📊 Dashboard</a>
      <a href="search.html">🔍 Search</a>
      <a href="gallery.html">🖼 Gallery</a>
      <a href="settings.html">⚙️ Settings</a>
    </nav>
    <div class="nav-actions">
      <button class="btn btn-sm btn-ghost" onclick="CH.exportBackup()" title="Backup data">💾 Backup</button>
      <button class="theme-toggle" onclick="Theme.toggle()" title="Toggle light/dark mode" aria-label="Toggle theme">
        <span class="icon-sun">☀️</span>
        <span class="icon-moon">🌙</span>
      </button>
    </div>
  </header>`;
}

// Re-apply theme after nav is injected into DOM
(function() {
  const obs = new MutationObserver(() => {
    const nav = document.querySelector('.ch-nav');
    if (nav) { Theme.apply(Theme.get()); obs.disconnect(); }
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();
