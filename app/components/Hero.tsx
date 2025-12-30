"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue
} from "framer-motion";
import { ArrowRight, Star, Eye, Sparkles } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";
// --- COSMIC ORNAMENTS ---
const CornerFiligree = ({ isDark }: { isDark: boolean }) => (
  <div className={`absolute inset-6 pointer-events-none z-20 border-[1px] transition-colors duration-1000 ${isDark ? "border-cyan-500/20" : "border-amber-500/20"}`}>
    {[
      "top-0 left-0",
      "top-0 right-0 rotate-90",
      "bottom-0 left-0 -rotate-90",
      "bottom-0 right-0 rotate-180"
    ].map((pos, i) => (
      <div key={i} className={`absolute w-16 h-16 ${pos}`}>
        <svg viewBox="0 0 100 100" fill="none" className={isDark ? "text-cyan-400/40" : "text-amber-500/40"}>
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
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.8, 0],
            x: Math.sin(i) * 250
          }}
          transition={{
            duration: 8 + (i % 12),
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className={`absolute rounded-full ${
            isDark
              ? (i % 3 === 0 ? "bg-cyan-300 w-[2px] h-[2px] shadow-[0_0_10px_#50F2CE]" : "bg-[#C72075] w-[1px] h-[1px] shadow-[0_0_8px_#C72075]")
              : "bg-amber-400 w-[1.5px] h-[1.5px] shadow-[0_0_8px_orange]"
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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-400, 400], [5, -5]), { stiffness: 50, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-5, 5]), { stiffness: 50, damping: 20 });
  const mouseGlowX = useSpring(useTransform(mouseX, (v) => v - 300));
  const mouseGlowY = useSpring(useTransform(mouseY, (v) => v - 300));
  const { scrollYProgress } = useScroll();
  const opacityFade = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scalePortal = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  useEffect(() => {
    setMounted(true);
    const handleMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);
  const isDark = false;
  const content = t({
    mn: {
      arcana: "Одот Аркана I",
      main: isDark ? "ГЭГЭЭН ОД" : "АМАР АМГАЛАН",
      sub: isDark ? "Celestial Zodiac" : "Туршлагатай багш, мэргэжлийн зөвлөхүүдтэй онлайнаар холбогдож, эргэлзээгээ тайлан, ирээдүйн замаа итгэлтэйгээр тодорхойлоорой.",
      desc: isDark
        ? "Одот тэнгэрийн доорх нууцад нэвтэрч, хувь тавилангийн хүрдийг эргүүлэгч."
        : "Бурханы энэрэл нигүүлслээр ариуссан, дотоод сэтгэлийн гэрэлт ертөнц.",
      btn: isDark ? "Хувь тавилан" : "Цаг захиалах",
      mantra: "OM MANI PADME HUM"
    },
    en: {
      arcana: "Cosmic Arcana I",
      main: isDark ? "THE STAR" : "ENLIGHTENMENT",
      sub: isDark ? "Celestial Zodiac" : "Connect online with experienced teachers and professional advisors, clear your doubts, and confidently determine your future path.",
      desc: isDark
        ? "A guide through the cosmic nebula, charting the ancient movements of destiny."
        : "A sacred sanctuary for the soul, illuminated by the ancient light of Buddha.",
      btn: isDark ? "Chart Destiny" : "Book Now",
      mantra: "OM MANI PADME HUM"
    }
  });
  if (!mounted) return <div className="h-screen w-full bg-[#05051a]" />;
  return (
    <section
      ref={containerRef}
      className={`relative h-screen w-full overflow-hidden transition-colors duration-1000 font-serif flex items-center justify-start ${
        isDark ? "bg-[#05051a]" : "bg-[#FCF9F2]"
      }`}
    >
      <CornerFiligree isDark={isDark} />
      <SacredDust isDark={isDark} />
      {/* --- BACKGROUND PORTAL --- */}
      <motion.div
        style={{ scale: scalePortal }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <div className={`absolute inset-0 z-10 transition-opacity duration-1000 ${
          isDark
            ? "bg-gradient-to-b from-[#05051a] via-[#2E1B49]/40 to-[#05051a]"
            : "bg-gradient-to-b from-[#FFFBEB]/80 via-transparent to-[#FFFBEB]/80"
        }`} />
        <video autoPlay loop muted playsInline className={`w-full h-full object-cover transition-all duration-1000 ${isDark ? "opacity-40 brightness-75 contrast-125" : "opacity-40"}`}>
          <source src="/video.mp4" type="video/mp4" />
        </video>
      </motion.div>
      {/* --- CONTENT CARD --- */}
      <motion.div
        style={{ rotateX, rotateY, opacity: opacityFade, transformStyle: "preserve-3d" }}
        className="relative z-30 max-w-5xl w-full flex flex-col items-start text-left px-6"
      >
        {/* Vertical Arcana Label */}
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 opacity-60">
          <div className={`w-[1px] h-20 ${isDark ? "bg-cyan-400" : "bg-amber-600"}`} />
          <span className={`uppercase tracking-[0.5em] text-[10px] font-bold [writing-mode:vertical-lr] ${isDark ? "text-cyan-300" : "text-amber-800"}`}>
            {content.arcana}
          </span>
        </div>
        {/* Title Section */}
        <div className="space-y-4 mb-12">
         
          <h1 className={`text-6xl md:text-9xl font-serif font-black tracking-tighter transition-colors drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] ${
            isDark ? "text-white" : "text-[#451a03]"
          }`}>
            {content.main}
          </h1>
          <div className="flex items-center justify-start gap-4">
            <div className={`h-[1px] w-12 ${isDark ? "bg-cyan-500/30" : "bg-amber-900/10"}`} />
            <h2 className={`text-2xl md:text-4xl font-serif italic font-light transition-colors ${isDark ? "text-cyan-200/90" : "text-amber-700/80"}`}>
              {content.sub}
            </h2>
            <div className={`h-[1px] w-12 ${isDark ? "bg-cyan-500/30" : "bg-amber-900/10"}`} />
          </div>
        </div>
        {/* Description */}
        <p className={`max-w-xl text-lg md:text-xl font-medium leading-relaxed mb-12 transition-colors ${
          isDark ? "text-cyan-50/70" : "text-amber-950/70"
        }`}>
          {content.desc}
        </p>
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <Link href="/services">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: isDark ? "0 0 40px rgba(199, 32, 117, 0.5)" : "0 0 30px rgba(245, 158, 11, 0.3)" }}
              className={`relative px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all overflow-hidden ${
                isDark ? "bg-gradient-to-r from-[#C72075] to-[#7B337D] text-white" : "bg-amber-600 text-white"
              }`}
            >
              <span className="relative z-10 flex items-center gap-3">
                {content.btn} <Eye size={16} className={isDark ? "text-cyan-300" : "text-white"} />
              </span>
              {/* Cosmic Shimmer */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12`}
              />
            </motion.button>
          </Link>
          <Link href="/about">
            <motion.button className={`flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:gap-5 ${
              isDark ? "text-cyan-400 hover:text-cyan-200" : "text-amber-900"
            }`}>
              {t({mn:"Бидний тухай",en:"About us"})}<ArrowRight size={14} />
            </motion.button>
          </Link>
        </div>
      </motion.div>
      {/* --- MOUSE GLOW (Cosmic Light Leak) --- */}
      <motion.div
        className={`fixed top-0 left-0 w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none z-[10] opacity-30 mix-blend-screen transition-colors duration-1000 ${
          isDark ? "bg-gradient-to-br from-[#C72075] to-[#50F2CE]" : "bg-amber-300/30"
        }`}
        style={{
          x: mouseGlowX,
          y: mouseGlowY,
        }}
      />
      {/* --- FOOTER MANTRA --- */}
      <div className="absolute bottom-12 left-0 right-0 z-40 text-center pointer-events-none">
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
          className={`text-[9px] font-black tracking-[1.2em] uppercase transition-colors ${
            isDark ? "text-cyan-500/60" : "text-amber-900/60"
          }`}>
          {content.mantra}
        </motion.div>
      </div>
    </section>
  );
}