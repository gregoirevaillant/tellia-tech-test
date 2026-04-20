import api from "./api";
import type { VoiceNote } from "../types/voiceNote";

export const getVoiceNotes = (): Promise<{ data: VoiceNote[] }> =>
  api.get("/voice-notes");

export const getVoiceNote = (id: string): Promise<{ data: VoiceNote }> =>
  api.get(`/voice-notes/${id}`);
