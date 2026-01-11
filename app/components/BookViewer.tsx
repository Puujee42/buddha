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
    const [showMobileDetails, setShowMobileDetails] = useState(false);

    const toggleCategory = (cat: string) => {
        setExpandedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const handleSelectItem = (item: RitualItem) => {
        setSelectedItem(item);
        setShowMobileDetails(true);
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
        <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none p-2 md:p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95 pointer-events-auto" onClick={onClose} />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className="bg-stone-950 border-2 md:border-4 border-amber-600 w-full max-w-6xl h-full md:h-[90vh] rounded-3xl md:rounded-[3rem] shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col pointer-events-auto relative"
            >
                {/* Header */}
                <div className="p-4 md:p-6 border-b-2 border-stone-800 bg-stone-900 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2 md:gap-3 text-amber-500">
                        {showMobileDetails && (
                            <button
                                onClick={() => setShowMobileDetails(false)}
                                className="md:hidden p-1 -ml-1 text-stone-400"
                            >
                                <ChevronRight className="rotate-180" size={24} />
                            </button>
                        )}
                        <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                        <h2 className="text-sm md:text-xl font-serif font-bold text-stone-200">Digital Ritual Book</h2>
                    </div>
                    <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors p-1">
                        <X size={20} className="md:w-6 md:h-6" />
                    </button>
                </div>

                {/* Content Container */}
                <div className="flex-1 flex overflow-hidden flex-row">
                    {/* Left Panel: Search & Hierarchy */}
                    <div className={`w-full md:w-1/4 border-r-2 md:border-r-4 border-stone-800 flex flex-col bg-stone-950 transition-all ${showMobileDetails ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-3 md:p-4 border-b-2 md:border-b-4 border-stone-800 shrink-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search rituals..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-stone-800 text-stone-200 pl-10 pr-4 py-2 rounded-xl text-xs md:text-sm border-2 border-stone-700 focus:border-amber-500 focus:outline-none placeholder:text-stone-600"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-stone-800">
                            {filteredBook.length === 0 ? (
                                <div className="text-center py-10 text-stone-600 text-sm">No results found</div>
                            ) : (
                                filteredBook.map((cat, idx) => (
                                    <div key={idx} className="rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleCategory(cat.category)}
                                            className="w-full px-3 py-2 flex items-center gap-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 text-left text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors"
                                        >
                                            <div className="shrink-0">{expandedCategories.includes(cat.category) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</div>
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
                                                            onClick={() => handleSelectItem(item)}
                                                            className={`w-full text-left pl-9 pr-4 py-2 text-xs md:text-sm border-l-2 transition-all flex items-start gap-2 ${selectedItem?.name === item.name
                                                                ? "border-amber-500 bg-amber-500/10 text-amber-100 font-bold"
                                                                : "border-transparent text-stone-400 hover:text-stone-300 hover:bg-stone-800"
                                                                }`}
                                                        >
                                                            <div className="mt-1.5 min-w-[4px] min-h-[4px] rounded-full bg-current opacity-50" />
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
                    <div className={`w-full md:w-3/4 flex flex-col bg-white overflow-y-auto ${!showMobileDetails ? 'hidden md:flex' : 'flex'}`}>
                        {selectedItem ? (
                            <div className="p-6 md:p-16">
                                {/* Title Section */}
                                <div className="mb-6 md:mb-8 pb-4 md:pb-8 border-b-2 md:border-b-4 border-amber-400">
                                    <h1 className="text-3xl md:text-6xl font-serif font-black text-black mb-3 md:mb-4 leading-tight">
                                        {selectedItem.name}
                                    </h1>
                                    <span className="inline-block px-3 py-1 md:px-5 md:py-2 rounded-full bg-amber-500 text-white text-[10px] md:text-sm font-black uppercase tracking-widest shadow-md md:shadow-lg">
                                        Ritual Details
                                    </span>
                                </div>

                                {/* Description */}
                                <div className="mb-8 md:mb-12">
                                    <h2 className="text-lg md:text-2xl font-bold text-black mb-4 md:mb-6 uppercase tracking-wide">Description</h2>
                                    <p className="text-lg md:text-3xl font-medium text-black leading-relaxed whitespace-pre-wrap">
                                        {selectedItem.desc || "No description available."}
                                    </p>
                                </div>

                                {/* Instructions Box */}
                                <div className="p-5 md:p-8 bg-amber-100 rounded-2xl md:rounded-3xl border-2 md:border-4 border-amber-400">
                                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                                        <div className="p-2 md:p-3 rounded-full bg-amber-500 shrink-0">
                                            <FileText size={18} className="text-white md:w-6 md:h-6" />
                                        </div>
                                        <h3 className="text-base md:text-xl font-black uppercase tracking-wider text-black">Instructions</h3>
                                    </div>
                                    <p className="text-base md:text-2xl font-medium text-black leading-relaxed">
                                        Perform this ritual with a clear mind and focused intention. Ensure all necessary preparations are completed before beginning.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-stone-500 p-8 md:p-12 text-center bg-stone-50">
                                <BookOpen size={48} className="md:w-20 md:h-20 mb-4 md:mb-6 text-stone-300" />
                                <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-4 text-stone-800">Select a Ritual</h3>
                                <p className="text-sm md:text-xl text-stone-500 max-w-sm leading-relaxed">
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
