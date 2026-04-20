import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "events.log");

type EventType = "transcription" | "structuring" | "save" | "error";

interface LogEntry {
  timestamp: string;
  event: EventType;
  data: Record<string, unknown>;
}

export function logEvent(event: EventType, data: Record<string, unknown>): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    event,
    data,
  };
  fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n");
}
