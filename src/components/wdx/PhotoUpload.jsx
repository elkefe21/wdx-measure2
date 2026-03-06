import React, { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Camera, X, Loader2 } from "lucide-react";

export default function PhotoUpload({ photos, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    const uploaded = [];
    for (const file of Array.from(files)) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      uploaded.push(file_url);
    }
    onChange([...photos, ...uploaded]);
    setUploading(false);
  };

  const removePhoto = (index) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {photos.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#e0dbd4] bg-[#f4f2ee]">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-black/80 transition-all"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full py-4 bg-transparent border-2 border-dashed border-[rgba(232,108,47,0.3)] rounded-[14px] text-[#e86c2f] font-syne text-[14px] font-semibold tracking-wide cursor-pointer hover:border-[#e86c2f] hover:bg-[rgba(232,108,47,0.05)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
        ) : (
          <><Camera className="w-4 h-4" /> {photos.length > 0 ? "Add More Photos" : "Add Site Photos"}</>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  );
}