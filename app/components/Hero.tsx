"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { 
  motion, 
  useScroll, 
  useTransform, 
  AnimatePresence, 
  useSpring, 
} from "framer-motion";
import { Play, ArrowRight, Sparkles, Sun } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

// --- ATMOSPHERE COMPONENTS ---

const HeavenlyRays = () => (
  <motion.div 
    animate={{ rotate: 360 }}
    transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
    className="absolute -top-[60%] left-1/2 -translate-x-1/2 w-[180vmax] h-[180vmax] opacity-40 pointer-events-none z-0"
    style={{
      background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(245, 158, 11, 0.1) 20deg, transparent 40deg, transparent 60deg, rgba(245, 158, 11, 0.1) 80deg, transparent 100deg, transparent 180deg, rgba(245, 158, 11, 0.05) 220deg, transparent 260deg)"
    }}
  />
);

const GoldenDust = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ y: "110vh", opacity: 0, scale: 0 }}
    animate={{ 
      y: "-20vh", 
      opacity: [0, 0.8, 0],
      scale: [0, 1.2, 0],
      x: (Math.random() - 0.5) * 150
    }}
    transition={{
      duration: Math.random() * 20 + 15,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    }}
    className="absolute w-[3px] h-[3px] bg-amber-500 rounded-full blur-[0.5px] pointer-events-none z-[2]"
    style={{ left: `${Math.random() * 100}%` }}
  />
);

const GentleFog = ({ scrollYProgress }: { scrollYProgress: any }) => {
    const yFog = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    return (
        <motion.div 
            style={{ y: yFog }}
            className="absolute inset-0 z-[1] opacity-30 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse" 
        />
    );
};

export default function Hero() {
  const { language, setLanguage, t } = useLanguage();
  console.log('Current language:', language);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse Follower Logic
  const mouseX = useSpring(0, { stiffness: 30, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]); 
  const opacityFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // --- CONTENT DICTIONARY (Restored Original "Bright World" text) ---
  const content = t({
    mn: {
      tag: "Гандантэгчинлэн",
      pre: "Сэтгэлийн",
      main: "Амар Амгалан",
      sub: "Гэрэлт Ертөнц",
      desc: "Бурханы сургаал, энэрэл нигүүлслийн хүчээр дотоод сэтгэлийн ариусал, жинхэнэ амар амгаланг мэдрээрэй.",
      btn1: "Ариусал эрэх",
      btn2: "Танилцах",
      mantra: "ОМ МАНИ БАДМЭ ХУМ"
    },
    en: {
      tag: "Gandantegchinlen",
      pre: "Eternal",
      
      main: "Enlightenment",
      sub: "Pure Land",
      desc: "Through the compassion of the Buddha, find the purification of the soul and true inner peace in the embrace of wisdom.",
      btn1: "Seek Peace",
      btn2: "Learn More",
      mantra: "OM MANI PADME HUM"
    }
  });

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden bg-[#FDFBF7] font-serif"
    >
      {/* ================= BACKGROUND LAYERS ================= */}
      
      {/* 1. Base Cream Layer */}
      <div className="absolute inset-0 bg-[#FFFBEB] z-0" />

      {/* 2. THE VIDEO - Styled for Bright Aesthetics */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover scale-110 grayscale"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 3. Central Readability Halo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,251,247,0.95)_0%,rgba(253,251,247,0.6)_40%,transparent_100%)] z-0" />

      {/* 4. Atmospheric Overlays */}
      <HeavenlyRays />
      <GentleFog scrollYProgress={scrollYProgress} />
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {[...Array(35)].map((_, i) => <GoldenDust key={i} delay={i * 0.3} />)}
      </div>

      {/* 5. Mouse Interaction */}
      <motion.div
        className="fixed top-0 left-0 w-[800px] h-[800px] bg-amber-300/20 blur-[100px] rounded-full pointer-events-none z-[1]"
        style={{ 
          x: useTransform(mouseX, (v) => v - 400),
          y: useTransform(mouseY, (v) => v - 400),
        }}
      />
      
      {/* ================= LANGUAGE SWITCHER ================= */}
      <div className="absolute top-8 right-8 z-50">
         <button 
           onClick={() => setLanguage(language === 'mn' ? 'en' : 'mn')}
           className="px-5 py-2 rounded-full border border-amber-900/10 bg-white/60 backdrop-blur-md text-[#78350F] text-xs font-bold tracking-[0.2em] uppercase hover:bg-white shadow-sm transition-all"
         >
           [{language}]
         </button>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <motion.div 
        // style={{ y: textY, opacity: opacityFade }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        
        {/* Spinner Icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="mb-6"
        >
          <div className="p-3 rounded-full bg-amber-50 border border-amber-200 shadow-lg">
             <Sun size={28} className="text-amber-600 animate-[spin_12s_linear_infinite]" />
          </div>
        </motion.div>

        {/* --- TITLE SECTION --- */}
        <div className="relative mb-8">
          
          <motion.h2
             key={`pre-${language}`}
             initial={{ opacity: 0, letterSpacing: "1em" }}
             animate={{ opacity: 1, letterSpacing: "0.5em" }}
             transition={{ duration: 1.5 }}
             className="text-[#92400e] font-sans font-bold text-sm md:text-base uppercase tracking-[0.5em] mb-2"
          >
            {content.pre}
          </motion.h2>

          <AnimatePresence mode="wait">
            <motion.div
               key={language}
               initial={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" }}
               animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
               exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
               transition={{ duration: 1, ease: "easeOut" }}
            >
               {/* Main Title - HIGH CONTRAST DARK AMBER */}
               <h1 className="text-5xl md:text-8xl lg:text-[7rem] font-serif leading-[1.1] tracking-tight text-[#451a03] drop-shadow-sm">
                 {content.main}
               </h1>
               
               {/* Subtitle - GOLDEN/ORANGE ACCENT */}
               <h2 className="text-3xl md:text-5xl font-serif italic text-amber-600/90 font-light mt-1">
                 {content.sub}
               </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- DESCRIPTION --- */}
        <motion.p 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8, duration: 1.2 }}
           // High readability Dark Brown
           className="max-w-2xl text-[#5d4037] font-medium text-lg md:text-2xl leading-relaxed text-center mb-12"
        >
           {content.desc}
        </motion.p>
            
        {/* --- BUTTONS --- */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col md:flex-row gap-6 items-center"
        >
            <Link href="/booking">
                <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="group relative px-10 py-4 bg-gradient-to-r from-amber-600 to-[#b45309] rounded-lg text-white font-sans font-bold tracking-widest uppercase text-sm shadow-[0_10px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_15px_30px_rgba(245,158,11,0.4)] transition-all overflow-hidden"
                >
                   <span className="relative z-10 flex items-center gap-3">
                     {content.btn1} <Sparkles size={16} />
                   </span>
                   {/* Shine */}
                   <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine" />
                </motion.button>
            </Link>

            <Link href="/about">
                <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="px-10 py-4 rounded-lg border-2 border-amber-900/10 text-[#78350F] font-bold tracking-widest uppercase text-sm hover:bg-amber-50 hover:border-amber-900/20 transition-all flex items-center gap-2"
                >
                   {content.btn2} <ArrowRight size={16} />
                </motion.button>
            </Link>
        </motion.div>
      </motion.div>

      {/* ================= FOOTER MANTRA ================= */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 2 }}
        className="absolute bottom-10 left-0 right-0 z-20 text-center pointer-events-none"
      >
           <p className="text-[10px] md:text-xs font-bold tracking-[0.6em] text-[#78350F]/50 uppercase">
             {content.mantra}
           </p>
      </motion.div>

      <style jsx global>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .animate-shine {
          animation: shine 0.8s ease-in-out;
        }
      `}</style>
    </section>
  );
}