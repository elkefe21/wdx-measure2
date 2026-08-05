import React from "react";
import { MapPin, Calendar, Ruler, Clock, Bell } from "lucide-react";

const STATUS_CONFIG = {
  quoted:    { label: "Pending",   color: "#e8a020", bg: "rgba(232,160,32,0.12)",  border: "rgba(232,160,32,0.3)" },
  responded: { label: "Responded", color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)" },
  accepted:  { label: "Accepted",  color: "#22c55e", bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.3)" },
  declined:  { label: "Declined",  color: "#dc3545", bg: "rgba(220,53,69,0.12)",  border: "rgba(220,53,69,0.3)" },
};

const ACTION_BUTTONS = [
  { status: "responded", label: "Responded", color: "#3b82f6" },
  { status: "accepted",  label: "Accepted",  color: "#22c55e" },
  { status: "declined",  label: "Declined",  color: "#dc3545" },
];

export default function ClientCard({ measurement, onStatusChange, onRecurringToggle }) {
  const m = measurement;
  const status = m.crm_status || "quoted";
  const config = STATUS_CONFIG[status];

  const formatDate = (d) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

  const nextFollowup = m.next_followup_date;
  const today = new Date().toISOString().split("T")[0];
  const overdue = nextFollowup && nextFollowup <= today;
  const followupCount = m.followup_count || 0;
  const canRecur = followupCount >= 3;

  return (
    <div className="bg-white border border-[#e8e4de] rounded-2xl p-4 transition-all hover:border-[rgba(232,108,47,0.25)]">
      {/* Header */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="min-w-0 flex-1">
          <div className="font-syne text-[15px] font-extrabold text-[#1a1a1a] truncate">
            {m.client_name || "Unnamed client"}
          </div>
          <div className="text-[12px] text-[#888880] flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {[m.address, m.city].filter(Boolean).join(", ") || "No address"}
            </span>
          </div>
        </div>
        <span
          className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold ml-2"
          style={{ color: config.color, background: config.bg, border: `1px solid ${config.border}` }}
        >
          {config.label}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex gap-3.5 mb-3 text-[11px] text-[#888880]">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(m.date)}
        </div>
        <div className="flex items-center gap-1">
          <Ruler className="w-3 h-3" />
          {(m.total_sqft || 0).toFixed(1)} ft²
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {followupCount} follow-up{followupCount !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Next follow-up info */}
      {(status === "quoted" || status === "responded") && (
        <div className="text-[12px] mb-3 px-2.5 py-1.5 rounded-lg bg-[#faf9f7]">
          {nextFollowup ? (
            <span className={overdue ? "text-[#dc3545] font-semibold" : "text-[#888880]"}>
              {overdue ? "⚠ Overdue · " : "Next reminder · "}
              {formatDate(nextFollowup)}
            </span>
          ) : canRecur ? (
            <span className="text-[#aaa]">Initial follow-ups complete</span>
          ) : (
            <span className="text-[#aaa]">No reminders scheduled</span>
          )}
        </div>
      )}

      {/* Status action buttons */}
      <div className="flex gap-1.5 flex-wrap">
        {ACTION_BUTTONS.map(btn => {
          const isActive = status === btn.status;
          return (
            <button
              key={btn.status}
              type="button"
              onClick={() => onStatusChange(m.id, btn.status)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all"
              style={
                isActive
                  ? { background: btn.color, color: "white", border: `1px solid ${btn.color}` }
                  : { background: "transparent", color: btn.color, border: `1px solid ${btn.color}33` }
              }
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Recurring toggle — only shows after 3 initial follow-ups */}
      {(status === "quoted" || status === "responded") && canRecur && (
        <label className="flex items-center gap-2 mt-3 text-[12px] text-[#888880] cursor-pointer">
          <input
            type="checkbox"
            checked={m.recurring_followup || false}
            onChange={e => onRecurringToggle(m.id, e.target.checked)}
            className="w-4 h-4 accent-[#e86c2f] cursor-pointer"
          />
          <Bell className="w-3 h-3" />
          Keep reminding every 15 days
        </label>
      )}
    </div>
  );
}