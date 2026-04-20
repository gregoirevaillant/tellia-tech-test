# Tellia Tech Test

## Setup

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Architecture

```
-> Generate audio in browser

-> POST /voice-notes (nodejs server, multipart form data)
-> multer and temp file save for read after
-> Transcription with groq and retry logic (task 1 and 4)
-> Generate structurePredefined and structureDynamic from transrcipt (task 2)
-> Save in MongoDB (task 3)
```

---
