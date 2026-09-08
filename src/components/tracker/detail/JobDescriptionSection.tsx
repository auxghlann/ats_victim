import { useState } from "react";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";
import { updateJobDescriptionAction } from "@/app/actions/applicationDetailsAction";
import { ApplicationDetail } from "@/types/database";

interface JobDescriptionSectionProps {
  applicationId: string;
  detail: ApplicationDetail | null;
  onDetailUpdated: (detail: ApplicationDetail) => void;
}

export function JobDescriptionSection({
  applicationId,
  detail,
  onDetailUpdated,
}: JobDescriptionSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(detail?.job_description || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateJobDescriptionAction(applicationId, descriptionDraft);
      if (updated) {
        onDetailUpdated(updated);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update job description:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-on-surface">Job Description</h2>
        <div className="flex items-center gap-2">
          {detail?.posting_url && (
            <a
              href={detail.posting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Original Posting
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                setDescriptionDraft(detail?.job_description || "");
                setIsEditing(false);
              } else {
                setDescriptionDraft(detail?.job_description || "");
                setIsEditing(true);
              }
            }}
            className="px-2.5 py-1 rounded-lg border border-outline-variant text-[11px] font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            rows={10}
            value={descriptionDraft}
            onChange={(e) => setDescriptionDraft(e.target.value)}
            className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:border-primary font-mono leading-relaxed resize-y"
            placeholder="Paste or edit the full job description (markdown supported)..."
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Description"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-xs text-on-surface-variant leading-relaxed">
          {detail?.job_description ? (
            <MarkdownRenderer content={detail.job_description} />
          ) : (
            <p className="italic text-on-surface-variant/60">
              No job description recorded. Click Edit to add responsibilities and requirements.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
