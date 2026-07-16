# CultureHub 🎯

**Track, celebrate, and reward your team culture — all in the browser, no backend required.**

CultureHub is a zero-server team culture event tracker built with vanilla HTML, CSS, and JavaScript. Manage events, check in attendees, run a live leaderboard, and share photo galleries — everything stored in your browser's localStorage.

## ✨ Features

### 📅 Event Management
- Create and manage events with title, date, type, location, and description
- Six color-coded event types: Game 🎮, Social 🥂, Team Building 🤝, Holiday 🎉, Charity ❤️, General 📌
- Live check-in counters, attendance tracking, and photo galleries per event

### 👥 Roster & Bulk Import
- Add team members manually or bulk-import from JSON
- Supports native format and Microsoft Teams/Azure AD exports
- Automatic duplicate detection
- Tracks name, team affiliation, and email
- Click any person for a stats popup — points, events attended, wins, leaderboard rank, and full event history

### ✅ Check-In & Scoring
- Tap to check in (1 point) or mark winner (3 points)
- Bulk check-in entire registered attendee lists
- Simple, transparent scoring system with no caps
- Undo functionality

### 📺 Live TV Dashboard & Leaderboard
- **TV Mode** for fullscreen lobby displays
- Animated rank rows with gold/silver/bronze highlights
- Scrolling ticker of top scores and recent events
- Event attendance progress bars
- Auto-refresh every 30 seconds
- Clickable stat cards (Participants, Events, Points, Winners) open a detail breakdown — disabled automatically in TV Mode to keep the lobby display clean

### 🖼️ Photo Gallery
- Per-event photo management with drag-drop support
- Slideshow view
- Quick gallery grid browsing

### 🔍 Global Search
- Search across people and events
- Fast, client-side searching

### ⚙️ Settings & Data Management
- Customize organization name
- **Dark, Dim, and Light** themes, plus **5 accent colors** (Teal, Violet, Blue, Orange, Red) — mix and match, both persisted independently
- Tiered sample data for demos: Small, Standard, Large, and XLarge (up to 60 people / 16 events), clearly labeled as fictitious and randomly generated
- Backup and restore data
- Export/import functionality
- Persistent footer on every page with copyright and a link to the full documentation

## 🚀 Getting Started

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/culturehub.git
   cd culturehub
   ```

2. **Open in browser:**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     python3 -m http.server 8000
     # Visit http://localhost:8000
     ```

### First Time Setup

1. Go to **Settings** to customize your organization name
2. Visit **Roster** to add team members (manual or bulk import)
3. Create your first event in **Events**
4. Use **Check-In** at the event to track attendance
5. View results on the **Dashboard** or in **TV Mode**

## 📁 Project Structure

```
├── index.html          # Dashboard home — stats, leaderboard, upcoming events
├── events.html         # Create and manage events
├── roster.html         # Add people / bulk import
├── checkin.html        # Day-of attendance tracking
├── dashboard.html      # Live leaderboard with TV mode
├── search.html         # Global search across data
├── gallery.html        # Per-event photo management
├── settings.html       # Configuration, backup, restore
├── data.js             # Shared data layer (localStorage)
├── utils.js            # Helper functions and navigation
├── style.css           # Styling (Dark/Dim/Light themes + 5 accent colors)
├── docs/               # Documentation
│   ├── hashnode-post.md
│   └── index.html
└── README.md           # This file
```

## 💾 Data Storage

All data is stored locally in your browser's `localStorage` under the key `culturehub_data`. This means:

- ✅ **No server required** — runs entirely client-side
- ✅ **Offline capable** — works without internet
- ⚠️ **Per-browser storage** — data doesn't sync across devices
- 💡 **Backup/restore** — use Settings to export/import JSON

### Data Structure

```javascript
{
  version: 1,
  people: [
    { id, name, team, email, avatar }
  ],
  events: [
    { id, title, date, type, description, location, gallery:[], attendees:[{personId, checkedIn, points, isWinner}] }
  ],
  settings: { orgName, theme }
}
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Alt+T` or `F11` | Toggle TV Mode (Dashboard) |
| `Esc` | Exit TV Mode |

## 🎨 Theme Support

CultureHub includes three themes — **Dark**, **Dim**, and **Light** — cycled from the nav bar's toggle button or picked directly in **Settings → Appearance**. Dim sits deliberately between the other two: a mid-tone slate canvas for a softer alternative to full dark or full light.

Independently of theme, pick an **accent color** — Teal (default), Violet, Blue, Orange, or Red — from the same Appearance card. Red is intentionally a muted brick tone rather than a pure alarm red, so it doesn't read as a danger color. Theme and accent combine freely (15 total looks) and both preferences persist to `localStorage` (`culturehub_theme`, `culturehub_accent`), applied before first paint to avoid a flash of the wrong colors on load.

## 📊 Scoring System

| Action | Points |
|---|---|
| ✅ Check-in (attending) | 1 pt |
| 🏆 Winner | 3 pts |
| **Tiebreaker** | # of events attended |

## 🛠️ Built With

- **HTML5** — Semantic markup
- **CSS3** — Grid, flexbox, CSS variables for theming, [View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) opt-in for smoother page-to-page navigation in supporting browsers
- **Vanilla JavaScript** — No frameworks or dependencies
- **localStorage** — Client-side data persistence

## 🤝 Contributing

Contributions are welcome! Please feel free to:

- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💬 Feedback

Have suggestions or found a bug? Please open an [Issue](https://github.com/yourusername/culturehub/issues) on GitHub.

---

**Made with ❤️ for building better team culture.**
