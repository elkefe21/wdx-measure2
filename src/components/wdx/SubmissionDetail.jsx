import React from "react";
import { format } from "date-fns";
import { X } from "lucide-react";

export default function SubmissionDetail({ submission, onClose }) {
  if (!submission) return null;

  const dateStr = submission.date
    ? format(new Date(submission.date), "EEE, MMM d, yyyy")
    : "";

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-[6px] z-[300] flex items-end justify-center transition-opacity"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-t-3xl w-full max-w-[600px] p-7 pb-10 max-h-[85vh] overflow-y-auto relative animate-in slide-in-from-bottom">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 bg-[#f4f2ee] rounded-full flex items-center justify-center text-[#888880] hover:text-[#e86c2f] transition-colors cursor-pointer border-none"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-1 bg-[#e0dbd4] rounded-full mx-auto mb-5" />

        <h2 className="font-syne text-[19px] font-extrabold mb-1">{submission.client_name || "—"}</h2>
        <p className="text-[13px] text-[#888880] mb-5">
          {submission.tech_name || "—"} · {dateStr}
        </p>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            ["Address", submission.address],
            ["City / Zip", [submission.city, submission.zip].filter(Boolean).join(" ")],
            ["Permitted", submission.permitted],
            ["Total SqFt", (submission.total_sqft || 0).toFixed(2) + " ft²"],
            ["Glass", submission.glass_color],
            ["Frame", submission.frame_color],
            submission.lowe_coating && submission.lowe_coating !== "NONE" && ["Low-E", submission.lowe_coating],
          ].filter(Boolean).map(([label, val], i) => (
            <div key={i} className={label === "Notes" ? "col-span-2" : ""}>
              <div className="text-[10px] uppercase tracking-wider text-[#aaa] mb-0.5">{label}</div>
              <div className="text-[14px] text-[#1a1a1a] font-medium">{val || "—"}</div>
            </div>
          ))}
          {submission.job_notes && (
            <div className="col-span-2">
              <div className="text-[10px] uppercase tracking-wider text-[#aaa] mb-0.5">Notes</div>
              <div className="text-[14px] text-[#1a1a1a] font-medium">{submission.job_notes}</div>
            </div>
          )}
        </div>

        {/* Line items table */}
        <div className="font-syne text-[11px] font-bold text-[#e86c2f] uppercase tracking-[0.18em] mb-2.5 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[rgba(232,108,47,0.25)]">
          Line Items
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["#", "Mark", "Series", "Config", "W", "H", "Qty", "ft²"].map(h => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-wider text-[#aaa] px-2.5 py-2 border-b border-[#f0ede8]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(submission.line_items || []).map((item, i) => (
                <tr key={i}>
                  <td className="px-2.5 py-2.5 border-b border-[#f0ede8] font-mono text-[#e86c2f]">{item.item}</td>
                  <td className="px-2.5 py-2.5 border-b border-[#f0ede8]">{item.mark || "—"}</td>
                  <td className="px-2.5 py-2.5 border-b border-[#f0ede8]">{item.series || "—"}</td>
                  <td className="px-2.5 py-2.5 border-b border-[#f0ede8]">{item.config || "—"}</td>
                  <td className="px-2.5 py-2.5 border-b border-[#f0ede8]">{item.width || "—"}"</td>
                  <td className="px-2.5 py-2.5 border-b border-[#f0ede8]">{item.height || "—"}"</td>
                  <td className="px-2.5 py-2.5 border-b border-[#f0ede8]">{item.qty || 1}</td>
                  <td className="px-2.5 py-2.5 border-b border-[#f0ede8] font-mono text-[#e86c2f]">{item.sqft}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}