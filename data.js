// CultureHub - Shared Data Layer
// All data is stored in localStorage under 'culturehub_data'

const CH = (() => {
  const KEY = 'culturehub_data';

  function getDefault() {
    return {
      version: 1,
      people: [],        // { id, name, team, email, avatar }
      events: [],        // { id, title, date, type, description, location, gallery:[], attendees:[{personId, checkedIn, points, isWinner}] }
      settings: { orgName: 'Our Organization', theme: 'dark' }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return getDefault();
      const data = JSON.parse(raw);
      // Migrations
      data.people = data.people || [];
      data.events = data.events || [];
      data.settings = data.settings || { orgName: 'Our Organization', theme: 'dark' };
      return data;
    } catch (e) {
      return getDefault();
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('culturehub:updated', { detail: data }));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
  }

  // ── People ──────────────────────────────────────────────────────────────────
  function getPeople() { return load().people; }

  function addPerson(name, team = '', email = '') {
    const data = load();
    const person = { id: uid(), name: name.trim(), team: team.trim(), email: email.trim(), avatar: '' };
    data.people.push(person);
    save(data);
    return person;
  }

  function updatePerson(id, updates) {
    const data = load();
    const idx = data.people.findIndex(p => p.id === id);
    if (idx === -1) return false;
    data.people[idx] = { ...data.people[idx], ...updates };
    save(data);
    return true;
  }

  function deletePerson(id) {
    const data = load();
    data.people = data.people.filter(p => p.id !== id);
    // Remove from all events
    data.events.forEach(e => {
      e.attendees = e.attendees.filter(a => a.personId !== id);
    });
    save(data);
  }

  function unwrapImportList(input) {
    if (Array.isArray(input)) return input;
    if (!input || typeof input !== 'object') return [];
    return input.people || input.members || input.users || input.value || input.data || [input];
  }

  function fieldValue(source, names) {
    for (const name of names) {
      if (source[name] !== undefined && source[name] !== null) return String(source[name]).trim();
    }
    return '';
  }

  function importPeople(list) {
    const data = load();
    const rows = unwrapImportList(list);
    let added = 0;
    rows.forEach(p => {
      if (!p || typeof p !== 'object') return;
      const name = fieldValue(p, ['name', 'displayName', 'full_name', 'fullName', 'Name', 'Display Name']);
      if (!name) return;
      const email = fieldValue(p, ['email', 'mail', 'userPrincipalName', 'Email', 'Email Address']);
      const team = fieldValue(p, ['team', 'department', 'group', 'groupName', 'officeLocation', 'Team', 'Department']);
      const exists = data.people.find(x =>
        x.name.toLowerCase() === name.toLowerCase() ||
        (email && (x.email || '').toLowerCase() === email.toLowerCase())
      );
      if (!exists) {
        data.people.push({ id: uid(), name, team, email, avatar: '' });
        added++;
      }
    });
    save(data);
    return added;
  }

  // ── Events ───────────────────────────────────────────────────────────────────
  function getEvents() { return load().events; }

  function addEvent(title, date, type = 'General', description = '', location = '') {
    const data = load();
    const event = {
      id: uid(), title: title.trim(), date, type,
      description: description.trim(), location: location.trim(),
      gallery: [], attendees: []
    };
    data.events.push(event);
    save(data);
    return event;
  }

  function updateEvent(id, updates) {
    const data = load();
    const idx = data.events.findIndex(e => e.id === id);
    if (idx === -1) return false;
    data.events[idx] = { ...data.events[idx], ...updates };
    save(data);
    return true;
  }

  function deleteEvent(id) {
    const data = load();
    data.events = data.events.filter(e => e.id !== id);
    save(data);
  }

  // ── Attendees / Check-in ─────────────────────────────────────────────────────
  function addAttendee(eventId, personId) {
    const data = load();
    const event = data.events.find(e => e.id === eventId);
    if (!event) return false;
    if (event.attendees.find(a => a.personId === personId)) return false;
    event.attendees.push({ personId, checkedIn: false, points: 0, isWinner: false });
    save(data);
    return true;
  }

  function removeAttendee(eventId, personId) {
    const data = load();
    const event = data.events.find(e => e.id === eventId);
    if (!event) return false;
    event.attendees = event.attendees.filter(a => a.personId !== personId);
    save(data);
    return true;
  }

  function checkIn(eventId, personId) {
    const data = load();
    const event = data.events.find(e => e.id === eventId);
    if (!event) return false;
    let att = event.attendees.find(a => a.personId === personId);
    if (!att) {
      // Auto-add if not on roster
      att = { personId, checkedIn: false, points: 0, isWinner: false };
      event.attendees.push(att);
    }
    if (!att.checkedIn) {
      att.checkedIn = true;
      att.points = att.isWinner ? 3 : 1;
    }
    save(data);
    return true;
  }

  function undoCheckIn(eventId, personId) {
    const data = load();
    const event = data.events.find(e => e.id === eventId);
    if (!event) return false;
    const att = event.attendees.find(a => a.personId === personId);
    if (att) { att.checkedIn = false; att.points = 0; att.isWinner = false; }
    save(data);
    return true;
  }

  function toggleWinner(eventId, personId) {
    const data = load();
    const event = data.events.find(e => e.id === eventId);
    if (!event) return false;
    const att = event.attendees.find(a => a.personId === personId);
    if (att && att.checkedIn) {
      att.isWinner = !att.isWinner;
      att.points = att.isWinner ? 3 : 1;
    }
    save(data);
    return att ? att.isWinner : false;
  }

  // ── Gallery ──────────────────────────────────────────────────────────────────
  function addGalleryImage(eventId, dataUrl, caption = '') {
    const data = load();
    const event = data.events.find(e => e.id === eventId);
    if (!event) return false;
    event.gallery.push({ id: uid(), url: dataUrl, caption });
    save(data);
    return true;
  }

  function removeGalleryImage(eventId, imgId) {
    const data = load();
    const event = data.events.find(e => e.id === eventId);
    if (!event) return false;
    event.gallery = event.gallery.filter(g => g.id !== imgId);
    save(data);
    return true;
  }

  // ── Stats ─────────────────────────────────────────────────────────────────────
  function getLeaderboard() {
    const data = load();
    const scores = {};
    data.people.forEach(p => { scores[p.id] = { person: p, points: 0, events: 0, wins: 0 }; });
    data.events.forEach(ev => {
      ev.attendees.forEach(a => {
        if (!scores[a.personId]) {
          const p = data.people.find(p => p.id === a.personId);
          if (p) scores[a.personId] = { person: p, points: 0, events: 0, wins: 0 };
          else return;
        }
        if (a.checkedIn) {
          scores[a.personId].points += a.points || 0;
          scores[a.personId].events += 1;
          if (a.isWinner) scores[a.personId].wins += 1;
        }
      });
    });
    return Object.values(scores).sort((a, b) => b.points - a.points || b.events - a.events);
  }

  function getPersonStats(personId) {
    const data = load();
    const person = data.people.find(p => p.id === personId);
    if (!person) return null;
    const eventsAttended = [];
    data.events.forEach(ev => {
      const att = ev.attendees.find(a => a.personId === personId && a.checkedIn);
      if (att) eventsAttended.push({ event: ev, attendance: att });
    });
    const totalPoints = eventsAttended.reduce((s, e) => s + (e.attendance.points || 0), 0);
    const wins = eventsAttended.filter(e => e.attendance.isWinner).length;
    return { person, eventsAttended, totalPoints, wins };
  }

  // ── Import / Export ──────────────────────────────────────────────────────────
  function downloadText(filename, text, type = 'application/json') {
    const blob = new Blob([text], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function exportBackup() {
    const data = load();
    downloadText(
      `culturehub-backup-${new Date().toISOString().slice(0,10)}.json`,
      JSON.stringify(data, null, 2)
    );
  }

  function exportEmbeddedBackup() {
    const data = JSON.stringify(load());
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>CultureHub Embedded Backup</title>
<style>body{font-family:Arial,sans-serif;max-width:760px;margin:48px auto;padding:0 24px;line-height:1.5;color:#1a1a2e}button{border:0;border-radius:10px;background:#6c63ff;color:#fff;padding:12px 18px;font-weight:700;cursor:pointer}pre{background:#f5f3ff;border:1px solid #ddd;border-radius:12px;padding:16px;overflow:auto;max-height:280px}</style>
</head>
<body>
<h1>🎯 CultureHub Embedded Backup</h1>
<p>This single HTML file contains your CultureHub roster, events, attendance, and gallery data. Keep it as a portable backup, then restore it in the same browser before opening CultureHub.</p>
<button onclick="restoreCultureHubData()">Restore this backup to this browser</button>
<p id="status"></p>
<h2>Included data preview</h2>
<pre id="preview"></pre>
<script id="culturehub-embedded-data" type="application/json">${data.replace(/<\//g, '<\\/')}</script>
<script>
function restoreCultureHubData(){
  var raw = document.getElementById('culturehub-embedded-data').textContent;
  localStorage.setItem('culturehub_data', raw);
  document.getElementById('status').textContent = 'Restored. Open index.html from your CultureHub folder to view the tracker.';
}
document.getElementById('preview').textContent = JSON.stringify(JSON.parse(document.getElementById('culturehub-embedded-data').textContent), null, 2);
<\/script>
</body>
</html>`;
    downloadText(
      `culturehub-embedded-backup-${new Date().toISOString().slice(0,10)}.html`,
      html,
      'text/html'
    );
  }

  function importBackup(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.people || !data.events) throw new Error('Invalid format');
      save(data);
      return { ok: true, people: data.people.length, events: data.events.length };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  // ── Settings ──────────────────────────────────────────────────────────────────
  function getSettings() { return load().settings; }
  function saveSettings(updates) {
    const data = load();
    data.settings = { ...data.settings, ...updates };
    save(data);
  }

  return {
    load, save, uid,
    getPeople, addPerson, updatePerson, deletePerson, importPeople,
    getEvents, addEvent, updateEvent, deleteEvent,
    addAttendee, removeAttendee, checkIn, undoCheckIn, toggleWinner,
    addGalleryImage, removeGalleryImage,
    getLeaderboard, getPersonStats,
    exportBackup, exportEmbeddedBackup, importBackup,
    getSettings, saveSettings
  };
})();

// Make globally available
window.CH = CH;
