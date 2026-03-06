import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { RefreshCw, Send } from "lucide-react";
import SectionCard from "@/components/wdx/SectionCard";
import SuccessScreen from "@/components/wdx/SuccessScreen";
import FieldGroup from "@/components/wdx/FieldGroup";
import ToggleGroup from "@/components/wdx/ToggleGroup";
import LineItem from "@/components/wdx/LineItem";
import { GLASS_COLORS, FRAME_COLORS, LOWE_COATINGS } from "@/components/wdx/constants";

const emptyItem = () => ({ mark: "", series: "", config: "", width: "", height: "", qty: "1", notes: "" });

export default function NewMeasurement() {
  const navigate = useNavigate();
  const [draftId, setDraftId] = useState(null);
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(null); // { clientName, totalSqft }
  const saveTimerRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setForm(prev => ({ ...prev, techName: u?.full_name || "" }));
    }).catch(() => {});
  }, []);

  const [form, setForm] = useState({
    permitted: "",
    techName: "",
    date: new Date().toISOString().split("T")[0],
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    address: "",
    city: "",
    zip: "",
    glassColor: "",
    frameColor: "",
    loweCoating: "NONE",
    jobNotes: "",
  });

  const [lineItems, setLineItems] = useState([emptyItem(), emptyItem(), emptyItem()]);

  // Total sqft calculation
  const totalSqft = useMemo(() => {
    return lineItems.reduce((acc, item) => {
      const w = parseFloat(item.width) || 0;
      const h = parseFloat(item.height) || 0;
      const q = parseFloat(item.qty) || 1;
      return acc + (w * h / 144) * q;
    }, 0);
  }, [lineItems]);

  const [editId, setEditId] = useState(null); // ID of submission being edited

  // Load draft or edit target from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const draftParam = params.get("draft");
    const editParam = params.get("edit");
    if (draftParam) {
      loadDraft(draftParam);
    } else if (editParam) {
      loadForEdit(editParam);
    }
  }, []);

  const loadForEdit = async (id) => {
    const measurement = await base44.entities.Measurement.get(id);
    if (!measurement) return;
    setEditId(id);
    setForm({
      permitted: measurement.permitted || "",
      techName: measurement.tech_name || "",
      date: measurement.date || new Date().toISOString().split("T")[0],
      clientName: measurement.client_name || "",
      address: measurement.address || "",
      city: measurement.city || "",
      zip: measurement.zip || "",
      glassColor: measurement.glass_color || "",
      frameColor: measurement.frame_color || "",
      loweCoating: measurement.lowe_coating || "NONE",
      jobNotes: measurement.job_notes || "",
    });
    if (measurement.line_items?.length > 0) {
      setLineItems(measurement.line_items.map(i => ({
        mark: i.mark || "",
        series: i.series || "",
        config: i.config || "",
        width: i.width || "",
        height: i.height || "",
        qty: i.qty || "1",
        notes: i.notes || "",
      })));
    }
    toast.success("Job loaded for editing");
  };

  const loadDraft = async (id) => {
    const drafts = await base44.entities.Draft.list("-updated_date", 1);
    const draft = drafts.find(d => d.id === id) || drafts[0];
    if (!draft?.data || Object.keys(draft.data).length === 0) return;

    setDraftId(draft.id);
    const d = draft.data;
    setForm({
      permitted: d.permitted || "",
      techName: d.techName || "",
      date: d.date || new Date().toISOString().split("T")[0],
      clientName: d.clientName || "",
      address: d.address || "",
      city: d.city || "",
      zip: d.zip || "",
      glassColor: d.glassColor || "",
      frameColor: d.frameColor || "",
      loweCoating: d.loweCoating || "NONE",
      jobNotes: d.jobNotes || "",
    });
    if (d.lineItems?.length > 0) {
      setLineItems(d.lineItems.map(i => ({
        mark: i.mark || "",
        series: i.series || "",
        config: i.config || "",
        width: i.width || "",
        height: i.height || "",
        qty: i.qty || 1,
        notes: i.notes || "",
      })));
    }
    toast.success("Draft restored");
  };

  // Auto-save
  const scheduleSave = useCallback(() => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveDraft(), 5000);
  }, [form, lineItems, draftId]);

  useEffect(() => {
    scheduleSave();
    return () => clearTimeout(saveTimerRef.current);
  }, [form, lineItems]);

  // Save on page hide
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") saveDraft();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [form, lineItems, draftId]);

  const saveDraft = async () => {
    const data = { ...form, lineItems, totalSqft };
    if (draftId) {
      await base44.entities.Draft.update(draftId, { data });
    } else {
      const created = await base44.entities.Draft.create({ data });
      setDraftId(created.id);
    }
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateLineItem = (index, newItem) => {
    setLineItems(prev => prev.map((item, i) => i === index ? newItem : item));
  };

  const removeLineItem = (index) => {
    setLineItems(prev => prev.filter((_, i) => i !== index));
  };

  const addLineItem = () => {
    setLineItems(prev => [...prev, emptyItem()]);
  };

  const validate = () => {
    if (!form.permitted) return "Please select if job is permitted";
    if (!form.techName.trim()) return "Technician name is required";
    if (!form.date) return "Date is required";
    if (!form.clientName.trim()) return "Client name is required";
    if (!form.address.trim()) return "Job site address is required";
    if (!form.city.trim()) return "City is required";
    if (!form.glassColor) return "Glass color is required";
    if (!form.frameColor) return "Frame color is required";
    const filledItems = lineItems.filter(i => i.series);
    if (filledItems.length === 0) return "At least one line item with a series is required";
    return null;
  };

  const handleSend = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setShowConfirm(true);
  };

  const confirmSend = async () => {
    setShowConfirm(false);
    setSending(true);

    try {
      const filledItems = lineItems
        .filter(i => i.series || i.width || i.height)
        .map((item, idx) => {
          const w = parseFloat(item.width) || 0;
          const h = parseFloat(item.height) || 0;
          const q = parseFloat(item.qty) || 1;
          return {
            ...item,
            item: idx + 1,
            sqft: ((w * h / 144) * q).toFixed(2),
          };
        });

      // Save as submission (create or update)
      const measurementData = {
        permitted: form.permitted,
        tech_name: form.techName,
        date: form.date,
        client_name: form.clientName,
        address: form.address,
        city: form.city,
        zip: form.zip,
        glass_color: form.glassColor,
        frame_color: form.frameColor,
        lowe_coating: form.loweCoating,
        job_notes: form.jobNotes,
        line_items: filledItems,
        total_sqft: totalSqft,
        status: "submitted",
      };
      if (editId) {
        await base44.entities.Measurement.update(editId, measurementData);
      } else {
        await base44.entities.Measurement.create(measurementData);
      }

      // Send email + create Monday.com entries
      const submitRes = await base44.functions.invoke('onMeasurementSubmitted', {
        jobInfo: {
          clientName: form.clientName,
          address: form.address,
          city: form.city,
          zip: form.zip,
          techName: form.techName,
          date: form.date,
          permitted: form.permitted,
          glassColor: form.glassColor,
          frameColor: form.frameColor,
          loweCoating: form.loweCoating,
          jobNotes: form.jobNotes,
        },
        lineItems: filledItems,
        totalSqft: totalSqft.toFixed(2),
      });

      if (!submitRes.data?.success) {
        toast.error("Submission failed: " + (submitRes.data?.error || "Unknown error"));
        setSending(false);
        return;
      }

      // Clear draft
      if (draftId) {
        await base44.entities.Draft.delete(draftId);
      }

      setSending(false);
      setSubmitted({ clientName: form.clientName, totalSqft });
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Something went wrong: " + err.message);
      setSending(false);
    }
  };

  const inputClass = "w-full bg-[#faf9f7] border-[1.5px] border-[#ddd] rounded-[10px] text-[#1a1a1a] font-sans text-[15px] py-3 px-3.5 outline-none transition-all focus:border-[#e86c2f] focus:shadow-[0_0_0_3px_rgba(232,108,47,0.1)]";
  const selectClass = `${inputClass} appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2712%27%20height%3D%278%27%20viewBox%3D%270%200%2012%208%27%3E%3Cpath%20d%3D%27M1%201l5%205%205-5%27%20stroke%3D%27%23e86c2f%27%20stroke-width%3D%271.5%27%20fill%3D%27none%27%20stroke-linecap%3D%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_14px_center] pr-9`;

  const resetForm = () => {
    setSubmitted(null);
    setDraftId(null);
    setForm({
      permitted: "", techName: "", date: new Date().toISOString().split("T")[0],
      clientName: "", address: "", city: "", zip: "", glassColor: "",
      frameColor: "", loweCoating: "NONE", jobNotes: "",
    });
    setLineItems([emptyItem(), emptyItem(), emptyItem()]);
  };

  if (submitted) {
    return <SuccessScreen clientName={submitted.clientName} totalSqft={submitted.totalSqft} onNewMeasurement={resetForm} />;
  }

  return (
    <div>
      {/* Header sqft badge */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-syne text-xl font-extrabold text-[#1a1a1a]">{editId ? "Edit Measurement" : "New Measurement"}</h1>
        <div className="bg-[rgba(232,108,47,0.08)] border border-[rgba(232,108,47,0.25)] rounded-[10px] px-3.5 py-2 text-right">
          <div className="font-mono text-[9px] text-[#888880] uppercase tracking-wider">Total SqFt</div>
          <div className="font-syne text-xl font-bold text-[#e86c2f]">
            {totalSqft.toFixed(2)} <span className="text-[11px] text-[#888880]">ft²</span>
          </div>
        </div>
      </div>

      {/* Job Information */}
      <SectionCard title="Job Information">
        <FieldGroup label="Is this job permitted?" required>
          <ToggleGroup
            value={form.permitted}
            onChange={v => updateForm("permitted", v)}
            options={[{ value: "Yes", label: "✓ Yes" }, { value: "No", label: "✗ No" }]}
          />
        </FieldGroup>

        <div className="grid grid-cols-2 gap-2.5">
          <FieldGroup label="Technician Name" required>
            <input type="text" value={form.techName} readOnly className={`${inputClass} opacity-70 cursor-default`} />
          </FieldGroup>
          <FieldGroup label="Date" required>
            <input type="date" value={form.date} onChange={e => updateForm("date", e.target.value)} className={inputClass} />
          </FieldGroup>
        </div>

        <FieldGroup label="Client Name" required>
          <input type="text" value={form.clientName} onChange={e => updateForm("clientName", e.target.value)} placeholder="Client / homeowner name" className={inputClass} />
        </FieldGroup>

        <FieldGroup label="Job Site Address" required>
          <input type="text" value={form.address} onChange={e => updateForm("address", e.target.value)} placeholder="Street address" className={inputClass} />
        </FieldGroup>

        <div className="grid grid-cols-2 gap-2.5">
          <FieldGroup label="City" required>
            <input type="text" value={form.city} onChange={e => updateForm("city", e.target.value)} placeholder="City" className={inputClass} />
          </FieldGroup>
          <FieldGroup label="Zip Code">
            <input type="text" value={form.zip} onChange={e => updateForm("zip", e.target.value)} placeholder="33101" inputMode="numeric" className={inputClass} />
          </FieldGroup>
        </div>
      </SectionCard>

      {/* Product Specifications */}
      <SectionCard title="Product Specifications">
        <div className="grid grid-cols-2 gap-2.5">
          <FieldGroup label="Glass Color" required>
            <select value={form.glassColor} onChange={e => updateForm("glassColor", e.target.value)} className={selectClass}>
              <option value="">Select...</option>
              {GLASS_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FieldGroup>
          <FieldGroup label="Frame Color" required>
            <select value={form.frameColor} onChange={e => updateForm("frameColor", e.target.value)} className={selectClass}>
              <option value="">Select...</option>
              {FRAME_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FieldGroup>
        </div>

        <FieldGroup label="Low-E Coating">
          <select value={form.loweCoating} onChange={e => updateForm("loweCoating", e.target.value)} className={selectClass}>
            {LOWE_COATINGS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </FieldGroup>

        <FieldGroup label="Job Notes">
          <textarea
            value={form.jobNotes}
            onChange={e => updateForm("jobNotes", e.target.value)}
            placeholder="Special instructions, access info, conditions..."
            className={`${inputClass} resize-y min-h-[80px]`}
          />
        </FieldGroup>
      </SectionCard>

      {/* Line Items */}
      <SectionCard title="Line Items">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[12px] text-[#888880] bg-[rgba(232,108,47,0.1)] border border-[rgba(232,108,47,0.25)] px-2.5 py-1 rounded-full">
            {lineItems.length} item{lineItems.length !== 1 ? "s" : ""}
          </span>
        </div>

        {lineItems.map((item, idx) => (
          <LineItem
            key={idx}
            item={item}
            index={idx}
            onChange={updateLineItem}
            onRemove={removeLineItem}
          />
        ))}

        <button
          onClick={addLineItem}
          className="w-full py-3.5 bg-transparent border-2 border-dashed border-[rgba(232,108,47,0.3)] rounded-[14px] text-[#e86c2f] font-syne text-[14px] font-semibold tracking-wide cursor-pointer hover:border-[#e86c2f] hover:bg-[rgba(232,108,47,0.1)] transition-all mt-1"
        >
          + Add Line Item
        </button>
      </SectionCard>

      {/* Sqft Summary */}
      <div className="bg-gradient-to-br from-[rgba(232,108,47,0.08)] to-[rgba(232,108,47,0.03)] border border-[#e86c2f] rounded-2xl p-5 mb-4 flex items-center justify-between">
        <div>
          <div className="font-syne text-[13px] font-bold text-[#888880] uppercase tracking-wider">Total Square Footage</div>
          <div>
            <span className="font-syne text-[32px] font-extrabold text-[#e86c2f]">{totalSqft.toFixed(2)}</span>
            <span className="text-[14px] text-[#888880] ml-1">ft²</span>
          </div>
        </div>
        <button
          onClick={() => setLineItems([...lineItems])}
          className="bg-[#e86c2f] text-white border-none rounded-[10px] px-4 py-2.5 font-syne text-[12px] font-bold cursor-pointer hover:bg-[#c9561f] transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Recalculate
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/[0.97] border-t border-[#e8e4de] p-4 pb-[calc(16px+env(safe-area-inset-bottom))] backdrop-blur-2xl z-50 flex gap-3 max-w-[640px] mx-auto">
        <button
          onClick={handleSend}
          className="flex-1 py-4 bg-[#e86c2f] border-none rounded-xl text-white font-syne text-[15px] font-extrabold cursor-pointer hover:bg-[#c9561f] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Send to WDX →
        </button>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300] flex items-center justify-center p-5">
          <div className="bg-white border border-[#e8e4de] rounded-[20px] p-7 w-full max-w-[420px]">
            <h2 className="font-syne text-xl font-extrabold mb-2">Send Measurements</h2>
            <p className="text-[14px] text-[#888880] mb-4 leading-relaxed">
              {editId ? "This will update the existing job and resend the measurement sheet to " : "This will email the measurement sheet to "}
              <strong className="text-[#e86c2f]">alex@wdximpact.com</strong>. Make sure all required fields are filled.
            </p>
            <div className="font-mono text-[12px] text-[#e8a020] mb-4 p-3 bg-[rgba(240,165,0,0.08)] rounded-[10px] border border-[rgba(240,165,0,0.2)]">
              <div>Client: <strong>{form.clientName}</strong></div>
              <div>Address: {form.address}, {form.city}</div>
              <div>Items: {lineItems.filter(i => i.series).length} | Total: {totalSqft.toFixed(2)} ft²</div>
              <div>Glass: {form.glassColor} | Frame: {form.frameColor}</div>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-4 bg-transparent border border-[rgba(232,108,47,0.25)] rounded-xl text-[#e86c2f] font-syne text-[14px] font-bold cursor-pointer hover:bg-[rgba(232,108,47,0.1)] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmSend}
                className="flex-[2] py-4 bg-[#e86c2f] border-none rounded-xl text-white font-syne text-[15px] font-extrabold cursor-pointer hover:bg-[#c9561f] transition-all"
              >
                {editId ? "Update & Resend →" : "Send Now →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sending overlay */}
      {sending && (
        <div className="fixed inset-0 bg-white/95 z-[400] flex flex-col items-center justify-center gap-5">
          <div className="w-12 h-12 border-3 border-[rgba(232,108,47,0.25)] border-t-[#e86c2f] rounded-full animate-spin" />
          <div className="font-syne text-base font-bold text-[#e86c2f]">Sending to WDX...</div>
        </div>
      )}
    </div>
  );
}