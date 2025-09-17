# Capstone Project — MIS + Anomaly Detector

Quick start (Windows, PowerShell)

Prerequisites
- Docker Desktop (running)
- Node.js (for local scripts)

1) Build and start services (Docker Compose)

```powershell
cd "C:\Users\My Pc\Documents\VsCodes\Capstone\Capstone_Project"
docker compose up --build -d
# or: docker-compose up --build -d
```

2) Seed the database (run after containers are healthy)

```powershell
cd "C:\Users\My Pc\Documents\VsCodes\Capstone\Capstone_Project\backend"
npm install
npm run db:init
```

3) Verify
- Frontend: http://localhost:3000
- Products API: http://localhost:5000/api/products

Notes
- The frontend will attempt to fetch `/api/products` and fall back to its local `products` array if the backend is unreachable.
- Optional seed data files are in `backend/src/data/` (`products_seed.json`, `sales_seed.json`, `inventory_seed.json`).
