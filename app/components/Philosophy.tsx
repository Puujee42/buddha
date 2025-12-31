"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { Flower, ShieldCheck, Users, Sparkles, Compass, Sun, Moon, Star, Orbit, ArrowDown } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";

// --- 1. THE PERMANENT RITUAL FRAME (Screen Edges) ---
const RitualViewportFrame = ({ theme }: { theme: any }) => (
  <div className="fixed inset-0 pointer-events-none z-[100] p-2 md:p-4 lg:p-8">
    <div className={`w-full h-full border-[1px] opacity-30 rounded-xl md:rounded-[2rem] lg:rounded-[3rem] transition-colors duration-1000 ${theme.borderColor}`} />
    
    {/* Top Symbol */}
    <div className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 flex gap-12">
        <span className={`text-[6px] md:text-[8px] tracking-[0.5em] md:tracking-[1em] opacity-40 font-bold uppercase ${theme.textColor}`}>ᚦᛅᛏ᛫ᛋᚴᛅᛚ᛫ᚢᛖᚱᚦᛅ</span>
    </div>
    
    {/* Bottom Spinner */}
    <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2">
        <Flower size={16} className={`md:w-5 md:h-5 animate-[spin_10s_linear_infinite] opacity-50 ${theme.accentText}`} />
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
      <GoldenNirvanaFooter />
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
    heroMain: t({ mn: "Онлайн зөвлөгөө", en: "Online Consultation" }),
    heroSub: t({ mn: "Таны байгаа газарт", en: "Wherever You Are" }),
    heroDesc: t({ 
      mn: "Цаг хугацаа, орон зайн саадыг арилгаж, оюун санааны дэмжлэгийг технологийн тусламжтайгаар танд хүргэж байна.", 
      en: "We are bringing you mental support through technology, removing the barriers of time and space." 
    }),
    missionTag: t({ mn: "Бидний Эхлэл", en: "The Origin" }),
    missionDesc1: t({
        mn: "Бид Монголын Бурхан шашны олон зуун жилийн түүхтэй зан үйл, сургаал номлолыг цаг хугацаа, орон зайнаас үл хамааран хүн бүрт хүртээмжтэй болгох зорилготой.",
        en: "We breathe life into centuries of Buddhist lineage, making ancient rites accessible through the cosmic ether, transcending physical bounds."
    }),
    missionDesc2: t({
        mn: "Цаг алдах шаардлагагүйгээр өөрт хэрэгцээт засал ном, зөвлөгөөг гэрээсээ, амар амгалан орчинд авах боломжийг бид бүрдүүллээ.",
        en: "By bridging the physical and astral, we allow you to welcome the Dharma into your home, finding stillness beneath the stars."
    }),
    whyUsTitle: t({ mn: "Яагаад бид гэж?", en: "Why This Path?" }),
    cards: [
      {
        number: "IX",
        title: t({ mn: "Чадварлаг Багш нар", en: "Zodiac Masters" }),
        desc: t({ mn: "Гандантэгчинлэн болон бусад томоохон хийдүүдийн дээд боловсролтой багш нар.", en: "Masters of the ancient lineage and celestial alignments." }),
        icon: <Users />,
        color: isNight ? "#50F2CE" : "#059669" 
      },
      {
        number: "XVII",
        title: t({ mn: "Нууцлал & Аюулгүй", en: "Seal of Silence" }),
        desc: t({ mn: "Таны яриа, хувийн мэдээлэл зөвхөн та болон багш хоёрын хооронд үлдэнэ.", en: "Your spiritual consultation is protected by the stars, fully confidential." }),
        icon: <ShieldCheck />,
        color: isNight ? "#C72075" : "#2563eb" 
      },
      {
        number: "XXI",
        title: t({ mn: "Эрхэм Зорилго", en: "The Grand Mission" }),
        desc: t({ mn: "Хүн бүрийн сэтгэлд амар амгалангийн үрийг тарьж, гүн ухаанаар замчлах.", en: "To plant seeds of awakening and guide every seeker through the void." }),
        icon: <Compass />,
        color: isNight ? "#BA68C8" : "#d97706" 
      },
      {
        number: "I",
        title: t({ mn: "Хялбар Шийдэл", en: "Instant Access" }),
        desc: t({ mn: "Цаг алдалгүй өөрт хэрэгцээт засал номоо гэрээсээ, амар амгалан орчинд авах.", en: "Access rituals and wisdom from your sanctuary, through the digital ether." }),
        icon: <Sparkles />,
        color: isNight ? "#9575CD" : "#dc2626" 
      }
    ]
  };

  // --- ANIMATIONS ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const yParallax = useTransform(smoothProgress, [0, 1], [0, -100]);

  // --- ZODIAC GALAXY THEME SYNC ---
  const theme = isNight ? {
      mainBg: "bg-[#05051a]",
      textColor: "text-cyan-50",
      accentText: "text-cyan-400",
      mutedText: "text-cyan-100/60",
      borderColor: "border-cyan-400/20",
      altarBg: "bg-[#0C164F]/40 backdrop-blur-md border-cyan-400/10",
      glowColorPrimary: "#C72075", 
      glowColorSecondary: "#50F2CE", 
      gradientBottom: "to-[#05051a]" 
  } : {
      mainBg: "bg-[#FDFBF7]",
      textColor: "text-[#451a03]",
      accentText: "text-amber-600",
      mutedText: "text-[#78350F]/70",
      borderColor: "border-amber-900/10",
      altarBg: "bg-white/60 backdrop-blur-md border-amber-900/5",
      glowColorPrimary: "rgba(251,191,36,0.2)",
      glowColorSecondary: "rgba(245,158,11,0.2)",
      gradientBottom: "to-[#FDFBF7]" 
  };

  return (
    <div ref={containerRef} className={`relative w-full ${theme.mainBg} ${theme.textColor} transition-colors duration-1000 font-serif overflow-hidden`}>
      <RitualViewportFrame theme={theme} />
      
      {/* BACKGROUND ATMOSPHERE (Nebula Effects) */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] md:blur-[160px] opacity-20" style={{ backgroundColor: theme.glowColorPrimary }} />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[100px] md:blur-[140px] opacity-10" style={{ backgroundColor: theme.glowColorSecondary }} />
         <div className={`absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] ${isNight ? 'invert' : ''}`} />
      </div>

      {/* --- SECTION 1: THE FULL VIDEO HERO --- */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        
        {/* VIDEO BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-80"
          >
            <source src="/num2.mp4" type="video/mp4" />
          </video>
          
          {/* Aesthetic Overlays */}
          <div className={`absolute inset-0 bg-black/40 mix-blend-multiply`} /> 
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent ${theme.gradientBottom}`} />
        </div>

        {/* HERO CONTENT */}
        <motion.div 
          style={{ y: yParallax }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 text-center px-4 md:px-6 max-w-7xl mx-auto flex flex-col items-center"
        >
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }} 
            className="mb-8 md:mb-12"
          >
             <Flower size={40} strokeWidth={0.5} className="w-10 h-10 md:w-16 md:h-16 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase text-white tracking-tighter leading-[0.9] italic drop-shadow-2xl mb-4 md:mb-8">
            {content.heroMain}
            <span className="block text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-normal opacity-90 mt-2 font-serif not-italic">
              {content.heroSub}
            </span>
          </h1>
          
          <div className="h-[1px] w-16 md:w-32 bg-white mx-auto my-6 md:my-10 opacity-60" />
          
          <p className="max-w-xl mx-auto text-white/90 font-sans tracking-[0.1em] md:tracking-[0.2em] text-[10px] sm:text-xs md:text-sm uppercase font-bold drop-shadow-md leading-relaxed px-4">
             {content.heroDesc}
          </p>

          <motion.div 
            animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2"
          >
            <ArrowDown className="text-white/50 w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}

// --- SUB-COMPONENT: TRUTH CARD ---
function TruthCard({ num, title, desc, icon, color, theme, isNight, index }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className={`relative group p-8 md:p-10 min-h-[400px] md:aspect-[3/4.5] flex flex-col justify-between transition-all duration-700 rounded-3xl border overflow-hidden ${theme.altarBg}`}
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-br from-current to-transparent" style={{ color }} />
      
      {/* Top Section */}
      <div className="flex justify-between items-start w-full">
         <div className="p-4 rounded-2xl border transition-all duration-500 group-hover:scale-110" style={{ borderColor: `${color}30`, color }}>
           {React.cloneElement(icon, { size: 28, strokeWidth: 1.5 })}
         </div>
         <span className="text-4xl italic font-black opacity-10 font-serif" style={{ color }}>{num}</span>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 mt-12">
        <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-4 leading-none transition-colors duration-300" style={{ color }}>
          {title}
        </h4>
        <div className={`h-[1px] w-12 mb-6 opacity-30`} style={{ backgroundColor: color }} />
        <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${theme.mutedText} leading-relaxed`}>
          {desc}
        </p>
      </div>
      
      {/* Bottom Decoration Line */}
      <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[4px] transition-all duration-700 ease-in-out opacity-60" style={{ backgroundColor: color }} />
    </motion.div>
  );
}