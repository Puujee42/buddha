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
            {/* Backdrop - Solid black, no blur */}
            <div className="absolute inset-0 bg-black pointer-events-auto" onClick={onClose} />

            {/* Modal - Solid, no transparency */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-stone-950 border-4 border-amber-600 w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col pointer-events-auto"
            >
                {/* Header - Solid */}
                <div className="p-6 border-b-2 border-stone-800 bg-stone-900 flex justify-between items-center">
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

                    {/* Left Panel: Search & Hierarchy - Solid */}
                    <div className="w-1/4 border-r-4 border-stone-800 flex flex-col bg-stone-950">
                        <div className="p-4 border-b-4 border-stone-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search rituals..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-stone-800 text-stone-200 pl-10 pr-4 py-2 rounded-xl text-sm border-2 border-stone-700 focus:border-amber-500 focus:outline-none placeholder:text-stone-600"
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
                                                    className="bg-stone-900 border-l-2 border-stone-800"
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

                    {/* Right Panel: Details - MAXIMUM CLARITY */}
                    <div className="w-3/4 flex flex-col bg-white">
                        {selectedItem ? (
                            <div className="p-16 h-full overflow-y-auto">
                                {/* Title Section - Large and Bold */}
                                <div className="mb-8 pb-8 border-b-4 border-amber-400">
                                    <h1 className="text-5xl font-serif font-black text-black mb-4 leading-tight">
                                        {selectedItem.name}
                                    </h1>
                                    <span className="inline-block px-5 py-2 rounded-full bg-amber-500 text-white text-sm font-black uppercase tracking-widest shadow-lg">
                                        Ritual Details
                                    </span>
                                </div>

                                {/* Description - Large, Clear, Black Text */}
                                <div className="mb-12">
                                    <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-wide">Description</h2>
                                    <p className="text-2xl font-medium text-black leading-relaxed whitespace-pre-wrap">
                                        {selectedItem.desc || "No description available."}
                                    </p>
                                </div>

                                {/* Instructions Box - High Contrast */}
                                <div className="mt-12 p-8 bg-amber-100 rounded-3xl border-4 border-amber-400">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-full bg-amber-500">
                                            <FileText size={24} className="text-white" />
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-wider text-black">Instructions</h3>
                                    </div>
                                    <p className="text-xl font-medium text-black leading-relaxed">
                                        Perform this ritual with a clear mind and focused intention. Ensure all necessary preparations are completed before beginning.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-stone-500 p-12 text-center">
                                <BookOpen size={80} className="mb-6 text-stone-400" />
                                <h3 className="text-3xl font-bold mb-4 text-black">Select a Ritual</h3>
                                <p className="text-xl text-stone-600 max-w-md leading-relaxed">
                                    Browse the categories on the left or use the search bar to find a specific ritual.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
