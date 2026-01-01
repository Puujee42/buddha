"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence, useMotionTemplate } from "framer-motion";
import { ArrowUpRight, Loader2, Disc, Sparkles, Flower, Sun, Orbit, Star } from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";
import { Monk } from "@/database/types";

// --- 1. CELESTIAL ATMOSPHERE ---
const CelestialAtmosphere = ({ isDark }: { isDark: boolean }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className={`absolute inset-0 transition-opacity duration-1000 ${
      isDark ? "bg-[#05051a]" : "bg-[#FDFBF7]"
    }`} />
    
    {isDark && (
      <>
        <div className="absolute -top-20 -left-20 w-full h-full rounded-full blur-[140px] bg-[#C72075]/10 animate-pulse" />
        <div className="absolute -bottom-40 -right-20 w-full h-full rounded-full blur-[140px] bg-[#2E1B49]/20" />
      </>
    )}

    <motion.div 
      animate={{ rotate: isDark ? -360 : 360 }}
      transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-50%] left-[-25%] w-[150vw] h-[150vw] opacity-[0.05] md:opacity-[0.08]"
      style={{
        background: isDark 
          ? "conic-gradient(from 0deg, transparent 0%, #50F2CE 15%, transparent 40%, #C72075 60%, transparent 80%)"
          : "conic-gradient(from 0deg, transparent 0%, #fbbf24 10%, transparent 50%)"
      }}
    />
  </div>
);

export default function DivineTarotShowcase() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [monks, setMonks] = useState<Monk[]>([]);
  const [loading, setLoading] = useState(true);

  // Forced isDark for development/demo consistency or sync with theme
  const isDark = false; // resolvedTheme === 'dark';  

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

  if (!mounted) return <div className="min-h-screen bg-[#05051a]" />;

  return (
    <>
      <OverlayNavbar />
      <section className="relative min-h-[100dvh] pt-32 pb-48 md:pt-48 md:pb-64 overflow-hidden transition-colors duration-1000">
        <CelestialAtmosphere isDark={isDark} />
        
        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <header className="text-center mb-24 md:mb-44">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="flex justify-center mb-10"
            >
              <div className={`p-6 rounded-full border shadow-2xl transition-all duration-700 ${
                   isDark ? "bg-[#0C164F]/60 border-cyan-400/50 text-cyan-300" : "bg-white border-amber-200 text-amber-500"
               }`}>
                  {isDark ? <Orbit size={48} className="animate-pulse" /> : <Sun size={48} className="animate-spin-slow" />}
               </div>
            </motion.div>
            
            <h1 className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif tracking-tight leading-[1.1] drop-shadow-2xl ${isDark ? 'text-white' : 'text-[#451a03]'}`}>
               {t({ mn: "Багш нар", en: "Readers" })} 
               <span className={`block mt-10 text-xl sm:text-2xl md:text-3xl italic font-light font-serif tracking-[0.6em] uppercase bg-clip-text text-transparent bg-gradient-to-r ${
                 isDark ? 'from-cyan-400 via-white to-magenta-500' : 'from-amber-600 via-orange-500 to-amber-600'}`}>
                 {t({mn:"Хувь Тавилангийн Зам", en:"The Path of Destiny"})}
               </span>
            </h1>
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-cyan-500" size={64} /></div>
          ) : (
            /* UPDATED GRID: From grid-cols-4 to grid-cols-3 for 30% size increase */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16 md:gap-20 max-w-7xl mx-auto">
              {monks.map((monk, idx) => (
                <DharmaKingCard key={idx} monk={monk} index={idx} isDark={isDark} lang={language === 'mn' ? 'mn' : 'en'} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function DharmaKingCard({ monk, index, isDark, lang }: { monk: Monk, index: number, isDark: boolean, lang: 'mn'|'en' }) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-150, 150], [8, -8]), { stiffness: 45, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-8, 8]), { stiffness: 45, damping: 25 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowColor = isDark ? 'rgba(80, 242, 206, 0.18)' : 'rgba(251, 191, 36, 0.18)';
  const glowTemplate = useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`;

  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="group perspective-2000 w-full"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
    >
      <Link href={`/monks/${monk._id}`}>
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          /* UPDATED ASPECT: Changed to 1/1.6 for a larger, more impactful feel */
          className={`relative aspect-[1/1.6] w-full rounded-[3rem] overflow-hidden border-2 transition-all duration-700 shadow-2xl ${
            isDark 
            ? "bg-[#0C164F]/80 border-cyan-400/20 text-cyan-50 shadow-[0_0_60px_rgba(0,0,0,0.6)]" 
            : "bg-white/90 border-amber-100 text-[#451a03] shadow-[0_30px_60px_rgba(0,0,0,0.08)]"
          }`}
        >
          {/* Inner Ornate Frame */}
          <div className={`absolute inset-6 border-2 rounded-[2.5rem] transition-opacity duration-700 pointer-events-none z-30 ${
            isDark ? "border-cyan-400/10 group-hover:border-cyan-400/30" : "border-amber-500/10 group-hover:border-amber-500/20"
          }`} />

          {/* Magnetic Glow */}
          <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ background: glowTemplate }} />

          {/* Card ID */}
          <div className="absolute top-[7%] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
             <span className={`text-[12px] font-black tracking-[0.8em] uppercase mb-3 ${isDark ? 'text-cyan-400' : 'text-amber-600'}`}>
                {romanNumerals[index] || index + 1}
             </span>
             <div className={`w-12 h-[2px] ${isDark ? 'bg-cyan-400/30' : 'bg-amber-400/30'}`} />
          </div>

          {/* Master Image Area (Scaled Up) */}
          <div className="absolute inset-0 p-10 pt-32 pb-56">
             <div className="relative h-full w-full rounded-t-full overflow-hidden transition-all duration-700">
                <div className={`absolute inset-0 z-0 blur-[60px] opacity-40 ${isDark ? 'bg-magenta-500' : 'bg-amber-300'}`} />
                <motion.img 
                  src={monk.image} 
                  alt={monk.name[lang]}
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 1.2 }}
                  className={`w-full h-full object-cover relative z-10 transition-all duration-1000 ${isHovered ? 'grayscale-0' : 'grayscale-[0.3] brightness-95'}`}
                />
                <div className={`absolute inset-0 z-20 bg-gradient-to-t ${isDark ? 'from-[#0C164F]' : 'from-white'} via-transparent to-transparent opacity-100`} />
             </div>
          </div>

          {/* Content Area (Scaled Up Typography) */}
          <div className="absolute bottom-[8%] left-0 right-0 z-40 text-center px-10 flex flex-col items-center">
             <h3 className={`text-2xl md:text-4xl font-serif font-bold tracking-tight mb-3 transition-all duration-500 ${
                 isDark ? 'text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]' : 'text-[#451a03]'
             }`}>
                {monk.name[lang]}
             </h3>
             
             <p className={`text-[11px] font-black uppercase tracking-[0.5em] mb-10 transition-colors ${
                 isDark ? "text-cyan-400" : "text-amber-600"
             }`}>
                {monk.title?.[lang] || "Master of Wisdom"}
             </p>

             {/* Booking Button (Bigger) */}
             <motion.div 
               whileHover={{ scale: 1.05, y: -5 }}
               whileTap={{ scale: 0.98 }}
               className={`
                relative flex items-center justify-center gap-4 px-10 py-4 rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl group/btn
                ${isDark 
                  ? 'bg-gradient-to-r from-[#C72075] to-[#7B337D] text-white' 
                  : 'bg-amber-500 text-white hover:bg-amber-600'}
             `}>
                <span className="text-[12px] font-black uppercase tracking-[0.25em]">
                  {lang === 'en' ? "Book Session" : "Цаг Захиалах"}
                </span>
                <ArrowUpRight size={20} className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                
                {isDark && (
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                )}
             </motion.div>
          </div>

          {/* Decorative Divider */}
          <div className="absolute bottom-6 left-0 right-0 px-16 flex justify-between items-center opacity-30 z-10">
                <div className={`h-[1px] flex-1 ${isDark ? 'bg-cyan-400' : 'bg-amber-800'}`} />
                <Star size={14} className="mx-6 animate-pulse" fill="currentColor" />
                <div className={`h-[1px] flex-1 ${isDark ? 'bg-cyan-400' : 'bg-amber-800'}`} />
          </div>
        </motion.div>
      </Link>
      
      {/* Expanded Floor Shadow */}
      <motion.div 
        animate={{ opacity: isHovered ? 1 : 0.3, scale: isHovered ? 1.15 : 1 }}
        className={`absolute -bottom-12 left-1/2 -translate-x-1/2 w-[85%] h-12 blur-[60px] rounded-full transition-all duration-1000 pointer-events-none 
        ${isDark ? 'bg-magenta-500/40' : 'bg-amber-400/30'}`} 
      />
    </motion.div>
  );
}