# MoubAnime - Next-Gen Anime Streaming Platform

**MoubAnime** is a modern, full-stack anime streaming application built for speed, reliability, and a premium user experience. It leverages a custom-built proxy architecture to provide ad-free, high-definition streaming directly in the browser, bypassing common geo-blocks and CORS restrictions.

> 💡 **Core Tech:** Built with **NestJS** (Backend) and **React + Vite** (Frontend), styled with **Tailwind CSS**, and powered by the **Consumet API**.

---

## ✨ Project Status & Features

We have successfully built a fully functional streaming engine from scratch.

* **Custom Backend Proxy Engine**: A specialized "Middleman" service in NestJS that intercepts video traffic, rewrites headers, and allows secure streaming without third-party pop-ups.
* **Intelligent Manifest Rewriting**: The backend intelligently parses `.m3u8` HLS playlists, rewriting relative video chunks to route through our secure local proxy, eliminating 404 errors.
* **Modern Video Player**: Integrated **Vidstack** for a Netflix-like playback experience, complete with quality controls, buffering, and theater mode.
* **Dynamic Content Fetching**: Real-time search and episode scraping using the Hianime (formerly Zoro) provider.
* **Responsive UI**: A sleek, dark-themed interface inspired by Crunchyroll, featuring hover-effect cards and a responsive grid layout.

---

## 🛠️ Engineering Challenges & Solutions

Developing MoubAnime required solving several complex full-stack issues. Here is a log of the critical hurdles we overcame:

### 1. The "CORS Wall" & Public Proxy Failures
* **The Issue:** Initial attempts to play video streams directly from the frontend using public proxies (like `workers.dev`) resulted in immediate `403 Forbidden` and `CORS` blocks by the anime providers.
* **The Fix:** We architected a **Custom Backend Proxy** in NestJS. Instead of the browser asking for the video, the Backend requests it (pretending to be a valid browser with custom `User-Agent` headers) and pipes the clean data stream to the frontend.

### 2. HLS Playlist (.m3u8) Relative Path Errors
* **The Issue:** Even with the proxy, the video player would fail after loading the main manifest. The logs showed `404 Not Found` for files like `segment-01.ts`. This happened because the "Map" file provided relative paths that the browser tried to find on `localhost` instead of the original server.
* **The Fix:** We implemented **Smart Manifest Rewriting**. The backend now intercepts the `.m3u8` file, scans it for relative links using Regex, and dynamically rewrites them to point back to our proxy endpoint (`/anime/proxy?url=...`).

### 3. Provider Instability (Gogoanime)
* **The Issue:** Our initial provider, Gogoanime, was removed from the library or became unstable, causing server crashes.
* **The Fix:** We migrated the service logic to **Hianime (Zoro)**, ensuring stable links and better video quality options ('auto'/'default').

### 4. React & Vidstack Version Conflicts
* **The Issue:** The project was initialized with React 19, but the Vidstack player library was only stable on React 18, causing dependency resolution errors (`ERESOLVE`).
* **The Fix:** We strictly downgraded the frontend environment to **React 18.2.0** and matched the TypeScript definitions (`@types/react`), creating a stable build environment.

---

## 📂 Project Structure

```bash
MoubAnime/
├── backend/                 # NestJS Server
│   ├── src/anime/
│   │   ├── anime.controller.ts  # Handles Proxy & Search Routes
│   │   ├── anime.service.ts     # Consumet Provider Logic
│   │   └── ...
│   └── ...
├── frontend/                # React + Vite Client
│   ├── src/
│   │   ├── components/      # Navbar, AnimeCard
│   │   ├── pages/           # Home, Watch (Player Logic)
│   │   └── ...
│   └── public/              # Static Assets (Icons)
└── README.md
```

## 🚀 How to Run
### 1. Start the Backend (The Brain)
The backend handles the API requests and video proxying.

Bash
```
cd backend
npm install
npm run start:dev
Server runs on: http://localhost:3000
```
### 2. Start the Frontend (The Interface)
The frontend connects to the backend to display content.

Bash
```
cd frontend
npm install
npm run dev
App runs on: http://localhost:5173
```

## 🔮 Future Roadmap
**Episode Tracking:**Save watch history to local storage.
**Next Episode Button:** Auto-play functionality.
**Quality Selector:** Explicitly choose between 360p, 720p, and 1080p in the player.

