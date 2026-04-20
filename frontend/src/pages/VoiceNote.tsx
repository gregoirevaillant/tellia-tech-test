import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVoiceNote } from "../services/createVoiceNote";
import styles from "./VoiceNote.module.css";

type RecordingState = "idle" | "recording" | "recorded" | "submitting" | "success" | "error";

function VoiceNote() {
  const [state, setState] = useState<RecordingState>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const audioBlobRef = useRef<Blob | null>(null);

  async function startRecording() {
    setErrorMessage(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      audioBlobRef.current = blob;
      setAudioUrl(URL.createObjectURL(blob));
      setDuration(Math.round((Date.now() - startTimeRef.current) / 1000));
      setState("recorded");
      stream.getTracks().forEach((t) => t.stop());
    };

    startTimeRef.current = Date.now();
    mediaRecorder.start();
    setState("recording");
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  async function handleSubmit() {
    if (!audioBlobRef.current) return;
    setState("submitting");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("audio", audioBlobRef.current, "recording.webm");

    try {
      await createVoiceNote(formData);
      setState("success");
    } catch {
      setErrorMessage("Failed to save the voice note. Please try again.");
      setState("error");
    }
  }

  function handleReset() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setDuration(0);
    audioBlobRef.current = null;
    setErrorMessage(null);
    setState("idle");
  }

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => navigate("/")}>
        ← Back
      </button>

      <h1 className={styles.title}>Voice Note</h1>
      <p className={styles.subtitle}>Record and save a voice note.</p>

      <div className={styles.actions}>
        {state === "idle" && (
          <button className={styles.btnPrimary} onClick={startRecording}>
            Start Recording
          </button>
        )}

        {state === "recording" && (
          <button className={styles.btnDanger} onClick={stopRecording}>
            Stop Recording
          </button>
        )}

        {(state === "recorded" || state === "error") && (
          <>
            <button className={styles.btnPrimary} onClick={handleSubmit}>
              Save
            </button>
            <button className={styles.btnSecondary} onClick={handleReset}>
              Discard
            </button>
          </>
        )}

        {state === "success" && (
          <button className={styles.btnPrimary} onClick={handleReset}>
            Record another
          </button>
        )}
      </div>

      {state === "recording" && (
        <div className={styles.recording}>
          <span className={styles.dot} />
          Recording in progress…
        </div>
      )}

      {state === "submitting" && (
        <p className={styles.statusSaving}>Saving…</p>
      )}

      {state === "success" && (
        <p className={styles.statusSuccess}>Voice note saved successfully.</p>
      )}

      {errorMessage && (
        <p className={styles.statusError}>{errorMessage}</p>
      )}

      {audioUrl && state !== "success" && (
        <div className={styles.preview}>
          <p className={styles.duration}>Duration: {duration}s</p>
          <audio className={styles.audio} controls src={audioUrl} />
        </div>
      )}
    </div>
  );
}

export default VoiceNote;
