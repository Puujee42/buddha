"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionTemplate, 
  useMotionValue 
} from "framer-motion";
import { Sparkles, ArrowUpRight, Sun, Flower, Cloud } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

// --- ETHEREAL ASSETS ---

// 1. Rotating Sacred Geometry (Light Mode)
const DharmaMandala = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] pointer-events-none opacity-[0.05] z-0">
    <motion.svg
      viewBox="0 0 100 100"
      className="w-full h-full fill-amber-900"
      animate={{ rotate: 360 }}
      transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
    >
        {/* Simplified Mandala Paths */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 2" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M50 10 L60 30 L90 50 L60 70 L50 90 L40 70 L10 50 L40 30 Z" fill="none" stroke="currentColor" strokeWidth="0.2" />
        <path d="M50 0 L50 100 M0 50 L100 50" stroke="currentColor" strokeWidth="0.1" />
    </motion.svg>
  </div>
);

// 2. Ascending Lotus Petals (Particles)
const LotusPetal = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ y: "110%", opacity: 0, rotate: 0 }}
    animate={{ 
      y: "-20%", 
      opacity: [0, 0.6, 0],
      rotate: [0, 90, 180],
      x: Math.random() * 40 - 20 
    }}
    transition={{
      duration: Math.random() * 10 + 15,
      repeat: Infinity,
      delay: delay,
      ease: "linear",
    }}
    className="absolute bottom-0 w-2 h-2 bg-gradient-to-tr from-rose-200 to-amber-100 rounded-tr-[50%] rounded-bl-[10%] blur-[0.5px] shadow-sm z-[1]"
    style={{ left: `${Math.random() * 100}%` }}
  />
);

// --- MOCK DATA ---
const MONKS_DATA = [
  {
    id: 1,
    name: { mn: "Данзанравжаа", en: "Danzanravjaa" },
    title: { mn: "Говийн Догшин Ноён Хутагт", en: "The Terrible Noble Saint of the Gobi" },
    image: "https://images.unsplash.com/photo-1570228811808-144d151c706d?q=80&w=2545&auto=format&fit=crop", 
  },
  {
    id: 2,
    name: { mn: "Занабазар", en: "Zanabazar" },
    title: { mn: "Өндөр Гэгээн", en: "The High Saint" },
    image: "https://images.unsplash.com/photo-1606132442436-b5fa53f317b9?q=80&w=2670&auto=format&fit=crop", 
  },
  {
    id: 3,
    name: { mn: "Богд Жавзандамба", en: "Bogd Jebtsundamba" },
    title: { mn: "Монголын Шашны Тэргүүн", en: "Head of Mongolian Buddhism" },
    image: "https://images.unsplash.com/photo-1526715694247-f671b5632eb7?q=80&w=2670&auto=format&fit=crop", 
  },
];

export default function HeavenlyMonkSection() {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax Background
  const { scrollYProgress } = useScroll({ target: containerRef });
  const cloudsY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  
  // Mouse "Divine Light" Spotlight
  const mouseX = useSpring(0, { stiffness: 40, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
        // Global mouse tracking for background spotlight
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const content = t({
    mn: {
      tag: "Ариун Багш нар",
      title_l1: "Билэг Оюуны",
      title_l2: "Хөтөч",
      desc: "Энэрэл нигүүлслийн гэрлээр таны замыг гийгүүлэх, бурханы сургаалыг дэлгэрүүлэгч их багш нар.",
      btn: "Дэлгэрэнгүй"
    },
    en: {
      tag: "Sacred Teachers",
      title_l1: "Guides of",
      title_l2: "Wisdom",
      desc: "Masters illuminating your path with the light of compassion and spreading the Buddha's teachings.",
      btn: "Learn More"
    }
  });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full py-32 overflow-hidden bg-[#FDFBF7]"
    >
      
      {/* ================= BACKGROUND: THE CLOUD REALM ================= */}
      
      {/* 1. Base Cream/Gold Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/30 z-0" />
      
      {/* 2. Interactive Spotlight (Moving Divine Light) */}
      <motion.div
        className="fixed top-0 left-0 w-[1000px] h-[1000px] bg-amber-400/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-plus-lighter"
        style={{ 
          x: useTransform(mouseX, (v) => v - 500),
          y: useTransform(mouseY, (v) => v - 500),
        }}
      />

      {/* 3. Moving Clouds Parallax */}
      <motion.div 
        style={{ y: cloudsY }}
        className="absolute inset-0 z-0 opacity-40 mix-blend-soft-light bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" 
      />
      <DharmaMandala />
      
      {/* 4. Rising Lotus Petals */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => <LotusPetal key={i} delay={i * 0.3} />)}
      </div>


      {/* ================= CONTENT CONTAINER ================= */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col items-center text-center mb-28">
          
          <motion.div 
             initial={{ opacity: 0, y: -20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 1 }}
             className="flex items-center gap-3 mb-6"
          >
             <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500" />
             <span className="text-amber-800/60 text-xs tracking-[0.4em] uppercase font-bold flex items-center gap-2">
                <Sun size={14} className="text-amber-500 animate-[spin_8s_linear_infinite]" /> {content.tag}
             </span>
             <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500" />
          </motion.div>

          <motion.h2 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8 }}
             className="text-6xl md:text-8xl leading-none font-serif relative z-10"
          >
             <span className="block text-[#451a03] font-medium drop-shadow-sm">
               {content.title_l1}
             </span>
             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 font-light italic">
               {content.title_l2}
             </span>
             {/* Decorative Halo behind text */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-amber-200/30 blur-3xl -z-10 rounded-full" />
          </motion.h2>
          
          <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ delay: 0.3, duration: 1 }}
             className="mt-8 max-w-xl text-[#78350F] font-medium text-lg leading-relaxed"
          >
            {content.desc}
          </motion.p>
        </div>


        {/* --- THE HALL OF CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full perspective-[2000px]">
           {MONKS_DATA.map((monk, index) => (
              <HeavenlyCard 
                key={monk.id} 
                monk={monk} 
                index={index} 
                language={language} 
                btnText={content.btn} 
              />
           ))}
        </div>

      </div>
    </section>
  );
}

// =========================================================================
// SUB-COMPONENT: HEAVENLY LIGHT PORTAL CARD
// =========================================================================
function HeavenlyCard({ monk, index, language, btnText }: { monk: any, index: number, language: "mn" | "en", btnText: string }) {
  
  // Hover Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-150, 150], [5, -5]), { stiffness: 50, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-5, 5]), { stiffness: 50, damping: 15 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    x.set(e.clientX - rect.left - centerX);
    y.set(e.clientY - rect.top - centerY);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true, margin: "-100px" }}
      className="group relative h-[620px] w-full cursor-pointer z-10"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {/* Levitation Animation Container */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
        style={{ rotateX, rotateY }}
        className="relative w-full h-full transform-gpu"
      >
        {/* 1. GLASS FRAME (The Stupa Shape) */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-xl border border-white/60 rounded-t-[200px] rounded-b-[40px] shadow-[0_20px_50px_-10px_rgba(245,158,11,0.2)] overflow-hidden transition-all duration-500 group-hover:shadow-[0_40px_80px_-10px_rgba(245,158,11,0.4)] group-hover:bg-white/60">
            
            {/* 2. IMAGE CONTAINER (The Portal) */}
            <div className="absolute top-3 left-3 right-3 bottom-32 rounded-t-[190px] rounded-b-[20px] overflow-hidden bg-gradient-to-b from-amber-50 to-white shadow-inner">
                {/* Background Glow inside image area */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-200/40 via-transparent to-transparent z-0 opacity-50 group-hover:opacity-80 transition-opacity" />
                
                {/* The Monk Image - Scales slowly (Breathing effect) */}
                <motion.div 
                   className="relative w-full h-full"
                   animate={{ scale: [1, 1.05, 1] }}
                   transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                >
                   <img 
                     src={monk.image} 
                     alt={monk.name[language]}
                     className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-all duration-700 contrast-[1.05]"
                   />
                </motion.div>

                {/* Holy Halo (Appears behind head on hover) */}
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/30 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-overlay z-10" />
            
                {/* Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none z-20" />
            </div>

            {/* 3. VERTICAL SCRIPT (Pillar of Wisdom) */}
            <div 
               className="absolute top-24 right-8 z-30 opacity-60 mix-blend-multiply group-hover:opacity-90 transition-opacity duration-700 text-[#451a03] font-serif tracking-widest text-xl h-48 border-r-2 border-amber-900/10 pr-2"
               style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
               {monk.name.mn.split(" ")[0]}
            </div>

            {/* 4. INFO CONTENT (Bottom) */}
            <div className="absolute bottom-0 left-0 w-full h-32 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-white via-white/80 to-transparent z-30">
               
               {/* Animated Decorator */}
               <div className="mb-2 opacity-50 group-hover:opacity-100 transition-opacity text-amber-500">
                  <Flower size={18} className="group-hover:rotate-45 transition-transform duration-700" />
               </div>

               <h3 className="text-2xl font-serif font-bold text-[#451a03] mb-1 group-hover:text-amber-700 transition-colors">
                  {monk.name[language]}
               </h3>
               
               <p className="text-[#92400e] text-[10px] uppercase tracking-[0.25em] font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                  {monk.title[language]}
               </p>

               {/* Hover Reveal Button */}
               <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  whileHover={{ width: "auto", opacity: 1 }}
                  className="absolute bottom-4 flex items-center gap-2 text-xs text-amber-600 font-bold uppercase tracking-widest border-b border-amber-400/50 pb-0.5 overflow-hidden"
               >
                  {btnText} <ArrowUpRight size={12} />
               </motion.div>
            </div>

            {/* 5. Shimmer Overlay on Card Hover */}
            <div className="absolute inset-0 z-40 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 skew-x-12 opacity-0 group-hover:animate-shine pointer-events-none" />
        </div>
      </motion.div>
      
      {/* 6. Shadow Reflection (The Grounding) */}
      <div className="absolute -bottom-8 left-[15%] right-[15%] h-4 bg-amber-900/10 blur-xl rounded-[100%] transition-all duration-500 group-hover:scale-x-110 group-hover:bg-amber-900/20" />

      {/* Shine Animation */}
      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateX(200%) skewX(-15deg); opacity: 0; }
        }
        .animate-shine {
          animation: shine 1.2s ease-in-out;
        }
      `}</style>
    </motion.div>
  );
}