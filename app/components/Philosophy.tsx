"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Crown, Brush, Sun, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

// --- ATMOSPHERICS ---

const SacredMandala = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vh] h-[140vh] opacity-[0.05] pointer-events-none z-0"
  >
    <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600 fill-current">
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 1" />
      <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" strokeWidth="0.05" />
    </svg>
  </motion.div>
);

const TimeDust = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "-10%", opacity: [0, 0.4, 0] }}
        transition={{ duration: 10 + (i % 10), repeat: Infinity, delay: i * 0.7 }}
        className="absolute w-1 h-1 bg-amber-400 rounded-full blur-[1px]"
        style={{ left: `${(i * 7) % 100}%` }}
      />
    ))}
  </div>
);

export default function ManualHeritageSection() {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const eras = [
    {
      id: "ancient",
      icon: <History />,
      year: "II BC - IX AD",
      image: "/tenzin.png",
      bichig: "ᠡᠷᠲᠡᠨ ᠦ",
      title: t({ mn: "Эртний Дэлгэрэлт", en: "Ancient Roots" }),
      desc: t({ mn: "Торгоны замаар дамжин ирсэн анхны гэгээрлийн үр.", en: "The first seeds of enlightenment arriving via the Silk Road." })
    },
    {
      id: "middle",
      icon: <Crown />,
      year: "XIII - XIV",
      image: "/bell.png",
      bichig: "ᠳᠤᠮᠳᠠᠳᠤ",
      title: t({ mn: "Хаадын Дэлгэрэлт", en: "Imperial Dharma" }),
      desc: t({ mn: "Их Монгол гүрний төрийн бодлого дахь бурхны шашин.", en: "Buddhism as the spiritual foundation of the Great Mongol Empire." })
    },
    {
      id: "renaissance",
      icon: <Brush />,
      year: "XVI - XIX",
      image: "/temple.png",
      bichig: "ᠰᠡᠷᠭᠦᠭᠡᠯᠲᠡ",
      title: t({ mn: "Соёлын Сэргэлт", en: "Cultural Zenith" }),
      desc: t({ mn: "Занабазарын үеийн урлаг, соёлын алтан эрин.", en: "The golden age of Mongolian art and philosophy under Zanabazar." })
    }
  ];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % eras.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + eras.length) % eras.length);

  return (
    <section className="relative h-screen w-full bg-[#FDFBF7] overflow-hidden flex flex-col justify-center">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFBEB] to-[#FDFBF7] z-0" />
      <SacredMandala />
      <TimeDust />

      {/* --- TOP HEADER (STATIC) --- */}
      <div className="absolute top-12 left-12 z-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Sun size={24} className="text-amber-500 animate-spin-slow" />
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-800/60">
            {t({ mn: "Түүхэн мандал", en: "Sacred Timeline" })}
          </span>
        </motion.div>
      </div>

      {/* --- MAIN STAGE --- */}
      <div className="relative z-10 container mx-auto px-6 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* LEFT: CONTENT (Animated by Index) */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 text-amber-600">
                  <span className="p-3 bg-white rounded-full shadow-sm border border-amber-100">
                    {eras[currentIndex].icon}
                  </span>
                  <span className="text-sm font-bold tracking-[0.2em] text-amber-500">
                    {eras[currentIndex].year}
                  </span>
                </div>

                <h2 className="text-5xl lg:text-7xl font-serif text-[#451a03] leading-tight">
                  {eras[currentIndex].title}
                </h2>

                <p className="text-lg lg:text-xl text-[#78350F]/70 leading-relaxed max-w-lg">
                  {eras[currentIndex].desc}
                </p>

                {/* Vertical Script Element (Mobile/Tablet Friendly) */}
                <div className="pt-6 flex items-center gap-4">
                  <div className="h-[2px] w-12 bg-amber-500/20" />
                  <span className="text-2xl font-serif text-amber-900/40 tracking-widest">
                    {eras[currentIndex].bichig}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* NAVIGATION BUTTONS */}
            <div className="mt-12 flex items-center gap-6">
              <button 
                onClick={handlePrev}
                className="group w-14 h-14 rounded-full border border-amber-500/30 flex items-center justify-center text-amber-600 hover:bg-amber-500 hover:text-white transition-all duration-500 shadow-sm"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-2">
                 {eras.map((_, i) => (
                   <div 
                    key={i} 
                    className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? "w-8 bg-amber-500" : "w-2 bg-amber-200"}`} 
                   />
                 ))}
              </div>

              <button 
                onClick={handleNext}
                className="group w-14 h-14 rounded-full bg-[#451a03] flex items-center justify-center text-amber-100 hover:bg-amber-600 transition-all duration-500 shadow-xl shadow-amber-900/20"
              >
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* RIGHT: THE VISUAL STUPA */}
          <div className="w-full lg:w-1/2 h-[50vh] lg:h-[70vh] order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ scale: 0.9, opacity: 0, rotateY: 20 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 1.1, opacity: 0, rotateY: -20 }}
                transition={{ duration: 0.8, ease: "backOut" }}
                className="relative h-full w-full"
              >
                {/* Image Portal with Rounded Stupa Shape */}
                <div className="h-full w-full bg-white rounded-t-[240px] rounded-b-[40px] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-amber-500/10">
                   <img 
                    src={eras[currentIndex].image} 
                    className="w-full h-full object-cover transition-all duration-[3s] hover:scale-110" 
                    alt="heritage" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#451a03]/40 to-transparent mix-blend-multiply" />
                   
                   {/* Vertical Script Ribbon */}
                   <div className="absolute top-12 right-12 z-20 flex flex-col items-center gap-4">
                      <div className="w-[1px] h-20 bg-white/50" />
                      <span className="text-3xl text-white font-serif drop-shadow-lg" style={{ writingMode: 'vertical-rl' }}>
                         {eras[currentIndex].bichig}
                      </span>
                   </div>
                </div>

                {/* Decorative Aura */}
                <div className="absolute -inset-10 bg-amber-500/10 blur-[80px] rounded-full -z-10 animate-pulse" />
                <Sparkles className="absolute -top-4 -right-4 text-amber-400 w-12 h-12" />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* --- PROGRESS THREAD (BOTTOM) --- */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500/10">
        <motion.div 
          initial={false}
          animate={{ width: `${((currentIndex + 1) / eras.length) * 100}%` }}
          className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
        />
      </div>

    </section>
  );
}