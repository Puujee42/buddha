"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import {
  Eye, Star, Flame, Zap, Compass, Loader2, ShieldCheck, Orbit, Sparkles, User, ArrowUpRight
} from "lucide-react";
import { useTheme } from "next-themes";
import OverlayNavbar from "../components/Navbar";
import { useLanguage } from "../contexts/LanguageContext";
import { Service } from "@/database/types";

// --- ZODIAC FRAME (Responsive SVG) ---
const ZodiacServiceFrame = ({ color }: { color: string }) => (
  <div className="absolute inset-0 pointer-events-none z-30 p-2 md:p-0">
    <svg className="w-full h-full" viewBox="0 0 400 600" fill="none" preserveAspectRatio="none">
      <defs>
        <filter id="celestial-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Corner Brackets */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        d="M40 60 L40 40 L60 40 M340 40 L360 40 L360 60 M360 540 L360 560 L340 560 M60 560 L40 560 L40 540"
        stroke={color} strokeWidth="1.5" strokeOpacity="0.5" vectorEffect="non-scaling-stroke"
      />
      
      {/* Top Center Symbol */}
      <motion.circle
        cx="200" cy="40" r="10"
        stroke={color} strokeWidth="1" strokeOpacity="0.3"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Bottom Center Symbol */}
      <motion.circle
        cx="200" cy="560" r="15"
        stroke={color} strokeWidth="1" strokeOpacity="0.3"
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      {/* Zodiac Glyphs - Hidden on very small screens if needed, adjusted font size */}
      <g fill={color} className="opacity-30 select-none" style={{ fontSize: '12px', fontWeight: 'bold' }} filter="url(#celestial-glow)">
        <motion.text
          x="375" y="300" className="[writing-mode:vertical-rl]" textAnchor="middle"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >♈ ♉ ♊ ♋ ♌</motion.text>
        <motion.text
          x="25" y="300" className="[writing-mode:vertical-rl]" textAnchor="middle"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >♎ ♏ ♐ ♑ ♒</motion.text>
      </g>
    </svg>
  </div>
);

export default function CelestialServices() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Theme Detection
  const isDark = false;

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        
        const validServices = Array.isArray(data) 
          ? data.filter(item => (item.name?.mn || item.title?.mn) && item.price) 
          : [];
          
        setServices(validServices);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#FDFBF7]" />;

  return (
    <>
      <OverlayNavbar />
      <main className={`relative min-h-[100dvh] transition-colors duration-1000 overflow-hidden ${isDark ? "bg-[#05051a]" : "bg-[#FDFBF7]"}`}>
        
        {/* --- BACKGROUND ATMOSPHERE --- */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className={`absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b ${isDark ? 'from-[#C72075]/10' : 'from-amber-200/20'} to-transparent`} />
          {isDark && (
            <>
              <motion.div
                className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#C72075]/10 blur-[100px] md:blur-[140px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#2E1B49]/20 blur-[100px] md:blur-[120px]"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen" />
            </>
          )}
        </div>

        {/* HERO SECTION */}
        <div className="container mx-auto px-4 md:px-6 text-center pt-24 md:pt-48 mb-16 md:mb-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            <motion.span
              className={`text-[8px] md:text-[10px] font-black tracking-[0.4em] md:tracking-[0.6em] uppercase flex items-center justify-center gap-2 ${isDark ? "text-cyan-400" : "text-amber-700"}`}
            >
              <Orbit size={12} className="md:w-3.5 md:h-3.5" /> {t({mn: "Одот тамга", en: "Celestial Seals"})}
            </motion.span>
            <motion.h1
              className={`text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif leading-[0.9] tracking-tighter transition-colors duration-700 ${isDark ? "text-white" : "text-stone-900"}`}
            >
              {t({mn: "Ариун", en: "Ancient"})} <br />
              <span className={`italic font-light transition-colors ${isDark ? "text-[#C72075]" : "text-amber-600"}`}>
                {t({mn: "Зан Үйл", en: "Rituals"})}
              </span>
            </motion.h1>
          </motion.div>
        </div>

        {/* SERVICES GRID */}
        <div className="container mx-auto px-4 md:px-6 pb-20 md:pb-40">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className={`animate-spin ${isDark ? 'text-cyan-500' : 'text-amber-500'}`} size={40} />
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {services.map((service, idx) => (
                  <motion.div
                    key={service._id || service.id || idx}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
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
    </>
  );
}

// --- UPDATED CARD COMPONENT ---
function ServiceTarotCard({ service, index, isGlobalDark, lang }: { service: any, index: number, isGlobalDark: boolean, lang: 'mn'|'en' }) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Detect mobile to disable 3D tilt effects
    if (window.innerWidth < 768) setIsMobile(true);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Dampen rotation heavily on mobile (or disable via conditional style)
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 50, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 50, damping: 20 });

  // Data Resolution
  const displayTitle = service.title?.[lang] || service.name?.[lang] || (lang === 'mn' ? "Нэргүй" : "Untitled");
  
  const rawDesc = service.desc?.[lang] || service.description || (lang === 'mn' 
    ? "Дэлгэрэнгүй мэдээлэл хараахан ороогүй байна." 
    : "The mist obscures the details of this ritual yet.");
  // Truncate description slightly longer on desktop
  const displayDesc = rawDesc.length > 90 ? rawDesc.substring(0, 90) + "..." : rawDesc;

  const providerName = service.providerName?.[lang];
  const serviceLink = `/booking/${service._id || service.id}`;

  const theme = isGlobalDark ? {
    bg: "bg-[#0C164F]/80",
    border: "border-cyan-400/20",
    accent: "#50F2CE", 
    text: "text-white",
    subText: "text-cyan-300",
    desc: "text-cyan-50/70",
    btn: "bg-gradient-to-r from-[#C72075] to-[#7B337D] text-white",
    glow: "bg-[#C72075]/20"
  } : {
    bg: "bg-white",
    border: "border-stone-200",
    accent: "#d97706",
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
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={(e) => {
        if (isMobile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative group w-full h-auto min-h-[500px] md:h-[620px] perspective-1000"
      whileHover={{ scale: isMobile ? 1 : 1.02, transition: { duration: 0.3 } }}
    >
      <Link href={serviceLink} className="block h-full">
        <motion.div
          style={isMobile ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={`relative h-full w-full rounded-3xl md:rounded-[2.5rem] border backdrop-blur-xl transition-all duration-1000 flex flex-col
            ${theme.bg} ${theme.border} ${isGlobalDark ? 'shadow-[0_0_50px_rgba(0,0,0,0.3)]' : 'shadow-xl'}`}
        >
          <ZodiacServiceFrame color={theme.accent} />
          
          <div className="relative z-40 p-6 md:p-10 flex-1 flex flex-col items-center justify-between">
            
            {/* --- TOP SECTION --- */}
            <div className="flex flex-col items-center w-full" style={isMobile ? {} : { transform: "translateZ(30px)" }}>
              {/* Index Badge */}
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full border mb-6 md:mb-8 flex items-center justify-center font-serif font-black text-[10px] md:text-xs
                  ${isGlobalDark ? 'border-cyan-400/30 text-cyan-300' : 'border-stone-200 text-stone-400'}`}
              >
                {index + 1}
              </div>

              {/* Icon Container */}
              <div
                className={`mb-4 md:mb-6 p-4 md:p-6 rounded-full border transition-all duration-1000 group-hover:rotate-[360deg]
                  ${isGlobalDark ? 'border-cyan-400/20 bg-[#2E1B49]/40' : 'border-stone-100 bg-stone-50'}`}
              >
                <Icon color={theme.accent} size={28} className="md:w-[36px] md:h-[36px]" />
              </div>

              {/* Type & Provider */}
              <div className="flex flex-col items-center gap-2 mb-3 md:mb-4">
                 <span className={`text-[8px] md:text-[9px] font-black tracking-[0.4em] md:tracking-[0.5em] uppercase transition-colors ${theme.subText}`}>
                  {service.type === "divination" ? (lang === 'mn' ? "Мэргэ" : "Divination") : (lang === 'mn' ? "Зан үйл" : "Ritual")}
                </span>
                {providerName && (
                  <span className={`flex items-center gap-1 text-[9px] md:text-[10px] bg-amber-500/10 px-2 py-1 rounded text-amber-500 font-bold`}>
                     <User size={10} /> {providerName}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className={`text-2xl md:text-4xl font-serif font-black leading-none mb-4 md:mb-6 px-2 text-center tracking-tighter ${theme.text}`}>
                {displayTitle}
              </h3>

              {/* Description */}
              <p className={`text-xs md:text-sm leading-relaxed max-w-[260px] text-center font-medium transition-colors ${theme.desc}`}>
                {displayDesc}
              </p>
            </div>

            {/* --- BOTTOM SECTION --- */}
            <div className="w-full mt-6 md:mt-0" style={isMobile ? {} : { transform: "translateZ(20px)" }}>
              <div className={`flex justify-between items-end mb-4 md:mb-8 border-b pb-4 ${isGlobalDark ? 'border-cyan-400/20' : 'border-stone-100'}`}>
                <div className="text-left">
                  <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-40 ${theme.text}`}>
                    {lang === 'mn' ? "Өргөл" : "Offering"}
                  </span>
                  <p className={`text-xl md:text-2xl font-serif font-black ${theme.text}`}>{Number(service.price).toLocaleString()}₮</p>
                </div>
                <div className={`text-right text-[8px] md:text-[10px] font-black uppercase tracking-tighter opacity-40 ${theme.text}`}>
                  {service.duration} <br /> {lang === 'mn' ? 'Хугацаа' : 'Session'}
                </div>
              </div>
              
              <motion.button
                className={`w-full py-3 md:py-4 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-2 md:gap-3 shadow-xl ${theme.btn}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {lang === 'mn' ? 'Захиалах' : 'Initiate'}
                <ArrowUpRight size={14} />
              </motion.button>
            </div>
          </div>
          
          {/* Floor Shadow (Desktop Only) */}
          <motion.div
             className={`hidden md:block absolute bottom-0 left-10 right-10 h-6 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-all ${theme.glow}`}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}