"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue
} from "framer-motion";
import { ArrowUpRight, Sun, Flower, Moon, Sparkles, Eye } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

// --- ETHEREAL ASSETS ---

const DharmaMandala = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] pointer-events-none opacity-[0.05] z-0">
    <motion.svg
      viewBox="0 0 100 100"
      className="w-full h-full fill-amber-900"
      animate={{ rotate: 360 }}
      transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
    >
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 2" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M50 10 L60 30 L90 50 L60 70 L50 90 L40 70 L10 50 L40 30 Z" fill="none" stroke="currentColor" strokeWidth="0.2" />
    </motion.svg>
  </div>
);

const FloatingParticle = ({ theme, delay }: { theme: 'heavenly' | 'night', delay: number }) => (
  <motion.div
    initial={{ y: "110%", opacity: 0 }}
    animate={{
      y: "-20%",
      opacity: [0, 0.6, 0],
      x: Math.random() * 40 - 20,
      rotate: theme === 'heavenly' ? [0, 180] : [0, -180]
    }}
    transition={{ duration: 15, repeat: Infinity, delay: delay, ease: "linear" }}
    className={`absolute bottom-0 w-2 h-2 blur-[0.5px] z-[1] ${
      theme === 'heavenly' 
      ? "bg-gradient-to-tr from-amber-200 to-rose-200 rounded-tr-[50%] rounded-bl-[10%]" 
      : "bg-indigo-300 rounded-full shadow-[0_0_8px_white]"
    }`}
    style={{ left: `${Math.random() * 100}%` }}
  />
);

// --- UPDATED MOCK DATA ---
const MYSTICS_DATA = [
  {
    id: 1,
    type: 'night',
    name: { mn: "Астрал Сувд", en: "Astral Pearl" },
    title: { mn: "Тарo Уншигч & Зурхайч", en: "Tarot Reader & Astrologer" },
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 2,
    type: 'night',
    name: { mn: "Орчлон", en: "Orchlon Oracle" },
    title: { mn: "Далд Оюун Ухаан", en: "Subconscious Guide" },
    image: "https://images.unsplash.com/photo-1568910741178-ee4410f94833?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 3,
    type: 'heavenly',
    name: { mn: "Занабазар", en: "Zanabazar" },
    title: { mn: "Өндөр Гэгээн", en: "The High Saint" },
    image: "https://images.unsplash.com/photo-1606132442436-b5fa53f317b9?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 4,
    type: 'heavenly',
    name: { mn: "Данзанравжаа", en: "Danzanravjaa" },
    title: { mn: "Догшин Ноён Хутагт", en: "The Terrible Noble Saint" },
    image: "https://images.unsplash.com/photo-1570228811808-144d151c706d?q=80&w=2545&auto=format&fit=crop",
  },
];

export default function MysticalUnionSection() {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useSpring(0, { stiffness: 40, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const content = t({
    mn: { tag: "Увидастнууд", title_l1: "Тэнгэрлэг ба", title_l2: "Далд Оюун", desc: "Гэрэл ба сүүдрийн ертөнцөөр аялах зам тань эндээс эхэлнэ.", btn: "Танилцах" },
    en: { tag: "The Mystics", title_l1: "Heavenly &", title_l2: "Night Souls", desc: "Your journey through the realms of light and shadow begins here.", btn: "View Details" }
  });

  return (
    <section ref={containerRef} className="relative w-full py-32 overflow-hidden bg-[#0A0A0B]">
      
      {/* Dynamic Background Transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#FDFBF7] to-[#FDFBF7] z-0 opacity-100" />
      
      <motion.div
        className="fixed top-0 left-0 w-[800px] h-[800px] bg-indigo-500/20 blur-[150px] rounded-full pointer-events-none z-0"
        style={{ x: useTransform(mouseX, (v) => v - 400), y: useTransform(mouseY, (v) => v - 400) }}
      />

      <DharmaMandala />
      
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => <FloatingParticle key={`h-${i}`} theme="heavenly" delay={i} />)}
        {[...Array(15)].map((_, i) => <FloatingParticle key={`n-${i}`} theme="night" delay={i + 0.5} />)}
      </div>

      <div className="relative z-10 container mx-auto px-6">
        
        <div className="flex flex-col items-center text-center mb-28">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center gap-3 mb-6">
            <span className="text-amber-600/60 text-xs tracking-[0.4em] uppercase font-bold flex items-center gap-2">
               <Sparkles size={14} /> {content.tag}
            </span>
          </motion.div>

          <h2 className="text-6xl md:text-8xl font-serif text-[#1e1b4b]">
            <span className="block italic font-light text-indigo-400">{content.title_l1}</span>
            <span className="block font-bold text-amber-900">{content.title_l2}</span>
          </h2>
          
          <p className="mt-8 max-w-xl text-slate-600 font-medium text-lg leading-relaxed">{content.desc}</p>
        </div>

        {/* Grid showing 2 Tarot (Night) then 2 Monks (Heavenly) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-[2000px]">
           {MYSTICS_DATA.map((mystic, index) => (
              <MysticalCard key={mystic.id} mystic={mystic} index={index} language={language} btnText={content.btn} />
           ))}
        </div>
      </div>
    </section>
  );
}

function MysticalCard({ mystic, index, language, btnText }: { mystic: any, index: number, language: "mn" | "en", btnText: string }) {
  const isNight = mystic.type === 'night';
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 50, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 50, damping: 15 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-[580px] w-full cursor-pointer"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <motion.div style={{ rotateX, rotateY }} className="relative w-full h-full">
        
        {/* CARD BASE: Switches between White/Gold (Heavenly) and Obsidian/Indigo (Night) */}
        <div className={`absolute inset-0 rounded-[30px] border transition-all duration-500 overflow-hidden ${
          isNight 
          ? "bg-[#0F172A]/90 border-indigo-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:border-indigo-400" 
          : "bg-white/60 border-amber-200 shadow-[0_20px_50px_rgba(251,191,36,0.1)] group-hover:border-amber-400"
        }`}>
          
          {/* IMAGE PORTAL */}
          <div className="absolute top-4 left-4 right-4 bottom-24 rounded-[20px] overflow-hidden grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700">
             <img src={mystic.image} alt="" className="w-full h-full object-cover" />
             <div className={`absolute inset-0 mix-blend-overlay ${isNight ? "bg-indigo-900/40" : "bg-amber-100/20"}`} />
          </div>

          {/* TYPE INDICATOR */}
          <div className={`absolute top-8 left-8 p-2 rounded-full backdrop-blur-md ${isNight ? "bg-indigo-500/20 text-indigo-200" : "bg-white/40 text-amber-600"}`}>
             {isNight ? <Moon size={20} /> : <Sun size={20} />}
          </div>

          {/* CONTENT AREA */}
          <div className="absolute bottom-0 left-0 w-full h-24 flex flex-col items-center justify-center text-center p-4">
            <h3 className={`text-xl font-serif font-bold ${isNight ? "text-white" : "text-amber-950"}`}>
               {mystic.name[language]}
            </h3>
            <p className={`text-[10px] uppercase tracking-[0.2em] font-medium mt-1 ${isNight ? "text-indigo-300/70" : "text-amber-700/70"}`}>
               {mystic.title[language]}
            </p>
            
            <motion.div 
               initial={{ y: 10, opacity: 0 }}
               whileHover={{ y: 0, opacity: 1 }}
               className={`mt-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter ${isNight ? "text-indigo-400" : "text-amber-600"}`}
            >
               {btnText} <ArrowUpRight size={12} />
            </motion.div>
          </div>

          {/* SPECIAL FX: Night gets stars, Heavenly gets shimmer */}
          {isNight ? (
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles size={10} className="absolute top-10 right-10 text-white animate-pulse" />
              <Sparkles size={8} className="absolute bottom-20 left-10 text-white animate-bounce" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out] pointer-events-none" />
          )}
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes shine {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </motion.div>
  );
}