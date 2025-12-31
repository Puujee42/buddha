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
  // Responsive stroke width logic is handled by SVG scaling naturally
  
  return (
    <div className="absolute inset-0 pointer-events-none z-30 p-1 md:p-2">
      <svg className="w-full h-full" viewBox="0 0 300 450" fill="none" preserveAspectRatio="none">
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

        {/* Top Nameplate Box */}
        <path 
          d="M100 10 L110 35 H190 L200 10" 
          fill={isDark ? "#05051a" : "#fff"} 
          stroke={primary} strokeWidth="2"
        />

        {/* Bottom Nameplate Box */}
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
        <g className="text-[8px] font-bold" fill={primary} style={{ pointerEvents: 'none' }}>
          <text x="16" y="23" textAnchor="middle" dominantBaseline="middle">♈</text>
          <text x="280" y="23" textAnchor="middle" dominantBaseline="middle">♋</text>
          <text x="16" y="433" textAnchor="middle" dominantBaseline="middle">♎</text>
          <text x="280" y="433" textAnchor="middle" dominantBaseline="middle">♑</text>
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
  
  // Dynamic Theme Detection
  const isDark = mounted && resolvedTheme === "dark";

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

  if (!mounted) return <div className="min-h-screen bg-[#fcfaf7]" />;

  return (
    <>
      <OverlayNavbar />
      <section className={`relative min-h-[100dvh] pt-24 pb-32 md:pt-48 md:pb-64 overflow-hidden transition-colors duration-700 ${isDark ? "bg-[#05051a]" : "bg-[#fcfaf7]"}`}>
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className={`absolute top-0 left-[-20%] md:left-1/4 w-64 h-64 md:w-96 md:h-96 blur-[100px] md:blur-[150px] opacity-20 ${isDark ? 'bg-[#C72075]' : 'bg-amber-200'}`} />
            <div className={`absolute bottom-0 right-[-20%] md:right-1/4 w-64 h-64 md:w-96 md:h-96 blur-[100px] md:blur-[150px] opacity-10 ${isDark ? 'bg-cyan-600' : 'bg-orange-200'}`} />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <header className="text-center mb-16 md:mb-32">
            <h1 className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif tracking-tighter leading-[1.1] ${isDark ? 'text-white' : 'text-stone-900'}`}>
               {t({ mn: "Багшийн танилцуулгатай танилцаж,", en: "Getting acquainted with the teacher's introduction," })} <span className="block mt-2 italic font-light text-[#C72075]">{t({mn:"өөрт боломжтой цагаа товлоорой",en:"schedule a time that works for you"})}</span>
            </h1>
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-cyan-500" size={48} /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile to disable heavy 3D transforms
    if (window.innerWidth < 768) setIsMobile(true);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Reduced dampening for smoother mobile scroll
  const rotateX = useSpring(useTransform(y, [-150, 150], [10, -10]), { stiffness: 60, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-10, 10]), { stiffness: 60, damping: 20 });
  
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group perspective-2000 w-full"
      onMouseMove={(e) => {
        if (isMobile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
    >
      <Link href={`/monks/${monk._id}`}>
        <motion.div
          // Disable 3D rotation on mobile for better scrolling performance
          style={isMobile ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={`relative aspect-[2/3.2] w-full rounded-lg overflow-hidden transition-all duration-700 border-2 md:border-4 shadow-xl hover:shadow-2xl
            ${isDark ? 'bg-[#05051a] border-cyan-400/30' : 'bg-white border-stone-300'}`}
        >
          {/* BRUSHED METAL TEXTURE OVERLAY */}
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

          <OrnateZodiacFrame isDark={isDark} isHovered={isHovered} />

          {/* TOP NAMEPLATE CONTENT (NUMERAL) */}
          <div className="absolute top-[3%] left-1/2 -translate-x-1/2 z-40">
             <span className={`text-[9px] md:text-[10px] font-black tracking-[0.4em] ${isDark ? 'text-cyan-300' : 'text-stone-800'}`}>
                {romanNumerals[index] || index + 1}
             </span>
          </div>

          {/* PORTAL PORTRAIT */}
          <div className="absolute inset-0 p-4 pt-10 pb-12 md:p-6 md:pt-12 md:pb-14">
             <div className={`relative h-full w-full rounded-t-full overflow-hidden border-2 transition-all duration-700
                ${isDark ? 'border-cyan-400/20 bg-[#0C164F]/50' : 'border-stone-200 bg-stone-50'}`}>
                
                <motion.img 
                  src={monk.image} 
                  alt={monk.name[lang]}
                  animate={{ scale: isHovered ? 1.1 : 1, filter: isHovered ? "grayscale(0) brightness(1.1)" : "grayscale(0.2) brightness(0.8)" }}
                  transition={{ duration: 0.7 }}
                  className="w-full h-full object-cover"
                />
                
                {/* Dark Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-60" />
             </div>
          </div>

          {/* BOTTOM NAMEPLATE CONTENT (NAME) */}
          <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 z-40 w-full text-center px-4">
             <h3 className={`text-xs md:text-sm font-serif font-black uppercase tracking-[0.15em] transition-all duration-500 ${isDark ? 'text-cyan-50' : 'text-stone-900'} ${isHovered ? 'scale-110 text-[#C72075]' : ''}`}>
                {monk.name[lang]}
             </h3>
          </div>

          {/* --- HOVER DETAIL OVERLAYS (Visible on Hover Desktop, or subtle on Mobile) --- */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 md:p-12 text-center bg-black/70 backdrop-blur-[2px] pointer-events-none"
              >
                 <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="space-y-4 md:space-y-6">
                    <Orbit size={32} className="text-cyan-400 mx-auto animate-spin-slow md:w-10 md:h-10" />
                    
                    <div>
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#C72075] mb-2">Sacred Title</p>
                        <h4 className="text-lg md:text-xl font-serif text-white leading-tight">{monk.title[lang]}</h4>
                    </div>

                    <div className="h-px w-12 bg-cyan-400/30 mx-auto" />

                    <div className="flex items-center justify-center gap-2 md:gap-3 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-cyan-400">
                        <Sparkles size={12} className="md:w-3.5 md:h-3.5" />
                        <span>{lang == 'en' ? "Booking" : "Цаг захиалга"}</span>
                        <ArrowUpRight size={12} className="md:w-3.5 md:h-3.5" />
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
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 md:h-10 blur-[40px] md:blur-[60px] rounded-full transition-all duration-1000 pointer-events-none ${isDark ? 'bg-[#C72075]/40' : 'bg-amber-500/20'}`} 
      />
    </motion.div>
  );
}