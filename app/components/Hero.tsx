"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, Sparkles, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext"; // Ensure this path matches your file structure

// Floating Particle Component
const FloatingParticle = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ y: "100vh", opacity: 0 }}
    animate={{ y: "-10vh", opacity: [0, 1, 0] }}
    transition={{
      duration: Math.random() * 10 + 10,
      repeat: Infinity,
      ease: "linear",
      delay: delay,
    }}
    className="absolute w-1 h-1 bg-amber-300 rounded-full blur-[1px]"
    style={{ left: `${Math.random() * 100}%` }}
  />
);

export default function Hero() {
  const { language, setLanguage, t } = useLanguage();

  // --- CONTENT DEFINITION USING CONTEXT ---
  // We use the t() helper to define the content object based on the current language
  const content = t({
    mn: {
      tag: "Гандантэгчинлэн",
      title: {
        l1: "Оюун",
        l2_main: "Санааны",
        l2_sub: "Амар",
        l3: "Амгалан гэрээсээ"
      },
      desc: (
        <>
          Хүний сэтгэл зүй, дотоод ертөнцийн амар амгаланг олоход тань <span className="text-white font-medium shadow-[0_1px_0_rgba(255,255,255,0.5)]">лам хуврагууд</span> туслах болно.
        </>
      ),
      btnPrimary: "Цаг захиалах",
      btnSecondary: "Танилцуулга",
      footer: ["ЭНЭРЭЛ", "НИГҮҮЛСЭЛ", "БИЛЭГ ОЮУН"]
    },
    en: {
      tag: "Gandantegchinlen",
      title: {
        l1: "Inner",
        l2_main: "Spiritual",
        l2_sub: "Peace",
        l3: "From Your Home"
      },
      desc: (
        <>
          Our venerable <span className="text-white font-medium shadow-[0_1px_0_rgba(255,255,255,0.5)]">monks</span> will guide you in finding peace of mind and inner balance through spiritual counseling.
        </>
      ),
      btnPrimary: "Book a Session",
      btnSecondary: "Learn More",
      footer: ["COMPASSION", "KINDNESS", "WISDOM"]
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const toggleLanguage = () => {
    setLanguage(language === 'mn' ? 'en' : 'mn');
  };

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden font-sans bg-[#0c0504]"
    >
      {/* ================= BACKGROUND LAYERS ================= */}
      
      {/* 1. Video Layer */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-110 opacity-60 mix-blend-screen"
        >
          <source src="/video.mp4" type="video/mp4" />
          <img 
            src="https://images.unsplash.com/photo-1596541223282-595304b868bb?q=80&w=2574&auto=format&fit=crop" 
            alt="Enlightenment" 
            className="w-full h-full object-cover"
          />
        </video>
      </div>

      {/* 2. Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-transparent to-amber-900/90 z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0505] via-transparent to-transparent z-0" />

      {/* 3. Sacred Geometry */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[50%] -right-[20%] w-[120vh] h-[120vh] rounded-full border border-amber-500/10 border-dashed z-0 opacity-40 pointer-events-none hidden lg:block"
      >
        <div className="absolute inset-[10%] border border-amber-500/5 rounded-full" />
      </motion.div>

      {/* 4. God Rays & Particles */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[800px] bg-amber-500/20 blur-[150px] -rotate-45 pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 z-1 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* ================= LANGUAGE TOGGLE (Top Right) ================= */}
      <div className="absolute top-8 right-8 z-50">
        <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-black/20 backdrop-blur-md hover:bg-amber-900/40 transition-all text-amber-200 text-xs font-bold tracking-widest uppercase"
        >
            <Globe size={14} />
            {/* Displaying the CURRENT language code */}
            <span className="w-6 text-center">{language.toUpperCase()}</span>
        </button>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative z-20 h-full flex flex-col justify-center px-6 lg:px-20 max-w-[1600px] mx-auto"
      >
        
        {/* Top Tagline */}
        <motion.div 
          // Use `language` as key to re-trigger animation on switch
          key={`tag-${language}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400" />
          <div className="px-3 py-1 rounded-full border border-amber-500/30 bg-amber-900/20 backdrop-blur-md">
            <span className="text-amber-300 text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2">
              <Sparkles size={12} /> {content.tag}
            </span>
          </div>
        </motion.div>

        {/* HERO TITLE (AnimatePresence allows smooth text swap) */}
        <div className="relative min-h-[300px] md:min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.h1 
              key={language}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="font-serif text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] font-medium text-white tracking-tight absolute top-0 left-0"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-amber-200 drop-shadow-[0_0_25px_rgba(251,191,36,0.3)]">
                {content.title.l1}
              </span>
              <span className="block relative z-10">
                <span className="bg-gradient-to-b from-amber-300 to-amber-600 bg-clip-text text-transparent">
                  {content.title.l2_main}
                </span>{" "}
                <span className="italic text-white/40 font-light">
                  {content.title.l2_sub}
                </span>
              </span>
              <span className="block text-white text-5xl md:text-7xl lg:text-[7rem] mt-2 md:mt-0">
                {content.title.l3}
              </span>
            </motion.h1>
          </AnimatePresence>

          {/* Decorative smoke/ink behind text */}
          <div className="absolute -z-10 top-1/2 left-0 w-full h-full bg-gradient-to-r from-amber-500/10 to-transparent blur-3xl rounded-full" />
        </div>

        {/* Description & Interactive Area */}
        <div className="mt-12 flex flex-col lg:flex-row items-start lg:items-end gap-12">
          
          <motion.div 
            key={`desc-${language}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl text-amber-100/80 font-light max-w-2xl leading-relaxed border-l-2 border-amber-500/30 pl-6 min-h-[80px]"
          >
            {content.desc}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-5"
          >
            {/* Primary Button */}
            <Link href="/booking">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-700 rounded-sm text-white font-serif tracking-wider text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(217,119,6,0.4)]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                <span className="relative z-10 flex items-center gap-3">
                  {content.btnPrimary} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
              </button>
            </Link>

            {/* Secondary Button */}
            <Link href="/about">
              <button className="px-8 py-4 rounded-sm border border-amber-200/20 text-amber-100 font-serif tracking-wider text-lg backdrop-blur-sm hover:bg-white/5 hover:border-amber-200/40 transition-all flex items-center gap-3">
                <Play className="w-4 h-4 fill-current" /> {content.btnSecondary}
              </button>
            </Link>
          </motion.div>
        </div>

      </motion.div>

      {/* ================= BOTTOM GLOSS BAR ================= */}
      <motion.div 
        key={`footer-${language}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f0505] to-transparent z-30 flex items-end justify-center pb-6"
      >
         <div className="flex gap-8 text-amber-500/40 text-sm tracking-[0.2em] font-light">
            <span>{content.footer[0]}</span>
            <span>•</span>
            <span>{content.footer[1]}</span>
            <span>•</span>
            <span>{content.footer[2]}</span>
         </div>
      </motion.div>

      {/* Styles */}
      <style jsx global>{`
        @keyframes shine {
          100% { left: 125%; }
        }
        .animate-shine {
          animation: shine 1s;
        }
      `}</style>
    </section>
  );
}