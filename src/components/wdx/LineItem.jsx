import React, { useMemo } from "react";
import { X } from "lucide-react";
import Stepper from "./Stepper";
import { MR_GLASS_SERIES, SERIES_CONFIGS } from "./constants";

export default function LineItem({ item, index, onChange, onRemove }) {
  const configs = useMemo(() => {
    return SERIES_CONFIGS[item.series] || [];
  }, [item.series]);

  const sqft = useMemo(() => {
    const w = parseFloat(item.width) || 0;
    const h = parseFloat(item.height) || 0;
    const q = parseFloat(item.qty) || 1;
    return (w * h / 144) * q;
  }, [item.width, item.height, item.qty]);

  const update = (field, val) => onChange(index, { ...item, [field]: val });

  return (
    <div className="bg-white border border-[#e8e4de] rounded-[14px] p-4 mb-3 transition-all focus-within:border-[#e86c2f]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[11px] text-[#e86c2f] font-medium">ITEM {index + 1}</span>
        <span className="font-mono text-[11px] text-[#e8a020]">
          {sqft > 0 ? sqft.toFixed(2) + " ft²" : "—"}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[rgba(255,77,109,0.1)] border border-[rgba(255,77,109,0.3)] text-[#dc3545] cursor-pointer transition-all hover:bg-[rgba(255,77,109,0.2)]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mark + Series */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <div>
          <label className="block text-[11px] font-medium text-[#888880] uppercase tracking-wider mb-1.5">Mark</label>
          <input
            type="text"
            value={item.mark || ""}
            onChange={e => update("mark", e.target.value)}
            placeholder="W-1, D-2..."
            className="w-full bg-[#faf9f7] border-[1.5px] border-[#ddd] rounded-[10px] text-[#1a1a1a] font-mono text-[14px] py-3 px-3.5 outline-none transition-all focus:border-[#e86c2f] focus:shadow-[0_0_0_3px_rgba(232,108,47,0.1)]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[#888880] uppercase tracking-wider mb-1.5">
            Product Series <span className="text-[#e86c2f]">*</span>
          </label>
          <select
            value={item.series || ""}
            onChange={e => {
              const newItem = { ...item, series: e.target.value, config: "" };
              const cfgs = SERIES_CONFIGS[e.target.value];
              if (cfgs?.length === 1) newItem.config = cfgs[0];
              onChange(index, newItem);
            }}
            className="w-full bg-[#faf9f7] border-[1.5px] border-[#ddd] rounded-[10px] text-[#1a1a1a] font-sans text-[14px] py-3 px-3.5 pr-9 outline-none transition-all focus:border-[#e86c2f] focus:shadow-[0_0_0_3px_rgba(232,108,47,0.1)] appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2712%27%20height%3D%278%27%20viewBox%3D%270%200%2012%208%27%3E%3Cpath%20d%3D%27M1%201l5%205%205-5%27%20stroke%3D%27%23e86c2f%27%20stroke-width%3D%271.5%27%20fill%3D%27none%27%20stroke-linecap%3D%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_14px_center]"
          >
            <option value="">Select series...</option>
            {MR_GLASS_SERIES.map((s, i) =>
              typeof s === "object" ? (
                <option key={i} disabled className="text-[#e86c2f] font-semibold text-xs">{s.label}</option>
              ) : (
                <option key={s} value={s}>{s}</option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Width, Height, Qty */}
      <div className="grid grid-cols-3 gap-2.5 mb-2.5">
        <div>
          <label className="block text-[11px] font-medium text-[#888880] uppercase tracking-wider mb-1.5">Width (in)</label>
          <Stepper value={item.width} onChange={v => update("width", v)} step={0.25} />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[#888880] uppercase tracking-wider mb-1.5">Height (in)</label>
          <Stepper value={item.height} onChange={v => update("height", v)} step={0.25} />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[#888880] uppercase tracking-wider mb-1.5">Qty</label>
          <Stepper value={item.qty || 1} onChange={v => update("qty", v)} min={1} step={1} inputMode="numeric" placeholder="1" />
        </div>
      </div>

      {/* Config */}
      {configs.length > 0 && (
        <div className="mb-2.5">
          <label className="block text-[11px] font-medium text-[#888880] uppercase tracking-wider mb-1.5">
            Config <span className="text-[#e86c2f]">*</span>
          </label>
          <select
            value={item.config || ""}
            onChange={e => update("config", e.target.value)}
            className="w-full bg-[#faf9f7] border-[1.5px] border-[#ddd] rounded-[10px] text-[#1a1a1a] font-sans text-[14px] py-3 px-3.5 pr-9 outline-none transition-all focus:border-[#e86c2f] focus:shadow-[0_0_0_3px_rgba(232,108,47,0.1)] appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2712%27%20height%3D%278%27%20viewBox%3D%270%200%2012%208%27%3E%3Cpath%20d%3D%27M1%201l5%205%205-5%27%20stroke%3D%27%23e86c2f%27%20stroke-width%3D%271.5%27%20fill%3D%27none%27%20stroke-linecap%3D%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_14px_center]"
          >
            <option value="">Select config...</option>
            {configs.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-[11px] font-medium text-[#888880] uppercase tracking-wider mb-1.5">Notes</label>
        <input
          type="text"
          value={item.notes || ""}
          onChange={e => update("notes", e.target.value)}
          placeholder="Special instructions..."
          className="w-full bg-[#faf9f7] border-[1.5px] border-[#ddd] rounded-[10px] text-[#1a1a1a] font-sans text-[15px] py-3 px-3.5 outline-none transition-all focus:border-[#e86c2f] focus:shadow-[0_0_0_3px_rgba(232,108,47,0.1)]"
        />
      </div>
    </div>
  );
}