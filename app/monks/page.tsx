"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowUpRight, Loader2, Orbit, Star } from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";
import { Monk } from "@/database/types";

// --- 1. THE MAGICAL STARFIELD ---
const Starfield = () => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-white"
        initial={{ 
          opacity: Math.random(), 
          x: Math.random() * 100 + "%", 
          y: Math.random() * 100 + "%",
          scale: Math.random() * 0.5 + 0.5 
        }}
        animate={{ 
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 3 + Math.random() * 5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{
          width: Math.random() * 3 + "px",
          height: Math.random() * 3 + "px",
          boxShadow: "0 0 10px rgba(255,255,255,0.8)"
        }}
      />
    ))}
  </div>
);

// --- 2. THE ZODIAC CELESTIAL FRAME (Enhanced) ---
const ZodiacFrame = ({ isDark }: { isDark: boolean }) => {
  const color = isDark ? "#50F2CE" : "#b45309";
  const secondary = isDark ? "#C72075" : "#f59e0b";

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <svg className="w-full h-full" viewBox="0 0 300 450" fill="none">
        <defs>
          <filter id="glow-symbol">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Animated Corner Brackets */}
        <motion.path 
          d="M30 20 H20 V30 M270 20 H280 V30 M280 420 V430 H270 M20 420 V430 H30" 
          stroke={color} strokeWidth="1" strokeLinecap="square"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Pulsing Zodiac Symbols */}
        <g className="font-serif font-bold" filter="url(#glow-symbol)">
          {[
            { x: 23, y: 28, char: "♈" },
            { x: 268, y: 28, char: "♋" },
            { x: 23, y: 428, char: "♎" },
            { x: 268, y: 428, char: "♑" }
          ].map((sym, i) => (
            <motion.text 
              key={i} x={sym.x} y={sym.y} fill={color} fontSize="10"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
            >
              {sym.char}
            </motion.text>
          ))}
        </g>

        {/* Ethereal Rings */}
        <circle cx="150" cy="225" r="180" stroke={secondary} strokeWidth="0.5" className="opacity-10" />
      </svg>
    </div>
  );
};

// --- 3. NEBULA ATMOSPHERICS ---
const NebulaOverlay = ({ isDark }: { isDark: boolean }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {isDark ? (
      <>
        <Starfield />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] blur-[150px] rounded-full opacity-25 bg-[#C72075]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-1/4 w-[600px] h-[600px] blur-[150px] rounded-full opacity-15 bg-[#2E1B49]" 
        />
      </>
    ) : (
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-white to-transparent" />
    )}
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
      <section className={`relative min-h-screen transition-colors duration-1000 pt-48 pb-64 overflow-hidden ${isDark ? "bg-[#05051a]" : "bg-[#fcfaf7]"}`}>
        <NebulaOverlay isDark={isDark} />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-32"
          >
            <div className={`inline-flex items-center gap-4 mb-6 ${isDark ? 'text-cyan-400' : 'text-amber-700'}`}>
              <motion.div animate={{ width: [0, 50, 0] }} transition={{ duration: 3, repeat: Infinity }} className="h-px bg-current opacity-30" />
              <span className="text-xs font-black tracking-[0.6em] uppercase flex items-center gap-2">
                <Sparkles size={14} className="animate-pulse" /> {t({ mn: "Одот Аркана", en: "Zodiac Arcana" })}
              </span>
              <motion.div animate={{ width: [0, 50, 0] }} transition={{ duration: 3, repeat: Infinity }} className="h-px bg-current opacity-30" />
            </div>
            
            <h1 className="text-7xl md:text-9xl font-serif mb-8 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
              <span className={isDark ? "text-white" : "text-stone-900"}>{isDark ? "The Astral" : "Guardians of"}</span><br/>
              <motion.span 
                animate={{ color: isDark ? ["#C72075", "#7B337D", "#C72075"] : "" }}
                transition={{ duration: 5, repeat: Infinity }}
                className={`italic font-light ${!isDark ? 'text-amber-600' : ''}`}
              >
                {isDark ? "Collective" : "Enlightenment"}
              </motion.span>
            </h1>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-cyan-500" size={48} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-24">
              {monks.map((monk, idx) => (
                <ZodiacTarotCard 
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

// --- 4. THE MAGIC ZODIAC CARD COMPONENT ---
function ZodiacTarotCard({ monk, index, isDark, lang }: { monk: Monk, index: number, isDark: boolean, lang: 'mn'|'en' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Springy 3D Rotation
  const rotateX = useSpring(useTransform(y, [-150, 150], [12, -12]), { stiffness: 60, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-12, 12]), { stiffness: 60, damping: 20 });
  
  // Magical Aurora Flash that follows mouse
  const flashX = useSpring(useTransform(x, (v) => v - 200));
  const flashY = useSpring(useTransform(y, (v) => v - 200));

  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, delay: index * 0.15, ease: "easeOut" }}
      className="group perspective-2000"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <Link href={`/monks/${monk._id}`}>
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={`relative aspect-[2/3.2] w-full rounded-sm overflow-hidden transition-all duration-1000 border-2
            ${isDark 
              ? 'bg-[#0C164F]/70 border-cyan-400/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl hover:border-cyan-400/50' 
              : 'bg-white border-stone-200 shadow-2xl'
            }`}
        >
          {/* HOLOGRAPHIC GLOW EFFECT (Follows mouse) */}
          {isDark && (
            <motion.div 
              style={{ x: flashX, y: flashY }}
              className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-cyan-400/20 via-[#C72075]/20 to-transparent blur-3xl z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}

          <ZodiacFrame isDark={isDark} />

          {/* Top Arcana Number */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 text-center">
            <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ duration: 3, repeat: Infinity }}
              className={`text-xs font-black tracking-[0.8em] ${isDark ? 'text-cyan-300 drop-shadow-[0_0_10px_#50F2CE]' : 'text-amber-700'}`}
            >
              {romanNumerals[index] || index + 1}
            </motion.span>
          </div>

          {/* Portal with Sacred Halo */}
          <div className="absolute inset-0 p-10 pt-16 pb-28">
            <div className={`relative h-full w-full rounded-t-full overflow-hidden border-2 transition-all duration-700
              ${isDark ? 'border-cyan-400/30 bg-[#2E1B49]/40 group-hover:border-cyan-400/60' : 'border-amber-200 bg-stone-50'}`}>
              
              <motion.img 
                src={monk.image} 
                alt={monk.name[lang]}
                className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 brightness-90 group-hover:brightness-110"
              />
              
              {/* Dynamic Aura Gradient */}
              <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'bg-gradient-to-t from-[#05051a] via-transparent to-transparent opacity-90' : 'bg-gradient-to-t from-black/50 via-transparent to-transparent'}`} />
              
              {/* Spinning Sacred Halo (Background) */}
              {isDark && (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/4 left-1/2 -translate-x-1/2 w-40 h-40 border border-cyan-400/10 rounded-full blur-sm"
                />
              )}
            </div>
          </div>

          {/* Floating Sacred Title */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40">
            <p style={{ writingMode: 'vertical-lr' }} className={`text-[10px] uppercase font-black tracking-[0.5em] rotate-180 transition-all ${isDark ? 'text-cyan-200 opacity-40 group-hover:opacity-80 group-hover:tracking-[0.7em]' : 'text-stone-400 opacity-40'}`}>
              {monk.title[lang]}
            </p>
          </div>

          {/* Footer Card Info */}
          <div className="absolute bottom-0 left-0 right-0 p-8 pb-10 text-center">
            <h3 className={`text-2xl font-serif font-black mb-2 transition-all group-hover:tracking-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>
              {monk.name[lang]}
            </h3>
            
            <div className={`flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${isDark ? 'text-cyan-400 group-hover:text-white' : 'text-amber-700'}`}>
              <Orbit size={14} className={isDark ? "animate-spin-slow" : ""} />
              <span>{lang === 'mn' ? 'Зурхай' : 'Zodiac Path'}</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
            </div>
          </div>

          {/* Interactive Star Corner */}
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.2 }}
            className={`absolute bottom-6 left-6 z-40 p-2 rounded-full border-2 transition-all duration-700 ${isDark ? 'border-cyan-400/40 text-cyan-300 bg-[#0C164F] shadow-[0_0_15px_#50F2CE]' : 'border-amber-200 text-amber-600 bg-white'}`}
          >
            <Star size={12} fill={isDark ? "currentColor" : "none"} />
          </motion.div>
        </motion.div>
      </Link>
      
      {/* Interactive Nebula Bloom (Floor Glow) */}
      <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 ${isDark ? 'bg-[#C72075]' : 'bg-amber-500/20'}`} />
    </motion.div>
  );
}