import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVoiceNote } from "../services/getVoiceNotes";
import type { VoiceNote } from "../types/voiceNote";
import styles from "./NoteDetail.module.css";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function DataSection({ title, data }: { title: string; data: Record<string, unknown> }) {
  const entries = Object.entries(data).filter(([, v]) => v !== undefined && v !== null && v !== "");
  if (entries.length === 0) return null;
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <dl className={styles.dl}>
        {entries.map(([key, value]) => (
          <div key={key} className={styles.row}>
            <dt className={styles.dt}>{key}</dt>
            <dd className={styles.dd}>{JSON.stringify(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<VoiceNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getVoiceNote(id)
      .then(({ data }) => setNote(data))
      .catch(() => setError("Failed to load note."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => navigate("/notes")}>
        ← Back to Notes
      </button>

      {loading && <p className={styles.status}>Loading…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {note && (
        <>
          <p className={styles.meta}>{formatDate(note.createdAt)}</p>
          <h1 className={styles.title}>Transcript</h1>
          <p className={styles.transcript}>{note.transcript}</p>

          {note.structuredData && (
            <div className={styles.structured}>
              <h2 className={styles.structuredHeading}>Structured Data</h2>
              <DataSection
                title="Predefined"
                data={note.structuredData.predefined}
              />
              <DataSection
                title="Dynamic"
                data={note.structuredData.dynamic}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NoteDetail;
