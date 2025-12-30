"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { Flower, ShieldCheck, Users, Sparkles, Compass, Sun, Moon, Star, Orbit } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";

// --- 1. THE PERMANENT RITUAL FRAME (Screen Edges) ---
const RitualViewportFrame = ({ theme }: { theme: any }) => (
  <div className="fixed inset-0 pointer-events-none z-[100] p-4 lg:p-8">
    <div className={`w-full h-full border-[1px] opacity-30 rounded-lg lg:rounded-[3rem] transition-colors duration-1000 ${theme.borderColor}`} />
    <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-12">
        <span className={`text-[8px] tracking-[1em] opacity-40 font-bold uppercase ${theme.textColor}`}>ᚦᛅᛏ᛫ᛋᚴᛅᛚ᛫ᚢᛖᚱᚦᛅ</span>
    </div>
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <Flower size={20} className={`animate-[spin_10s_linear_infinite] opacity-50 ${theme.accentText}`} />
    </div>
  </div>
);

export default function SacredAboutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-[#05051a]" />;

  return (
    <>
      <OverlayNavbar />
      <ActualSacredAboutContent />
    </>
  );
}

function ActualSacredAboutContent() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isNight = resolvedTheme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);

  // --- CONTENT DEFINITIONS ---
  const content = {
    heroTitle: t({ mn: "Бидний тухай", en: "Our Celestial Path" }),
    heroSubtitle: t({
      mn: "Цаг хугацаа, орон зайг үл хамааран оюун санааны амар амгаланг танд түгээнэ.",
      en: "Whispering spiritual peace across the infinite zodiac of time and space."
    }),
    missionTag: t({ mn: "Бидний Эхлэл", en: "First Inception" }),
    missionTitle: t({ mn: "Оюун санааны холбоос", en: "The Astral Connection" }),
    missionDesc1: t({
        mn: "Бид Монголын Бурхан шашны олон зуун жилийн түүхтэй зан үйл, сургаал номлолыг цаг хугацаа, орон зайнаас үл хамааран хүн бүрт хүртээмжтэй болгох зорилготой.",
        en: "We breathe life into centuries of Buddhist lineage, making ancient rites accessible through the cosmic ether, transcending physical bounds."
    }),
    missionDesc2: t({
        mn: "Цаг алдах шаардлагагүйгээр өөрт хэрэгцээт засал ном, зөвлөгөөг гэрээсээ, амар амгалан орчинд авах боломжийг бид бүрдүүллээ.",
        en: "By bridging the physical and astral, we allow you to welcome the Dharma into your home, finding stillness beneath the stars."
    }),
    whyUsTitle: t({ mn: "Яагаад бид гэж?", en: "Why This Path?" }),
    whyUsSub: t({ mn: "Зурхайн дөрвөн үндэс", en: "Four Foundations of the Zodiac" }),
    cards: [
      {
        number: "IX",
        title: t({ mn: "Чадварлаг Багш нар", en: "Zodiac Masters" }),
        desc: t({ mn: "Гандантэгчинлэн болон бусад томоохон хийдүүдийн дээд боловсролтой багш нар.", en: "Masters of the ancient lineage and celestial alignments." }),
        icon: <Users />,
        color: isNight ? "#50F2CE" : "#10b981" // Cyan / Emerald
      },
      {
        number: "XVII",
        title: t({ mn: "Нууцлал & Аюулгүй", en: "Seal of Silence" }),
        desc: t({ mn: "Таны яриа, хувийн мэдээлэл зөвхөн та болон багш хоёрын хооронд үлдэнэ.", en: "Your spiritual consultation is protected by the stars, fully confidential." }),
        icon: <ShieldCheck />,
        color: isNight ? "#C72075" : "#3b82f6" // Magenta / Blue
      },
      {
        number: "XXI",
        title: t({ mn: "Эрхэм Зорилго", en: "The Grand Mission" }),
        desc: t({ mn: "Хүн бүрийн сэтгэлд амар амгалангийн үрийг тарьж, гүн ухаанаар замчлах.", en: "To plant seeds of awakening and guide every seeker through the void." }),
        icon: <Compass />,
        color: isNight ? "#BA68C8" : "#f59e0b" // Purple / Amber
      },
      {
        number: "I",
        title: t({ mn: "Хялбар Шийдэл", en: "Instant Access" }),
        desc: t({ mn: "Цаг алдалгүй өөрт хэрэгцээт засал номоо гэрээсээ, амар амгалан орчинд авах.", en: "Access rituals and wisdom from your sanctuary, through the digital ether." }),
        icon: <Sparkles />,
        color: isNight ? "#9575CD" : "#ef4444" // Violet / Red
      }
    ]
  };

  // --- ANIMATIONS ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  const portalScale = useTransform(smoothProgress, [0, 0.3], ["circle(20% at 50% 50%)", "circle(100% at 50% 50%)"]);
  const videoBlur = useTransform(smoothProgress, [0, 0.1], ["blur(0px)", "blur(12px)"]);
  const textOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const textBlur = useTransform(smoothProgress, [0, 0.2], ["blur(0px)", "blur(20px)"]);
  const textScale = useTransform(smoothProgress, [0, 0.2], [1, 1.2]);
  const contentY = useTransform(smoothProgress, [0.1, 0.3], [100, 0]);

  // --- ZODIAC GALAXY THEME SYNC ---
  const theme = isNight ? {
      mainBg: "bg-[#05051a]",
      textColor: "text-cyan-50",
      accentText: "text-cyan-400",
      mutedText: "text-cyan-50/70",
      borderColor: "border-cyan-400/20",
      altarBg: "bg-[#0C164F]/80 backdrop-blur-2xl border-cyan-400/10",
      glowColorPrimary: "#C72075", // Magenta Nebula
      glowColorSecondary: "#50F2CE", // Cyan Star
      primaryBtn: "bg-gradient-to-r from-[#C72075] to-[#7B337D] text-white shadow-[#C72075]/20",
      icon: <Orbit className="text-cyan-400 animate-pulse" size={32} />,
      accent: "text-[#C72075]" // Magenta accent
  } : {
      mainBg: "bg-[#FDFBF7]",
      textColor: "text-[#451a03]",
      accentText: "text-amber-600",
      mutedText: "text-[#78350F]/80",
      borderColor: "border-amber-200",
      altarBg: "bg-white/80 backdrop-blur-2xl border-amber-200",
      glowColorPrimary: "rgba(251,191,36,0.15)",
      glowColorSecondary: "rgba(251,191,36,0.15)",
      primaryBtn: "bg-amber-600 text-white shadow-amber-900/20",
      icon: <Sun className="text-amber-500 animate-spin-slow" size={32} />,
      accent: "text-amber-600"
  };

  return (
    <div ref={containerRef} className={`relative min-h-[300vh] ${theme.mainBg} ${theme.textColor} transition-colors duration-1000 font-serif overflow-hidden`}>
      <RitualViewportFrame theme={theme} />
      
      {/* BACKGROUND ATMOSPHERE (Nebula Effects) */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[160px] opacity-20" style={{ backgroundColor: theme.glowColorPrimary }} />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-10" style={{ backgroundColor: theme.glowColorSecondary }} />
         <div className={`absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] ${isNight ? 'invert' : ''}`} />
      </div>

      {/* --- SECTION 1: THE PORTAL MONOLITH --- */}
      <section className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        
        <motion.div 
          style={{ clipPath: portalScale, filter: videoBlur }} 
          className="absolute inset-0 z-0 bg-[#05051a] overflow-hidden"
        >
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50 grayscale contrast-125 brightness-75">
            <source src="/try.mp4" type="video/mp4" />
          </video>
          {/* Cosmic Overlay Gradient */}
          <div className={`absolute inset-0 transition-colors duration-1000 ${isNight ? 'bg-gradient-to-tr from-[#0C164F]/80 via-[#2E1B49]/40 to-[#C72075]/20' : 'bg-amber-900/10'}`} />
        </motion.div>

        <motion.div 
          style={{ opacity: textOpacity, scale: textScale, filter: textBlur }} 
          className="relative z-10 text-center mix-blend-difference pointer-events-none px-6"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="mb-10 flex justify-center">
             <Flower size={80} strokeWidth={0.5} className="text-white" />
          </motion.div>
          <h1 className="text-5xl md:text-[9rem] font-black uppercase text-white tracking-tighter leading-none italic">
            Nirvana
          </h1>
          <div className="h-[1px] w-24 bg-white mx-auto my-8 opacity-40" />
          <p className="text-white font-sans tracking-[0.2em] md:tracking-[0.8em] text-[10px] uppercase font-bold opacity-80">
             {content.heroTitle}
          </p>
        </motion.div>
      </section>

      {/* --- SECTION 2: EDITORIAL CONTENT (Mission) --- */}
      <section className="relative z-20 py-64 container mx-auto px-6 max-w-6xl">
        <motion.div style={{ y: contentY }} className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <span className={`text-[10px] font-black tracking-[0.6em] uppercase mb-8 block px-6 py-2 border rounded-full w-fit ${theme.altarBg} ${isNight ? 'text-cyan-400' : theme.accent}`}>
              {content.missionTag}
            </span>
            <h2 className="text-5xl md:text-8xl leading-[0.85] mb-12 tracking-tighter">
               {language === 'mn' ? "Оюун Санааны" : "The"} <span className={`italic ${isNight ? 'text-cyan-300' : theme.accent}`}>{language === 'mn' ? "Холбоос" : "Astral"}</span> <br/>
               <span className="italic">{language === 'mn' ? "" : "Connection"}</span>
            </h2>
            <div className={`text-xl leading-relaxed space-y-8 font-medium ${theme.mutedText}`}>
               <p>"{content.missionDesc1}"</p>
               <p>{content.missionDesc2}</p>
               <button className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] transition-all flex items-center gap-4 group ${theme.primaryBtn}`}>
                  {language === 'mn' ? "Зөвлөгөө Авах" : "Consult the Void"} <Star size={14} className="group-hover:rotate-180 transition-transform duration-500" />
               </button>
            </div>
          </div>

          <div className={`relative group p-4 border rounded-[3rem] transition-colors duration-1000 ${theme.borderColor}`}>
             <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem]">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  src="https://images.unsplash.com/photo-1601633596408-f421f28b499f?q=80&w=2574&auto=format&fit=crop" 
                  className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2s]"
                />
             </div>
             <div className={`absolute -bottom-8 -right-8 w-32 h-32 flex items-center justify-center rounded-full border shadow-2xl backdrop-blur-3xl ${theme.altarBg}`}>
                <span className={`text-4xl font-black font-serif ${isNight ? 'text-cyan-300' : theme.accent}`}>ᚢᛦ</span>
             </div>
          </div>
        </motion.div>
      </section>

      {/* --- SECTION 3: THE FOUNDATIONS (Cards) --- */}
      <section className="relative py-48">
        <div className="container mx-auto px-6 max-w-7xl">
           <div className={`flex flex-col md:flex-row items-end justify-between mb-24 border-b pb-12 ${theme.borderColor}`}>
              <div className="flex items-center gap-4">
                  {theme.icon}
                  <h2 className="text-5xl italic font-serif">{content.whyUsTitle}</h2>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 mt-4 md:mt-0">{content.whyUsSub}</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {content.cards.map((card, idx) => (
                  <TruthCard 
                    key={idx}
                    num={card.number} 
                    title={card.title} 
                    desc={card.desc}
                    icon={card.icon} 
                    color={card.color} 
                    theme={theme} 
                    isNight={isNight} 
                  />
              ))}
           </div>
        </div>
      </section>

      <div className="h-[20vh]" />
    </div>
  );
}

// --- SUB-COMPONENT: TRUTH CARD ---
function TruthCard({ num, title, desc, icon, color, theme, isNight }: any) {
  return (
    <motion.div 
      whileHover={{ y: -15, boxShadow: isNight ? `0 20px 40px ${color}15` : "" }}
      className={`relative p-10 aspect-[3/4.5] flex flex-col transition-all duration-700 rounded-[2.5rem] border overflow-hidden group ${theme.altarBg}`}
    >
      <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity" style={{ backgroundColor: color }} />
      <div className="absolute top-8 right-8 text-4xl italic font-black opacity-10 font-serif" style={{ color }}>{num}</div>
      
      <div className="p-5 w-fit rounded-2xl border transition-all mb-auto" style={{ borderColor: `${color}40`, color }}>
        {React.cloneElement(icon, { size: 24, strokeWidth: 1.5 })}
      </div>

      <div className="mt-12">
        <h4 className="text-2xl font-black uppercase tracking-tighter mb-4 leading-none" style={{ color }}>{title}</h4>
        <p className={`text-[11px] font-bold uppercase tracking-widest ${theme.mutedText} leading-relaxed`}>
          {desc}
        </p>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[5px] opacity-30 group-hover:opacity-100 transition-all duration-700 shadow-[0_0_15px_currentColor]" style={{ backgroundColor: color, color: color }} />
    </motion.div>
  );
}