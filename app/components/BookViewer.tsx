"use client";

import React, { useState, useMemo } from "react";
import { RITUAL_BOOK, RitualItem, RitualCategory } from "../data/book";
import { Search, BookOpen, X, ChevronDown, ChevronRight, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookViewerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BookViewer({ isOpen, onClose }: BookViewerProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [selectedItem, setSelectedItem] = useState<RitualItem | null>(null);

    const toggleCategory = (cat: string) => {
        setExpandedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const filteredBook = useMemo(() => {
        if (!searchTerm) return RITUAL_BOOK;

        return RITUAL_BOOK.map(category => {
            const matchesCategory = category.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchingItems = category.items.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.desc.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (matchesCategory || matchingItems.length > 0) {
                return {
                    ...category,
                    items: matchesCategory ? category.items : matchingItems
                };
            }
            return null;
        }).filter(Boolean) as RitualCategory[];
    }, [searchTerm]);

    // Auto-expand if searching
    React.useEffect(() => {
        if (searchTerm) {
            setExpandedCategories(filteredBook.map(c => c.category));
        }
    }, [searchTerm, filteredBook]);

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-stone-900 border border-stone-700 w-full max-w-4xl h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
                {/* Header */}
                <div className="p-6 border-b border-stone-800 bg-stone-900 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-amber-500">
                        <BookOpen className="w-6 h-6" />
                        <h2 className="text-xl font-serif font-bold text-stone-200">Digital Ritual Book</h2>
                    </div>
                    <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content Container */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Left Panel: Search & Hierarchy */}
                    <div className="w-1/3 border-r border-stone-800 flex flex-col bg-[#0c0c0c]">
                        <div className="p-4 border-b border-stone-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search rituals..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-stone-800/50 text-stone-200 pl-10 pr-4 py-2 rounded-xl text-sm border border-stone-700 focus:border-amber-500/50 focus:outline-none placeholder:text-stone-600"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {filteredBook.length === 0 ? (
                                <div className="text-center py-10 text-stone-600 text-sm">No results found</div>
                            ) : (
                                filteredBook.map((cat, idx) => (
                                    <div key={idx} className="rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleCategory(cat.category)}
                                            className="w-full px-3 py-2 flex items-center gap-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 text-left text-xs font-bold uppercase tracking-wider transition-colors"
                                        >
                                            {expandedCategories.includes(cat.category) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            <span className="truncate">{cat.category}</span>
                                        </button>

                                        <AnimatePresence>
                                            {expandedCategories.includes(cat.category) && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="bg-stone-900/50"
                                                >
                                                    {cat.items.map((item, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setSelectedItem(item)}
                                                            className={`w-full text-left pl-9 pr-4 py-2 text-sm border-l-2 transition-all flex items-start gap-2 ${selectedItem?.name === item.name
                                                                    ? "border-amber-500 bg-amber-500/10 text-amber-100"
                                                                    : "border-transparent text-stone-400 hover:text-stone-300 hover:bg-stone-800"
                                                                }`}
                                                        >
                                                            <div className="mt-1 min-w-[4px] min-h-[4px] rounded-full bg-current opacity-50" />
                                                            <span className="line-clamp-1">{item.name}</span>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Details */}
                    <div className="w-2/3 flex flex-col bg-[#111111]">
                        {selectedItem ? (
                            <div className="p-8 h-full overflow-y-auto">
                                <div className="mb-6 pb-6 border-b border-stone-800">
                                    <h1 className="text-3xl font-serif font-bold text-amber-500 mb-2">{selectedItem.name}</h1>
                                    <span className="inline-block px-3 py-1 rounded-full bg-stone-800 text-stone-400 text-xs font-bold uppercase tracking-widest border border-stone-700">
                                        Ritual Details
                                    </span>
                                </div>

                                <div className="prose prose-invert prose-lg max-w-none text-stone-300 leading-relaxed">
                                    <p className="whitespace-pre-wrap">{selectedItem.desc || "No description available."}</p>
                                </div>

                                <div className="mt-12 p-6 bg-stone-900/50 rounded-2xl border border-stone-800 border-dashed">
                                    <div className="flex items-center gap-3 text-stone-500 mb-2">
                                        <FileText size={18} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Instructions</span>
                                    </div>
                                    <p className="text-sm text-stone-500 italic">
                                        Perform this ritual with a clear mind and focused intention. Ensure all necessary preparations are completed before beginning.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-stone-600 p-8 text-center opacity-50">
                                <BookOpen size={64} className="mb-4 text-stone-700" />
                                <h3 className="text-xl font-bold mb-2">Select a Ritual</h3>
                                <p className="max-w-xs">Browse the categories on the left or use the search bar to find a specific ritual.</p>
                            </div>
                        )}
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
