import Groq from "groq-sdk";
import { DynamicSchema, PredefinedSchema } from "../types/IStructuredData";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

// Approach A — Predefined schemas enforced via json_schema response_format
export const structurePredefined = async (
  transcript: string
): Promise<PredefinedSchema> => {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `Classify the following voice note into one of the structured types: task, observation, reminder, or note.

Rules:
- "task": something that needs to be done (call, email, fix, buy, check…)
- "observation": something noticed in the field (crop health, pest, weather…)
- "reminder": something to remember or not forget
- "note": anything that doesn't fit the above

Always include ALL fields in the output. Set fields that are not relevant to the chosen type to null.
Preserve the original language of the voice note — do not translate any field values.
- task fields: title (required), scheduledTime (ISO 8601 or natural language), context
- observation fields: location, crop, issue, severity (low/medium/high)
- reminder fields: message (required), scheduledTime
- note fields: content (required)

Voice note: "${transcript}"`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "predefined_schema",
        strict: true,
        schema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["task", "observation", "reminder", "note"],
              description: "The category of this voice note",
            },
            title: { type: ["string", "null"], description: "Short title of the task" },
            scheduledTime: {
              type: ["string", "null"],
              description: "When the task/reminder is due (ISO 8601 or natural language)",
            },
            context: { type: ["string", "null"], description: "Additional context for the task" },
            location: { type: ["string", "null"], description: "Where the observation was made" },
            crop: { type: ["string", "null"], description: "Crop type involved" },
            issue: { type: ["string", "null"], description: "Problem or issue observed" },
            severity: {
              type: ["string", "null"],
              enum: ["low", "medium", "high", null],
              description: "Severity of the issue",
            },
            message: { type: ["string", "null"], description: "The reminder message" },
            content: { type: ["string", "null"], description: "Full content of a general note" },
          },
          required: [
            "type",
            "title",
            "scheduledTime",
            "context",
            "location",
            "crop",
            "issue",
            "severity",
            "message",
            "content",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  return JSON.parse(response.choices[0].message.content!) as PredefinedSchema;
};

// Approach B — Dynamic structure: model decides the shape
export const structureDynamic = async (
  transcript: string
): Promise<DynamicSchema> => {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `Extract all meaningful entities from this voice note and produce a structured JSON object.

The output must have:
- "type": a short descriptive label you invent (e.g. "irrigation_task", "crop_observation", "field_reminder")
- "entities": an object whose keys and values you derive freely from the content

Be specific — extract dates, times, locations, people, actions, crops, equipment, issues, etc.
Preserve the original language of the voice note — do not translate any field values.

Voice note: "${transcript}"`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "dynamic_schema",
        strict: false,
        schema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "A concise label describing the kind of note",
            },
            entities: {
              type: "object",
              description: "Key-value pairs of extracted entities",
            },
          },
          required: ["type", "entities"],
          additionalProperties: false,
        },
      },
    },
  });

  return JSON.parse(response.choices[0].message.content!) as DynamicSchema;
};
