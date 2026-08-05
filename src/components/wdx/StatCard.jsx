import React from "react";

export default function StatCard({ label, value, color }) {
  return (
    <div className="bg-white border border-[#e8e4de] rounded-xl p-3 text-center transition-all hover:border-[rgba(232,108,47,0.3)]">
      <div className="font-syne text-2xl font-extrabold leading-none" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] text-[#888880] uppercase tracking-wider mt-1.5 font-medium">
        {label}
      </div>
    </div>
  );
}