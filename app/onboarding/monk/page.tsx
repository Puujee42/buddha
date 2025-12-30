"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, Loader2, Upload, ImageIcon, X } from "lucide-react";

// --- THE INTERFACE ---
export interface Monk {
  name: { mn: string; en: string };
  title: { mn: string; en: string };
  image: string;
  video?: string;
  specialties: string[];
  bio: { mn: string; en: string };
  isAvailable: boolean;
  quote: { mn: string; en: string };
  yearsOfExperience: number;
  education: { mn: string; en: string };
  philosophy: { mn: string; en: string };
  services: {
    id: string;
    name: { mn: string; en: string };
    price: number;
    duration: string;
  }[];
}

export default function MonkOnboarding() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); // New state for image upload

  // --- FORM STATE ---
  const [formData, setFormData] = useState<Monk>({
    name: { mn: "", en: "" },
    title: { mn: "", en: "" },
    image: "",
    video: "",
    specialties: [],
    bio: { mn: "", en: "" },
    isAvailable: true,
    quote: { mn: "", en: "" },
    yearsOfExperience: 0,
    education: { mn: "", en: "" },
    philosophy: { mn: "", en: "" },
    services: [],
  });

  // --- CLOUDINARY UPLOAD HANDLER ---
  // --- CLOUDINARY UPLOAD HANDLER ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary configuration missing in .env");
      setUploadingImage(false);
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Cloudinary Error:", errorData); // <--- Check Console for this!
        throw new Error(errorData.error?.message || "Image upload failed");
      }

      const fileData = await res.json();
      setFormData((prev) => ({ ...prev, image: fileData.secure_url }));
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  // --- HELPERS ---
  const handleInputChange = (
    section: keyof Monk,
    subField: string | null,
    value: any
  ) => {
    setFormData((prev) => {
      if (subField && typeof prev[section] === "object" && prev[section] !== null) {
        return {
          ...prev,
          [section]: {
            ...(prev[section] as object),
            [subField]: value,
          },
        };
      }
      return { ...prev, [section]: value };
    });
  };

  const handleSpecialtyAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      e.preventDefault();
      const val = e.currentTarget.value.trim();
      if (!formData.specialties.includes(val)) {
        setFormData((prev) => ({
          ...prev,
          specialties: [...prev.specialties, val],
        }));
      }
      e.currentTarget.value = "";
    }
  };

  const removeSpecialty = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== item),
    }));
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { id: crypto.randomUUID(), name: { mn: "", en: "" }, price: 0, duration: "30 min" },
      ],
    }));
  };

  const updateService = (id: string, field: string, subField: string | null, value: any) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((svc) => {
        if (svc.id !== id) return svc;
        if (subField) {
           // @ts-ignore
          return { ...svc, [field]: { ...svc[field], [subField]: value } };
        }
        return { ...svc, [field]: value };
      }),
    }));
  };

  const removeService = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!formData.image) {
        alert("Please upload a profile image.");
        return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
      };

      const res = await fetch('/api/monks', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
      });

      if (!res.ok) throw new Error("Failed to save profile");
      
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] p-6 md:p-12 font-serif text-[#451a03]">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-[#D97706]">Monk Profile Setup</h1>
          <p className="text-[#78350F]/70">Complete your profile to begin guiding students.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white/60 p-8 rounded-[2rem] border border-[#D97706]/10 shadow-xl">
          
          {/* 1. Basic Info */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold border-b border-[#D97706]/20 pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                 placeholder="Name (Mongolian)" 
                 className="p-3 rounded-xl bg-white border border-[#D97706]/20 focus:outline-[#D97706]"
                 value={formData.name.mn} onChange={(e) => handleInputChange("name", "mn", e.target.value)} required
              />
              <input 
                 placeholder="Name (English)" 
                 className="p-3 rounded-xl bg-white border border-[#D97706]/20 focus:outline-[#D97706]"
                 value={formData.name.en} onChange={(e) => handleInputChange("name", "en", e.target.value)} required
              />
              <input 
                 placeholder="Title (MN) - e.g. Gavj" 
                 className="p-3 rounded-xl bg-white border border-[#D97706]/20 focus:outline-[#D97706]"
                 value={formData.title.mn} onChange={(e) => handleInputChange("title", "mn", e.target.value)}
              />
              <input 
                 placeholder="Title (EN) - e.g. Master" 
                 className="p-3 rounded-xl bg-white border border-[#D97706]/20 focus:outline-[#D97706]"
                 value={formData.title.en} onChange={(e) => handleInputChange("title", "en", e.target.value)}
              />
            </div>
          </section>

          {/* 2. Media (UPDATED WITH CLOUDINARY) */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold border-b border-[#D97706]/20 pb-2">Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Image Upload Area */}
              <div className="relative">
                <label className="block text-xs font-bold text-[#D97706] mb-2 uppercase">Profile Picture</label>
                
                {formData.image ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-[#D97706] group">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                type="button" 
                                onClick={removeImage} 
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full h-40 rounded-xl border-2 border-dashed border-[#D97706]/40 bg-white hover:bg-[#FFFBEB] transition-colors flex flex-col items-center justify-center cursor-pointer">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={uploadingImage}
                        />
                        {uploadingImage ? (
                            <Loader2 className="animate-spin text-[#D97706]" size={30} />
                        ) : (
                            <>
                                <ImageIcon className="text-[#D97706]/60 mb-2" size={30} />
                                <span className="text-xs text-[#D97706] font-bold uppercase tracking-widest">Click to Upload</span>
                            </>
                        )}
                    </div>
                )}
              </div>

              {/* Video URL (Kept as text input) */}
              <div>
                <label className="block text-xs font-bold text-[#D97706] mb-2 uppercase">Intro Video URL (Optional)</label>
                <input 
                    placeholder="e.g. YouTube or Vimeo link" 
                    className="w-full p-3 rounded-xl bg-white border border-[#D97706]/20 focus:outline-[#D97706]"
                    value={formData.video} onChange={(e) => handleInputChange("video", null, e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* 3. Details */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold border-b border-[#D97706]/20 pb-2">Details</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <textarea 
                 placeholder="Biography (Mongolian)" rows={3}
                 className="p-3 rounded-xl bg-white border border-[#D97706]/20 focus:outline-[#D97706]"
                 value={formData.bio.mn} onChange={(e) => handleInputChange("bio", "mn", e.target.value)}
              />
              <textarea 
                 placeholder="Biography (English)" rows={3}
                 className="p-3 rounded-xl bg-white border border-[#D97706]/20 focus:outline-[#D97706]"
                 value={formData.bio.en} onChange={(e) => handleInputChange("bio", "en", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-bold uppercase text-[#D97706] mb-1 block">Years of Experience</label>
                  <input 
                    type="number"
                    className="w-full p-3 rounded-xl bg-white border border-[#D97706]/20 focus:outline-[#D97706]"
                    value={formData.yearsOfExperience} onChange={(e) => handleInputChange("yearsOfExperience", null, parseInt(e.target.value))}
                  />
               </div>
               <div>
                  <label className="text-xs font-bold uppercase text-[#D97706] mb-1 block">Specialties (Press Enter)</label>
                  <input 
                    onKeyDown={handleSpecialtyAdd}
                    className="w-full p-3 rounded-xl bg-white border border-[#D97706]/20 focus:outline-[#D97706]"
                    placeholder="Type and hit Enter..."
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specialties.map(s => (
                      <span key={s} className="bg-[#D97706]/10 text-[#D97706] px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        {s} <button type="button" onClick={() => removeSpecialty(s)}><Trash2 size={12}/></button>
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          </section>

          {/* 4. Education & Philosophy */}
          <section className="space-y-4">
             <h3 className="text-xl font-bold border-b border-[#D97706]/20 pb-2">Wisdom</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea 
                   placeholder="Education (MN)"
                   className="p-3 rounded-xl bg-white border border-[#D97706]/20 focus:outline-[#D97706]"
                   value={formData.education.mn} onChange={(e) => handleInputChange("education", "mn", e.target.value)}
                />
                <textarea 
                   placeholder="Education (EN)"
                   className="p-3 rounded-xl bg-white border border-[#D97706]/20 focus:outline-[#D97706]"
                   value={formData.education.en} onChange={(e) => handleInputChange("education", "en", e.target.value)}
                />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea 
                   placeholder="Philosophy (MN)"
                   className="p-3 rounded-xl bg-white border border-[#D97706]/20 focus:outline-[#D97706]"
                   value={formData.philosophy.mn} onChange={(e) => handleInputChange("philosophy", "mn", e.target.value)}
                />
                <textarea 
                   placeholder="Philosophy (EN)"
                   className="p-3 rounded-xl bg-white border border-[#D97706]/20 focus:outline-[#D97706]"
                   value={formData.philosophy.en} onChange={(e) => handleInputChange("philosophy", "en", e.target.value)}
                />
             </div>
          </section>

          {/* 5. Services */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b border-[#D97706]/20 pb-2">
              <h3 className="text-xl font-bold">Services Offered</h3>
              <button 
                type="button" 
                onClick={addService}
                className="flex items-center gap-1 text-sm bg-[#D97706] text-white px-3 py-1 rounded-lg hover:bg-[#B45309]"
              >
                <Plus size={16} /> Add Service
              </button>
            </div>

            {formData.services.map((svc, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={svc.id} 
                className="bg-white p-4 rounded-xl border border-[#D97706]/10 relative group"
              >
                <button 
                  type="button" 
                  onClick={() => removeService(svc.id)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                   <input 
                      placeholder="Service Name (MN)" 
                      value={svc.name.mn}
                      onChange={(e) => updateService(svc.id, "name", "mn", e.target.value)}
                      className="p-2 border rounded-lg text-sm"
                   />
                   <input 
                      placeholder="Service Name (EN)" 
                      value={svc.name.en}
                      onChange={(e) => updateService(svc.id, "name", "en", e.target.value)}
                      className="p-2 border rounded-lg text-sm"
                   />
                </div>
                <div className="flex gap-3">
                   <input 
                      type="number" placeholder="Price" 
                      value={svc.price}
                      onChange={(e) => updateService(svc.id, "price", null, parseInt(e.target.value))}
                      className="p-2 border rounded-lg text-sm w-24"
                   />
                   <input 
                      placeholder="Duration (e.g. 30 min)" 
                      value={svc.duration}
                      onChange={(e) => updateService(svc.id, "duration", null, e.target.value)}
                      className="p-2 border rounded-lg text-sm flex-1"
                   />
                </div>
              </motion.div>
            ))}
          </section>

          {/* SUBMIT */}
          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading || uploadingImage}
              className="w-full py-4 bg-[#D97706] text-white rounded-2xl font-bold text-lg hover:bg-[#B45309] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Complete Registration
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}