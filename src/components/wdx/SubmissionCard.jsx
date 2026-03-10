import React, { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Pencil, Copy } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import ConfirmModal from "@/components/wdx/ConfirmModal";

export default function SubmissionCard({ submission, onClick }) {
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);
  const [copying, setCopying] = useState(false);

  const items = (submission.line_items || []).length;
  const dateStr = submission.date
    ? format(new Date(submission.date), "MMM d, yyyy")
    : format(new Date(submission.created_date), "MMM d, yyyy");

  const handleCopy = async () => {
    setCopying(true);
    try {
      const draftData = {
        permitted: submission.permitted || "",
        techName: submission.tech_name || "",
        date: new Date().toISOString().split("T")[0],
        clientName: submission.client_name || "",
        address: submission.address || "",
        city: submission.city || "",
        zip: submission.zip || "",
        glassColor: submission.glass_color || "",
        frameColor: submission.frame_color || "",
        loweCoating: submission.lowe_coating || "NONE",
        jobNotes: submission.job_notes || "",
        lineItems: (submission.line_items || []).map(i => ({
          mark: i.mark || "",
          series: i.series || "",
          config: i.config || "",
          width: i.width || "",
          height: i.height || "",
          qty: i.qty || "1",
          notes: i.notes || "",
        })),
        totalSqft: submission.total_sqft || 0,
      };
      const draft = await base44.entities.Draft.create({ data: draftData });
      setShowCopyConfirm(false);
      window.location.href = createPageUrl("NewMeasurement") + "?draft=" + draft.id;
    } catch (err) {
      toast.error("Failed to copy: " + err.message);
      setCopying(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-[#e8e4de] rounded-[14px] px-4 py-4 flex items-center justify-between transition-all hover:border-[rgba(232,108,47,0.4)] hover:shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
          <div className="font-semibold text-[15px] text-[#1a1a1a] truncate">
            {submission.client_name || "—"}
          </div>
          <div className="text-[12px] text-[#888880] mt-0.5">
            {[submission.address, submission.city].filter(Boolean).join(", ")} · {dateStr}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <div className="text-right mr-1">
            <div className="font-mono text-[15px] text-[#e86c2f] font-medium">
              {(submission.total_sqft || 0).toFixed(1)} ft²
            </div>
            <div className="text-[11px] text-[#aaa] mt-0.5">
              {items} item{items !== 1 ? "s" : ""}
            </div>
          </div>
          <Link
            to={createPageUrl("NewMeasurement") + "?edit=" + submission.id}
            onClick={e => e.stopPropagation()}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0dbd4] bg-[#f4f2ee] text-[#888880] hover:text-[#e86c2f] hover:border-[#e86c2f] transition-all no-underline"
            title="Edit & Resubmit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={e => { e.stopPropagation(); setShowCopyConfirm(true); }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0dbd4] bg-[#f4f2ee] text-[#888880] hover:text-[#e86c2f] hover:border-[#e86c2f] transition-all cursor-pointer"
            title="Copy Job"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Copy confirmation popup */}
      {showCopyConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300] flex items-center justify-center p-5">
          <div className="bg-white border border-[#e8e4de] rounded-[20px] p-7 w-full max-w-[380px]">
            <div className="text-[30px] mb-3 text-center">📋</div>
            <h2 className="font-syne text-[18px] font-extrabold mb-2 text-center">Copy this job?</h2>
            <p className="text-[13px] text-[#888880] mb-5 text-center leading-relaxed">
              A copy of <strong className="text-[#1a1a1a]">{submission.client_name}</strong> will be saved as a new draft so you can edit and resubmit it.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowCopyConfirm(false)}
                className="flex-1 py-3.5 bg-transparent border border-[#e0dbd4] rounded-xl text-[#888880] font-syne text-[14px] font-bold cursor-pointer hover:border-[#e86c2f] hover:text-[#e86c2f] transition-all"
              >
                No
              </button>
              <button
                onClick={handleCopy}
                disabled={copying}
                className="flex-[2] py-3.5 bg-[#e86c2f] border-none rounded-xl text-white font-syne text-[14px] font-extrabold cursor-pointer hover:bg-[#c9561f] transition-all disabled:opacity-60"
              >
                {copying ? "Copying..." : "Yes, Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}