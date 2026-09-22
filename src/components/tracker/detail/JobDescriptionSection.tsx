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
  const [isClamped, setIsClamped] = useState(true);

  const wordCount = detail?.job_description
    ? detail.job_description.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const isLongDescription = wordCount > 60;

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
    <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm space-y-4">
      {/* Header */}
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
            className={
              isEditing
                ? "px-3 py-1 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-1"
                : "px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
            }
          >
            <span className="material-symbols-outlined text-sm">
              {isEditing ? "close" : "edit"}
            </span>
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {/* Editor Mode */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            rows={10}
            value={descriptionDraft}
            onChange={(e) => setDescriptionDraft(e.target.value)}
            className="w-full p-3 rounded-xl bg-white border border-outline-variant/60 shadow-2xs text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary font-mono leading-relaxed resize-y transition-all"
            placeholder="Paste or edit the full job description (markdown supported)..."
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm font-bold">
                {isSaving ? "hourglass_empty" : "check"}
              </span>
              {isSaving ? "Saving..." : "Save Description"}
            </button>
          </div>
        </div>
      ) : (
        /* View Mode with Expand / Retract */
        <div className="space-y-3">
          {detail?.job_description ? (
            <>
              <div className="relative">
                <div
                  className={`text-xs text-on-surface-variant leading-relaxed transition-all duration-300 ${
                    isLongDescription && isClamped ? "max-h-64 overflow-hidden" : ""
                  }`}
                >
                  <MarkdownRenderer content={detail.job_description} />
                </div>

                {/* Bottom gradient fade when clamped */}
                {isLongDescription && isClamped && (
                  <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
                )}
              </div>

              {/* Retract / Expand Content Button */}
              {isLongDescription && (
                <div className="flex justify-center pt-1 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => setIsClamped(!isClamped)}
                    className="px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary hover:text-primary/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isClamped ? "expand_more" : "expand_less"}
                    </span>
                    {isClamped ? "Expand Description" : "Retract Description"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="italic text-xs text-on-surface-variant/60">
              No job description recorded. Click Edit to add responsibilities and requirements.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
