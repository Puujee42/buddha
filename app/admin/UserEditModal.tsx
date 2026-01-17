"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";

interface UserEditModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: any) => Promise<void>;
}

export default function UserEditModal({ user, isOpen, onClose, onSave }: UserEditModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
        // Handle name structure (string or object)
        let name = { mn: "", en: "" };
        if (typeof user.name === 'string') {
            name = { mn: user.name, en: user.name };
        } else if (user.name) {
            name = { mn: user.name.mn || "", en: user.name.en || "" };
        }

        setFormData({
            ...user,
            name,
            phone: user.phone || "",
        });
    }
  }, [user]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(user._id, formData);
      onClose();
    } catch (error) {
      console.error("Failed to save user", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-2xl font-black font-serif text-stone-800">Хэрэглэгч засах</h2>
            <p className="text-sm text-stone-500 font-medium">Мэдээллийг шинэчлэх</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X size={24} className="text-stone-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <form id="user-edit-form" onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 gap-6">
                <InputGroup label="Нэр (MN)" value={formData.name?.mn} onChange={(v: string) => handleChange("name", v, "mn")} />
                <InputGroup label="Name (EN)" value={formData.name?.en} onChange={(v: string) => handleChange("name", v, "en")} />
                <InputGroup label="Утас (Phone)" value={formData.phone} onChange={(v: string) => handleChange("phone", v)} />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-stone-50">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-xs uppercase bg-stone-200 text-stone-600 hover:opacity-80 transition-opacity"
          >
            Болих
          </button>
          <button
            type="submit"
            form="user-edit-form"
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold text-xs uppercase bg-amber-500 text-white shadow-lg shadow-amber-900/20 hover:bg-amber-600 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Хадгалах
          </button>
        </div>

      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold uppercase text-stone-700 block">{label}</label>
      <input
        type={type}
        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 transition-colors"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
