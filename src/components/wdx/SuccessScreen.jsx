import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function SuccessScreen({ clientName, totalSqft, onNewMeasurement }) {
  return (
    <div className="fixed inset-0 bg-[#f4f2ee] z-[500] flex flex-col items-center justify-center px-6 text-center">
      {/* Animated checkmark */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-[rgba(232,108,47,0.12)] border-2 border-[rgba(232,108,47,0.3)] flex items-center justify-center animate-pulse">
          <CheckCircle className="w-12 h-12 text-[#e86c2f]" />
        </div>
      </div>

      <h1 className="font-syne text-3xl font-extrabold text-[#1a1a1a] mb-2">Sent!</h1>
      <p className="font-mono text-[13px] text-[#888880] mb-6">
        Measurement submitted to WDX
      </p>

      {/* Summary card */}
      <div className="bg-white border border-[#e8e4de] rounded-2xl p-5 w-full max-w-[320px] mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#f0ede8]">
          <span className="font-mono text-[11px] text-[#888880] uppercase tracking-wider">Client</span>
          <span className="font-syne text-[15px] font-bold text-[#1a1a1a]">{clientName}</span>
        </div>
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#f0ede8]">
          <span className="font-mono text-[11px] text-[#888880] uppercase tracking-wider">Total SqFt</span>
          <span className="font-syne text-[20px] font-extrabold text-[#e86c2f]">{parseFloat(totalSqft).toFixed(2)} ft²</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono text-[11px] text-[#888880] uppercase tracking-wider">Sent To</span>
          <span className="font-mono text-[12px] text-[#1a1a1a]">alex@wdximpact.com</span>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={onNewMeasurement}
        className="w-full max-w-[320px] py-4 bg-[#e86c2f] border-none rounded-xl text-white font-syne text-[15px] font-extrabold cursor-pointer hover:bg-[#c9561f] active:scale-[0.98] transition-all mb-3"
      >
        + New Measurement
      </button>
      <Link
        to={createPageUrl("Home")}
        className="w-full max-w-[320px] py-4 bg-transparent border border-[rgba(232,108,47,0.3)] rounded-xl text-[#e86c2f] font-syne text-[14px] font-bold text-center no-underline hover:bg-[rgba(232,108,47,0.08)] transition-all block"
      >
        Back to Home
      </Link>
    </div>
  );
}