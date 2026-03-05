import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Home, Ruler, LogOut, Menu, X } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u) {
        base44.auth.redirectToLogin();
        return;
      }
      setUser(u);
      setAuthChecked(true);
    }).catch(() => {
      base44.auth.redirectToLogin();
    });
  }, []);

  // Block ALL page rendering until auth is confirmed
  if (!authChecked) {
    return (
      <div className="fixed inset-0 bg-[#f4f2ee] flex flex-col items-center justify-center gap-4">
        <div style={{ width: 44, height: 44, border: "3px solid rgba(232,108,47,0.2)", borderTopColor: "#e86c2f", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, color: "#e86c2f", letterSpacing: "0.05em" }}>
          Loading WDX...
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Home", icon: Home, page: "Home" },
    { name: "New Measurement", icon: Ruler, page: "NewMeasurement" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      <style>{`
        body { font-family: 'DM Sans', sans-serif; }
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-mono { font-family: 'DM Mono', monospace; }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-[#e8e4de] px-5 py-4 flex items-center justify-between sticky top-0 z-50 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
        <Link to={createPageUrl("Home")} className="flex flex-col no-underline">
          <span className="font-syne text-lg font-extrabold text-[#e86c2f] tracking-wider">WDX IMPACT</span>
          <span className="font-mono text-[10px] text-[#888880] tracking-[0.15em] uppercase">Field Measurements</span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <span className="font-mono text-[13px] text-[#888880] hidden sm:inline">
              {user.full_name?.split(' ')[0] || user.email?.split('@')[0]}
            </span>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-lg border border-[#e0dbd4] bg-[#f4f2ee] text-[#888880] hover:text-[#e86c2f] hover:border-[#e86c2f] transition-all"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <nav className="hidden sm:flex items-center gap-2">
            {navItems.map(item => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all no-underline ${
                  currentPageName === item.page
                    ? "bg-[rgba(232,108,47,0.1)] text-[#e86c2f] border border-[rgba(232,108,47,0.25)]"
                    : "text-[#888880] hover:text-[#e86c2f] hover:bg-[rgba(232,108,47,0.05)]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => base44.auth.logout(window.location.href)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#888880] border border-[#e0dbd4] bg-[#f4f2ee] hover:text-[#e86c2f] hover:border-[#e86c2f] transition-all cursor-pointer font-sans"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-b border-[#e8e4de] px-5 py-3 flex flex-col gap-2 shadow-sm">
          {navItems.map(item => (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium no-underline ${
                currentPageName === item.page
                  ? "bg-[rgba(232,108,47,0.1)] text-[#e86c2f]"
                  : "text-[#888880]"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => base44.auth.logout(window.location.href)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#888880] hover:text-[#e86c2f] transition-all cursor-pointer font-sans text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}

      <main className="max-w-[640px] mx-auto px-4 py-5 pb-32">
        {children}
      </main>
    </div>
  );
}