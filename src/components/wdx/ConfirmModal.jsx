import React from "react";

export default function ConfirmModal({ emoji = "❓", title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel, loading = false, destructive = false }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300] flex items-center justify-center p-5">
      <div className="bg-white border border-[#e8e4de] rounded-[20px] p-7 w-full max-w-[380px]">
        {emoji && <div className="text-[30px] mb-3 text-center">{emoji}</div>}
        <h2 className="font-syne text-[18px] font-extrabold mb-2 text-center">{title}</h2>
        <p className="text-[13px] text-[#888880] mb-5 text-center leading-relaxed">{message}</p>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3.5 bg-transparent border border-[#e0dbd4] rounded-xl text-[#888880] font-syne text-[14px] font-bold cursor-pointer hover:border-[#e86c2f] hover:text-[#e86c2f] transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-[2] py-3.5 border-none rounded-xl text-white font-syne text-[14px] font-extrabold cursor-pointer transition-all disabled:opacity-60 ${
              destructive
                ? "bg-[#dc3545] hover:bg-[#b02a37]"
                : "bg-[#e86c2f] hover:bg-[#c9561f]"
            }`}
          >
            {loading ? "Loading..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}