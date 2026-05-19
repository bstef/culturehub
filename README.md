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

### 🖼️ Photo Gallery
- Per-event photo management with drag-drop support
- Slideshow view
- Quick gallery grid browsing

### 🔍 Global Search
- Search across people and events
- Fast, client-side searching

### ⚙️ Settings & Data Management
- Customize organization name
- Dark/light theme toggle (persisted)
- Backup and restore data
- Export/import functionality

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
├── style.css           # Styling (dark/light theme support)
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

CultureHub includes built-in dark and light themes, toggled from Settings. Theme preference is persisted to localStorage.

## 📊 Scoring System

| Action | Points |
|---|---|
| ✅ Check-in (attending) | 1 pt |
| 🏆 Winner | 3 pts |
| **Tiebreaker** | # of events attended |

## 🛠️ Built With

- **HTML5** — Semantic markup
- **CSS3** — Grid, flexbox, CSS variables for theming
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
