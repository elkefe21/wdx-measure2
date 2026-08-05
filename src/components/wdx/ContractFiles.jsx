import React, { useRef, useState } from "react";
import { FileText, Upload, Trash2, Loader2 } from "lucide-react";

export default function ContractFiles({ files, isAdmin, onUpload, onDelete }) {
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-[#f0ede8]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-[#888880] uppercase tracking-wider font-semibold">
          Contracts & Files
        </span>
        {isAdmin && (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1 text-[11px] text-[#e86c2f] font-semibold cursor-pointer disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
            {uploading ? "Uploading…" : "Upload"}
          </button>
        )}
        <input
          ref={fileInput}
          type="file"
          onChange={handleSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.xlsx,.csv"
        />
      </div>
      {!files || files.length === 0 ? (
        <div className="text-[12px] text-[#aaa]">No files uploaded</div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {files.map((url) => {
            const name = decodeURIComponent(url.split("/").pop().split("?")[0]);
            return (
              <div key={url} className="flex items-center gap-2 bg-[#faf9f7] rounded-lg px-2.5 py-1.5">
                <FileText className="w-3.5 h-3.5 text-[#888880] shrink-0" />
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] text-[#3b82f6] truncate flex-1 hover:underline"
                >
                  {name}
                </a>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => onDelete(url)}
                    className="text-[#dc3545] hover:opacity-70 shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}