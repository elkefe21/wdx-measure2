import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Plus, Zap, Clock, WifiOff, Search } from "lucide-react";
import SubmissionCard from "@/components/wdx/SubmissionCard";
import SubmissionDetail from "@/components/wdx/SubmissionDetail";

export default function Home() {
  const [user, setUser] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  const { data: drafts = [], isLoading: draftsLoading, isError: draftsError } = useQuery({
    queryKey: ["drafts", user?.id],
    queryFn: () => base44.entities.Draft.list("-updated_date", 1).then(r => Array.isArray(r) ? r : []),
    enabled: !!user,
  });

  const { data: submissions = [], isLoading: subsLoading, isError: subsError } = useQuery({
    queryKey: ["submissions", user?.id],
    queryFn: () => base44.entities.Measurement.list("-created_date", 50).then(r => Array.isArray(r) ? r : []),
    enabled: !!user,
  });

  const draft = drafts[0];
  const draftData = draft?.data;

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "";
    const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    return `${greet}${name ? ", " + name : ""}`;
  };

  const handleDiscardDraft = async () => {
    if (!confirm("Discard this draft? This cannot be undone.")) return;
    await base44.entities.Draft.delete(draft.id);
    window.location.reload();
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div>
      <h1 className="font-syne text-2xl font-extrabold text-[#1a1a1a] mb-1">{getGreeting()}</h1>
      <p className="text-[14px] text-[#888880] mb-7">Ready to measure?</p>

      <Link
        to={createPageUrl("NewMeasurement")}
        className="flex items-center justify-center gap-2.5 w-full py-[18px] bg-gradient-to-br from-[#e86c2f] to-[#d05a20] rounded-2xl text-white font-syne text-base font-extrabold tracking-wide shadow-[0_4px_20px_rgba(232,108,47,0.35)] hover:translate-y-[-2px] hover:shadow-[0_8px_28px_rgba(232,108,47,0.40)] active:translate-y-0 transition-all no-underline mb-6"
      >
        <Plus className="w-5 h-5" />
        New Measurement
      </Link>

      <div className="font-syne text-[11px] font-bold text-[#e86c2f] uppercase tracking-[0.18em] mb-3.5 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[rgba(232,108,47,0.25)]">
        Saved Draft
      </div>

      {draftsLoading ? (
        <div className="text-center py-10">
          <div className="w-8 h-8 border-3 border-[#e8e4de] border-t-[#e86c2f] rounded-full animate-spin mx-auto mb-3" />
          <div className="text-[13px] text-[#aaa]">Loading...</div>
        </div>
      ) : draftsError ? (
        <div className="bg-white border border-[#e8e4de] rounded-2xl p-5 mb-6 flex items-center gap-3 text-[#888880]">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span className="text-[13px]">Couldn't load draft — check your connection.</span>
        </div>
      ) : draftData && Object.keys(draftData).length > 0 ? (
        <div className="bg-white border-2 border-[#e86c2f] rounded-2xl p-5 mb-6 shadow-[0_2px_12px_rgba(232,108,47,0.1)]">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium text-[#e86c2f] bg-[rgba(232,108,47,0.1)] rounded-md px-2 py-1 mb-3 uppercase tracking-wide">
            <Zap className="w-3 h-3" /> Draft in progress
          </div>
          <div className="font-syne text-[17px] font-extrabold text-[#1a1a1a] mb-1">
            {draftData.clientName || "Unnamed client"}
          </div>
          <div className="text-[13px] text-[#888880] mb-4">
            {[draftData.address, draftData.city].filter(Boolean).join(", ") || "No address entered"}
          </div>
          <div className="flex gap-4 mb-4">
            <div>
              <div className="font-mono text-[18px] font-medium text-[#1a1a1a]">
                {(draftData.lineItems || []).filter(i => i.series).length}
              </div>
              <div className="text-[11px] text-[#888880] uppercase tracking-wide">Items</div>
            </div>
            <div>
              <div className="font-mono text-[18px] font-medium text-[#1a1a1a]">
                {(draftData.totalSqft || 0).toFixed(1)}
              </div>
              <div className="text-[11px] text-[#888880] uppercase tracking-wide">ft²</div>
            </div>
            <div>
              <div className="font-mono text-[18px] font-medium text-[#1a1a1a] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#888880]" />
                {formatTime(draft.updated_date)}
              </div>
              <div className="text-[11px] text-[#888880] uppercase tracking-wide">Saved</div>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Link
              to={createPageUrl("NewMeasurement") + "?draft=" + draft.id}
              className="flex-[2] py-3.5 bg-[#e86c2f] rounded-[10px] text-white font-syne text-[14px] font-extrabold text-center hover:bg-[#d05a20] transition-all no-underline cursor-pointer"
            >
              Resume Draft →
            </Link>
            <button
              onClick={handleDiscardDraft}
              className="flex-1 py-3.5 bg-transparent border-[1.5px] border-[#e0dbd4] rounded-[10px] text-[#888880] font-sans text-[14px] cursor-pointer hover:border-[#dc3545] hover:text-[#dc3545] transition-all"
            >
              Discard
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#e8e4de] rounded-2xl p-6 text-center mb-6">
          <div className="text-[32px] mb-2.5">📋</div>
          <div className="text-[14px] text-[#888880]">No active draft — start a new measurement above</div>
        </div>
      )}

      <div className="font-syne text-[11px] font-bold text-[#e86c2f] uppercase tracking-[0.18em] mb-3.5 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[rgba(232,108,47,0.25)]">
        Submitted Jobs
      </div>

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

      {subsLoading ? (
        <div className="text-center py-10">
          <div className="w-8 h-8 border-3 border-[#e8e4de] border-t-[#e86c2f] rounded-full animate-spin mx-auto mb-3" />
          <div className="text-[13px] text-[#aaa]">Loading history...</div>
        </div>
      ) : subsError ? (
        <div className="bg-white border border-[#e8e4de] rounded-2xl p-6 flex items-center gap-3 text-[#888880]">
          <WifiOff className="w-5 h-5 shrink-0" />
          <div>
            <div className="text-[14px] font-medium text-[#1a1a1a]">Couldn't load jobs</div>
            <div className="text-[13px]">Check your connection and pull to refresh.</div>
          </div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-[36px] mb-2.5">📭</div>
          <div className="text-[14px] text-[#aaa]">No submitted jobs yet</div>
        </div>
      ) : (
        (() => {
          const q = search.trim().toLowerCase();
          const filtered = q
            ? submissions.filter(s =>
                s.client_name?.toLowerCase().includes(q) ||
                s.address?.toLowerCase().includes(q) ||
                s.city?.toLowerCase().includes(q)
              )
            : submissions;
          return filtered.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-[32px] mb-2.5">🔍</div>
              <div className="text-[14px] text-[#aaa]">No jobs match "{search}"</div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {filtered.map(sub => (
                <SubmissionCard
                  key={sub.id}
                  submission={sub}
                  onClick={() => setSelectedSubmission(sub)}
                />
              ))}
            </div>
          );
        })()
      )}

      {selectedSubmission && (
        <SubmissionDetail
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
}