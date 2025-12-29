"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  motion, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  AnimatePresence 
} from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";

// --- 1. MISSING STYLES DECLARATION ---
const sectionStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Jost:wght@200;300;400&display=swap');
  .font-celestial { font-family: 'Cinzel', serif; }
  .font-ethereal { font-family: 'Jost', sans-serif; }
`;

// --- 2. TIGHT INTERFACES ---
interface LanguageContent {
  mn: string;
  en: string;
}

interface MonkData {
  id: number;
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
}

// --- 3. BACKGROUND COMPONENTS ---
const HeavenlyBackground: React.FC = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Tailwind v4 suggests bg-linear-to-b instead of bg-gradient-to-b */}
    <div className="absolute inset-0 bg-linear-to-b from-[#FFFBEB] via-[#fffbf0] to-[#fff7ed]" />
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] opacity-30"
      style={{ background: "conic-gradient(from 0deg, transparent 0%, #fbbf24 10%, transparent 20%, #fbbf24 30%, transparent 50%)" }}
    />
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "110vh", opacity: 0 }}
        animate={{ y: "-10vh", opacity: [0, 0.6, 0] }}
        transition={{ duration: 10 + (i % 5), repeat: Infinity, delay: i * 0.8, ease: "linear" }}
        className="absolute bottom-0 w-2 h-2 bg-amber-400 rounded-full blur-xs"
        style={{ left: `${(i * 7) % 100}%` }}
      />
    ))}
  </div>
);

const CosmicBackground: React.FC = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]" />
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] right-[-20%] w-[120vw] h-[120vw] opacity-20"
      style={{ background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)" }}
    />
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.1, 1, 0.1], scale: [0.5, 1.5, 0.5] }}
        transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.2 }}
        className="absolute w-1 h-1 bg-indigo-100 rounded-full shadow-[0_0_4px_white]"
        style={{ top: `${(i * 13) % 100}%`, left: `${(i * 17) % 100}%` }}
      />
    ))}
  </div>
);

// --- 4. VIKING CORNER (Fixing missing className prop) ---
interface VikingCornerProps {
  theme: ThemeConfig;
  className?: string;
}

const VikingCorner: React.FC<VikingCornerProps> = ({ theme, className }) => (
  <svg className={`absolute w-14 h-14 ${theme.accentColor} opacity-60 ${className ?? ""}`} viewBox="0 0 100 100" fill="none">
    <path d="M0 0 L100 0 L100 4 L4 4 L4 100 L0 100 Z" fill="currentColor" />
    <path d="M12 12 C 30 12, 12 30, 30 30" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="8" cy="8" r="3" fill="currentColor" />
  </svg>
);

const MONKS_DATA: MonkData[] = [
  {
    id: 1,
    arcana: "ᚠ",
    name: { mn: "Данзанравжаа", en: "The Great Danzan" },
    title: { mn: "Говийн Догшин Ноён Хутагт", en: "Saint of the Gobi" },
    video: "/num1.mp4", 
  },
  {
    id: 2,
    arcana: "ᚢ",
    name: { mn: "Занабазар", en: "Holy Zanabazar" },
    title: { mn: "Өндөр Гэгээн", en: "The High Creator" },
    video: "/num4.mp4", 
  },
  {
    id: 3,
    arcana: "ᚦ",
    name: { mn: "Богд Жавзандамба", en: "8th Bogd Khan" },
    title: { mn: "Монголын Шашны Тэргүүн", en: "Supreme Oracle" },
    video: "/num3.mp4", 
  },
];

export default function MajesticTarotSection() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-screen bg-[#FDFBF7]" />;

  const isNight = resolvedTheme === "dark";

  const theme: ThemeConfig = isNight ? {
    textColor: "text-indigo-50",
    accentColor: "text-indigo-400",
    borderColor: "border-indigo-800/50",
    cardBg: "bg-[#05050a]/80",
    glowColor: "rgba(99,102,241,0.25)",
    mandalaColor: "text-indigo-500",
    titleGradient: "from-indigo-200 via-indigo-400 to-purple-600"
  } : {
    textColor: "text-[#451a03]",
    accentColor: "text-amber-600",
    borderColor: "border-amber-200",
    cardBg: "bg-[#fffbeb]/90",
    glowColor: "rgba(251,191,36,0.25)",
    mandalaColor: "text-amber-500",
    titleGradient: "from-amber-200 via-amber-500 to-amber-700"
  };

  return (
    <section className="relative w-full py-40 overflow-hidden font-ethereal transition-colors duration-1000">
      <style>{sectionStyles}</style>
      
      {isNight ? <CosmicBackground /> : <HeavenlyBackground />}
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className={`relative w-300 h-300 border border-current rounded-full flex items-center justify-center ${theme.mandalaColor}`}
        >
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-full h-px bg-linear-to-r from-transparent via-current to-transparent" 
              style={{ transform: `rotate(${i * 30}deg)` }} 
            />
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <header className="flex flex-col items-center text-center mb-32 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0 }} 
            whileInView={{ opacity: 1, scale: 1 }}
            className={`w-16 h-16 rounded-full border flex items-center justify-center mb-4 backdrop-blur-md ${theme.borderColor} ${theme.cardBg}`}
          >
            <ShieldCheck className={theme.accentColor} size={32} strokeWidth={1} />
          </motion.div>
          
          <h2 className={`text-6xl md:text-8xl font-celestial font-light tracking-tighter ${theme.textColor}`}>
            {t({ mn: "Дээд", en: "Supreme" })}{" "}
            <span className={`italic text-transparent bg-clip-text bg-linear-to-b ${theme.titleGradient}`}>
              Arcana
            </span>
          </h2>
          <div className={`w-40 h-px bg-linear-to-r from-transparent via-current to-transparent ${theme.mandalaColor}`} />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 max-w-7xl mx-auto">
           {MONKS_DATA.map((monk, index) => (
              <MajesticCard 
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

// --- 5. MAJESTIC CARD (Typed properly) ---
interface MajesticCardProps {
  monk: MonkData;
  index: number;
  language: "mn" | "en";
  theme: ThemeConfig;
  isNight: boolean;
}

function MajesticCard({ monk, index, language, theme, isNight }: MajesticCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-150, 150], [10, -10]), { stiffness: 40, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-10, 10]), { stiffness: 40, damping: 20 });
  const flashX = useTransform(x, (val: number) => val - 300);
  const flashY = useTransform(y, (val: number) => val - 300);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: index * 0.2 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
      className="group relative h-175 w-full perspective-[2000px] cursor-none"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative w-full h-full rounded-[30px] border transition-all duration-1000 overflow-hidden backdrop-blur-md shadow-2xl ${theme.cardBg} ${theme.borderColor}`}
      >
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay loop muted playsInline 
            className={`w-full h-full object-cover transition-all duration-[2s]
              ${isHovered ? " contrast-[1.1] " : "contrast-100 "}
            `}
          >
            <source src={monk.video} type="video/mp4" />
          </video>
          <div className={`absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40 transition-opacity duration-700 ${isHovered ? "opacity-60" : "opacity-90"}`} />
          
          <motion.div 
            style={{ 
                background: `radial-gradient(circle at center, ${theme.glowColor} 0%, transparent 70%)`,
                left: flashX,
                top: flashY
            }}
            className="absolute w-150 h-150 z-10 pointer-events-none mix-blend-screen blur-xl"
          />
        </div>

        <VikingCorner theme={theme} className="top-4 left-4" />
        <VikingCorner theme={theme} className="top-4 right-4 rotate-90" />
        <VikingCorner theme={theme} className="bottom-4 left-4 -rotate-90" />
        <VikingCorner theme={theme} className="bottom-4 right-4 rotate-180" />

        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
            <motion.div 
              animate={isHovered ? { y: 5, scale: 1.1 } : { y: 0, scale: 1 }}
              className={`font-celestial text-4xl font-black tracking-[0.2em] drop-shadow-lg ${theme.accentColor}`}
            >
              {monk.arcana}
            </motion.div>
        </div>

        <div className="absolute inset-0 z-40 flex flex-col items-center justify-end pb-20 px-10 pointer-events-none">
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-center"
              >
                <div className={`flex items-center justify-center gap-2 mb-4 ${theme.accentColor}`}>
                  <Sparkles size={18} className="animate-pulse" />
                </div>
                
                <h3 className="text-4xl font-celestial text-white font-bold tracking-tight mb-2 uppercase">
                  {monk.name[language]}
                </h3>
                
                <p className={`${theme.accentColor} font-bold tracking-[0.3em] text-[10px] uppercase`}>
                  {monk.title[language]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
            style={{ x, y }}
            className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <div className={`w-16 h-16 border rounded-full flex items-center justify-center backdrop-blur-sm ${theme.borderColor}`}>
                <div className={`w-2 h-2 rounded-full animate-ping ${isNight ? 'bg-indigo-400' : 'bg-amber-500'}`} />
            </div>
        </motion.div>
      </motion.div>

      <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-20 blur-[100px] rounded-full transition-opacity duration-1000 ${isHovered ? "opacity-100" : "opacity-0"} ${isNight ? 'bg-indigo-900/30' : 'bg-amber-600/20'}`} />
    </motion.div>
  );
}