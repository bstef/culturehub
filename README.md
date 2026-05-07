<div align="center">

```
  ██████╗██╗   ██╗██╗  ████████╗██╗   ██╗██████╗ ███████╗
 ██╔════╝██║   ██║██║  ╚══██╔══╝██║   ██║██╔══██╗██╔════╝
 ██║     ██║   ██║██║     ██║   ██║   ██║██████╔╝█████╗  
 ██║     ██║   ██║██║     ██║   ██║   ██║██╔══██╗██╔══╝  
 ╚██████╗╚██████╔╝███████╗██║   ╚██████╔╝██║  ██║███████╗
  ╚═════╝ ╚═════╝ ╚══════╝╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝
                                                    H U B
```

### 🎯 Office Culture Event Tracker — No server. No database. No drama.

[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](.)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](.)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](.)
[![No Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen?style=for-the-badge)](.)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal?style=for-the-badge)](LICENSE)

**[🚀 Quick Start](#-quick-start)** · **[✨ Features](#-features)** · **[📸 Screenshots](#-screenshots)** · **[🗂 File Structure](#-file-structure)** · **[🤝 Contributing](#-contributing)**

</div>

---

## 🎉 What is CultureHub?

CultureHub is a **fully self-contained, zero-dependency** office culture event tracker built with plain HTML, CSS, and JavaScript. Drop it on a file server, a shared drive, or just open it locally — it works everywhere, stores everything in your browser's `localStorage`, and looks sharp doing it.

Built for teams that want to **track, celebrate, and reward** the people who show up, participate, and bring the energy.

> **TL;DR:** Think trivia nights, bowling leagues, holiday parties, team-building events — CultureHub tracks who came, who won, and who's climbing the leaderboard. 🏆

---

## ✨ Features

### 📅 Event Management
Create and manage any type of team event with full metadata — title, date, type, location, and description. Filter by type, search by name, and jump straight to check-in or gallery from every event card.

```
Event Types: General · Game · Social · Team Building · Holiday · Charity
```

### 👥 Roster Management
Maintain a living roster of your team with names, departments, and emails. Import in bulk from a JSON file — including **Microsoft Teams / Azure AD export format** (`displayName`, `mail`, `department`). No manual entry required.

### ✅ Live Check-In
The heart of CultureHub. Select an event, tap a card to check someone in, tap 🏆 to crown a winner.

```
✅ Attendance  →  1 point
🏆 Game Winner →  3 points
```

Check-in is instant, visual, and satisfying. Every card lights up green when checked in and gold for winners.

### 📊 TV Dashboard / Leaderboard
A **full-screen TV mode** built for the break room display. Hit `📺 TV Mode` and it goes fullscreen — animated leaderboard, live ticker tape, attendance bars, auto-refreshes every 30 seconds. Press `Esc` to exit.

```
🥇 Alice Johnson    ████████████████  42 pts  · 14 events · 3 wins
🥈 Bob Smith        ████████████      36 pts  · 12 events · 2 wins
🥉 Carol White      ████████          24 pts  ·  9 events · 1 win
   David Lee        ██████            18 pts  ·  7 events
   Emma Davis       █████             15 pts  ·  6 events
```

### 🔍 Search
Search by **person** or **event** with instant side-by-side detail panels. See every event a person attended, every person who attended an event, win/loss records, and points breakdowns — all in one place.

### 🖼 Photo Gallery
Every event gets its own photo gallery with drag-and-drop upload, captions, and a **fullscreen slideshow** with keyboard navigation (`←` `→` `Esc`). Because memories matter.

### 📄 PDF Reports
One-click print-ready PDF reports for:
- 📊 **Overview** — org-wide leaderboard, stats, all events
- 📅 **Per Event** — full attendance list with points
- 👤 **Per Person** — individual history and score breakdown

### 💾 Backup & Restore
Full JSON backup/restore — download your data anytime, restore from any backup file. Your data lives in `localStorage` but you own it completely.

---

## 📸 Screenshots

> *App preview — open `index.html` in your browser to see the live experience*

### 🏠 Home Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│  🎯 CultureHub   Home  Events  Roster  Check-In  Dashboard  ☀️  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Welcome to  Our Organization  🎯          [+ New Event]        │
│  Track, celebrate, and reward your team culture  [📺 Dashboard] │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │    24    │  │    8     │  │   186    │  │  Alice   │        │
│  │  PEOPLE  │  │  EVENTS  │  │  POINTS  │  │  LEADER  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  🏆 Top 5 Leaders              📅 Upcoming Events               │
│  ┌────────────────────────┐   ┌────────────────────────┐       │
│  │ 🥇 Alice J.   42 pts  │   │ Oct  Halloween Party   │       │
│  │ 🥈 Bob S.     36 pts  │   │  31  Holiday · Upcoming│       │
│  │ 🥉 Carol W.   24 pts  │   ├────────────────────────┤       │
│  │ #4 David L.   18 pts  │   │ Nov  Team Bowling      │       │
│  │ #5 Emma D.    15 pts  │   │  14  Social · Upcoming │       │
│  └────────────────────────┘   └────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### ✅ Check-In Screen
```
┌─────────────────────────────────────────────────────────────────┐
│  ✅ Check-In                              [📄 Export Report]    │
├────────────────┬────────────────────────────────────────────────┤
│  📅 Events     │  Summer Trivia Night                           │
│  ─────────     │  🎮 Game  ·  📅 Jul 15  ·  📍 Rooftop         │
│  ▶ Summer      │                                                 │
│    Trivia      │  6 checked in  ·  8 registered  ·  18 pts     │
│    6 in ✅     │                                                 │
│                │  ┌──────────────────────────────────────────┐  │
│  Team Bowling  │  │ ✓  🟢  Alice Johnson      ⭐ 1pt   🏆  │  │
│  4 in ✅       │  │ ✓  🏆  Bob Smith          🏆 3pts  🏆  │  │
│                │  │ ✓  🟢  Carol White        ⭐ 1pt   🏆  │  │
│  Q3 Town Hall  │  │    ○   David Lee          Not checked in │  │
│  8 in ✅       │  │    ○   Emma Davis         Not checked in │  │
│                │  └──────────────────────────────────────────┘  │
└────────────────┴────────────────────────────────────────────────┘
```

### 📊 TV Leaderboard (Dark Mode)
```
┌─────────────────────────────────────────────────────────────────┐
│  🏆 Our Organization Leaderboard          🟢 Live · 2:34 PM    │
├─────────────────────────────────────────────────────────────────┤
│  ┄ 🏆 Alice 42pts ┄ 📅 Trivia Night ┄ 🥈 Bob 36pts ┄ ┄ ┄ ┄   │  ← ticker
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🥇  👤 Alice Johnson    42  ████████████████  14 events  3🏆  │
│  🥈  👤 Bob Smith        36  ████████████      12 events  2🏆  │
│  🥉  👤 Carol White      24  ████████           9 events  1🏆  │
│  #4  👤 David Lee        18  ██████             7 events       │
│  #5  👤 Emma Davis       15  █████              6 events       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

It literally couldn't be simpler:

```bash
# Clone the repo
git clone https://github.com/bstef/culturehub.git
cd culturehub

# Open in browser — that's it!
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

No `npm install`. No build step. No config files. No environment variables. No server. **Just open and go.**

> 💡 **Pro tip:** Host it on any static file server (Nginx, GitHub Pages, S3, Cloudflare Pages) for your whole team to access.

---

## 🗂 File Structure

```
culturehub/
│
├── 📄 index.html       # Home dashboard — stats overview & quick actions
├── 📄 events.html      # Event management — create, edit, delete, filter
├── 📄 roster.html      # People roster — add, import, manage team members
├── 📄 checkin.html     # Live check-in — attendance + winner tracking
├── 📄 dashboard.html   # Leaderboard — TV mode, live ticker, rankings
├── 📄 search.html      # Search — by person or event with detail panels
├── 📄 gallery.html     # Photo gallery — per-event slideshows
├── 📄 settings.html    # Settings — backup, restore, import, org config
│
├── 🎨 style.css        # Full design system — dark/light mode, tokens
├── ⚙️  data.js          # Data layer — all CRUD ops, stats, localStorage
└── 🛠  utils.js         # Shared utilities — nav, toasts, modals, reports
```

### Key Design Decisions

| Decision | Why |
|----------|-----|
| **Zero dependencies** | No node_modules, no CDN failures, no version conflicts |
| **localStorage** | Works offline, no backend needed, data stays with the user |
| **Multi-file HTML** | Each page is independently navigable, easy to maintain |
| **Shared `data.js`** | Single source of truth — all pages read/write the same store |
| **CSS variables** | Full dark/light theme switching with zero JS class toggling |

---

## 🎨 Design System

CultureHub uses a custom design system with:

- **Fonts:** [Outfit](https://fonts.google.com/specimen/Outfit) (headings) + [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (body)
- **Colors:** Teal accent · Coral red · Amber gold · Navy canvas
- **Themes:** Full dark and light mode — toggle in the nav, persisted to localStorage
- **No flash:** Inline script in `<head>` applies saved theme before first paint

```css
/* Teal accent (dark mode) */
--accent: #00c9b1;

/* Same accent adapted for light mode contrast */
--accent: #007f6f;
```

---

## 📊 Scoring System

| Action | Points |
|--------|--------|
| ✅ Attended an event | **1 point** |
| 🏆 Won a game/competition | **3 points** |

Points accumulate across all events. The leaderboard is recalculated live from raw attendance data — no points are stored separately, so you can always adjust and it self-corrects.

---

## 📥 Importing Team Members

CultureHub supports bulk import from a JSON array. Works with:

**Simple format:**
```json
[
  { "name": "Alice Johnson", "team": "Engineering", "email": "alice@company.com" },
  { "name": "Bob Smith",     "team": "Marketing",   "email": "bob@company.com" }
]
```

**Microsoft Teams / Azure AD export format:**
```json
[
  { "displayName": "Alice Johnson", "mail": "alice@company.com", "department": "Engineering" },
  { "displayName": "Bob Smith",     "mail": "bob@company.com",   "department": "Marketing" }
]
```

Import via **Roster → 📥 Import** or **Settings → Import from Team**.

---

## 💾 Data & Privacy

All data is stored **100% locally** in your browser's `localStorage` under the key `culturehub_data`. Nothing is ever sent to a server.

```
localStorage['culturehub_data'] = {
  version: 1,
  people: [ { id, name, team, email } ],
  events: [ { id, title, date, type, location, description, gallery, attendees } ],
  settings: { orgName, theme }
}
```

**Backup regularly** — `localStorage` can be cleared by browser settings. Use **Settings → 💾 Download Backup JSON** to export, and **Settings → ♻️ Restore** to import.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Close modal / exit TV mode |
| `←` / `→` | Navigate gallery slideshow |
| `Alt + T` | Toggle TV mode (on Dashboard) |

---

## 🗺 Roadmap

Things that would be fun to add:

- [ ] 🏷 Custom point values per event type
- [ ] 👥 Team/department leaderboard view
- [ ] 📧 Email digest export
- [ ] 🎨 Custom accent color picker
- [ ] 📱 PWA / installable app support
- [ ] 🔔 Upcoming event reminders
- [ ] 📊 Charts & trends over time
- [ ] 🔗 Shareable read-only dashboard link

---

## 🤝 Contributing

PRs welcome! Since this is a zero-dependency vanilla project, keep it that way — no build tools, no frameworks, no package.json.

```bash
git clone https://github.com/bstef/culturehub.git
cd culturehub
open index.html  # start hacking
```

Please keep:
- All logic in the appropriate file (`data.js` for data ops, `utils.js` for UI helpers)
- Styles using the existing CSS variable system
- New pages following the same HTML shell pattern

---

## 📄 License

MIT — do whatever you want with it. If it makes your office a little more fun, that's payment enough. 🎉

---

<div align="center">

Made with ☕ and a genuine belief that office culture events deserve better tooling.

**[⬆ Back to top](#)**

</div>
