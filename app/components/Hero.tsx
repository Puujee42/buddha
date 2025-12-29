"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { 
  motion, 
  useScroll, 
  useTransform, 
  AnimatePresence, 
  useSpring, 
  useMotionValue
} from "framer-motion";
import { Sparkles, Sun, Moon, ArrowRight, Star, Eye } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";

// --- SACRED ORNAMENTS ---

const CornerFiligree = ({ isDark }: { isDark: boolean }) => (
  <div className={`absolute inset-6 pointer-events-none z-20 border-[1px] transition-colors duration-1000 ${isDark ? "border-indigo-500/20" : "border-amber-500/20"}`}>
    {[
      "top-0 left-0",
      "top-0 right-0 rotate-90",
      "bottom-0 left-0 -rotate-90",
      "bottom-0 right-0 rotate-180"
    ].map((pos, i) => (
      <div key={i} className={`absolute w-16 h-16 ${pos}`}>
        <svg viewBox="0 0 100 100" fill="none" className={isDark ? "text-indigo-400/40" : "text-amber-500/40"}>
          <path d="M0 0 L100 0 L100 4 L4 4 L4 100 L0 100 Z" fill="currentColor" />
          <circle cx="10" cy="10" r="4" fill="currentColor" />
        </svg>
      </div>
    ))}
  </div>
);

const SacredDust = ({ isDark }: { isDark: boolean }) => {
  return (
    <div className="absolute inset-0 z-[2] pointer-events-none">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ 
            y: "-10vh", 
            opacity: [0, 0.8, 0],
            x: Math.sin(i) * 200 
          }}
          transition={{
            duration: 10 + (i % 15),
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className={`absolute w-[1.5px] h-[1.5px] rounded-full ${
            isDark ? "bg-indigo-300 shadow-[0_0_8px_white]" : "bg-amber-400 shadow-[0_0_8px_orange]"
          }`}
          style={{ left: `${(i * 7.7) % 100}%` }}
        />
      ))}
    </div>
  );
};

export default function Hero() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. TOP LEVEL HOOKS
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth Springs for Parallax
  const rotateX = useSpring(useTransform(mouseY, [-400, 400], [5, -5]), { stiffness: 50, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-5, 5]), { stiffness: 50, damping: 20 });
  const mouseGlowX = useSpring(useTransform(mouseX, (v) => v - 400));
  const mouseGlowY = useSpring(useTransform(mouseY, (v) => v - 400));

  const { scrollYProgress } = useScroll();
  const opacityFade = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scalePortal = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  useEffect(() => {
    setMounted(true);
    const handleMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(clientX - centerX);
      mouseY.set(clientY - centerY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const isDark = resolvedTheme === "dark";

  const content = t({
    mn: {
      arcana: "Аркана I",
      main: isDark ? "ГЭГЭЭН ОД" : "АМАР АМГАЛАН",
      sub: isDark ? "Celestial Path" : "The Pure Land",
      desc: isDark 
        ? "Одот тэнгэрийн доорх нууцад нэвтэрч, хувь тавилангийн хүрдийг эргүүлэгч."
        : "Бурханы энэрэл нигүүлслээр ариуссан, дотоод сэтгэлийн гэрэлт ертөнц.",
      btn: isDark ? "Одод унших" : "Ариусал эрэх",
      mantra: "OM MANI PADME HUM"
    },
    en: {
      arcana: "Arcana I",
      main: isDark ? "THE STAR" : "ENLIGHTENMENT",
      sub: isDark ? "Celestial Path" : "The Pure Land",
      desc: isDark 
        ? "A guide through the cosmic void, turning the wheel of eternal destiny."
        : "A sacred sanctuary for the soul, illuminated by the ancient light of Buddha.",
      btn: isDark ? "Read Destiny" : "Seek Peace",
      mantra: "OM MANI PADME HUM"
    }
  });

  if (!mounted) return <div className="h-screen w-full bg-[#020617]" />;

  return (
    <section 
      ref={containerRef}
      className={`relative h-screen w-full overflow-hidden transition-colors duration-1000 font-serif flex items-center justify-center ${
        isDark ? "bg-[#020205]" : "bg-[#FCF9F2]"
      }`}
    >
      {/* --- TAROT BORDERS & DUST --- */}
      <CornerFiligree isDark={isDark} />
      <SacredDust isDark={isDark} />

      {/* --- RITUAL VIDEO PORTAL (Background) --- */}
      <motion.div 
        style={{ scale: scalePortal }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <div className={`absolute inset-0 z-10 transition-opacity duration-1000 ${
          isDark 
          ? "bg-gradient-to-b from-black via-indigo-950/40 to-black" 
          : "bg-gradient-to-b from-[#FFFBEB]/80 via-transparent to-[#FFFBEB]/80"
        }`} />
        <video autoPlay loop muted playsInline className={`w-full h-full object-cover transition-all duration-1000 ${isDark ? "opacity-30 grayscale-[0.5] contrast-[1.2]" : "opacity-40"}`}>
          <source src="/video.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* --- 3D TILTING UI CARD --- */}
      <motion.div 
        style={{ rotateX, rotateY, opacity: opacityFade, transformStyle: "preserve-3d" }}
        className="relative z-30 max-w-5xl w-full flex flex-col items-center text-center px-6"
      >
        {/* Arcana Vertical Label */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 opacity-40">
           <div className={`w-[1px] h-20 ${isDark ? "bg-indigo-400" : "bg-amber-600"}`} />
           <span className={`uppercase tracking-[0.5em] text-[10px] font-bold [writing-mode:vertical-lr] ${isDark ? "text-indigo-300" : "text-amber-800"}`}>
             {content.arcana}
           </span>
        </div>

        {/* Sacred Icon Portal */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5 }}
          className="mb-10 relative"
        >
          <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center relative z-10 transition-all duration-700 shadow-[0_0_30px_rgba(0,0,0,0.3)] ${
              isDark ? "bg-indigo-900/40 border-indigo-400 text-amber-200" : "bg-white border-amber-300 text-amber-600"
          }`}>
             {isDark ? <Moon size={40} fill="currentColor" /> : <Sun size={40} className="animate-[spin_20s_linear_infinite]" />}
          </div>
          {/* Pulsing Halo */}
          <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isDark ? "bg-indigo-400" : "bg-amber-400"}`} />
        </motion.div>

        {/* Title Section */}
        <div className="space-y-4 mb-12">
           <motion.div 
             initial={{ letterSpacing: "0.2em", opacity: 0 }}
             animate={{ letterSpacing: "0.8em", opacity: 1 }}
             className={`text-[10px] font-black uppercase tracking-[0.8em] ${isDark ? "text-indigo-400" : "text-amber-600"}`}
           >
             The Major Arcana
           </motion.div>
           
           <h1 className={`text-6xl md:text-9xl font-serif font-black tracking-tighter transition-colors drop-shadow-2xl ${
               isDark ? "text-white" : "text-[#451a03]"
           }`}>
             {content.main}
           </h1>
           
           <div className="flex items-center justify-center gap-4">
              <div className={`h-[1px] w-12 ${isDark ? "bg-indigo-500/30" : "bg-amber-900/10"}`} />
              <h2 className={`text-2xl md:text-4xl font-serif italic font-light ${isDark ? "text-amber-200/80" : "text-amber-700/80"}`}>
                {content.sub}
              </h2>
              <div className={`h-[1px] w-12 ${isDark ? "bg-indigo-500/30" : "bg-amber-900/10"}`} />
           </div>
        </div>

        {/* Description */}
        <p className={`max-w-xl text-lg md:text-xl font-medium leading-relaxed mb-12 transition-colors ${
            isDark ? "text-indigo-100/70" : "text-amber-950/70"
        }`}>
           {content.desc}
        </p>

        {/* Tarot Action Buttons */}
        <div className="flex flex-col md:flex-row gap-8 items-center">
            <Link href="/services">
                <motion.button 
                   whileHover={{ scale: 1.05, boxShadow: isDark ? "0 0 30px rgba(99, 102, 241, 0.4)" : "0 0 30px rgba(245, 158, 11, 0.3)" }}
                   className={`relative px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all overflow-hidden ${
                       isDark ? "bg-indigo-600 text-white" : "bg-amber-600 text-white"
                   }`}
                >
                   <span className="relative z-10 flex items-center gap-3">
                     {content.btn} <Eye size={16} />
                   </span>
                   {/* Shimmer */}
                   <motion.div 
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" 
                   />
                </motion.button>
            </Link>

            <Link href="/about">
               <motion.button className={`flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:gap-5 ${
                 isDark ? "text-indigo-300" : "text-amber-900"
               }`}>
                  The Path <ArrowRight size={14} />
               </motion.button>
            </Link>
        </div>
      </motion.div>

      {/* --- MOUSE GLOW (Holographic Light Leak) --- */}
      <motion.div
        className={`fixed top-0 left-0 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none z-[10] opacity-40 mix-blend-screen transition-colors duration-1000 ${
            isDark ? "bg-indigo-500/20" : "bg-amber-300/30"
        }`}
        style={{ 
          x: mouseGlowX,
          y: mouseGlowY,
        }}
      />

      {/* --- RITUAL MANTRA FOOTER --- */}
      <div className="absolute bottom-12 left-0 right-0 z-40 text-center pointer-events-none">
           <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`text-[9px] font-black tracking-[1em] uppercase transition-colors ${
               isDark ? "text-indigo-400" : "text-amber-900/60"
           }`}>
             {content.mantra}
           </motion.div>
      </div>
    </section>
  );
}