import React from "react";

export default function FieldGroup({ label, required, children, className = "" }) {
  return (
    <div className={`mb-3.5 last:mb-0 ${className}`}>
      {label && (
        <label className="block text-[11px] font-medium text-[#888880] uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-[#e86c2f]">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}