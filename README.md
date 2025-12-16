# Vachanamrut App

A web app to explore and search through Vachanamrut texts. Built with Python FastAPI on the backend and React on the frontend.

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The API runs on `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens on `http://localhost:5173`

## Using Docker

```bash
docker-compose up
```

Both services will start automatically.

## What's Inside

- **backend/**: FastAPI server, API routes, and business logic
- **frontend/**: React UI with Vite
- **Data/**: The Vachanamrut dataset and Chroma vector database

## Development

The backend has two main services:

- `brain.py`: Handles RAG and search functionality
- `librarian.py`: Manages the knowledge base

Add new API endpoints in `backend/app/api/` and new components in `frontend/src/components/`.

## Notes

Make sure Python 3.8+ and Node.js 16+ are installed before starting.
