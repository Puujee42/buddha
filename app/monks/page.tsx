"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Loader2, Orbit, Star, Sparkles } from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";
import { Monk } from "@/database/types";

// --- 1. THE ORNATE BEVELED FRAME ---
const OrnateZodiacFrame = ({ isDark, isHovered }: { isDark: boolean; isHovered: boolean }) => {
  const primary = isDark ? "#50F2CE" : "#b45309";
  const glow = isDark ? "#C72075" : "#f59e0b";

  return (
    <div className="absolute inset-0 pointer-events-none z-30 p-2">
      <svg className="w-full h-full" viewBox="0 0 300 450" fill="none">
        {/* Main Thick Border */}
        <rect 
          x="10" y="10" width="280" height="430" 
          stroke={primary} strokeWidth="4" rx="4"
          className="opacity-40"
        />
        
        {/* Inner Engraved Line */}
        <rect 
          x="18" y="18" width="264" height="414" 
          stroke={primary} strokeWidth="1" rx="2"
          className="opacity-20"
        />

        {/* Top Nameplate Box (VOH style) */}
        <path 
          d="M100 10 L110 35 H190 L200 10" 
          fill={isDark ? "#05051a" : "#fff"} 
          stroke={primary} strokeWidth="2"
        />

        {/* Bottom Nameplate Box (MOMING style) */}
        <path 
          d="M40 440 L60 415 H240 L260 440" 
          fill={isDark ? "#05051a" : "#fff"} 
          stroke={primary} strokeWidth="2"
        />

        {/* Corner Medallions */}
        {[
          { cx: 20, cy: 20 }, { cx: 280, cy: 20 },
          { cx: 20, cy: 430 }, { cx: 280, cy: 430 }
        ].map((pos, i) => (
          <circle 
            key={i} cx={pos.cx} cy={pos.cy} r="8" 
            fill={isDark ? "#0C164F" : "#fff"} 
            stroke={primary} strokeWidth="2" 
          />
        ))}

        {/* Zodiac Symbols in Medallions */}
        <g className="text-[8px] font-bold" fill={primary}>
          <text x="16" y="23">♈</text>
          <text x="276" y="23">♋</text>
          <text x="16" y="433">♎</text>
          <text x="276" y="433">♑</text>
        </g>
      </svg>
    </div>
  );
};

export default function DivineTarotShowcase() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [monks, setMonks] = useState<Monk[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setMounted(true);
    async function fetchMonks() {
      try {
        const response = await fetch('/api/monks');
        const data = await response.json();
        setMonks(data);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    }
    fetchMonks();
  }, []);

  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <OverlayNavbar />
      <section className={`relative min-h-screen pt-48 pb-64 overflow-hidden ${isDark ? "bg-[#05051a]" : "bg-[#fcfaf7]"}`}>
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute top-0 left-1/4 w-96 h-96 blur-[150px] opacity-20 ${isDark ? 'bg-[#C72075]' : 'bg-amber-200'}`} />
            <div className={`absolute bottom-0 right-1/4 w-96 h-96 blur-[150px] opacity-10 ${isDark ? 'bg-cyan-600' : 'bg-orange-200'}`} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <header className="text-center mb-32">
            <h1 className={`text-6xl md:text-8xl font-serif tracking-tighter ${isDark ? 'text-white' : 'text-stone-900'}`}>
               The Astral <span className="italic font-light text-[#C72075]">Collective</span>
            </h1>
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-cyan-500" size={48} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
              {monks.map((monk, idx) => (
                <VikingZodiacCard key={idx} monk={monk} index={idx} isDark={isDark} lang={language === 'mn' ? 'mn' : 'en'} />
              ))}
            </div>
          )}
        </div>
      </section>
      <GoldenNirvanaFooter />
    </>
  );
}

function VikingZodiacCard({ monk, index, isDark, lang }: { monk: Monk, index: number, isDark: boolean, lang: 'mn'|'en' }) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-150, 150], [12, -12]), { stiffness: 60, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-12, 12]), { stiffness: 60, damping: 20 });
  
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group perspective-2000"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
    >
      <Link href={`/monks/${monk._id}`}>
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={`relative aspect-[2/3.2] w-full rounded-lg overflow-hidden transition-all duration-700 border-4 shadow-2xl
            ${isDark ? 'bg-[#05051a] border-cyan-400/30' : 'bg-white border-stone-300'}`}
        >
          {/* BRUSHED METAL TEXTURE OVERLAY */}
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

          <OrnateZodiacFrame isDark={isDark} isHovered={isHovered} />

          {/* TOP NAMEPLATE CONTENT (NUMERAL) */}
          <div className="absolute top-[14px] left-1/2 -translate-x-1/2 z-40">
             <span className={`text-[10px] font-black tracking-[0.4em] ${isDark ? 'text-cyan-300' : 'text-stone-800'}`}>
                {romanNumerals[index] || index + 1}
             </span>
          </div>

          {/* PORTAL PORTRAIT */}
          <div className="absolute inset-0 p-6 pt-12 pb-14">
             <div className={`relative h-full w-full rounded-t-full overflow-hidden border-2 transition-all duration-700
                ${isDark ? 'border-cyan-400/20 bg-[#0C164F]/50' : 'border-stone-200 bg-stone-50'}`}>
                
                <motion.img 
                  src={monk.image} 
                  alt={monk.name[lang]}
                  animate={{ scale: isHovered ? 1.1 : 1, filter: isHovered ? "grayscale(0) brightness(1.1)" : "grayscale(0.2) brightness(0.8)" }}
                  className="w-full h-full object-cover transition-all duration-1000"
                />
                
                {/* Dark Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-60" />
             </div>
          </div>

          {/* BOTTOM NAMEPLATE CONTENT (NAME) */}
          <div className="absolute bottom-[16px] left-1/2 -translate-x-1/2 z-40 w-full text-center">
             <h3 className={`text-sm font-serif font-black uppercase tracking-[0.2em] transition-all duration-500 ${isDark ? 'text-cyan-50' : 'text-stone-900'} ${isHovered ? 'scale-110 text-[#C72075]' : ''}`}>
                {monk.name[lang]}
             </h3>
          </div>

          {/* --- HOVER DETAIL OVERLAYS --- */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center p-12 text-center bg-black/60 backdrop-blur-sm pointer-events-none"
              >
                 <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="space-y-6">
                    <Orbit size={40} className="text-cyan-400 mx-auto animate-spin-slow" />
                    
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C72075] mb-2">Sacred Title</p>
                        <h4 className="text-xl font-serif text-white">{monk.title[lang]}</h4>
                    </div>

                    <div className="h-px w-12 bg-cyan-400/30 mx-auto" />

                    <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
                        <Sparkles size={14} />
                        <span>{lang == 'en' ? "Booking" : "Цаг захиалга"}</span>
                        <ArrowUpRight size={14} />
                    </div>
                 </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </Link>
      
      {/* Floor Glow */}
      <motion.div 
        animate={{ opacity: isHovered ? 1 : 0 }}
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-10 blur-[60px] rounded-full transition-all duration-1000 ${isDark ? 'bg-[#C72075]/40' : 'bg-amber-500/20'}`} 
      />
    </motion.div>
  );
}