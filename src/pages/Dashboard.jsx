import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, BarChart3 } from "lucide-react";
import StatCard from "@/components/wdx/StatCard";
import ClientCard from "@/components/wdx/ClientCard";

const STATUS_FILTERS = [
  { key: "all",       label: "All" },
  { key: "quoted",    label: "Pending" },
  { key: "responded", label: "Responded" },
  { key: "accepted",  label: "Accepted" },
  { key: "declined",  label: "Declined" },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  const { data: measurements = [], isLoading } = useQuery({
    queryKey: ["crm-measurements", user?.id],
    queryFn: () =>
      base44.entities.Measurement.list("-created_date", 200).then(r =>
        Array.isArray(r) ? r : []
      ),
    enabled: !!user,
  });

  const stats = {
    total: measurements.length,
    quoted: measurements.filter(m => (m.crm_status || "quoted") === "quoted").length,
    responded: measurements.filter(m => m.crm_status === "responded").length,
    accepted: measurements.filter(m => m.crm_status === "accepted").length,
    declined: measurements.filter(m => m.crm_status === "declined").length,
  };
  const decided = stats.accepted + stats.declined;
  const winRate = decided > 0 ? Math.round((stats.accepted / decided) * 100) : 0;

  const filtered = measurements.filter(m => {
    const statusMatch = filter === "all" || (m.crm_status || "quoted") === filter;
    const q = search.trim().toLowerCase();
    const searchMatch =
      !q ||
      m.client_name?.toLowerCase().includes(q) ||
      m.address?.toLowerCase().includes(q) ||
      m.city?.toLowerCase().includes(q);
    return statusMatch && searchMatch;
  });

  const handleStatusChange = async (id, newStatus) => {
    const update = { crm_status: newStatus };
    if (newStatus === "accepted" || newStatus === "declined") {
      update.next_followup_date = null;
    }
    await base44.entities.Measurement.update(id, update);
    queryClient.invalidateQueries({ queryKey: ["crm-measurements"] });
  };

  const handleRecurringToggle = async (id, value) => {
    const m = measurements.find(x => x.id === id);
    const update = { recurring_followup: value };
    // Re-activate reminders if toggled on and none scheduled
    if (value && !m.next_followup_date) {
      const created = new Date(m.created_date);
      const next = new Date(created.getTime() + (30 + (m.followup_count - 2) * 15) * 86400000);
      if (next > new Date()) {
        update.next_followup_date = next.toISOString().split("T")[0];
      }
    }
    await base44.entities.Measurement.update(id, update);
    queryClient.invalidateQueries({ queryKey: ["crm-measurements"] });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <BarChart3 className="w-6 h-6 text-[#e86c2f]" />
        <h1 className="font-syne text-2xl font-extrabold text-[#1a1a1a]">CRM Dashboard</h1>
      </div>
      <p className="text-[14px] text-[#888880] mb-6">
        Track client follow-ups, responses, and win rates
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <StatCard label="Total" value={stats.total} color="#1a1a1a" />
        <StatCard label="Pending" value={stats.quoted} color="#e8a020" />
        <StatCard label="Responded" value={stats.responded} color="#3b82f6" />
        <StatCard label="Accepted" value={stats.accepted} color="#22c55e" />
        <StatCard label="Declined" value={stats.declined} color="#dc3545" />
        <StatCard label="Win Rate" value={`${winRate}%`} color="#e86c2f" />
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa] pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by client or address…"
          className="w-full bg-white border border-[#e8e4de] rounded-[10px] pl-10 pr-4 py-3 text-[14px] text-[#1a1a1a] placeholder-[#aaa] outline-none focus:border-[#e86c2f] focus:shadow-[0_0_0_3px_rgba(232,108,47,0.1)] transition-all"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {STATUS_FILTERS.map(f => {
          const count =
            f.key === "all"
              ? stats.total
              : stats[f.key] + (f.key === "quoted" ? 0 : 0);
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`shrink-0 px-3.5 py-2 rounded-lg text-[12px] font-semibold cursor-pointer transition-all no-underline ${
                isActive
                  ? "bg-[#e86c2f] text-white border border-[#e86c2f]"
                  : "bg-white text-[#888880] border border-[#e8e4de] hover:border-[#e86c2f] hover:text-[#e86c2f]"
              }`}
            >
              {f.label} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Client list */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="w-8 h-8 border-3 border-[#e8e4de] border-t-[#e86c2f] rounded-full animate-spin mx-auto mb-3" />
          <div className="text-[13px] text-[#aaa]">Loading clients…</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-[36px] mb-2.5">📊</div>
          <div className="text-[14px] text-[#aaa]">
            {measurements.length === 0
              ? "No clients yet — submit a measurement to start tracking"
              : "No clients match your filters"}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map(m => (
            <ClientCard
              key={m.id}
              measurement={m}
              onStatusChange={handleStatusChange}
              onRecurringToggle={handleRecurringToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}