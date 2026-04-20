import { Request, Response, NextFunction } from "express";
import VoiceNote from "../models/VoiceNote";
import { structurePredefined, structureDynamic } from "../services/structuringService";
import { withRetry } from "../utils/retry";
import { getGroqTranscript } from "../services/getTranscript";
import { logEvent } from "../utils/eventLogger";
import { IStructuredData } from "../types/IVoiceNote";

export const getVoiceNotes = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notes = await VoiceNote.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

export const getVoiceNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const note = await VoiceNote.findById(req.params.id);
    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }
    res.json(note);
  } catch (err) {
    next(err);
  }
};

export const createVoiceNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Audio file is required" });
      return;
    }

    const transcript = await withRetry(
      () => {
        if (req.file) {
          return getGroqTranscript(req.file);
        }
        throw new Error("No file provided");
      },
      { maxAttempts: 3, baseDelayMs: 300, maxDelayMs: 2000 },
    );

    logEvent("transcription", { transcript, filename: req.file.originalname });

    const [predefined, dynamic] = await Promise.all([structurePredefined(transcript), structureDynamic(transcript)]);

    const structuredData: IStructuredData = { predefined, dynamic };

    logEvent("structuring", { structuredData });

    const note = await VoiceNote.create({ transcript, structuredData });

    logEvent("save", { id: note._id.toString() });

    res.status(201).json({ transcript, structuredData });
  } catch (err) {
    logEvent("error", { message: (err as Error).message });
    next(err);
  }
};
