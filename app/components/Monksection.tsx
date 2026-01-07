"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  motion, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  AnimatePresence,
  useMotionTemplate 
} from "framer-motion";
import { Sparkles, ShieldCheck, Stars } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";
import { Monk } from "@/database/types";

// --- 1. STYLES & FONTS ---
const sectionStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Jost:wght@200;300;400&display=swap');
  .font-celestial { font-family: 'Cinzel', serif; }
  .font-ethereal { font-family: 'Jost', sans-serif; }
  .mask-gradient { mask-image: linear-gradient(to bottom, black 50%, transparent 100%); }
`;

interface LanguageContent { mn: string; en: string; }
interface MonkData {
  id: string | number;
  arcana: string;
  name: LanguageContent;
  title: LanguageContent;
  video: string;
}

interface ThemeConfig {
  textColor: string;
  accentColor: string;
  borderColor: string;
  cardBg: string;
  glowColor: string;
  mandalaColor: string;
  titleGradient: string;
  particleColor: string;
}

const RUNES = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ"];

// --- 2. ADVANCED BACKGROUNDS ---
const EtherealBackground: React.FC<{ isNight: boolean }> = ({ isNight }) => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Base Gradient */}
    <div className={`absolute inset-0 transition-colors duration-1000 ${isNight ? 'bg-[#05051a]' : 'bg-[#FFFBEB]'}`} />
    
    {/* Animated Nebula/Clouds */}
    <motion.div 
      animate={{ 
        rotate: [0, 360],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      className={`absolute top-[-50%] left-[-20%] w-[150vw] h-[150vw] rounded-full blur-[100px] opacity-20
        ${isNight 
          ? 'bg-[conic-gradient(from_0deg,_transparent_0%,_#4f46e5_30%,_transparent_60%)]' 
          : 'bg-[conic-gradient(from_0deg,_transparent_0%,_#fbbf24_30%,_transparent_60%)]'}`}
    />

    {/* Floating Dust Particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ 
          y: "-10vh", 
          opacity: [0, 1, 0],
          x: Math.sin(i) * 100 
        }}
        transition={{ 
          duration: 10 + Math.random() * 10, 
          repeat: Infinity, 
          delay: i * 0.5,
          ease: "linear" 
        }}
        className={`absolute w-1 h-1 rounded-full ${isNight ? 'bg-cyan-200' : 'bg-amber-400'}`}
        style={{ left: `${Math.random() * 100}%` }}
      />
    ))}
  </div>
);

// --- 3. CUSTOM SVG DECORATIONS ---
const MysticFrame: React.FC<{ theme: ThemeConfig, className?: string }> = ({ theme, className }) => (
  <svg className={`absolute w-full h-full pointer-events-none opacity-30 ${className}`} viewBox="0 0 400 600" fill="none">
    <path d="M20,20 L380,20 L380,580 L20,580 Z" stroke="currentColor" strokeWidth="1" className={theme.borderColor} />
    <path d="M20,50 L20,20 L50,20" stroke="currentColor" strokeWidth="3" className={theme.accentColor} />
    <path d="M380,50 L380,20 L350,20" stroke="currentColor" strokeWidth="3" className={theme.accentColor} />
    <path d="M20,550 L20,580 L50,580" stroke="currentColor" strokeWidth="3" className={theme.accentColor} />
    <path d="M380,550 L380,580 L350,580" stroke="currentColor" strokeWidth="3" className={theme.accentColor} />
  </svg>
);

// --- 4. MAIN COMPONENT ---
export default function MajesticTarotSection() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [monks, setMonks] = useState<MonkData[]>([]);

  useEffect(() => {
    setMounted(true);
    // Simulating fetching logic
    async function fetchMonks() {
        try {
            const res = await fetch('/api/monks');
            const data: Monk[] = await res.json();
            const limitedData = data.slice(0, 3);
            const mappedMonks: MonkData[] = limitedData.map((m, i) => ({
              id: m._id?.toString() || `temp-${i}`,
              arcana: RUNES[i % RUNES.length],
              name: m.name,
              title: m.title,
              video: m.video || "/default-tarot.mp4" 
            }));
            setMonks(mappedMonks);
        } catch(e) { console.error(e) }
    }
    fetchMonks();
  }, []);

  if (!mounted) return <div className="h-screen bg-[#FFFBEB]" />;

  const isNight = resolvedTheme === 'dark';

  // --- THEME CONFIGURATION ---
  const theme: ThemeConfig = isNight ? {
    textColor: "text-cyan-50",
    accentColor: "text-cyan-400",
    borderColor: "border-cyan-400/30",
    cardBg: "bg-[#0C164F]/40",
    glowColor: "rgba(34, 211, 238, 0.2)",
    mandalaColor: "text-cyan-500",
    titleGradient: "from-cyan-300 via-blue-500 to-purple-600",
    particleColor: "bg-cyan-400"
  } : {
    textColor: "text-[#451a03]",
    accentColor: "text-amber-600",
    borderColor: "border-amber-200",
    cardBg: "bg-[#fffbeb]/40",
    glowColor: "rgba(251,191,36,0.25)",
    mandalaColor: "text-amber-500",
    titleGradient: "from-amber-400 via-orange-500 to-amber-700",
    particleColor: "bg-amber-500"
  };

  return (
    <section className="relative w-full py-32 md:py-48 overflow-hidden font-ethereal transition-colors duration-1000">
      <style>{sectionStyles}</style>
      
      {/* 1. Dynamic Background */}
      <EtherealBackground isNight={isNight} />
      
      {/* 2. Rotating Mandala Underlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.07]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className={`relative w-[150vw] h-[150vw] border-[1px] border-dashed rounded-full flex items-center justify-center ${theme.mandalaColor}`}
        >
             {/* Simple Geometric Rings */}
             <div className="absolute w-[80%] h-[80%] border border-current rounded-full opacity-50" />
             <div className="absolute w-[60%] h-[60%] border-[2px] border-dotted border-current rounded-full opacity-70" />
        </motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        
        {/* 3. Header with Reveal Animation */}
        <header className="flex flex-col items-center text-center mb-24 md:mb-36 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`w-20 h-20 rounded-full border flex items-center justify-center backdrop-blur-md shadow-lg ${theme.borderColor} ${theme.cardBg}`}
          >
            <ShieldCheck className={theme.accentColor} size={36} strokeWidth={1} />
          </motion.div>
          
          <div className="relative">
            <h2 className={`text-5xl md:text-8xl font-celestial font-bold tracking-tighter ${theme.textColor} drop-shadow-sm`}>
               {t({ mn: "Мэргэ", en: "Tarot" })}
            </h2>
            <motion.h2 
               className={`text-5xl md:text-8xl font-celestial font-bold tracking-tighter absolute top-0 left-0 blur-xl opacity-50 ${theme.textColor}`}
               aria-hidden="true"
            >
               {t({ mn: "Мэргэ", en: "Tarot" })}
            </motion.h2>
          </div>
          
          <p className={`text-lg md:text-xl tracking-[0.2em] uppercase font-light ${theme.accentColor}`}>
             <span className="inline-block w-8 h-[1px] bg-current align-middle mr-3" />
             {t({ mn: "Ирээдүйгээ тольдох", en: "Glimpse the Future" })}
             <span className="inline-block w-8 h-[1px] bg-current align-middle ml-3" />
          </p>
        </header>

        {/* 4. The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 max-w-7xl mx-auto perspective-[1000px]">
           {monks.map((monk, index) => (
              <ParallaxCard 
                key={monk.id} 
                monk={monk} 
                index={index} 
                language={language === "mn" ? "mn" : "en"} 
                theme={theme} 
                isNight={isNight} 
              />
           ))}
        </div>
      </div>
    </section>
  );
}

// --- 5. HIGH-LEVEL ANIMATED CARD ---
function ParallaxCard({ monk, index, language, theme, isNight }: { monk: MonkData; index: number; language: "mn" | "en"; theme: ThemeConfig; isNight: boolean; }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion Values for Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth Springs for Rotation
  const rotateX = useSpring(useTransform(y, [-300, 300], [15, -15]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-15, 15]), { stiffness: 100, damping: 20 });
  
  // Parallax Layer Movements (Video moves opposite to card)
  const bgX = useTransform(x, [-300, 300], [20, -20]); 
  const bgY = useTransform(y, [-300, 300], [20, -20]);

  // Holographic Glare Position
  const glareX = useTransform(x, (val) => val + 150);
  const glareY = useTransform(y, (val) => val + 150);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}px ${glareY}px, ${theme.glowColor}, transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0); y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.15, type: "spring" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{ perspective: 1000 }}
      className="group relative h-[600px] w-full cursor-none z-10"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative w-full h-full rounded-[2rem] border transition-colors duration-500 shadow-2xl overflow-hidden backdrop-blur-xl
            ${theme.cardBg} ${isHovered ? theme.accentColor.replace('text-', 'border-') : theme.borderColor}`}
      >
        
        {/* A. Parallax Video Layer */}
        <motion.div 
            style={{ x: bgX, y: bgY, scale: 1.15 }} // Scaled up to avoid edges showing
            className="absolute inset-0 z-0"
        >
          <video 
             autoPlay loop muted playsInline 
             className={`w-full h-full object-cover transition-all duration-[1.5s] ease-out
                ${isHovered ? "saturate-150 contrast-125 brightness-75" : "saturate-[0.8] brightness-50 contrast-100"}`}
          >
            <source src={monk.video} type="video/mp4" />
          </video>
          
          {/* Noise/Grain Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />
        </motion.div>

        {/* B. Holographic Interaction Layer */}
        <motion.div
            style={{ background: glareBackground }}
            className="absolute inset-0 z-10 mix-blend-overlay pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* C. Decorative SVG Frame */}
        <div className="absolute inset-4 z-20 pointer-events-none">
            <MysticFrame theme={theme} className="w-full h-full" />
        </div>

        {/* D. Content Layer (3D Lifted) */}
        <div 
          className="absolute inset-0 z-30 flex flex-col justify-between p-8 pointer-events-none transform-style-3d"
        >
            {/* Top: Rune Mark */}
            <motion.div 
                style={{ translateZ: 40 }}
                className="flex justify-center pt-4"
            >
                <div className={`w-16 h-16 rounded-full border border-dashed flex items-center justify-center backdrop-blur-sm ${theme.borderColor}`}>
                    <span className={`text-4xl font-celestial ${theme.accentColor}`}>{monk.arcana}</span>
                </div>
            </motion.div>

            {/* Bottom: Info Reveal */}
            <motion.div 
                style={{ translateZ: 60 }}
                className="flex flex-col items-center pb-8"
            >
                <h3 className={`text-4xl md:text-5xl font-celestial font-black text-center text-white mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]`}>
                    {monk.name[language]}
                </h3>
                
                <div className="h-[2px] w-0 group-hover:w-24 bg-white/50 transition-all duration-500 mb-3" />

                <p className={`text-sm tracking-[0.3em] font-bold uppercase text-white/80`}>
                    {monk.title[language]}
                </p>

                {/* Floating "Read More" Hint */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    className={`mt-6 px-6 py-2 rounded-full backdrop-blur-md border ${theme.borderColor} flex items-center gap-2`}
                >
                    <Stars size={14} className={theme.accentColor} />
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${theme.textColor}`}>
                        {language === 'mn' ? 'Дэлгэрэнгүй' : 'Read Prediction'}
                    </span>
                </motion.div>
            </motion.div>
        </div>

        {/* E. Floating Particles (Simulated) */}
        <AnimatePresence>
          {isHovered && [...Array(5)].map((_, i) => (
             <motion.div
                key={i}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "50%", opacity: [0, 1, 0], x: Math.random() * 40 - 20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                className={`absolute bottom-0 w-1 h-1 rounded-full z-20 ${theme.particleColor}`}
                style={{ left: `${20 + Math.random() * 60}%` }}
             />
          ))}
        </AnimatePresence>
        
      </motion.div>

      {/* F. Custom Cursor Follower */}
      <motion.div
         style={{ x, y }}
         className="absolute top-1/2 left-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
          <div className={`w-12 h-12 -ml-6 -mt-6 rounded-full border border-dashed animate-[spin_4s_linear_infinite] ${isNight ? 'border-cyan-200' : 'border-amber-200'}`} />
          <div className={`absolute inset-0 w-2 h-2 m-auto rounded-full ${isNight ? 'bg-cyan-400' : 'bg-amber-500'}`} />
      </motion.div>

    </motion.div>
  );
}