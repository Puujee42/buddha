"use client";

import React from "react";
import Link from "next/link";
import { 
  motion, 
  useTransform, 
  useSpring, 
  useMotionValue
} from "framer-motion";
import { 
  Sparkles, 
  Sun, 
  Moon,
  Flower, 
  ArrowUpRight,
  Eye
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Monk } from "@/database/types";

// --- 1. THE CROWNS (CUSTODIANS OF THE REALMS) ---

const GoldenFilletFrame = () => (
  <div className="absolute top-0 left-0 w-full h-[150px] z-30 pointer-events-none drop-shadow-2xl">
    <svg viewBox="0 0 400 150" className="w-full h-full fill-none overflow-visible">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <filter id="goldGlow"><feGaussianBlur stdDeviation="3" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M 10 120 Q 200 60, 390 120" stroke="url(#goldGradient)" strokeWidth="8" strokeLinecap="round" filter="url(#goldGlow)" />
      <path d="M 180 75 Q 200 100, 220 75 L 200 40 Z" fill="#78350F" />
      <circle cx="20" cy="115" r="6" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
      <circle cx="380" cy="115" r="6" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
    </svg>
    <div className="absolute top-[55px] left-1/2 -translate-x-1/2 -translate-y-1/2">
       <Flower size={24} className="text-amber-500 fill-amber-200 animate-pulse" />
    </div>
  </div>
);

const SilverDiademFrame = () => (
  <div className="absolute top-0 left-0 w-full h-[150px] z-30 pointer-events-none drop-shadow-2xl">
    <svg viewBox="0 0 400 150" className="w-full h-full fill-none overflow-visible">
      <defs>
        <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
      <path d="M 10 110 Q 200 130, 390 110" stroke="url(#silverGradient)" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <path d="M 50 100 Q 200 40, 350 100" stroke="url(#silverGradient)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 200 40 L 190 70 L 200 100 L 210 70 Z" fill="#818cf8" />
    </svg>
    <div className="absolute top-[45px] left-1/2 -translate-x-1/2 -translate-y-1/2">
       <div className="relative">
         <Eye size={22} className="text-indigo-200 fill-indigo-900 animate-pulse" />
         <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-30 animate-ping" />
       </div>
    </div>
  </div>
);

// --- 2. SACRED ATMOSPHERICS ---

const DharmaMandala = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none opacity-[0.04] z-0">
    <motion.svg viewBox="0 0 100 100" className="w-full h-full text-amber-900 fill-current" animate={{ rotate: 360 }} transition={{ duration: 180, repeat: Infinity, ease: "linear" }}>
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 1" />
        <path d="M50 0 L50 100 M0 50 L100 50" stroke="currentColor" strokeWidth="0.05" />
    </motion.svg>
  </div>
);

// --- 3. MAIN COMPONENT ---

export default function MonksList({ monks }: { monks: Monk[] }) {
  const { t, language } = useLanguage();

  return (
    <section className="relative w-full py-32 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1105] to-[#0a0a0a] z-0" />
      <DharmaMandala />
      
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-28">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center gap-3 mb-6">
            <span className="text-amber-500/60 text-xs tracking-[0.5em] uppercase font-black flex items-center gap-2">
               <Sparkles size={14} /> {t({ mn: "Тэнгэрлэг Холбоо", en: "Mystical Union" })}
            </span>
          </motion.div>

          <h2 className="text-6xl md:text-8xl font-serif leading-none">
            <span className="block text-amber-50 drop-shadow-[0_0_20px_rgba(251,191,36,0.2)]">
               {t({ mn: "Ариун Багш ба", en: "Sacred Masters &" })}
            </span>
            <span className="block italic font-light text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
               {t({ mn: "Нууц Увидас", en: "Forbidden Arcane" })}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {monks.map((monk, index) => (
            <TarotDharmaCard 
              key={monk._id?.toString() || index} 
              monk={monk} 
              index={index} 
              language={language} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- 4. THE HYBRID CARD COMPONENT ---

function TarotDharmaCard({ monk, index, language }: { monk: Monk, index: number, language: "mn" | "en" }) {
  // Logic: First 2 are "Forbidden Magic" (Night), others are "Heavenly Buddha" (Day)
  const isNight = index < 2; 

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-150, 150], [10, -10]), { stiffness: 40, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-10, 10]), { stiffness: 40, damping: 15 });

  const theme = isNight ? {
    crown: <SilverDiademFrame />,
    cardBg: "bg-[#0a0b14]/90 border-indigo-500/30",
    glow: "bg-indigo-600/20 shadow-[0_0_80px_rgba(79,70,229,0.3)]",
    text: "text-indigo-50",
    accent: "text-indigo-400",
    btn: "border-indigo-500/50 text-indigo-300",
    halo: "from-indigo-600/40 via-purple-900/10 to-transparent",
    icon: <Moon size={16} />,
    overlay: "bg-indigo-900/10"
  } : {
    crown: <GoldenFilletFrame />,
    cardBg: "bg-[#1a1105]/90 border-amber-500/30",
    glow: "bg-amber-600/20 shadow-[0_0_80px_rgba(217,119,6,0.3)]",
    text: "text-amber-50",
    accent: "text-amber-500",
    btn: "border-amber-500/50 text-amber-300",
    halo: "from-amber-600/40 via-orange-900/10 to-transparent",
    icon: <Sun size={16} />,
    overlay: "bg-amber-900/10"
  };

  return (
    <Link href={`/monks/${monk._id}`}>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-[620px] w-full cursor-pointer z-10"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="h-full w-full">
        
        {/* BACK SHADOW */}
        <div className={`absolute inset-10 rounded-[100px] blur-[100px] opacity-30 -z-20 transition-all duration-700 group-hover:opacity-50 group-hover:scale-110 ${isNight ? 'bg-indigo-900' : 'bg-amber-900'}`} />

        {/* HALO REVEAL */}
        <div className={`absolute top-10 left-1/2 -translate-x-1/2 w-[140%] h-[60%] rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 bg-gradient-to-t ${theme.halo}`} />

        {/* MAIN BODY */}
        <div className={`absolute inset-0 backdrop-blur-2xl border flex flex-col pt-16 rounded-t-[120px] rounded-b-[30px] transition-all duration-500 ${theme.cardBg} ${theme.glow} group-hover:scale-[1.02]`}>
          
          {/* THE CROWN */}
          <div className="absolute -top-2 left-0 right-0 z-40 transform scale-[1.1] transition-transform duration-700 group-hover:scale-[1.15]">
            {theme.crown}
          </div>

          {/* PORTAL (Image/Video) */}
          <div className="relative flex-1 mx-4 mt-2 overflow-hidden rounded-t-[100px] rounded-b-[10px] bg-black/40 border border-white/5 shadow-inner">
             {/* Note: Original code used monk.video which is not in Monk type, assuming it might be or using image fallback */}
             {(monk as any).video ? (
                <video autoPlay loop muted playsInline className={`w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000`}>
                  <source src={(monk as any).video} type="video/mp4" />
                </video>
             ) : (
                <img src={monk.image} className={`w-full h-full object-cover transition-all duration-1000 ${isNight ? 'brightness-75 contrast-125' : 'sepia-[0.2]'}`} alt="" />
             )}
             <div className={`absolute inset-0 ${theme.overlay} mix-blend-overlay`} />
             
             {/* Forbidden Runes (Floating Particles) */}
             {isNight && (
                <div className="absolute inset-0 pointer-events-none z-20">
                   {[...Array(6)].map((_, i) => (
                      <motion.div 
                        key={i} 
                        animate={{ y: [0, -20, 0], opacity: [0, 0.5, 0] }} 
                        transition={{ duration: 3 + i, repeat: Infinity }}
                        className="absolute text-[10px] text-indigo-300 font-serif"
                        style={{ top: `${20 + i * 10}%`, left: `${Math.random() * 80}%` }}
                      >
                         ᠵᠢᠷᠭᠠᠯ
                      </motion.div>
                   ))}
                </div>
             )}
          </div>

          {/* SCRIPT PILLAR */}
          <div className="absolute top-40 right-8 z-30 opacity-40 group-hover:opacity-100 transition-all duration-700" style={{ writingMode: 'vertical-rl' }}>
             <span className={`font-serif text-2xl tracking-[0.3em] font-black ${theme.accent} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                {monk.name.mn.split(" ")[0]}
             </span>
          </div>

          {/* CONTENT */}
          <div className={`h-40 flex flex-col justify-center items-center text-center p-6 z-20 relative bg-gradient-to-t ${isNight ? 'from-black' : 'from-[#1a1105]'} to-transparent`}>
             <div className={`absolute -top-6 p-2 rounded-full border shadow-[0_0_15px_rgba(0,0,0,0.5)] ${theme.cardBg} ${theme.accent}`}>
                {theme.icon}
             </div>

             <h3 className={`text-2xl font-serif font-bold mb-1 ${theme.text}`}>
                {monk.name[language]}
             </h3>
             <p className={`text-[10px] uppercase tracking-[0.3em] font-black mb-5 ${theme.accent}`}>
                {monk.title[language]}
             </p>

             <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b pb-1 transition-all hover:scale-105 ${theme.btn}`}>
                {t({ mn: "АВРАЛ ЭРЭХ", en: "SEEK GUIDANCE" })} <ArrowUpRight size={12} />
             </div>
          </div>

        </div>

        {/* GROUND SHADOW */}
        <div className={`absolute -bottom-8 left-[20%] right-[20%] h-6 blur-2xl rounded-full transition-all duration-500 group-hover:scale-x-150 ${isNight ? 'bg-indigo-900/40' : 'bg-amber-900/40'}`} />

      </motion.div>
    </motion.div>
    </Link>
  );
}