import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function MonthlyChart({ measurements }) {
  const data = useMemo(() => {
    const byMonth = {};
    const now = new Date();
    // Seed last 12 months so empty months still show
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
      byMonth[key] = { key, label: d.toLocaleDateString("en-US", { month: "short" }), count: 0 };
    }
    (Array.isArray(measurements) ? measurements : []).forEach(m => {
      const raw = m.date || m.created_date;
      if (!raw) return;
      const d = new Date(raw);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
      if (byMonth[key]) byMonth[key].count++;
    });
    return Object.values(byMonth);
  }, [measurements]);

  const hasData = data.some(d => d.count > 0);

  return (
    <div className="bg-white border border-[#e8e4de] rounded-2xl p-4 mb-6">
      <div className="font-syne text-[11px] font-bold text-[#e86c2f] uppercase tracking-[0.18em] mb-3 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[rgba(232,108,47,0.25)]">
        Measurements per Month
      </div>
      {!hasData ? (
        <div className="text-center py-8 text-[13px] text-[#aaa]">No measurements yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#888880" }} axisLine={false} tickLine={false} interval={0} />
            <YAxis tick={{ fontSize: 10, fill: "#888880" }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
            <Tooltip
              cursor={{ fill: "rgba(232,108,47,0.06)" }}
              contentStyle={{ borderRadius: 8, border: "1px solid #e8e4de", fontSize: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
              formatter={(v) => [`${v} measurement${v !== 1 ? "s" : ""}`, "Count"]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.count > 0 ? "#e86c2f" : "#f0ede8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}