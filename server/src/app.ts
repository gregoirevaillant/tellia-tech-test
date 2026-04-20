import cors from "cors";
import express from "express";
import voiceNoteRoutes from "./routes/voiceNote";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/voice-notes", voiceNoteRoutes);

export default app;
