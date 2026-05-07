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

  function normalizePeopleImport(input) {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (input.name || input.displayName || input.displayname || input.fullName || input.full_name) return [input];
    // Microsoft Graph / Teams exports commonly wrap members in one of these arrays.
    return input.value || input.members || input.users || input.people || input.roster || [];
  }

  function parseCSV(text) {
    const rows = [];
    let row = [], cell = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i], next = text[i + 1];
      if (ch === '"' && quoted && next === '"') { cell += '"'; i++; continue; }
      if (ch === '"') { quoted = !quoted; continue; }
      if (ch === ',' && !quoted) { row.push(cell.trim()); cell = ''; continue; }
      if ((ch === '\n' || ch === '\r') && !quoted) {
        if (ch === '\r' && next === '\n') i++;
        row.push(cell.trim());
        if (row.some(Boolean)) rows.push(row);
        row = []; cell = '';
        continue;
      }
      cell += ch;
    }
    row.push(cell.trim());
    if (row.some(Boolean)) rows.push(row);
    if (rows.length === 0) return [];
    const headers = rows.shift().map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    return rows.map(cols => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = cols[i] || ''; });
      return {
        name: obj.name || obj.displayname || obj.fullname || obj.givenname && obj.surname && `${obj.givenname} ${obj.surname}` || obj.userprincipalname || '',
        team: obj.team || obj.department || obj.office || obj.jobtitle || '',
        email: obj.email || obj.mail || obj.userprincipalname || obj.upn || ''
      };
    });
  }

  function parsePeopleImport(text) {
    const raw = (text || '').trim();
    if (!raw) return [];
    if (raw[0] === '[' || raw[0] === '{') {
      const parsed = JSON.parse(raw);
      return normalizePeopleImport(parsed);
    }
    return parseCSV(raw);
  }

  function importPeople(list) {
    const data = load();
    let added = 0;
    normalizePeopleImport(list).forEach(p => {
      const name = (p.name || p.displayName || p.displayname || p.full_name || p.fullName || '').trim();
      if (!name) return;
      const team = (p.team || p.department || p.office || p.jobTitle || '').trim();
      const email = (p.email || p.mail || p.userPrincipalName || p.upn || '').trim();
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
  function exportBackup() {
    const data = load();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `culturehub-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
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

  // ── Demo data ──────────────────────────────────────────────────────────────────
  function createDemoData() {
    const data = getDefault();
    data.settings.orgName = 'CultureHub Demo Office';
    const people = [
      ['Avery Johnson','Engineering','avery@company.com'], ['Maya Chen','People Ops','maya@company.com'],
      ['Noah Patel','Sales','noah@company.com'], ['Sofia Garcia','Finance','sofia@company.com'],
      ['Liam Williams','Marketing','liam@company.com'], ['Emma Davis','Engineering','emma@company.com'],
      ['Olivia Brown','Customer Success','olivia@company.com'], ['Ethan Kim','Product','ethan@company.com'],
      ['Isabella Martinez','Design','isabella@company.com'], ['Lucas Smith','IT','lucas@company.com'],
      ['Grace Lee','Legal','grace@company.com'], ['Henry Wilson','Operations','henry@company.com']
    ].map(([name, team, email]) => ({ id: uid(), name, team, email, avatar: '' }));
    data.people = people;
    const byName = Object.fromEntries(people.map(p => [p.name, p.id]));
    const addDemoEvent = (title, date, type, description, location, attendeeNames, winnerNames = [], gallery = []) => {
      const event = { id: uid(), title, date, type, description, location, gallery, attendees: [] };
      attendeeNames.forEach(name => {
        const personId = byName[name];
        if (!personId) return;
        const isWinner = winnerNames.includes(name);
        event.attendees.push({ personId, checkedIn: true, points: isWinner ? 3 : 1, isWinner });
      });
      data.events.push(event);
    };
    addDemoEvent('Spring Trivia Challenge', '2026-03-19', 'Game', 'Cross-team trivia with culture, product, and music rounds.', 'Cafe Commons',
      ['Avery Johnson','Maya Chen','Noah Patel','Sofia Garcia','Liam Williams','Emma Davis','Olivia Brown','Ethan Kim','Isabella Martinez','Lucas Smith'],
      ['Maya Chen','Ethan Kim']);
    addDemoEvent('Volunteer Lunch Pack', '2026-04-11', 'Charity', 'Assembled lunch kits for a neighborhood nonprofit partner.', 'Conference Center',
      ['Avery Johnson','Sofia Garcia','Emma Davis','Olivia Brown','Grace Lee','Henry Wilson']);
    addDemoEvent('Mario Kart Bracket', '2026-04-25', 'Game', 'Single-elimination game bracket for bragging rights.', 'Game Room',
      ['Noah Patel','Liam Williams','Emma Davis','Ethan Kim','Isabella Martinez','Lucas Smith','Grace Lee','Henry Wilson'],
      ['Noah Patel']);
    addDemoEvent('May Culture Potluck', '2026-05-16', 'Social', 'Team-hosted potluck with photo booth and story cards.', 'Rooftop Patio', []);
    return data;
  }

  function seedDemoData(replace = false) {
    if (replace) {
      const data = createDemoData();
      save(data);
      return { people: data.people.length, events: data.events.length, replaced: true };
    }
    const demo = createDemoData();
    const addedPeople = importPeople(demo.people);
    const data = load();
    demo.events.forEach(ev => {
      if (!data.events.some(existing => existing.title === ev.title && existing.date === ev.date)) {
        const newEvent = { ...ev, id: uid(), attendees: [] };
        ev.attendees.forEach(a => {
          const demoPerson = demo.people.find(p => p.id === a.personId);
          const currentPerson = data.people.find(p => p.name === demoPerson?.name);
          if (currentPerson) newEvent.attendees.push({ ...a, personId: currentPerson.id });
        });
        data.events.push(newEvent);
      }
    });
    save(data);
    return { people: addedPeople, events: demo.events.length, replaced: false };
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
    getPeople, addPerson, updatePerson, deletePerson, importPeople, parsePeopleImport,
    getEvents, addEvent, updateEvent, deleteEvent,
    addAttendee, removeAttendee, checkIn, undoCheckIn, toggleWinner,
    addGalleryImage, removeGalleryImage,
    getLeaderboard, getPersonStats,
    exportBackup, importBackup, seedDemoData, createDemoData,
    getSettings, saveSettings
  };
})();

// Make globally available
window.CH = CH;
