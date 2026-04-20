import mongoose, { Schema } from "mongoose";
import { IVoiceNote } from "../types/IVoiceNote";

const predefinedSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["task", "observation", "reminder", "note"],
    },
    title: { type: String },
    scheduledTime: { type: String },
    context: { type: String },
    location: { type: String },
    crop: { type: String },
    issue: { type: String },
    severity: { type: String, enum: ["low", "medium", "high"] },
    message: { type: String },
    content: { type: String },
  },
  { _id: false }
);

const dynamicSchema = new Schema(
  {
    type: { type: String, required: true },
    entities: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const structuredDataSchema = new Schema(
  {
    predefined: { type: predefinedSchema, required: true },
    dynamic: { type: dynamicSchema, required: true },
  },
  { _id: false }
);

const voiceNoteSchema = new Schema<IVoiceNote>(
  {
    transcript: { type: String, required: true, trim: true, minlength: 1 },
    structuredData: { type: structuredDataSchema },
  },
  { timestamps: true }
);

export default mongoose.model<IVoiceNote>("VoiceNote", voiceNoteSchema);
