import { useState, useRef, useEffect } from "react";
import { addNoteAction, updateNoteAction, deleteNoteAction } from "@/app/actions/applicationDetailsAction";
import { ApplicationDetail, NoteItem } from "@/types/database";

interface JobNotesSectionProps {
  applicationId: string;
  detail: ApplicationDetail | null;
  onDetailUpdated: (detail: ApplicationDetail) => void;
}

interface NoteCardProps {
  note: NoteItem;
  applicationId: string;
  onUpdated: (detail: ApplicationDetail) => void;
}

function NoteCard({ note, applicationId, onUpdated }: NoteCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleSaveEdit = async () => {
    if (!editContent.trim() || isSaving) return;
    setIsSaving(true);
    try {
      const updated = await updateNoteAction(applicationId, note.id, editContent.trim());
      if (updated) {
        onUpdated(updated);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update note:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        const updated = await deleteNoteAction(applicationId, note.id);
        if (updated) {
          onUpdated(updated);
        }
      } catch (err) {
        console.error("Failed to delete note:", err);
      }
    }
  };

  return (
    <div className="p-3.5 rounded-xl border border-outline-variant/30 bg-surface-container-low space-y-1.5 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block">
          {note.date}
        </span>

        {/* More Vert Menu Button */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-6 h-6 rounded-md text-on-surface-variant hover:bg-surface-container flex items-center justify-center cursor-pointer transition-colors"
            title="Note actions"
          >
            <span className="material-symbols-outlined text-base">more_vert</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-7 z-30 w-32 bg-surface rounded-xl border border-outline-variant/40 shadow-lg py-1 animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setIsEditing(true);
                }}
                className="w-full px-3 py-1.5 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-primary">edit</span>
                Edit Note
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  handleDelete();
                }}
                className="w-full px-3 py-1.5 text-left text-xs font-semibold text-error hover:bg-error/10 flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete Note
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2 pt-1">
          <textarea
            rows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-white border border-outline-variant/60 shadow-2xs text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditContent(note.content);
              }}
              disabled={isSaving}
              className="px-3 py-1 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={isSaving || !editContent.trim()}
              className="px-3.5 py-1 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm font-bold">
                {isSaving ? "hourglass_empty" : "check"}
              </span>
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">
          {note.content}
        </p>
      )}
    </div>
  );
}

export function JobNotesSection({
  applicationId,
  detail,
  onDetailUpdated,
}: JobNotesSectionProps) {
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  const notesList: NoteItem[] = detail?.notes || [];

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
              <span className="material-symbols-outlined text-sm font-bold">
                {isSavingNote ? "hourglass_empty" : "check"}
              </span>
              {isSavingNote ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {notesList.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            applicationId={applicationId}
            onUpdated={onDetailUpdated}
          />
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
