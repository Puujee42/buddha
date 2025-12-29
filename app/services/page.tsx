"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { 
  ArrowRight, Eye, Star, Flame, Zap, Compass, Loader2, ShieldCheck 
} from "lucide-react";
import { useTheme } from "next-themes";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { Service } from "@/database/types";

// --- DYNAMIC VIKING FRAME ---
const VikingServiceFrame = ({ color }: { color: string }) => (
  <div className="absolute inset-0 pointer-events-none z-30">
    <svg className="w-full h-full" viewBox="0 0 400 600" fill="none">
      <path 
        d="M40 60 L40 40 L60 40 M340 40 L360 40 L360 60 M360 540 L360 560 L340 560 M60 560 L40 560 L40 540" 
        stroke={color} strokeWidth="1.5" strokeOpacity="0.6" 
      />
      <circle cx="200" cy="40" r="3" fill={color} />
      <path d="M160 40 Q200 10 240 40" stroke={color} strokeWidth="2" />
      <path d="M160 560 Q200 590 240 560" stroke={color} strokeWidth="2" />
      <text x="365" y="300" fill={color} fontSize="12" className="font-serif opacity-30 [writing-mode:vertical-rl]">
        ᚢᚦᚬᚱᚴᚼᚠᛅᛚ
      </text>
    </svg>
  </div>
);

export default function VikingServices() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <OverlayNavbar />
      
      {/* GLOBAL THEME SYNCED BACKGROUND */}
      <div className={`fixed inset-0 transition-colors duration-1000 -z-20 ${isDark ? "bg-[#020205]" : "bg-[#FDFBF7]"}`} />
      
      {/* Atmosphere Gradients */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${isDark ? "opacity-40" : "opacity-10"}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/20 blur-[120px]" />
      </div>

      <main className="relative min-h-screen pt-40 pb-32 overflow-hidden">
        {/* HERO */}
        <div className="container mx-auto px-6 text-center mb-24 relative z-10">
          <motion.h1 
            className={`text-6xl md:text-9xl font-serif leading-[0.8] mb-12 tracking-tighter transition-colors duration-700 ${isDark ? "text-white" : "text-stone-900"}`}
          >
            {t({mn: "Ариун", en: "Ancient"})} <br />
            <span className={`italic font-light transition-colors ${isDark ? "text-indigo-400" : "text-amber-600"}`}>
               {t({mn: "Зөвлөгөө", en: "Rituals"})}
            </span>
          </motion.h1>
        </div>

        {/* GRID */}
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className={`animate-spin ${isDark ? 'text-indigo-500' : 'text-amber-500'}`} size={48} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {services.map((service, idx) => (
                <ServiceTarotCard key={idx} service={service} index={idx} isGlobalDark={isDark} lang={language === 'mn' ? 'mn' : 'en'} />
              ))}
            </div>
          )}
        </div>
      </main>
      <GoldenNirvanaFooter />
    </>
  );
}

function ServiceTarotCard({ service, index, isGlobalDark, lang }: { service: any, index: number, isGlobalDark: boolean, lang: 'mn'|'en' }) {
  // Logic: Is this service naturally 'mystical' (Lunar)?
  const isMystical = service.type === "divination";
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 100, damping: 20 });

  // THEME MATRIX
  const theme = isGlobalDark ? {
    // DARK MODE STYLES
    bg: isMystical ? "bg-[#07070c]" : "bg-[#0a0a0f]",
    border: "border-white/10",
    accent: isMystical ? "#818cf8" : "#6366f1", // Indigo vs Violet
    text: "text-white",
    subText: isMystical ? "text-indigo-400" : "text-blue-400",
    desc: "text-slate-400",
    cardInner: "bg-white/5",
    btn: "bg-white text-black hover:bg-indigo-400",
    glow: "bg-indigo-500/10",
    ring: "border-white/5"
  } : {
    // LIGHT MODE STYLES
    bg: isMystical ? "bg-[#faf9f6]" : "bg-white",
    border: "border-stone-200",
    accent: isMystical ? "#4f46e5" : "#d97706", // Deep Indigo vs Amber
    text: "text-stone-900",
    subText: isMystical ? "text-indigo-600" : "text-amber-700",
    desc: "text-stone-500",
    cardInner: "bg-stone-100/50",
    btn: "bg-stone-900 text-white hover:bg-amber-700",
    glow: "bg-amber-500/5",
    ring: "border-stone-900/5"
  };

  const Icons = [Eye, Star, Flame, Zap, ShieldCheck, Compass];
  const Icon = Icons[index % Icons.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative group h-[620px]"
    >
      <Link href={`/booking/${service._id}`} className="block h-full">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={`relative h-full w-full rounded-[2rem] border transition-all duration-1000 
            ${theme.bg} ${theme.border} ${isGlobalDark ? 'shadow-2xl shadow-black' : 'shadow-xl shadow-stone-200'}`}
        >
          {/* Grain Texture (Syncs with theme) */}
          <div className={`absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply ${isGlobalDark ? 'invert' : ''} bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]`} />
          
          <VikingServiceFrame color={theme.accent} />

          {/* BACKGROUND ICON WATERMARK */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none" style={{ transform: "translateZ(10px)" }}>
             <Icon size={250} strokeWidth={1} color={theme.accent} />
          </div>

          <div className="relative z-40 p-10 h-full flex flex-col items-center">
            
            {/* TOP EMBLEM */}
            <div className={`w-10 h-10 rounded-full border mb-10 flex items-center justify-center font-serif font-bold text-xs ${theme.subText} ${theme.ring}`}>
              {index + 1}
            </div>

            {/* IDENTITY BLOOM */}
            <div style={{ transform: "translateZ(40px)" }} className="flex flex-col items-center">
               <div className={`mb-8 p-6 rounded-[2rem] border-2 transition-all duration-500 group-hover:rotate-[360deg] 
                  ${theme.ring} ${theme.cardInner}`}>
                  <Icon color={theme.accent} size={36} />
               </div>

               <span className={`text-[10px] font-black tracking-[0.4em] uppercase mb-4 ${theme.subText}`}>
                 {service.type === "divination" ? "Ancient Arcana" : "Holy Offering"}
               </span>

               <h3 className={`text-4xl font-serif font-bold leading-none mb-6 px-2 text-center ${theme.text}`}>
                 {service.title?.[lang]}
               </h3>

               <p className={`text-sm leading-relaxed max-w-[260px] text-center mb-8 font-medium ${theme.desc}`}>
                 {service.desc?.[lang]?.substring(0, 85)}...
               </p>
            </div>

            <div className="flex-1" />

            {/* ACTION SECTION */}
            <div style={{ transform: "translateZ(20px)" }} className="w-full">
               <div className={`flex justify-between items-end mb-8 border-b pb-4 ${theme.ring}`}>
                  <div className="text-left">
                     <span className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${theme.text}`}>Sacrifice</span>
                     <p className={`text-2xl font-serif font-black ${theme.text}`}>{service.price.toLocaleString()}₮</p>
                  </div>
                  <div className={`text-right text-[10px] font-black uppercase tracking-tighter opacity-40 ${theme.text}`}>
                     {service.duration} <br /> {lang === 'mn' ? 'Мөчлөг' : 'Session'}
                  </div>
               </div>

               <button className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 ${theme.btn}`}>
                  {lang === 'mn' ? 'Зан үйл эхлэх' : 'Initiate Ritual'}
                  <ArrowRight size={14} />
               </button>
            </div>

          </div>

          {/* DYNAMIC GLOW (Indigo in Dark, Amber in Light) */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-[100px] pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-1000 ${theme.glow}`} />
        </motion.div>
        
        {/* Floor Shadow */}
        <div className={`absolute -bottom-8 left-10 right-10 h-10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 
           ${isGlobalDark ? 'bg-indigo-900/30' : 'bg-amber-900/10'}`} />
      </Link>
    </motion.div>
  );
}