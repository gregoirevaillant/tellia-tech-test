import { Router } from "express";
import multer from "multer";
import path from "path";
import os from "os";
import crypto from "crypto";
import {
  createVoiceNote,
  getVoiceNotes,
  getVoiceNote,
} from "../controllers/voiceNoteController";

const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, os.tmpdir());
    },
    filename: (_req, file, cb) => {
      const uniqueName = `${crypto.randomUUID()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
});

router.get("/", getVoiceNotes);
router.get("/:id", getVoiceNote);
router.post("/", upload.single("audio"), createVoiceNote);

export default router;
