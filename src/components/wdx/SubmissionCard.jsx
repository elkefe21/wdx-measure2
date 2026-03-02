import React from "react";
import { format } from "date-fns";

export default function SubmissionCard({ submission, onClick }) {
  const items = (submission.line_items || []).length;
  const dateStr = submission.date
    ? format(new Date(submission.date), "MMM d, yyyy")
    : format(new Date(submission.created_date), "MMM d, yyyy");

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#e8e4de] rounded-[14px] px-4 py-4 flex items-center justify-between cursor-pointer transition-all hover:border-[#e86c2f] hover:shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
    >
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[15px] text-[#1a1a1a] truncate">
          {submission.client_name || "—"}
        </div>
        <div className="text-[12px] text-[#888880] mt-0.5">
          {[submission.address, submission.city].filter(Boolean).join(", ")} · {dateStr}
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-3">
        <div className="font-mono text-[15px] text-[#e86c2f] font-medium">
          {(submission.total_sqft || 0).toFixed(1)} ft²
        </div>
        <div className="text-[11px] text-[#aaa] mt-0.5">
          {items} item{items !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}