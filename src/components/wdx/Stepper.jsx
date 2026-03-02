import React, { useRef, useCallback } from "react";

export default function Stepper({ value, onChange, min = 0, step = 0.25, inputMode = "decimal", placeholder = "0" }) {
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  const doStep = useCallback((delta) => {
    const current = parseFloat(value) || (min > 0 ? min : 0);
    const next = Math.max(min, Math.round((current + delta) * 100) / 100);
    onChange(next);
  }, [value, min, onChange]);

  const startStep = (delta) => {
    doStep(delta);
    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => doStep(delta), 80);
    }, 400);
  };

  const stopStep = () => {
    clearTimeout(timerRef.current);
    clearInterval(intervalRef.current);
  };

  return (
    <div className="flex items-stretch bg-[#faf9f7] border-[1.5px] border-[#ddd] rounded-[10px] overflow-hidden transition-all focus-within:border-[#e86c2f] focus-within:shadow-[0_0_0_3px_rgba(232,108,47,0.1)]">
      <button
        type="button"
        onPointerDown={() => startStep(-step)}
        onPointerUp={stopStep}
        onPointerLeave={stopStep}
        className="w-9 min-w-[36px] flex items-center justify-center text-[#e86c2f] text-lg font-light bg-[rgba(232,108,47,0.06)] border-none border-r border-r-[rgba(232,108,47,0.15)] cursor-pointer select-none active:bg-[rgba(232,108,47,0.18)] touch-manipulation"
      >
        −
      </button>
      <input
        type="number"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        min={min}
        step={step}
        className="flex-1 min-w-0 border-none bg-transparent text-center py-3 px-1 font-mono text-[15px] text-[#1a1a1a] outline-none shadow-none"
      />
      <button
        type="button"
        onPointerDown={() => startStep(step)}
        onPointerUp={stopStep}
        onPointerLeave={stopStep}
        className="w-9 min-w-[36px] flex items-center justify-center text-[#e86c2f] text-lg font-light bg-[rgba(232,108,47,0.06)] border-none border-l border-l-[rgba(232,108,47,0.15)] cursor-pointer select-none active:bg-[rgba(232,108,47,0.18)] touch-manipulation"
      >
        +
      </button>
    </div>
  );
}