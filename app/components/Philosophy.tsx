"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring,
  useMotionValue 
} from "framer-motion";
import { History, Crown, Brush, Sun, Cloud, Sparkles, Scroll, ArrowRight } from "lucide-react"; 
import { useLanguage } from "../contexts/LanguageContext"; 

// --- HEAVENLY DECORATIONS ---

// 1. Rotating Mandala (Massive Background)
const SacredMandala = () => (
  <motion.div 
    animate={{ rotate: 360 }}
    transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vh] h-[150vh] opacity-[0.07] pointer-events-none z-0"
  >
    <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600 fill-current">
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 1" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M50 0 L50 100 M0 50 L100 50 M15 15 L85 85 M85 15 L15 85" stroke="currentColor" strokeWidth="0.1" />
    </svg>
  </motion.div>
);

// 2. Parallax Clouds
const CloudLayer = () => (
  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-multiply animate-pulse pointer-events-none z-[1]" />
);

// 3. Golden Dust Particles
const TimeDust = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "110vh", opacity: 0 }}
        animate={{ 
          y: "-10vh", 
          opacity: [0, 0.5, 0],
          x: Math.random() * 100 - 50
        }}
        transition={{
          duration: 15 + Math.random() * 10,
          repeat: Infinity,
          delay: i * 0.5,
          ease: "linear"
        }}
        className="absolute bottom-0 w-1 h-1 bg-amber-400 rounded-full blur-[1px] shadow-[0_0_8px_#f59e0b]"
        style={{ left: `${Math.random() * 100}%` }}
      />
    ))}
  </div>
);

export default function HorizontalHeritageSection() {
  const { t, language } = useLanguage();
  
  // Ref for the long scrolling container
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Tracks how far down we've scrolled in this section (0 to 1)
  const { scrollYProgress } = useScroll({ 
    target: targetRef,
  });

  // Maps vertical scroll to horizontal movement
  // We move from 0% (start) to -75% (end) to show all cards
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-75%"]);
  
  // Parallax Text fades
  const opacityHeader = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // --- DATA ---
  const eras = [
    {
      id: "intro",
      type: "header",
      content: {
          title: t({ mn: "Түүхэн Замнал", en: "Sacred Timeline" }),
          sub: t({ mn: "Гурван Цагийн Хэлхээ", en: "Chronicle of Eternity" }),
          desc: t({ mn: "Монголын бурхны шашны дэлгэрэлтийн түүхэн замнал.", en: "Journey through the golden history of Dharma in Mongolia." })
      }
    },
    {
      id: "ancient",
      icon: <History />,
      year: "II BC - IX AD",
      image: "/tenzin.png", 
      bichig: "ᠡᠷᠲᠡᠨ ᠦ",
      title: t({ mn: "Эртний Дэлгэрэлт", en: "The First Light" }),
      desc: t({ mn: "Хүннү гүрнээс эхлэн Уйгур хүртэлх Төв Азийн нүүдэлчдийн сэтгэлгээнд Бурхны шашин анхлан соёолж, торгоны замаар дамжин ирсэн үе.", en: "From the Xiongnu to the Uyghur Khaganates, the seeds of Dharma were first sown in the nomadic soul along the Silk Road." })
    },
    {
      id: "middle",
      icon: <Crown />,
      year: "XIII - XIV",
      image: "/bell.png", 
      bichig: "ᠳᠤᠮᠳᠠᠳᠤ",
      title: t({ mn: "Хаадын Дэлгэрэлт", en: "Royal Patronage" }),
      desc: t({ mn: "Их Монгол гүрний үед Бурхны шашин төрийн бодлогын хэмжээнд хүрч, Хубилай хаан ба Пагва лам нарын 'Багш-Шийтгүүлэгч' ёс тогтжээ.", en: "Under the Great Khans, Buddhism became the spiritual pillar of the empire. The bond between Kublai Khan and Pagpa Lama unified state and religion." })
    },
    {
      id: "late",
      icon: <Brush />,
      year: "XVI - XXI",
      image: "/temple.png", 
      bichig: "ᠬᠣᠵᠢᠭᠤ",
      title: t({ mn: "Соёлын Мандал", en: "Cultural Golden Age" }),
      desc: t({ mn: "Өндөр Гэгээн Занабазарын ур ухаанаар бурхны шашин монгол хүний сэтгэл зүй, урлаг соёлд гүн бат шингэсэн дахин сэргэлтийн үе.", en: "The era of Undur Gegeen Zanabazar. A renaissance where Buddhism deeply entwined with Mongolian art, philosophy, and identity." })
    },
  ];

  return (
    // Height is 400vh to give enough scroll room for the horizontal movement
    <section ref={targetRef} className="relative h-[400vh] bg-[#FDFBF7] font-serif">
        
        {/* ================= STICKY VIEWPORT ================= */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
            
            {/* --- ATMOSPHERE (FIXED BEHIND SCROLL) --- */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFFBEB] via-[#fffbf0] to-[#fff] z-0" />
            <div className="absolute inset-0 mix-blend-soft-light opacity-60 z-[1]"><CloudLayer /></div>
            <div className="absolute inset-0 z-[2]"><TimeDust /></div>
            <SacredMandala />

            {/* --- PROGRESS BAR (GOLDEN THREAD) --- */}
            <div className="absolute bottom-20 left-12 right-12 h-[2px] bg-amber-200/50 z-20">
               <motion.div 
                 style={{ scaleX: scrollYProgress }} 
                 className="h-full bg-amber-500 origin-left" 
               />
            </div>

            {/* --- THE HORIZONTAL TRACK --- */}
            <motion.div style={{ x }} className="flex gap-20 pl-12 items-center relative z-10 h-[80vh]">
               
               {eras.map((era, index) => {
                 if (era.type === 'header') {
                   return (
                     <div key={index} className="w-[80vw] md:w-[40vw] flex-shrink-0 flex flex-col justify-center px-12 border-l-4 border-amber-500/20 pl-12">
                        <div className="mb-6">
                           <Sun size={48} strokeWidth={1} className="text-amber-500 animate-[spin_10s_linear_infinite]" />
                        </div>
                        <h2 className="text-6xl md:text-8xl font-medium text-[#451a03] mb-4">
                           {era.content.title}
                        </h2>
                        <p className="text-3xl text-amber-600/80 italic font-light mb-8">
                           {era.content.sub}
                        </p>
                        <p className="text-lg text-[#78350F] max-w-md leading-relaxed">
                           {era.content.desc}
                        </p>
                        <div className="mt-12 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-400 animate-pulse">
                           <ArrowRight /> {t({mn: "Гүйлгэх", en: "Scroll to Explore"})}
                        </div>
                     </div>
                   )
                 }
                 return <HeritageCard key={index} era={era} index={index} />
               })}

            </motion.div>

        </div>
    </section>
  );
}

// =========================================================================
// THE "HEAVENLY PORTAL" CARD
// =========================================================================
function HeritageCard({ era, index }: { era: any, index: number }) {
  
  return (
    <div className="w-[85vw] md:w-[60vw] lg:w-[45vw] flex-shrink-0 h-[70vh] relative perspective-1000 group">
       
       {/* 1. GLASS STUPA FRAME */}
       <div className="relative h-full w-full bg-white/60 backdrop-blur-xl border border-white/80 rounded-t-[300px] rounded-b-[40px] shadow-[0_20px_50px_-10px_rgba(245,158,11,0.15)] overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(245,158,11,0.3)] ring-1 ring-white/50 flex flex-col">
          
          {/* Top: The Image (Window to the Past) */}
          <div className="relative h-[55%] m-4 rounded-t-[280px] rounded-b-[30px] overflow-hidden bg-amber-50 group-hover:h-[60%] transition-all duration-700 ease-in-out">
             <img 
               src={era.image} 
               alt={era.title}
               className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-[2s] group-hover:scale-110"
             />
             {/* Holy Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBEB] via-transparent to-transparent opacity-50 mix-blend-screen" />
             
             {/* The Vertical Script (Pillar) */}
             <div className="absolute top-10 right-10 bottom-10 w-16 z-20 flex flex-col items-center">
                <div className="h-full w-[1px] bg-white/60 mb-2" />
                <span className="text-4xl font-serif text-white drop-shadow-md opacity-80" style={{ writingMode: 'vertical-rl' }}>
                   {era.bichig}
                </span>
                <div className="h-full w-[1px] bg-white/60 mt-2" />
             </div>
          </div>

          {/* Bottom: The Text (The Teaching) */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative">
             
             {/* Icon Badge */}
             <div className="absolute -top-8 left-12 p-4 bg-[#FDFBF7] rounded-full shadow-lg border border-amber-100 text-amber-600">
                {era.icon}
             </div>

             <div className="mb-2 text-xs font-bold tracking-[0.3em] uppercase text-amber-400">
                {era.year}
             </div>
             
             <h3 className="text-3xl md:text-5xl font-serif text-[#451a03] mb-4 leading-tight group-hover:text-amber-700 transition-colors">
                {era.title}
             </h3>
             
             <p className="text-lg text-[#78350F]/80 leading-relaxed font-medium">
                {era.desc}
             </p>

             {/* Reflection Shine */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

       </div>

       {/* 2. NUMBER WATERMARK BEHIND */}
       <div className="absolute -bottom-10 -right-4 text-[12rem] font-serif text-amber-500/5 leading-none z-[-1]">
          {index}
       </div>

    </div>
  )
}