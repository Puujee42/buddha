"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Imported Link
import { 
  motion, 
  useScroll, 
  useTransform, 
} from "framer-motion";
import { 
  CalendarDays, 
  Sparkles, 
  Cloud, 
  Flower2, 
  ArrowRight,
  Loader2
} from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { Monk } from "@/database/types";

// --- 0. STYLE INJECTION ---
const STYLE_INJECTION = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Jost:wght@200;300;400&display=swap');
  
  .font-celestial { font-family: 'Cinzel', serif; }
  .font-ethereal { font-family: 'Jost', sans-serif; }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export default function CelestialMonkShowcase() {
  const { t, language } = useLanguage();
  const [monks, setMonks] = useState<Monk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMonks() {
      try {
        const response = await fetch('/api/monks');
        if (!response.ok) {
          throw new Error('Failed to fetch monks');
        }
        const data = await response.json();
        setMonks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMonks();
  }, []);

  const content = {
    tag: t({ mn: "Гэгээрэгсэд", en: "The Enlightened Ones" }),
    title: t({ mn: "Гэрлээс заларсан", en: "Descended from Light" }),
    desc: t({ 
      mn: "Тэд зовлонгийн далайг гаталж таны төлөө эргэн ирлээ. Багш нарын дүр дээр очиж тэдний адислалыг авч, уулзах хүсэлт илгээнэ үү.", 
      en: "They have crossed the ocean of suffering to return for you. Hover over a master to receive their darshan and request an audience." 
    }),
    awakened: t({ mn: "Гэгээрсэн нэгэн", en: "Awakened One" }),
    availability: t({ mn: "Боломжтой цаг", en: "Availability" }),
    available: t({ mn: "Боломжтой", en: "Available" }),
    unavailable: t({ mn: "Боломжгүй", en: "Unavailable" }),
    btn: t({ mn: "Уулзах цаг товлох", en: "Set Date of Meeting" }),
  };

  return (
    <>
      <OverlayNavbar/>
      <div className="relative w-full min-h-screen bg-slate-50 overflow-hidden text-slate-800 selection:bg-amber-100">
        <style>{STYLE_INJECTION}</style>
        
        {/* BACKGROUND */}
        <HeavenlyBackground />

        <main className="relative z-10 pt-32 pb-20 container mx-auto px-6">
          
          {/* HEADER */}
          <div className="text-center mb-24 relative">
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.2, ease: "easeOut" }}
             >
               <h2 className="font-ethereal text-amber-600 tracking-[0.4em] uppercase text-sm mb-4">
                  {content.tag}
               </h2>
               <h1 className="font-celestial text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-400 drop-shadow-sm pb-4">
                 {content.title}
               </h1>
               <p className="font-ethereal text-slate-500 max-w-lg mx-auto leading-relaxed">
                 {content.desc}
               </p>
             </motion.div>
          </div>

          {/* CARDS CONTAINER */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8 lg:gap-12 perspective-2000">
               {monks.map((monk, index) => (
                  <CelestialCard 
                    key={monk._id?.toString() || index} 
                    monk={monk} 
                    index={index} 
                    content={content} 
                    language={language} 
                  />
               ))}
            </div>
          )}

        </main>
      </div>
      <GoldenNirvanaFooter/>
    </>
  );
}

// --- 2. THE CELESTIAL CARD COMPONENT ---
function CelestialCard({ monk, index, content, language }: { monk: Monk, index: number, content: any, language: "mn" | "en" }) {
  
  const floatY = [0, -10, 0];
  const floatTransition = { 
    duration: 4 + index, 
    repeat: Infinity, 
    ease: "easeInOut" 
  };

  const aura = "bg-orange-500"; 
  const monkUrl = `/monks/${monk._id}`; // Define the dynamic URL

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="relative group w-full max-w-[340px] h-[550px] cursor-pointer"
    >
      {/* A. DIVINE HALO (Appears on Hover) */}
      <div className={`absolute -inset-8 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-1000 ${aura}`} />
      
      {/* B. MAIN CARD BODY */}
      <motion.div 
        animate={{ y: floatY }}
        transition={floatTransition as any}
        className="relative w-full h-full rounded-t-[200px] rounded-b-[12px] overflow-hidden bg-white shadow-xl transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(255,255,255,0.8)] group-hover:-translate-y-4"
      >
        {/* 1. LINK WRAPPER FOR IMAGE (So clicking the face works) */}
        <Link href={monkUrl} className="block w-full h-full absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <img 
              src={monk.image} 
              alt={monk.name[language]} 
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-115" 
            />
            {/* Mist overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/90 z-10" />
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-overlay" />
          </div>
        </Link>

        {/* 2. INITIAL STATE CONTENT (Visible when NOT hovering) */}
        <div className="absolute bottom-0 w-full p-8 text-center z-20 pointer-events-none transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-10">
          <div className="inline-block p-2 rounded-full bg-white/30 backdrop-blur-md mb-3">
             <Flower2 className="w-5 h-5 text-slate-800" />
          </div>
          <h3 className="font-celestial text-2xl text-slate-900 mb-1">{monk.name[language]}</h3>
          <p className="font-ethereal text-xs uppercase tracking-widest text-slate-600">{monk.title[language]}</p>
        </div>

        {/* 3. HOVER REVEAL CONTENT (Visible ONLY when hovering) */}
        <div className="absolute inset-0 z-30 flex flex-col justify-end p-8 bg-gradient-to-t from-white via-white/95 to-transparent opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 ease-out pointer-events-none group-hover:pointer-events-auto">
           
           <div className="w-[1px] h-12 bg-amber-500 mx-auto mb-4" />
           
           <h3 className="font-celestial text-3xl text-slate-900 text-center leading-none mb-2">
             {monk.name[language]}
           </h3>
           
           <div className="flex justify-center gap-2 mb-6">
             <Sparkles className="w-4 h-4 text-amber-500" />
             <span className="font-ethereal text-xs text-amber-600 uppercase tracking-widest">{content.awakened}</span>
             <Sparkles className="w-4 h-4 text-amber-500" />
           </div>

           <p className="font-ethereal text-slate-600 text-center text-sm leading-relaxed mb-8">
             "{monk.bio[language]}"
           </p>

           {/* THE INTERACTIVE BUTTON -> WRAPPED IN LINK */}
           <div className="space-y-3">
             <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
               <span>{content.availability}</span>
               <span className="text-amber-600">{monk.isAvailable ? content.available : content.unavailable}</span>
             </div>
             
             {/* Using Link instead of Button for Navigation */}
             <Link href={monkUrl} className="block w-full">
               <div className="group/btn relative w-full overflow-hidden rounded-lg bg-slate-900 px-6 py-4 text-white shadow-lg transition-all hover:bg-amber-600 hover:shadow-amber-500/30 cursor-pointer">
                  <div className="relative z-10 flex items-center justify-center gap-3">
                     <CalendarDays className="w-4 h-4" />
                     <span className="font-celestial font-bold tracking-widest text-sm">{content.btn}</span>
                     <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
               </div>
             </Link>
           </div>

        </div>

        {/* 4. BORDER GLOW */}
        <div className="absolute inset-4 rounded-t-[190px] rounded-b-[8px] border border-white/40 pointer-events-none scale-95 opacity-50 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700" />

      </motion.div>
    </motion.div>
  );
}

// --- 3. ATMOSPHERIC BACKGROUND ---
function HeavenlyBackground() {
  const { scrollY } = useScroll();
  const rotateBig = useTransform(scrollY, [0, 1000], [0, 45]);
  
  return (
    <div className="fixed inset-0 pointer-events-none">
       {/* Gradient */}
       <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-amber-50" />

       {/* God Rays */}
       <motion.div 
         style={{ rotate: rotateBig }}
         className="absolute -top-[50%] -left-[20%] w-[150vw] h-[150vw] bg-conic-gradient from-transparent via-white/40 to-transparent opacity-40 z-0" 
       />

       {/* Clouds */}
       <div className="absolute inset-0 overflow-hidden">
          <motion.div 
             animate={{ x: [-100, 100] }}
             transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
             className="absolute top-[20%] right-[10%] opacity-20 text-blue-200 blur-3xl"
          >
             <Cloud size={400} />
          </motion.div>
          <motion.div 
             animate={{ x: [50, -50] }}
             transition={{ duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
             className="absolute bottom-[10%] left-[10%] opacity-20 text-amber-200 blur-3xl"
          >
             <Cloud size={500} />
          </motion.div>
       </div>

       {/* Grain */}
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/snow.png')] opacity-40 mix-blend-overlay" />
    </div>
  );
}