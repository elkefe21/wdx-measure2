import React from "react";

export default function ToggleGroup({ value, onChange, options }) {
  return (
    <div className="flex gap-2.5">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-3 rounded-[10px] border-[1.5px] text-[15px] font-medium cursor-pointer transition-all text-center font-sans ${
            value === opt.value
              ? opt.value === "Yes"
                ? "bg-[rgba(232,108,47,0.1)] border-[#e86c2f] text-[#e86c2f]"
                : "bg-[rgba(255,77,109,0.1)] border-[#dc3545] text-[#dc3545]"
              : "bg-[#f4f2ee] border-[#ddd] text-[#888880]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}