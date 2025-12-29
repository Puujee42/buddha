"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  AnimatePresence 
} from "framer-motion";
import { Sparkles, Sun, Moon, Star, ShieldCheck } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";

// --- MAJESTIC COMPONENTS ---

const GoldCorner = ({ className }: { className: string }) => (
  <svg className={`absolute w-12 h-12 text-amber-500/80 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 20V0H20" stroke="currentColor" strokeWidth="2" />
    <path d="M0 40V15C0 6.71573 6.71573 0 15 0H40" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <circle cx="5" cy="5" r="2" fill="currentColor" />
  </svg>
);

const MandalaBackdrop = () => (
  <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-20">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      className="relative w-[1200px] h-[1200px] border border-amber-500/20 rounded-full flex items-center justify-center"
    >
      {[...Array(8)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" 
          style={{ transform: `rotate(${i * 45}deg)` }} 
        />
      ))}
      <div className="absolute inset-0 border-[10px] border-dashed border-amber-500/10 rounded-full animate-pulse" />
    </motion.div>
  </div>
);

const MONKS_DATA = [
  {
    id: 1,
    arcana: "I",
    name: { mn: "Данзанравжаа", en: "The Great Saint Danzan" },
    title: { mn: "Говийн Догшин Ноён Хутагт", en: "Master of the Gobi Desert" },
    video: "/num1.mp4", 
  },
  {
    id: 2,
    arcana: "II",
    name: { mn: "Занабазар", en: "Holy Zanabazar" },
    title: { mn: "Өндөр Гэгээн", en: "The High Creator & Artist" },
    video: "/num4.mp4", 
  },
  {
    id: 3,
    arcana: "III",
    name: { mn: "Богд Жавзандамба", en: "The 8th Bogd Khan" },
    title: { mn: "Монголын Шашны Тэргүүн", en: "The Supreme Oracle" },
    video: "/num3.mp4", 
  },
];

export default function MajesticTarotSection() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <section className={`relative w-full py-40 overflow-hidden transition-colors duration-1000 ${isDark ? "bg-[#020205]" : "bg-[#FCF9F2]"}`}>
      <MandalaBackdrop />
      
      {/* Dynamic Background Particles */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />

      <div className="relative z-10 container mx-auto px-6">
        <header className="flex flex-col items-center text-center mb-24 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0 }} 
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center mb-4"
          >
            <ShieldCheck className="text-amber-500" size={32} strokeWidth={1} />
          </motion.div>
          
          <h2 className="text-6xl md:text-8xl font-serif font-light tracking-tighter">
            <span className={isDark ? "text-amber-50" : "text-amber-950"}>Supreme </span>
            <span className="italic text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-500 to-amber-700">
              Arcana
            </span>
          </h2>
          <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 max-w-7xl mx-auto">
           {MONKS_DATA.map((monk, index) => (
              <MajesticCard key={monk.id} monk={monk} index={index} language={language} isDark={isDark} />
           ))}
        </div>
      </div>
    </section>
  );
}

function MajesticCard({ monk, index, language, isDark }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth Spring Physics
  const rotateX = useSpring(useTransform(y, [-150, 150], [12, -12]), { stiffness: 40, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-12, 12]), { stiffness: 40, damping: 20 });
  const glareX = useSpring(useTransform(x, [-150, 150], [0, 100]), { stiffness: 40, damping: 20 });
  const glareY = useSpring(useTransform(y, [-150, 150], [0, 100]), { stiffness: 40, damping: 20 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: index * 0.3, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
      className="group relative h-[700px] w-full perspective-[2000px] cursor-none"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative w-full h-full rounded-[20px] border-[1px] transition-all duration-1000 overflow-hidden
          ${isDark 
            ? "bg-[#050508] border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,1)]" 
            : "bg-white border-amber-900/10 shadow-xl"}
          group-hover:border-amber-500 group-hover:shadow-[0_0_80px_rgba(245,158,11,0.2)]
        `}
      >
        {/* VIDEO ENGINE (The core of the card) */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay loop muted playsInline 
            className={`w-full h-full object-cover transition-all duration-[2s]
              ${isHovered ? "scale-105 contrast-[1.1] grayscale-0" : "scale-110 contrast-100 grayscale-[0.4]"}
            `}
          >
            <source src={monk.video} type="video/mp4" />
          </video>
          
          {/* Majestic Overlays */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 transition-opacity duration-700 ${isHovered ? "opacity-90" : "opacity-40"}`} />
          
          {/* Shimmer / Glare Effect */}
          <motion.div 
            style={{ 
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)` 
            }}
            className="absolute inset-0 z-10 pointer-events-none"
          />
        </div>

        {/* ORNATE FRAME ELEMENTS */}
        <div className="absolute inset-4 border border-amber-500/20 rounded-[15px] z-20 pointer-events-none" />
        <GoldCorner className="top-2 left-2" />
        <GoldCorner className="top-2 right-2 rotate-90" />
        <GoldCorner className="bottom-2 left-2 -rotate-90" />
        <GoldCorner className="bottom-2 right-2 rotate-180" />

        {/* ARCANA BADGE */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
            <motion.div 
              animate={isHovered ? { y: 5, scale: 1.1 } : { y: 0, scale: 1 }}
              className="text-amber-400 font-serif text-3xl font-bold tracking-[0.5em] drop-shadow-lg"
            >
              {monk.arcana}
            </motion.div>
            <div className="w-8 h-[1px] bg-amber-500/50 mt-2" />
        </div>

        {/* HOVER CONTENT: GHOSTLY TITLES */}
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-end pb-16 px-8 pointer-events-none">
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="h-[1px] w-8 bg-amber-500" />
                  <Sparkles size={16} className="text-amber-500 animate-pulse" />
                  <div className="h-[1px] w-8 bg-amber-500" />
                </div>
                
                <h3 className="text-3xl font-serif text-white font-bold tracking-wide mb-2 uppercase drop-shadow-2xl">
                  {monk.name[language]}
                </h3>
                
                <p className="text-amber-400 font-medium tracking-[0.2em] text-[10px] uppercase">
                  {monk.title[language]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MOUSE TRACKER ICON */}
        <motion.div
            style={{ x, y }}
            className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <div className="w-12 h-12 border border-amber-500/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-ping" />
            </div>
        </motion.div>
      </motion.div>

      {/* CARD UNDERGLOW */}
      <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-amber-600/20 blur-[100px] rounded-full transition-opacity duration-1000 ${isHovered ? "opacity-100" : "opacity-0"}`} />
    </motion.div>
  );
}