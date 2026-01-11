"use client";

import React, { useState } from "react";
import { X, Save, Loader2, ImageIcon, Trash2 } from "lucide-react";

interface ServiceCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function ServiceCreateModal({ isOpen, onClose, onSave }: ServiceCreateModalProps) {
  const [formData, setFormData] = useState<any>({
    name: { mn: "", en: "" },
    title: { mn: "", en: "" },
    type: "teaching",
    price: 0,
    duration: "30 min",
    desc: { mn: "", en: "" },
    subtitle: { mn: "", en: "" },
    image: "",
    quote: { mn: "", en: "" }
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "content">("basic");

  if (!isOpen) return null;

  const handleChange = (field: string, value: any, nestedField?: string) => {
    if (nestedField) {
      setFormData((prev: any) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [nestedField]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      alert("Cloudinary configuration missing");
      setUploadingImage(false);
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: data });
      if (!res.ok) throw new Error("Image upload failed");
      const fileData = await res.json();
      setFormData((prev: any) => ({ ...prev, image: fileData.secure_url }));
    } catch (error: any) {
      console.error(error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => setFormData((prev: any) => ({ ...prev, image: "" }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
      // Reset form roughly
      setFormData({
        name: { mn: "", en: "" },
        title: { mn: "", en: "" },
        type: "teaching",
        price: 0,
        duration: "30 min",
        desc: { mn: "", en: "" },
        subtitle: { mn: "", en: "" },
        image: "",
        quote: { mn: "", en: "" }
      });
    } catch (error) {
      console.error("Failed to save service", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0C164F] w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
          <div>
             <h2 className="text-xl font-black font-serif text-amber-900 dark:text-amber-100">Үйлчилгээ нэмэх</h2>
             <p className="text-xs opacity-60">Шинэ үйлчилгээ бүртгэх</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-white/10 px-6">
            {["basic", "details", "content"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                        activeTab === tab 
                        ? "border-amber-500 text-amber-600 dark:text-amber-400" 
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                >
                    {{ basic: "Үндсэн", details: "Нарийвчлал", content: "Агуулга" }[tab]}
                </button>
            ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <form id="service-create-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* BASIC INFO */}
            {activeTab === "basic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Нэр (MN)" value={formData.name?.mn} onChange={(v:string) => handleChange("name", v, "mn")} required />
                    <InputGroup label="Name (EN)" value={formData.name?.en} onChange={(v:string) => handleChange("name", v, "en")} required />
                    
                    <InputGroup label="Гарчиг (MN)" value={formData.title?.mn} onChange={(v:string) => handleChange("title", v, "mn")} />
                    <InputGroup label="Title (EN)" value={formData.title?.en} onChange={(v:string) => handleChange("title", v, "en")} />

                    <div className="col-span-full">
                        <label className="text-xs font-bold uppercase opacity-70 block mb-1">Зураг (Image)</label>
                        {formData.image ? (
                            <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-amber-500 group">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><Trash2 size={16} /></button>
                            </div>
                        ) : (
                            <div className="relative w-full h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 flex flex-col items-center justify-center hover:border-amber-500 transition-colors">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploadingImage} />
                                {uploadingImage ? <Loader2 className="animate-spin text-amber-500" /> : (
                                    <div className="text-center opacity-50">
                                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                                        <p className="text-xs font-bold">Зураг оруулах (Click to upload)</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* DETAILS */}
            {activeTab === "details" && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase opacity-70 block">Төрөл</label>
                        <select 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 transition-colors"
                            value={formData.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                        >
                            <option value="teaching">Teaching (Сургаал)</option>
                            <option value="divination">Divination (Мэрэг)</option>
                            <option value="ritual">Ritual (Засал)</option>
                        </select>
                    </div>

                    <InputGroup label="Үнэ (₮)" type="number" value={formData.price} onChange={(v:string) => handleChange("price", parseFloat(v) || 0)} required />
                    <InputGroup label="Хугацаа (Duration)" value={formData.duration} onChange={(v:string) => handleChange("duration", v)} />
                 </div>
            )}

            {/* CONTENT */}
            {activeTab === "content" && (
                <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Тайлбар (MN)" value={formData.desc?.mn} onChange={(v:string) => handleChange("desc", v, "mn")} textarea rows={4} />
                        <InputGroup label="Description (EN)" value={formData.desc?.en} onChange={(v:string) => handleChange("desc", v, "en")} textarea rows={4} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Дэд гарчиг (MN)" value={formData.subtitle?.mn} onChange={(v:string) => handleChange("subtitle", v, "mn")} />
                        <InputGroup label="Subtitle (EN)" value={formData.subtitle?.en} onChange={(v:string) => handleChange("subtitle", v, "en")} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Ишлэл (MN)" value={formData.quote?.mn} onChange={(v:string) => handleChange("quote", v, "mn")} textarea />
                        <InputGroup label="Quote (EN)" value={formData.quote?.en} onChange={(v:string) => handleChange("quote", v, "en")} textarea />
                    </div>
                </div>
            )}

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3 bg-gray-50/50 dark:bg-white/5">
            <button 
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-bold text-xs uppercase bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-white/60 hover:opacity-80 transition-opacity"
            >
                Болих
            </button>
            <button 
                type="submit" 
                form="service-create-form"
                disabled={loading || uploadingImage}
                className="px-6 py-3 rounded-xl font-bold text-xs uppercase bg-amber-500 text-white shadow-lg shadow-amber-900/20 hover:bg-amber-600 transition-all flex items-center gap-2 disabled:opacity-50"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Хадгалах
            </button>
        </div>

      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, type = "text", textarea = false, rows = 3, required = false }: any) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-bold uppercase opacity-70 block">{label} {required && <span className="text-red-500">*</span>}</label>
            {textarea ? (
                <textarea 
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 transition-colors"
                    rows={rows}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                />
            ) : (
                <input 
                    type={type}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 transition-colors"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                />
            )}
        </div>
    )
}