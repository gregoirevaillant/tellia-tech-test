export interface VoiceNote {
  _id: string;
  transcript: string;
  structuredData?: {
    predefined: Record<string, unknown>;
    dynamic: Record<string, unknown>;
  };
  createdAt: string;
  updatedAt: string;
}
