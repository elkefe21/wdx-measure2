import React from "react";

export default function SectionCard({ title, children }) {
  return (
    <div className="bg-white border border-[#e8e4de] rounded-2xl p-5 mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      {title && (
        <div className="font-syne text-[11px] font-bold text-[#e86c2f] uppercase tracking-[0.18em] mb-4 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[rgba(232,108,47,0.25)]">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}