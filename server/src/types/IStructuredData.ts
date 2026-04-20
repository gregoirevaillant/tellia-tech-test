// Approach A — Predefined schemas
export interface TaskSchema {
  type: "task";
  title: string;
  scheduledTime?: string;
  context?: string;
  location?: string;
}

export interface ObservationSchema {
  type: "observation";
  location?: string;
  crop?: string;
  issue?: string;
  severity?: "low" | "medium" | "high";
}

export interface ReminderSchema {
  type: "reminder";
  message: string;
  scheduledTime?: string;
}

export interface NoteSchema {
  type: "note";
  content: string;
}

export type PredefinedSchema = TaskSchema | ObservationSchema | ReminderSchema | NoteSchema;

// Approach B — Dynamic structure
export interface DynamicSchema {
  type: string;
  entities: Record<string, unknown>;
}
