"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Eye, Star, Flame, Zap, Compass, Loader2, ShieldCheck, Orbit, Sparkles
} from "lucide-react";
import { useTheme } from "next-themes";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { Service } from "@/database/types";

// --- 1. ENHANCED ZODIAC CELESTIAL FRAME WITH ANIMATIONS ---
const ZodiacServiceFrame = ({ color }: { color: string }) => (
  <div className="absolute inset-0 pointer-events-none z-30">
    <svg className="w-full h-full" viewBox="0 0 400 600" fill="none">
      <defs>
        <filter id="celestial-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Animated Corner Brackets */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        d="M40 60 L40 40 L60 40 M340 40 L360 40 L360 60 M360 540 L360 560 L340 560 M60 560 L40 560 L40 540"
        stroke={color} strokeWidth="1" strokeOpacity="0.4"
      />
      {/* Pulsing Sacred Geometry Rings */}
      <motion.circle
        cx="200" cy="40" r="15"
        stroke={color} strokeWidth="0.5" strokeOpacity="0.2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="200" cy="560" r="20"
        stroke={color} strokeWidth="0.5" strokeOpacity="0.2"
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      {/* Rotating Zodiac Symbols Bar */}
      <g fill={color} className="opacity-30" style={{ fontSize: '10px' }} filter="url(#celestial-glow)">
        <motion.text
          x="375" y="200" className="[writing-mode:vertical-rl]"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >♈ ♉ ♊ ♋ ♌ ♍</motion.text>
        <motion.text
          x="15" y="200" className="[writing-mode:vertical-rl]"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >♎ ♏ ♐ ♑ ♒ ♓</motion.text>
      </g>
    </svg>
  </div>
);

export default function CelestialServices() {
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
      <main className={`relative min-h-screen transition-colors duration-1000 overflow-hidden ${isDark ? "bg-[#05051a]" : "bg-[#FDFBF7]"}`}>
        {/* --- ENHANCED NEBULA BACKGROUND WITH ANIMATIONS (Watercolor Style) --- */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {isDark && (
            <>
              <motion.div
                className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#C72075]/10 blur-[140px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#2E1B49]/20 blur-[120px]"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen" />
              {/* Added Sparkling Stars */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: Math.random() * 5 }}
                />
              ))}
            </>
          )}
        </div>

        {/* HERO WITH ENHANCED ANIMATIONS */}
        <div className="container mx-auto px-6 text-center pt-48 mb-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            <motion.span
              className={`text-[10px] font-black tracking-[0.6em] uppercase flex items-center justify-center gap-2 ${isDark ? "text-cyan-400" : "text-amber-700"}`}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Orbit size={14} /> {t({mn: "Одот тамга", en: "Celestial Seals"})}
            </motion.span>
            <motion.h1
              className={`text-6xl md:text-9xl font-serif leading-[0.8] tracking-tighter transition-colors duration-700 ${isDark ? "text-white" : "text-stone-900"}`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {t({mn: "Ариун", en: "Ancient"})} <br />
              <span className={`italic font-light transition-colors ${isDark ? "text-[#C72075]" : "text-amber-600"}`}>
                {t({mn: "Зан Үйл", en: "Rituals"})}
              </span>
            </motion.h1>
          </motion.div>
        </div>

        {/* GRID WITH STAGGERED ENTRANCE ANIMATIONS */}
        <div className="container mx-auto px-6 pb-40">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className={`animate-spin ${isDark ? 'text-cyan-500' : 'text-amber-500'}`} size={48} />
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.2 } }
                }}
              >
                {services.map((service, idx) => (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                  >
                    <ServiceTarotCard service={service} index={idx} isGlobalDark={isDark} lang={language === 'mn' ? 'mn' : 'en'} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
      <GoldenNirvanaFooter />
    </>
  );
}

function ServiceTarotCard({ service, index, isGlobalDark, lang }: { service: any, index: number, isGlobalDark: boolean, lang: 'mn'|'en' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 80, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 80, damping: 20 });
  // Enhanced Interactive Glow follow mouse with scale
  const flashX = useSpring(useTransform(x, (v) => v - 200));
  const flashY = useSpring(useTransform(y, (v) => v - 200));

  const theme = isGlobalDark ? {
    bg: "bg-[#0C164F]/80",
    border: "border-cyan-400/20",
    accent: "#50F2CE", // Cyan
    secondary: "#C72075", // Magenta
    text: "text-white",
    subText: "text-cyan-300",
    desc: "text-cyan-50/60",
    btn: "bg-gradient-to-r from-[#C72075] to-[#7B337D] text-white",
    glow: "bg-[#C72075]/20"
  } : {
    bg: "bg-white",
    border: "border-stone-200",
    accent: "#d97706",
    secondary: "#f59e0b",
    text: "text-stone-900",
    subText: "text-amber-700",
    desc: "text-stone-500",
    btn: "bg-stone-900 text-white",
    glow: "bg-amber-500/5"
  };

  const Icons = [Eye, Star, Flame, Zap, ShieldCheck, Compass];
  const Icon = Icons[index % Icons.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative group h-[620px] perspective-1000"
      whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
    >
      <Link href={`/booking/${service._id}`} className="block h-full">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={`relative h-full w-full rounded-[2.5rem] border backdrop-blur-xl transition-all duration-1000
            ${theme.bg} ${theme.border} ${isGlobalDark ? 'shadow-[0_0_50px_rgba(0,0,0,0.3)] hover:border-cyan-400/50' : 'shadow-xl'}`}
        >
          {/* Enhanced Holographic Mouse Shine with Animation */}
          {isGlobalDark && (
            <motion.div
              style={{ x: flashX, y: flashY }}
              className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-cyan-400/10 via-[#C72075]/10 to-transparent blur-3xl z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          )}
          <ZodiacServiceFrame color={theme.accent} />
          <div className="relative z-40 p-10 h-full flex flex-col items-center">
            {/* TOP EMBLEM WITH PULSE */}
            <motion.div
              className={`w-10 h-10 rounded-full border mb-10 flex items-center justify-center font-serif font-black text-xs transition-colors duration-700
                ${isGlobalDark ? 'border-cyan-400/30 text-cyan-300' : 'border-stone-200 text-stone-400'}`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {index + 1}
            </motion.div>
            <div style={{ transform: "translateZ(40px)" }} className="flex flex-col items-center">
              <motion.div
                className={`mb-8 p-6 rounded-full border transition-all duration-1000 group-hover:rotate-[360deg]
                  ${isGlobalDark ? 'border-cyan-400/20 bg-[#2E1B49]/40 shadow-[0_0_20px_#C7207510]' : 'border-stone-100 bg-stone-50'}`}
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Icon color={theme.accent} size={36} className={isGlobalDark ? "animate-pulse" : ""} />
              </motion.div>
              <span className={`text-[9px] font-black tracking-[0.5em] uppercase mb-4 transition-colors ${theme.subText}`}>
                {service.type === "divination" ? "Zodiac Reading" : "Celestial Offering"}
              </span>
              <h3 className={`text-4xl font-serif font-black leading-none mb-6 px-2 text-center tracking-tighter ${theme.text}`}>
                {service.title?.[lang]}
              </h3>
              <p className={`text-sm leading-relaxed max-w-[260px] text-center mb-8 font-medium transition-colors ${theme.desc}`}>
                {service.desc?.[lang]?.substring(0, 85)}...
              </p>
            </div>
            <div className="flex-1" />
            {/* ACTION SECTION WITH HOVER EFFECTS */}
            <div style={{ transform: "translateZ(20px)" }} className="w-full">
              <div className={`flex justify-between items-end mb-8 border-b pb-4 ${isGlobalDark ? 'border-cyan-400/20' : 'border-stone-100'}`}>
                <div className="text-left">
                  <span className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${theme.text}`}>Sacrifice</span>
                  <p className={`text-2xl font-serif font-black ${theme.text}`}>{service.price.toLocaleString()}₮</p>
                </div>
                <div className={`text-right text-[10px] font-black uppercase tracking-tighter opacity-40 ${theme.text}`}>
                  {service.duration} <br /> {lang === 'mn' ? 'Мөчлөг' : 'Session'}
                </div>
              </div>
              <motion.button
                className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl ${theme.btn}`}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                {lang === 'mn' ? 'Зан үйл эхлэх' : 'Initiate Ritual'}
                <Sparkles size={14} />
              </motion.button>
            </div>
          </div>
          {/* Enhanced Dynamic Floor Aura with Pulse */}
          <motion.div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[110px] pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-1000 ${theme.glow}`}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        {/* Enhanced Floor Shadow with Spread */}
        <motion.div
          className={`absolute -bottom-10 left-10 right-10 h-10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000
            ${isGlobalDark ? 'bg-[#C72075]/30' : 'bg-amber-900/10'}`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </Link>
    </motion.div>
  );
}