import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVoiceNotes } from "../services/getVoiceNotes";
import type { VoiceNote } from "../types/voiceNote";
import styles from "./NotesList.module.css";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function NotesList() {
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getVoiceNotes()
      .then(({ data }) => setNotes(data))
      .catch(() => setError("Failed to load notes."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => navigate("/")}>
        ← Back
      </button>

      <h1 className={styles.title}>Notes</h1>
      <p className={styles.subtitle}>All your saved voice notes.</p>

      {loading && <p className={styles.status}>Loading…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && notes.length === 0 && (
        <p className={styles.empty}>No notes yet. Record your first one!</p>
      )}

      <ul className={styles.list}>
        {notes.map((note) => (
          <li
            key={note._id}
            className={styles.item}
            onClick={() => navigate(`/notes/${note._id}`)}
          >
            <p className={styles.transcript}>{note.transcript}</p>
            <span className={styles.date}>{formatDate(note.createdAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotesList;
