"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  Crown, 
  Brush, 
  Moon, 
  Sun, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles,
  Compass
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";

// --- SACRED ATMOSPHERICS ---

const CosmicMandala = ({ isDark }: { isDark: boolean }) => (
  <motion.div
    animate={{ rotate: isDark ? -360 : 360 }}
    transition={{ duration: 250, repeat: Infinity, ease: "linear" }}
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vh] h-[150vh] opacity-[0.08] pointer-events-none z-0"
  >
    <svg viewBox="0 0 100 100" className={`w-full h-full fill-current ${isDark ? "text-indigo-400" : "text-amber-600"}`}>
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.05" strokeDasharray="1 2" />
      <path d="M50 0 L52 48 L100 50 L52 52 L50 100 L48 52 L0 50 L48 48 Z" />
      <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.1" />
    </svg>
  </motion.div>
);

const ChronoDust = ({ isDark }: { isDark: boolean }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: "-10%", opacity: [0, 0.5, 0], x: Math.sin(i) * 50 }}
        transition={{ duration: 12 + (i % 8), repeat: Infinity, delay: i * 0.5 }}
        className={`absolute w-1 h-1 rounded-full blur-[1px] ${isDark ? "bg-indigo-300 shadow-[0_0_8px_white]" : "bg-amber-400 shadow-[0_0_8px_orange]"}`}
        style={{ left: `${(i * 5.5) % 100}%` }}
      />
    ))}
  </div>
);

export default function ManualHeritageSection() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-screen bg-[#020205]" />;

  const isDark = resolvedTheme === "dark";

  const eras = [
    {
      id: "ancient",
      arcana: "IX",
      icon: <Compass />,
      year: "II BC - IX AD",
      image: "/tenzin.png",
      bichig: "ᠡᠷᠲᠡᠨ ᠦ",
      title: t({ mn: "Эртний Дэлгэрэлт", en: "Ancient Origins" }),
      desc: t({ mn: "Торгоны замаар дамжин ирсэн анхны гэгээрлийн үр.", en: "The primordial seeds of Dharma carried through the winds of the Silk Road." })
    },
    {
      id: "middle",
      arcana: "XVII",
      icon: <Crown />,
      year: "XIII - XIV",
      image: "/bell.png",
      bichig: "ᠳᠤᠮᠳᠠᠳᠤ",
      title: t({ mn: "Хаадын Дэлгэрэлт", en: "Imperial Mandate" }),
      desc: t({ mn: "Их Монгол гүрний төрийн бодлого дахь бурхны шашин.", en: "When the Great Khans wove the Dharma into the fabric of the Empire." })
    },
    {
      id: "renaissance",
      arcana: "XXI",
      icon: <Brush />,
      year: "XVI - XIX",
      image: "/temple.png",
      bichig: "ᠰᠡᠷᠭᠦᠭᠡᠯᠲᠡ",
      title: t({ mn: "Соёлын Сэргэлт", en: "The Golden Zenith" }),
      desc: t({ mn: "Занабазарын үеийн урлаг, соёлын алтан эрин.", en: "The absolute peak of artistic enlightenment under the Saint Zanabazar." })
    }
  ];

  const theme = isDark ? {
    bg: "bg-[#020205]",
    gradient: "from-[#05051a] via-[#020205] to-black",
    textMain: "text-white",
    textSub: "text-indigo-400",
    textDesc: "text-indigo-100/60",
    accent: "text-amber-400",
    cardBorder: "border-indigo-500/30",
    navBg: "bg-indigo-950/40",
    btnPrimary: "bg-indigo-600 shadow-indigo-500/20 text-white"
  } : {
    bg: "bg-[#FDFBF7]",
    gradient: "from-[#FFFBEB] via-[#FDFBF7] to-[#FDFBF7]",
    textMain: "text-[#451a03]",
    textSub: "text-amber-600",
    textDesc: "text-[#78350F]/70",
    accent: "text-amber-500",
    cardBorder: "border-amber-200",
    navBg: "bg-white",
    btnPrimary: "bg-[#451a03] shadow-amber-900/20 text-amber-100"
  };

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % eras.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + eras.length) % eras.length);

  return (
    <section className={`relative h-screen w-full transition-colors duration-1000 overflow-hidden flex flex-col justify-center ${theme.bg}`}>
      
      {/* --- ATMOSPHERE --- */}
      <div className={`absolute inset-0 z-0 bg-linear-to-b ${theme.gradient}`} />
      <CosmicMandala isDark={isDark} />
      <ChronoDust isDark={isDark} />

      {/* --- HEADER --- */}
      <div className="absolute top-12 left-12 z-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border backdrop-blur-md ${theme.cardBorder}`}>
            {isDark ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-amber-500 animate-[spin_10s_linear_infinite]" />}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.5em] opacity-60 ${theme.textMain}`}>
            {t({ mn: "Түүхэн мандал", en: "Chronicles of the Stars" })}
          </span>
        </motion.div>
      </div>

      {/* --- MAIN STAGE --- */}
      <div className="relative z-10 container mx-auto px-6 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* LEFT: THE SCROLL OF TIME */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1 space-y-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="space-y-8"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center backdrop-blur-xl transition-all shadow-2xl ${theme.cardBorder} ${theme.navBg} ${theme.textSub}`}>
                    {eras[currentIndex].icon}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-black tracking-widest uppercase ${theme.textSub}`}>Arcana {eras[currentIndex].arcana}</span>
                    <span className={`text-xl font-serif italic ${theme.accent}`}>{eras[currentIndex].year}</span>
                  </div>
                </div>

                <h2 className={`text-6xl lg:text-8xl font-serif font-black leading-[1.1] transition-colors ${theme.textMain}`}>
                  {eras[currentIndex].title}
                </h2>

                <p className={`text-lg lg:text-xl font-medium leading-relaxed max-w-lg transition-colors ${theme.textDesc}`}>
                  {eras[currentIndex].desc}
                </p>

                <div className="flex items-center gap-6 pt-4">
                  <div className={`h-[1px] w-24 ${isDark ? "bg-indigo-500/30" : "bg-amber-900/10"}`} />
                  <span className={`text-4xl font-serif opacity-30 tracking-[0.3em] ${theme.textMain}`}>
                    {eras[currentIndex].bichig}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* NAVIGATION Ritual Artifacts */}
            <div className="flex items-center gap-8">
              <button onClick={handlePrev} className={`group w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${theme.cardBorder} ${theme.textMain} ${theme.navBg}`}>
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <div className="flex gap-3">
                 {eras.map((_, i) => (
                   <motion.div 
                    key={i} 
                    animate={{ width: i === currentIndex ? 40 : 10, opacity: i === currentIndex ? 1 : 0.3 }}
                    className={`h-1 rounded-full ${isDark ? "bg-indigo-400" : "bg-amber-600"}`} 
                   />
                 ))}
              </div>

              <button onClick={handleNext} className={`group w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 shadow-2xl ${theme.btnPrimary}`}>
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* RIGHT: THE MONOLITH PORTAL */}
          <div className="w-full lg:w-1/2 h-[50vh] lg:h-[75vh] order-1 lg:order-2 perspective-[2000px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, rotateY: 45, scale: 0.8 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: -45, scale: 0.8 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full w-full group"
              >
                {/* Image Altar */}
                <div className={`h-full w-full rounded-t-[300px] rounded-b-[40px] overflow-hidden border-[2px] transition-all duration-1000 shadow-[0_50px_100px_rgba(0,0,0,0.5)] ${theme.cardBorder}`}>
                   <img 
                    src={eras[currentIndex].image} 
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[4s]" 
                    alt="heritage" 
                   />
                   <div className={`absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent ${isDark ? "opacity-80" : "opacity-40"}`} />
                   
                   {/* Vertical Holographic Script */}
                   <div className="absolute top-20 right-10 z-20 flex flex-col items-center gap-6">
                      <div className={`w-[1px] h-24 bg-linear-to-b from-transparent via-white/50 to-transparent`} />
                      <span className="text-4xl text-white font-serif tracking-[0.5em] [writing-mode:vertical-rl] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                         {eras[currentIndex].bichig}
                      </span>
                   </div>
                </div>

                {/* Ritual Glow */}
                <div className={`absolute -inset-10 blur-[120px] rounded-full -z-10 transition-colors duration-1000 ${isDark ? "bg-indigo-600/20" : "bg-amber-500/10"}`} />
                <Sparkles className={`absolute -top-6 -right-6 w-16 h-16 transition-colors duration-1000 ${theme.accent}`} />
                
                {/* Arcana Seal */}
                <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full border backdrop-blur-2xl font-black text-[10px] tracking-[0.5em] uppercase z-30 ${theme.cardBorder} ${theme.navBg} ${theme.textMain}`}>
                   {eras[currentIndex].id} Realm
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* --- PROGRESS THREAD --- */}
      <div className={`absolute bottom-0 left-0 w-full h-[2px] ${isDark ? "bg-indigo-900/20" : "bg-amber-900/5"}`}>
        <motion.div 
          animate={{ width: `${((currentIndex + 1) / eras.length) * 100}%` }}
          className={`h-full transition-colors duration-1000 ${isDark ? "bg-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.8)]" : "bg-amber-600"}`} 
        />
      </div>

    </section>
  );
}