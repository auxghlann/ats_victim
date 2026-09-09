import { useState } from "react";
import { addNoteAction } from "@/app/actions/applicationDetailsAction";
import { ApplicationDetail } from "@/types/database";

interface NoteItem {
  id: string;
  date: string;
  content: string;
}

interface JobNotesSectionProps {
  applicationId: string;
  detail: ApplicationDetail | null;
  onDetailUpdated: (detail: ApplicationDetail) => void;
}

export function JobNotesSection({
  applicationId,
  detail,
  onDetailUpdated,
}: JobNotesSectionProps) {
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  const notesList: NoteItem[] = (() => {
    if (!detail?.notes) return [];
    try {
      const parsed = JSON.parse(detail.notes);
      return Array.isArray(parsed) ? parsed : [{ id: "n-1", date: "Initial Note", content: detail.notes }];
    } catch {
      return [{ id: "n-1", date: "Initial Note", content: detail.notes }];
    }
  })();

  const handleAddNote = async () => {
    if (!newNoteContent.trim() || isSavingNote) return;
    setIsSavingNote(true);
    try {
      const updated = await addNoteAction(applicationId, newNoteContent.trim());
      if (updated) {
        onDetailUpdated(updated);
        setNewNoteContent("");
        setShowAddNote(false);
      }
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-on-surface">Notes &amp; Preparation</h2>
        <button
          type="button"
          onClick={() => setShowAddNote(!showAddNote)}
          className="px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
          Add Note
        </button>
      </div>

      {showAddNote && (
        <div className="space-y-3 p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40 animate-in fade-in">
          <textarea
            rows={3}
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Log interview feedback, salary insights, or follow-up notes..."
            className="w-full p-2.5 rounded-lg bg-white border border-outline-variant/60 shadow-2xs text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowAddNote(false);
                setNewNoteContent("");
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddNote}
              disabled={isSavingNote || !newNoteContent.trim()}
              className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm font-bold">{isSavingNote ? "hourglass_empty" : "check"}</span>
              {isSavingNote ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {notesList.map((note) => (
          <div
            key={note.id}
            className="p-3.5 rounded-xl border border-outline-variant/30 bg-surface-container-low space-y-1.5"
          >
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block">
              {note.date}
            </span>
            <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
          </div>
        ))}

        {notesList.length === 0 && !showAddNote && (
          <p className="text-xs italic text-on-surface-variant/60 py-2">
            No notes added yet. Keep track of recruiter feedback or interview tips here.
          </p>
        )}
      </div>
    </div>
  );
}
