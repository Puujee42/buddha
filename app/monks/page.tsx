"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  AnimatePresence 
} from "framer-motion";
import { 
  Sparkles, 
  Sun, 
  Moon,
  Flower, 
  ArrowUpRight,
  Gem
} from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { Monk } from "@/database/types";

// --- 1. SVG FRAMES (CROWNS) ---

// A. The Sun Wukong Golden Fillet (Day)
const GoldenFilletFrame = () => (
  <div className="absolute top-0 left-0 w-full h-[150px] z-30 pointer-events-none drop-shadow-xl">
    <svg viewBox="0 0 400 150" className="w-full h-full fill-none overflow-visible">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <filter id="goldGlow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M 10 120 Q 20 120, 30 100 Q 50 60, 200 70 Q 350 60, 370 100 Q 380 120, 390 120" stroke="url(#goldGradient)" strokeWidth="6" strokeLinecap="round" filter="url(#goldGlow)" />
      <circle cx="20" cy="115" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
      <circle cx="380" cy="115" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
      <path d="M 185 70 Q 200 90, 215 70 L 200 50 Z" fill="#78350F" />
    </svg>
    <div className="absolute top-[60px] left-1/2 -translate-x-1/2 -translate-y-1/2">
       <Gem size={20} className="text-red-600 fill-red-500 animate-pulse drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
    </div>
  </div>
);

// B. The Night God Silver Diadem (Night)
const SilverDiademFrame = () => (
  <div className="absolute top-0 left-0 w-full h-[150px] z-30 pointer-events-none drop-shadow-xl">
    <svg viewBox="0 0 400 150" className="w-full h-full fill-none overflow-visible">
      <defs>
        <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="30%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#e2e8f0" /> {/* Shine */}
          <stop offset="70%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <filter id="silverGlow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Sharper, more moon-like curve */}
      <path d="M 10 110 Q 40 110, 60 80 Q 200 100, 340 80 Q 360 110, 390 110" stroke="url(#silverGradient)" strokeWidth="5" strokeLinecap="round" filter="url(#silverGlow)" />
      <path d="M 200 70 L 195 90 L 200 110 L 205 90 Z" fill="#818cf8" filter="url(#silverGlow)" />
      <circle cx="20" cy="110" r="4" fill="#312e81" stroke="#a5b4fc" strokeWidth="2" />
      <circle cx="380" cy="110" r="4" fill="#312e81" stroke="#a5b4fc" strokeWidth="2" />
    </svg>
    <div className="absolute top-[85px] left-1/2 -translate-x-1/2 -translate-y-1/2">
       <div className="relative">
         <Moon size={24} className="text-indigo-200 fill-indigo-400 animate-pulse drop-shadow-[0_0_15px_rgba(99,102,241,1)]" />
         <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 animate-ping" />
       </div>
    </div>
  </div>
);

// --- 2. ATMOSPHERICS ---
const SamsaraWheel = () => (
  <div className="absolute top-[-20%] right-[-10%] w-[120vw] h-[120vw] opacity-[0.04] pointer-events-none z-0">
    <motion.svg viewBox="0 0 100 100" className="w-full h-full fill-amber-900" animate={{ rotate: 360 }} transition={{ duration: 240, repeat: Infinity, ease: "linear" }}>
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 1" />
        <path d="M50 0 L50 100 M0 50 L100 50 M15 15 L85 85 M85 15 L15 85" stroke="currentColor" strokeWidth="0.05" />
    </motion.svg>
  </div>
);

export default function CelestialMonkShowcase() {
  const { t, language } = useLanguage();
  const [monks, setMonks] = useState<Monk[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
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

  const content = {
    tag: t({ mn: "Ариун Багш нар", en: "Divine Teachers" }),
    title: t({ mn: "Гэгээрлийн", en: "Guardians of" }),
    subtitle: t({ mn: "Хөтөч", en: "Realms" }),
    desc: t({ mn: "Энэрэл нигүүлсэл ба нууцлаг ертөнцийн хөтөч нар.", en: "Masters of Light and Keepers of the Night Mysteries." }),
    btn: t({ mn: "Дэлгэрэнгүй", en: "Consult" }),
  };

  return (
    <>
      <OverlayNavbar />
      <section ref={containerRef} className="relative w-full min-h-screen bg-[#FDFBF7] text-[#1c100b] font-serif overflow-hidden pb-40">
        
        {/* ATMOSPHERE */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0f9ff] via-[#fffbf0] to-[#fff7ed] z-0" />
        <SamsaraWheel />
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-soft-light" />
        
        <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-36">
          
          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-32 relative">
             <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="mb-6 flex items-center gap-3">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-amber-500/50" />
                <span className="text-amber-600/80 text-xs font-bold tracking-[0.4em] uppercase flex items-center gap-2">
                   <Sun size={14} className="animate-spin-slow text-amber-500" /> {content.tag}
                </span>
                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-amber-500/50" />
             </motion.div>

             <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="text-7xl md:text-9xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#451a03] via-[#78350F] to-[#b45309] drop-shadow-sm leading-none tracking-tight">
               {content.title} <br />
               <span className="italic font-light text-amber-500/90 text-6xl md:text-8xl">{content.subtitle}</span>
             </motion.h1>
             
             <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="mt-10 max-w-lg text-[#78350F]/70 font-medium text-lg leading-relaxed mix-blend-multiply">
                {content.desc}
             </motion.p>
          </div>

          {/* GRID OF CARDS */}
          {loading ? (
             <div className="h-96 w-full flex items-center justify-center"><Sun className="w-16 h-16 text-amber-400 animate-spin" /></div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20 w-full perspective-2000">
                {monks.map((monk, index) => (
                   <DivineCard 
                      key={monk._id?.toString() || index} 
                      monk={monk} 
                      index={index} 
                      language={language}
                      btnText={content.btn} 
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

// =========================================================================
// SUB-COMPONENT: DYNAMIC "SUN" OR "MOON" CARD
// =========================================================================
function DivineCard({ monk, index, language, btnText }: { monk: Monk, index: number, language: "mn" | "en", btnText: string }) {
  
  // LOGIC: Determine Aesthetic based on keywords
  const keywords = [...(monk.specialties || []), monk.title?.en || ""].join(" ").toLowerCase();
  const isNight =false;
  // Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-150, 150], [8, -8]), { stiffness: 40, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-8, 8]), { stiffness: 40, damping: 15 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }
  const handleMouseLeave = () => { x.set(0); y.set(0); };
  
  const floatDuration = 6 + (index % 3);

  // --- STYLE MAPPING --- 
  const theme = isNight ? {
      frame: <SilverDiademFrame />,
      cardBg: "bg-slate-900/80 border-indigo-500/30",
      halo: "bg-gradient-to-t from-indigo-600/30 to-purple-900/10",
      shadow: "shadow-[0_20px_60px_-10px_rgba(30,27,75,0.6)] group-hover:shadow-[0_40px_90px_-10px_rgba(99,102,241,0.4)]",
      textColor: "text-indigo-100",
      accentText: "text-indigo-400",
      imageMix: "mix-blend-normal opacity-90 brightness-110 contrast-125 saturate-50", // Cool mystic look
      particles: true,
      buttonColor: "text-indigo-300 group-hover:text-white border-indigo-800",
      icon: <Moon size={16} />,
      groundShadow: "bg-indigo-950/40"
  } : {
      frame: <GoldenFilletFrame />,
      cardBg: "bg-white/60 border-white/80",
      halo: "bg-gradient-to-t from-amber-500/20 via-orange-300/10 to-transparent",
      shadow: "shadow-[0_20px_40px_-10px_rgba(75,50,30,0.1)] group-hover:shadow-[0_40px_80px_-10px_rgba(245,158,11,0.3)]",
      textColor: "text-[#451a03]",
      accentText: "text-[#92400e]/80",
      imageMix: "", // Classic parchment look
      particles: false,
      buttonColor: "text-amber-600 group-hover:text-amber-800 border-amber-200",
      icon: <Sun size={16} />,
      groundShadow: "bg-[#78350F]/10"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="relative group h-[580px] shadow-2xl w-full cursor-pointer z-10"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/monks/${monk._id}`} className="block h-full w-full">
      
        <motion.div
           animate={{ y: [-10, 10, -10] }}
           transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut" }}
           style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
           className="relative h-full shadow-2xl w-full"
        >
           
           {/* A. HALO BACKDROP */}
           <div className={`absolute top-[50px] left-1/2 -translate-x-1/2 w-[120%] h-[60%] rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 translate-z-[-20px] ${theme.halo}`} />

           {/* B. MAIN CARD BODY */}
           <div className={`absolute inset-0 backdrop-blur-xl border rounded-b-[12px] overflow-hidden transition-all duration-500 flex flex-col pt-12 rounded-t-[100px] ${theme.cardBg} ${theme.shadow}`}>
              
              {/* THE CROWN (Sun vs Moon) */}
              <div className="absolute -top-1 left-0 right-0 z-40 transform scale-[1.05] origin-bottom group-hover:scale-110 transition-transform duration-700">
                 {theme.frame}
              </div>

              {/* 1. IMAGE AREA */}
              <div 
                className="relative flex-1 mx-3 mt-4 overflow-hidden rounded-t-[120px] rounded-b-[4px] shadow-inner bg-current"
                style={{ transform: "translateZ(10px)" }}
              >
                 <motion.div className="w-full h-full relative" whileHover={{ scale: 1.05 }} transition={{ duration: 1.5, ease: "easeOut" }}>
                    <img 
                      src={monk.image} 
                      alt={monk.name[language]}
                      className={`w-full h-full object-cover transition-all duration-700 pt-8 ${theme.imageMix}`} 
                    />
                    
                    {/* Night Mode Stars inside Image */}
                    {theme.particles && (
                       <div className="absolute inset-0 z-20 pointer-events-none">
                          {[...Array(10)].map((_,i) => (
                             <motion.div 
                               key={i}
                               animate={{ opacity: [0,1,0], scale: [0.5,1,0.5] }}
                               transition={{ duration: 2+i, repeat: Infinity }}
                               className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"
                               style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%` }}
                             />
                          ))}
                       </div>
                    )}
                 </motion.div>
                 
                 {/* Internal Shine */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent z-20 pointer-events-none group-hover:opacity-50 opacity-20 transition-opacity" />
              </div>

              {/* 2. VERTICAL SCRIPT */}
              <div 
                 className={`absolute top-32 right-6 bottom-40 w-10 flex flex-col items-center justify-start z-30 opacity-70 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay`}
                 style={{ transform: "translateZ(30px)" }}
              >
                 <div className="h-full border-r-2 border-current opacity-30 absolute right-4" />
                 <span style={{ writingMode: 'vertical-rl' }} className={`font-serif text-xl tracking-[0.2em] font-bold pt-4 h-full drop-shadow-md ${isNight ? "text-indigo-200" : "text-[#78350F]"}`}>
                    {monk.name.mn.split(" ")[0]}
                 </span>
              </div>

              {/* 3. INFO CONTENT */}
              <div 
                 className={`h-36 flex flex-col justify-center items-center text-center p-6 z-20 relative bg-gradient-to-t ${isNight ? "from-[#020617] via-[#1e1b4b]/80" : "from-white via-white/95"} to-transparent`}
                 style={{ transform: "translateZ(20px)" }}
              >
                 {/* Decorative Icon */}
                 <div className={`absolute -top-6 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 border ${isNight ? "bg-[#1e1b4b] border-indigo-500 text-indigo-300" : "bg-white border-amber-100 text-amber-500"}`}>
                    {theme.icon}
                 </div>

                 <h3 className={`text-2xl font-serif font-bold leading-none mb-2 pt-2 transition-colors ${theme.textColor}`}>
                    {monk.name[language]}
                 </h3>
                 <p className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-4 ${theme.accentText}`}>
                    {monk.title[language]}
                 </p>

                 <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b pb-0.5 transition-all ${theme.buttonColor}`}>
                    {btnText} <ArrowUpRight size={12} />
                 </div>
              </div>

           </div>

           {/* C. SHADOW */}
           <div className={`absolute -bottom-10 left-[20%] right-[20%] h-4 blur-xl rounded-[100%] transition-all duration-500 group-hover:scale-x-125 ${theme.groundShadow}`} />

        </motion.div>
      </Link>
    </motion.div>
  );
}