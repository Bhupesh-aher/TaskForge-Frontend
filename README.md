# ⚡ TaskForge – Trello-Style Project Management Frontend

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Realtime-Socket.io-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployed%20on-Render%20%26%20Vercel-orange?style=for-the-badge" />
</p>

<p align="center">
  🚀 <b>TaskForge</b> — A Trello-style collaborative task management app with real-time updates, drag-and-drop lists, and persistent cards.
  <br/>
  <a href="https://task-forge-frontend.vercel.app" target="_blank"><b>🌐 Live Frontend</b></a> | 
  <a href="https://taskforge-backend-jjdh.onrender.com/api/docs" target="_blank"><b>📘 Backend Swagger Docs</b></a>
</p>



**Frontend Live URL:** [https://task-forge-frontend.vercel.app](https://task-forge-frontend.vercel.app)  
**Backend API:** [https://taskforge-backend-jjdh.onrender.com](https://taskforge-backend-jjdh.onrender.com)  
**Swagger Docs:** [https://taskforge-backend-jjdh.onrender.com/api/docs](https://taskforge-backend-jjdh.onrender.com/api/docs)

---

## 🖼️ Screenshots


---

## 💡 Overview

TaskForge is a **modern, responsive, and scalable Trello-style project management app** built with **React.js**, **Tailwind CSS**, and **Redux Toolkit**, powered by a Node.js backend.

It offers users a real-time collaborative experience to manage projects through boards, lists, and draggable cards — all synced via **Socket.io** and persisted with MongoDB.

This frontend is optimized for performance, smooth animations, and clean UI/UX across devices.  
It’s designed for **scalability**, **extensibility**, and **production deployment** on **Vercel**.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend Framework** | React.js (Vite) |
| **State Management** | Redux Toolkit |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Drag & Drop** | @hello-pangea/dnd |
| **Real-Time Updates** | Socket.io Client |
| **Routing** | React Router v6 |
| **Authentication** | JWT-based (via backend) |
| **API Handling** | Axios (custom instance) |
| **Deployment** | Vercel |
| **Build Tool** | Vite |
| **Type of App** | SPA (Single Page Application) |

---

## ⚙️ Key Features

✅ **JWT Authentication** – Secure login & signup integrated with backend auth routes  
✅ **Dynamic Boards System** – Create, view, and manage unlimited boards  
✅ **List Management** – Add, rename, and delete lists in each board  
✅ **Card Management** – Add, edit, and drag cards between lists  
✅ **Persistent Drag & Drop** – Every card move is saved in MongoDB  
✅ **Socket.io Ready** – Built to support real-time updates (future enablement)  
✅ **Redux Store** – Global state management for consistent updates  
✅ **Loading States & Skeletons** – Seamless UX during API operations  
✅ **Framer Motion Animations** – Smooth transitions & hover effects  
✅ **Responsive UI** – Fully optimized for desktop & mobile  
✅ **Dynamic Environment Handling** – Automatically switches API URLs between dev and prod  
✅ **Scalable Architecture** – Modular code structure and reusable components  

---

## 🧱 Project Structure

```

src/
    - assets/            → Icons, images, and static assets
    - components/        → Reusable UI components (Modals, Loaders, Forms, etc.)
    - features/          → Redux slices (auth, boards, lists, cards)
    - pages/             → Page components (Login, Dashboard, BoardDetails)
    - utils/             → Helper utilities (API config, constants)
    - App.jsx            → Root component
    - main.jsx           → Entry point for Vite
    - index.css          → Global Tailwind styles

````

---

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
# Local Development
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Production (Vercel)
VITE_API_BASE_URL_PROD=https://taskforge-backend-jjdh.onrender.com/api
VITE_SOCKET_URL_PROD=https://taskforge-backend-jjdh.onrender.com
````

---

## 🔄 Dynamic Environment Handling

No manual changes are required between local and production.

The app automatically switches endpoints based on:

```js
import.meta.env.MODE === "development"
```

✅ When running locally → uses localhost
✅ When deployed → uses live Render backend automatically

---

## 🧠 API Integration

All API calls use a **custom Axios instance** with:

* Base URL detection via environment
* `withCredentials` enabled for secure auth
* JWT token auto-attached to headers via interceptor

Example:

```js
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});
```

---

## 🧩 Major Pages & Components

| Page                        | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| **Login / Register**        | Handles user authentication                                          |
| **Dashboard**               | Lists all boards, includes board creation modal                      |
| **Board Details**           | Contains lists, cards, and drag-drop interface                       |
| **AddCardForm**             | Quick inline card creation component                                 |
| **LoadingSkeleton**         | Placeholder for loading states                                       |
| **Socket Ready Components** | Event emitters and listeners for real-time sync (future enhancement) |

---

## 💾 State Management Flow

Redux Toolkit Slices:

* `authSlice.js` → Handles login/register & user token
* `boardSlice.js` → CRUD for boards
* `listSlice.js` → CRUD for lists
* `cardSlice.js` → CRUD + move functionality
* `store.js` → Central Redux store configuration

This modular architecture allows future addition of slices like:

* Notifications
* Activities
* Comments

---

## 🪄 Scalability & Future Upgrades

TaskForge frontend is designed to scale seamlessly:

* **Redux slices** make adding new modules simple.
* **Socket.io integration** can easily enable full real-time sync.
* **Component-level abstraction** enables future microfrontend or SSR adaptation.
* **Persistent APIs** ensure drag-drop and CRUD actions are stable even after refresh.
* **Tailwind + Framer Motion** provide flexibility for design and animations without complexity.

---

## 🚀 Setup & Local Development

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Bhupesh-aher/TaskForge-Frontend.git
cd TaskForge-Frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Add `.env` file (as shown above)

### 4️⃣ Run the App

```bash
npm run dev
```

> App runs at: [http://localhost:5173](http://localhost:5173)

---

## ☁️ Deployment

| Service              | Description                  |
| -------------------- | ---------------------------- |
| **Frontend Hosting** | Vercel
| **Backend Hosting**  | Render
| **Database**         | MongoDB Atlas                |
| **Media Storage**    | Cloudinary                   |

---

## 🧠 Developer Notes

* Smooth Drag-and-Drop powered by `@hello-pangea/dnd`
* Persistent backend sync for all card movements
* Modular Redux slices for scalability
* Dynamic Axios setup for env-based switching
* Ready for WebSocket (Socket.io) activation

---

## 🏷️ License

MIT License © 2025 [Bhupesh Aher]
