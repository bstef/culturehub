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

  function importPeople(list) {
    const data = load();
    let added = 0;
    list.forEach(p => {
      const name = (p.name || p.displayName || p.full_name || '').trim();
      if (!name) return;
      const exists = data.people.find(x => x.name.toLowerCase() === name.toLowerCase());
      if (!exists) {
        data.people.push({ id: uid(), name, team: p.team || p.department || '', email: p.email || p.mail || '', avatar: '' });
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
    exportBackup, importBackup,
    getSettings, saveSettings
  };
})();

// Make globally available
window.CH = CH;
