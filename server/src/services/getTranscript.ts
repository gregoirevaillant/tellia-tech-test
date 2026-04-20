import fs from "fs";
import Groq from "groq-sdk";

const mockTranscribe = async (_audioBuffer: Buffer): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (Math.random() < 0.4) {
    throw new Error(
      "Transcription service unavailable (simulated transient failure)",
    );
  }

  return "Tomorrow at 9am call the irrigation technician about the pump failure in field 12";
};

const groq = new Groq();

async function getGroqTranscript(file: Express.Multer.File): Promise<string> {
  const stream = fs.createReadStream(file.path);

  const transcription = await groq.audio.transcriptions.create({
    file: stream,
    model: "whisper-large-v3-turbo",
    response_format: "verbose_json",
    language: "fr",
  });

  return transcription.text;
}

export { mockTranscribe, getGroqTranscript };
