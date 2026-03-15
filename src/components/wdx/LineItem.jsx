import React, { useMemo } from "react";
import { X } from "lucide-react";
import { MR_GLASS_SERIES, SERIES_CONFIGS, WINDOW_OPTION_SERIES, DOOR_OPTION_SERIES, FRAME_OPTIONS, GLASS_SPECS } from "./constants";

export default function LineItem({ item, index, onChange, onRemove }) {
  const configs = useMemo(() => SERIES_CONFIGS[item.system] || [], [item.system]);

  const sqft = useMemo(() => {
    const w = parseFloat(item.width) || 0;
    const h = parseFloat(item.height) || 0;
    const q = parseFloat(item.quantity) || 1;
    return (w * h / 144) * q;
  }, [item.width, item.height, item.quantity]);

  const update = (field, val) => onChange(index, { ...item, [field]: val });

  const inputCls = "w-full bg-[#faf9f7] border-[1.5px] border-[#ddd] rounded-[10px] text-[#1a1a1a] font-sans text-[14px] py-3 px-3.5 outline-none transition-all focus:border-[#e86c2f] focus:shadow-[0_0_0_3px_rgba(232,108,47,0.1)]";
  const selectCls = `${inputCls} appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2712%27%20height%3D%278%27%20viewBox%3D%270%200%2012%208%27%3E%3Cpath%20d%3D%27M1%201l5%205%205-5%27%20stroke%3D%27%23e86c2f%27%20stroke-width%3D%271.5%27%20fill%3D%27none%27%20stroke-linecap%3D%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_14px_center] pr-9`;
  const labelCls = "block text-[11px] font-medium text-[#888880] uppercase tracking-wider mb-1.5";

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

      {/* Mark + System */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <div>
          <label className={labelCls}>Mark</label>
          <input
            type="text"
            value={item.mark || ""}
            onChange={e => update("mark", e.target.value)}
            placeholder="W-1, D-2..."
            className={inputCls.replace("text-[14px]", "font-mono text-[14px]")}
          />
        </div>
        <div>
          <label className={labelCls}>System <span className="text-[#e86c2f]">*</span></label>
          <select
            value={item.system || ""}
            onChange={e => {
              const newItem = { ...item, system: e.target.value, configuration: "" };
              const cfgs = SERIES_CONFIGS[e.target.value];
              if (cfgs?.length === 1) newItem.configuration = cfgs[0];
              // Auto-fill description
              const s = e.target.value;
              if (s.includes('SH')) newItem.description = 'SINGLE HUNG WINDOW';
              else if (s.includes('HR')) newItem.description = 'HORIZONTAL ROLLER';
              else if (s.includes('PW') || s.includes('450') || s.includes('400')) newItem.description = 'PICTURE WINDOWS';
              else if (s.includes('CA') || s.includes('600')) newItem.description = 'CASEMENT WINDOW';
              else if (s.includes('SGD') || s.includes('1000') || s.includes('1100') || s.includes('1500')) newItem.description = 'SLIDING GLASS DOOR';
              else if (s.includes('FD') || s.includes('3000') || s.includes('3500')) newItem.description = 'FOLDING DOOR';
              else if (s.includes('Pivot') || s.includes('4000')) newItem.description = 'PIVOT DOOR';
              else if (s.includes('SF') || s.includes('500') || s.includes('5000') || s.includes('6000') || s.includes('4500') || s.includes('275')) newItem.description = 'STOREFRONT';
              else if (s.includes('Tube')) newItem.description = '1" x 4" x 1/8"';
              onChange(index, newItem);
            }}
            className={selectCls}
          >
            <option value="">Select system...</option>
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

      {/* Configuration */}
      {configs.length > 0 && (
        <div className="mb-2.5">
          <label className={labelCls}>Configuration <span className="text-[#e86c2f]">*</span></label>
          <select
            value={item.configuration || ""}
            onChange={e => update("configuration", e.target.value)}
            className={selectCls}
          >
            <option value="">Select config...</option>
            {configs.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      {/* Width, Height, Quantity */}
      <div className="grid grid-cols-3 gap-2.5 mb-2.5">
        <div>
          <label className={labelCls}>Width (in)</label>
          <input type="number" inputMode="decimal" value={item.width || ""} onChange={e => update("width", e.target.value)} placeholder="0.00"
            className="w-full bg-[#faf9f7] border-[1.5px] border-[#ddd] rounded-[10px] text-[#1a1a1a] font-mono text-[15px] py-3 px-3 outline-none transition-all focus:border-[#e86c2f] focus:shadow-[0_0_0_3px_rgba(232,108,47,0.1)] text-center" />
        </div>
        <div>
          <label className={labelCls}>Height (in)</label>
          <input type="number" inputMode="decimal" value={item.height || ""} onChange={e => update("height", e.target.value)} placeholder="0.00"
            className="w-full bg-[#faf9f7] border-[1.5px] border-[#ddd] rounded-[10px] text-[#1a1a1a] font-mono text-[15px] py-3 px-3 outline-none transition-all focus:border-[#e86c2f] focus:shadow-[0_0_0_3px_rgba(232,108,47,0.1)] text-center" />
        </div>
        <div>
          <label className={labelCls}>Quantity</label>
          <input type="number" inputMode="numeric" value={item.quantity || ""} onChange={e => update("quantity", e.target.value)} placeholder="1" min="1"
            className="w-full bg-[#faf9f7] border-[1.5px] border-[#ddd] rounded-[10px] text-[#1a1a1a] font-mono text-[15px] py-3 px-3 outline-none transition-all focus:border-[#e86c2f] focus:shadow-[0_0_0_3px_rgba(232,108,47,0.1)] text-center" />
        </div>
      </div>

      {/* Frame */}
      <div className="mb-2.5">
        <label className={labelCls}>Frame</label>
        <select value={item.frame || ""} onChange={e => update("frame", e.target.value)} className={selectCls}>
          <option value="">Select frame...</option>
          {FRAME_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Glass */}
      <div className="mb-2.5">
        <label className={labelCls}>Glass</label>
        <select value={item.glass || ""} onChange={e => update("glass", e.target.value)} className={selectCls}>
          <option value="">Select glass spec...</option>
          {GLASS_SPECS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        {/* Free-text override */}
        {item.glass && !GLASS_SPECS.includes(item.glass) && (
          <input type="text" value={item.glass} onChange={e => update("glass", e.target.value)} placeholder="Custom glass spec..." className={`${inputCls} mt-1.5`} />
        )}
        {item.glass === "" && (
          <input type="text" value={item.glassCustom || ""} onChange={e => { update("glassCustom", e.target.value); if (e.target.value) update("glass", e.target.value); }} placeholder="Or type custom spec..." className={`${inputCls} mt-1.5 text-[13px]`} />
        )}
      </div>

      {/* Description */}
      <div className="mb-2.5">
        <label className={labelCls}>Description</label>
        <input type="text" value={item.description || ""} onChange={e => update("description", e.target.value)} placeholder="e.g. SINGLE HUNG WINDOW" className={inputCls} />
      </div>

      {/* Window Options */}
      {item.configuration && WINDOW_OPTION_SERIES.includes(item.system) && (
        <div className="mb-2.5 flex gap-4">
          {["Privacy", "Flush Adapter (no flange)"].map(opt => {
            const key = `opt_${opt}`;
            return (
              <label key={opt} className="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" checked={!!item[key]} onChange={e => update(key, e.target.checked)} className="w-4 h-4 accent-[#e86c2f] cursor-pointer" />
                <span className="text-[12px] text-[#1a1a1a] font-sans">{opt}</span>
              </label>
            );
          })}
        </div>
      )}

      {/* Door Options */}
      {item.configuration && DOOR_OPTION_SERIES.includes(item.system) && (
        <div className="mb-2.5 flex gap-4">
          {["Privacy", "LH", "RH"].map(opt => {
            const key = `opt_${opt}`;
            return (
              <label key={opt} className="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" checked={!!item[key]} onChange={e => update(key, e.target.checked)} className="w-4 h-4 accent-[#e86c2f] cursor-pointer" />
                <span className="text-[12px] text-[#1a1a1a] font-sans">{opt}</span>
              </label>
            );
          })}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className={labelCls}>Notes</label>
        <input type="text" value={item.notes || ""} onChange={e => update("notes", e.target.value)} placeholder="Special instructions..." className={inputCls} />
      </div>
    </div>
  );
}