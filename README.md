# Hackathon MountReach 2026 — MERN Stack Project

## 🚀 Tech Stack

- **MongoDB** — Database
- **Express.js** — Backend framework
- **React.js** (Vite) — Frontend
- **Node.js** — Runtime

---

## 📁 Project Structure

```
hackthon-mountreach-2026/
│
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page-level components
│   │   ├── services/         # API call functions
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # React Context providers
│   │   └── assets/           # Static assets
│   └── package.json
│
├── server/                   # Express backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/          # Route logic
│   ├── middleware/
│   │   └── errorHandler.js   # Global error handler
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routers
│   └── server.js             # Entry point
│
├── .env                      # Local secrets (DO NOT COMMIT)
├── .env.example              # Template for env vars
├── .gitignore
├── package.json              # Root scripts + backend deps
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tanmayrongre/hackthon-mountreach-2026.git
cd hackthon-mountreach-2026
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Then fill in your actual values in .env
```

### 3. Install all dependencies

```bash
npm run install-all
```

### 4. Run the project (server + client together)

```bash
npm run dev
```

- Backend runs at: `http://localhost:5000`
- Frontend runs at: `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Server health check |

> More routes will be added as features are developed.

---

## 🌿 Git Workflow

```
main (protected)
  ↓
feature/branch-name
  ↓
commit changes
  ↓
git push origin feature/branch-name
  ↓
Pull Request → Review → Merge
```

**Never push directly to `main`.**

---

## 👥 Team

| Member | Role |
|--------|------|
| Tanmay (Team Leader) | GitHub, Integration, Frontend, Auth, Testing |
| Gauri Bonde | UI Components |
| Shubh Chincholkar | Node.js, Express, APIs |
| Supesh Ugale | MongoDB, Models, Database |
| Vaishnavi Pund | Whole Website Testing, Documentation |
