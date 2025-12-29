"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Sparkles, Sun, Moon, ArrowUpRight, Gem, Loader2 } from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";
import { Monk } from "@/database/types";

// --- 1. THE VIKING-TAROT FRAME ---
// This SVG creates the intricate interlaced border typical of Norse art
const TarotFrame = ({ isDark }: { isDark: boolean }) => {
  const color = isDark ? "#818cf8" : "#b45309";
  const glow = isDark ? "rgba(99, 102, 241, 0.5)" : "rgba(251, 191, 36, 0.5)";

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <svg className="w-full h-full" viewBox="0 0 300 450" fill="none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Main Border Path - Norse Knotwork Style */}
        <path 
          d="M20 40 L20 20 L40 20 M260 20 L280 20 L280 40 M280 410 L280 430 L260 430 M40 430 L20 430 L20 410" 
          stroke={color} strokeWidth="2" strokeLinecap="round" 
        />
        
        {/* Elaborate Corners */}
        {[
          "M15 45 Q15 15 45 15", // Top Left
          "M255 15 Q285 15 285 45", // Top Right
          "M285 405 Q285 435 255 435", // Bottom Right
          "M45 435 Q15 435 15 405"  // Bottom Left
        ].map((d, i) => (
          <path key={i} d={d} stroke={color} strokeWidth="1" className="opacity-50" />
        ))}

        {/* Center Top Arch */}
        <path 
          d="M100 20 Q150 -5 200 20" 
          stroke={color} strokeWidth="3" filter="url(#glow)"
        />
        
        {/* Runic Decals in corners */}
        <text x="25" y="35" fill={color} fontSize="10" className="font-serif opacity-60">ᛗ</text>
        <text x="265" y="35" fill={color} fontSize="10" className="font-serif opacity-60">ᚦ</text>
        <text x="25" y="425" fill={color} fontSize="10" className="font-serif opacity-60">ᚠ</text>
        <text x="265" y="425" fill={color} fontSize="10" className="font-serif opacity-60">ᛟ</text>
      </svg>
    </div>
  );
};

// --- 2. ATMOSPHERICS ---
const CelestialOverlay = ({ isDark }: { isDark: boolean }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className={`absolute top-0 left-1/4 w-96 h-96 blur-[120px] rounded-full opacity-20 ${isDark ? 'bg-indigo-600' : 'bg-amber-300'}`} />
    <div className={`absolute bottom-0 right-1/4 w-96 h-96 blur-[120px] rounded-full opacity-10 ${isDark ? 'bg-purple-900' : 'bg-orange-200'}`} />
  </div>
);

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
      <section className={`relative min-h-screen transition-colors duration-1000 pt-32 pb-48 overflow-hidden ${isDark ? "bg-[#050508]" : "bg-[#fcfaf7]"}`}>
        <CelestialOverlay isDark={isDark} />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <div className={`inline-flex items-center gap-4 mb-6 ${isDark ? 'text-indigo-400' : 'text-amber-700'}`}>
              <div className="h-px w-12 bg-current opacity-30" />
              <span className="text-xs font-bold tracking-[0.4em] uppercase">{t({ mn: "Тэнгэрийн Хөлгүүд", en: "Celestial Arcana" })}</span>
              <div className="h-px w-12 bg-current opacity-30" />
            </div>
            <h1 className={`text-6xl md:text-8xl font-serif mb-6 tracking-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>
              {isDark ? "The Sacred" : "Guardians of"}<br/>
              <span className={`italic font-light ${isDark ? 'text-indigo-400' : 'text-amber-600'}`}>
                {isDark ? "Oracles" : "Enlightenment"}
              </span>
            </h1>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={48} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
              {monks.map((monk, idx) => (
                <VikingTarotCard 
                  key={monk._id?.toString()} 
                  monk={monk} 
                  index={idx} 
                  isDark={isDark} 
                  lang={language === 'mn' ? 'mn' : 'en'}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <GoldenNirvanaFooter />
    </>
  );
}

// --- 3. THE CARD COMPONENT ---
function VikingTarotCard({ monk, index, isDark, lang }: { monk: Monk, index: number, isDark: boolean, lang: 'mn'|'en' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 100, damping: 20 });

  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group perspective-1000"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <Link href={`/monks/${monk._id}`}>
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={`relative aspect-[2/3] w-full rounded-lg overflow-hidden transition-all duration-500
            ${isDark 
              ? 'bg-[#0a0a0f] border border-white/5 shadow-2xl shadow-indigo-500/10' 
              : 'bg-white border border-stone-200 shadow-xl shadow-stone-200'
            }`}
        >
          {/* Card Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
          
          <TarotFrame isDark={isDark} />

          {/* Top Info (Roman Numeral) */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40">
            <span className={`text-[10px] font-black tracking-[0.5em] ${isDark ? 'text-indigo-400' : 'text-amber-700'}`}>
              {romanNumerals[index] || index + 1}
            </span>
          </div>

          {/* Arched Portrait Portal */}
          <div className="absolute inset-0 p-8 pt-12 pb-24">
            <div className={`relative h-full w-full rounded-t-full overflow-hidden border-2 
              ${isDark ? 'border-indigo-500/20 bg-indigo-950/20' : 'border-amber-200 bg-stone-50'}`}>
              
              <motion.img 
                src={monk.image} 
                alt={monk.name[lang]}
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              />
              
              {/* Divine Halo Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
            </div>
          </div>

          {/* Vertical Name Accent */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
            <p style={{ writingMode: 'vertical-lr' }} className={`text-[9px] uppercase font-bold tracking-[0.6em] rotate-180 opacity-40 ${isDark ? 'text-indigo-200' : 'text-stone-500'}`}>
              {monk.title[lang]}
            </p>
          </div>

          {/* Card Footer Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 text-center bg-gradient-to-t from-inherit to-transparent">
            <motion.h3 className={`text-xl font-serif font-bold mb-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>
              {monk.name[lang]}
            </motion.h3>
            
            <div className={`flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-amber-700'}`}>
              <Gem size={10} className="animate-pulse" />
              <span>{lang === 'mn' ? 'Захиалга' : 'Booking'}</span>
              <ArrowUpRight size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>

          {/* Corner Gem Decor */}
          <div className={`absolute bottom-4 left-4 z-40 p-1 rounded-full border ${isDark ? 'border-indigo-500/30 text-indigo-400' : 'border-amber-200 text-amber-600'}`}>
            <Sparkles size={10} />
          </div>
        </motion.div>
      </Link>
      
      {/* Floor Glow */}
      <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-4 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isDark ? 'bg-indigo-500/20' : 'bg-amber-500/10'}`} />
    </motion.div>
  );
}