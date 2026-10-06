# Atlas

A neighborhood discovery map built with Next.js, Tailwind CSS, Leaflet, and a small Python FastAPI service.

## Requirements

- Node.js 20 or later
- Python 3.10 or later

## Run locally

Install the frontend dependencies and start the Next.js development server:

```powershell
npm install
npm run dev
```

In a second terminal, install and run the Python API:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
py -m uvicorn backend.main:app --reload
```

Open [http://localhost:3000](http://localhost:3000). The places API runs at [http://localhost:8000](http://localhost:8000); its interactive API docs are at `/docs`.

The sample places and coordinates are in `backend/main.py`. Map tiles are provided by CARTO using OpenStreetMap data; place photos are hosted by Unsplash.
