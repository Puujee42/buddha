"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionTemplate
} from "framer-motion";
import {
  Sun,
  Sparkles,
  HandHeart,
  Eye,
  Infinity as InfinityIcon,
  MoveRight,
  Flower
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Monk } from "@/database/types";

export default function DivineMonkSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const { t, language } = useLanguage();
  
  const [monks, setMonks] = useState<Monk[]>([]);

  useEffect(() => {
    async function fetchMonks() {
      try {
        const response = await fetch('/api/monks');
        if (response.ok) {
          const data = await response.json();
          // Limit to 4 for the home page section if needed, or show all
          setMonks(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch monks:", error);
      }
    }
    fetchMonks();
  }, []);
  
  // Parallax background movements
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const rotateWheel = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Interactive Mouse Gradient
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set((clientX - left) / width);
    mouseY.set((clientY - top) / height);
  }

  const backgroundGradient = useMotionTemplate`radial-gradient(
    600px circle at ${useTransform(mouseX, x => x * 100)}% ${useTransform(mouseY, y => y * 100)}%,
    rgba(255, 220, 150, 0.4),
    transparent 80%
  )`;

  // --- CONTENT TRANSLATIONS ---
  const content = {
    tag: t({ mn: "Гэгээрэгсэд", en: "The Awakened Ones" }),
    title: t({ mn: "Ариун Уламжлал", en: "Sacred Lineage" }),
    desc: t({
      mn: "Шавраас урган гарч, уснаа дэлгэрэх бадамлянхуа мэт, эдгээр сахиусууд таны замыг гийгүүлэхээр ариун тунгалаг оршмуй.",
      en: "\"Like a lotus flower that grows out of the mud and blossoms above the water, these guardians stand tall and pure to guide your path.\""
    }),
    btn: t({ mn: "Адис авах", en: "Receive Blessing" })
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[150vh] bg-[#FDFBF7] overflow-hidden py-32 font-sans selection:bg-orange-200"
    >
      {/* 1. BACKGROUND ATMOSPHERE */}
      
      {/* A. Divine Glow (Mouse Follower) */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none mix-blend-soft-light"
        style={{ background: backgroundGradient }}
      />

      {/* B. The Great Dharma Wheel (Background Decoration) */}
      <motion.div 
        style={{ rotate: rotateWheel, y: yBg, opacity: 0.1 }}
        className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] z-0 pointer-events-none"
      >
         {/* Simplified Mandala SVG Representation */}
         <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400 animate-[spin_60s_linear_infinite]">
            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2 2"/>
            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" fill="none"/>
            <path d="M50 2 v96 M2 50 h96 M15 15 l70 70 M85 15 l-70 70" stroke="currentColor" strokeWidth="0.5"/>
            <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" fill="none"/>
         </svg>
      </motion.div>

      {/* C. Floating Petals/Clouds */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
         <motion.div 
            animate={{ y: [0, -40, 0], x: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[5%] w-64 h-64 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-3xl mix-blend-multiply" 
         />
         <motion.div 
            animate={{ y: [0, 50, 0], x: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-gradient-to-bl from-yellow-100 to-orange-100 rounded-full blur-3xl mix-blend-multiply" 
         />
      </div>


      {/* 2. CONTENT CONTAINER */}
      <div className="relative z-10 container mx-auto px-4 lg:px-12">
        
        {/* Header Block */}
        <div className="flex flex-col items-center justify-center text-center mb-32 space-y-6">
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="flex items-center gap-2 px-5 py-2 rounded-full border border-orange-200 bg-white/60 backdrop-blur-sm shadow-sm"
           >
              <Eye className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold tracking-[0.25em] text-orange-800 uppercase">
                {content.tag}
              </span>
           </motion.div>
           
           <h2 className="text-6xl md:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 drop-shadow-sm pb-2">
             {content.title}
           </h2>
           
           <p className="max-w-2xl text-lg text-stone-600 font-light italic">
             {content.desc}
           </p>
        </div>

        {/* 3. THE SHRINE CARDS */}
        <div className="flex flex-wrap justify-center gap-10 xl:gap-14 pb-20">
           {monks.map((monk, index) => (
             <DivineCard key={monk._id?.toString() || index} monk={monk} index={index} btnText={content.btn} language={language} />
           ))}
        </div>

      </div>
    </section>
  );
}

// --- SUB-COMPONENT: The Prismatic Stupa Card ---
function DivineCard({ monk, index, btnText, language }: { monk: Monk, index: number, btnText: string, language: "mn" | "en" }) {
  
  // Create organic floating offsets
  const floatDuration = 5 + index; 
  
  // Map icons/colors based on specialties or just default for now as we transition to DB
  // In a real app, you might store these visual preferences in the DB or map them by ID
  const icon = <Sun className="w-6 h-6" />;
  const color = "#EA580C"; 
  const shadow = "shadow-orange-500/30";
  const bgGradient = "from-orange-400 via-amber-200 to-yellow-50";
  const textAccent = "text-orange-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 150, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ margin: "-100px", once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
      className="group relative w-full sm:w-[320px] lg:w-[340px] h-[580px] perspective-1000"
    >
      
      {/* A. SHADOW AURA (The Grounding) */}
      <motion.div 
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: floatDuration, repeat: Infinity }}
        className={`absolute bottom-[-30px] left-[10%] w-[80%] h-8 rounded-[100%] blur-xl ${shadow}`}
      />

      {/* B. MAIN CARD BODY (Floating) */}
      <motion.div 
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full transform-gpu transition-all duration-500 group-hover:rotate-1"
      >
        {/* Card Shape: Stupa Arch */}
        <div className={`
          relative w-full h-full overflow-hidden 
          rounded-t-[1000px] rounded-b-[40px] 
          bg-gradient-to-br ${bgGradient}
          border border-white/80
          shadow-xl
        `}>
            
            {/* NOISE TEXTURE (For Paper feel) */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay z-0" />
            
            {/* TOP SHINE (Glass Effect) */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent z-20 pointer-events-none" />

            {/* IMAGE SECTION */}
            <div className="absolute inset-0 z-10 group-hover:scale-105 transition-transform duration-1000 ease-out">
                {/* Image Mask Gradient */}
                <div className="absolute bottom-0 w-full h-[60%] bg-gradient-to-t from-white via-white/90 to-transparent z-10" />
                <img 
                  src={monk.image} 
                  alt={monk.name[language]}
                  className="w-full h-full object-cover"
                />
            </div>

            {/* C. TEXT & CONTENT */}
            <div className="absolute bottom-0 inset-x-0 z-30 p-8 flex flex-col items-center text-center">
                
                {/* Floating Icon Badge */}
                <div className={`
                   relative mb-4 w-14 h-14 rounded-full flex items-center justify-center 
                   bg-white shadow-lg text-[${color}] group-hover:-translate-y-2 transition-transform duration-300
                `}>
                   <div className="text-current" style={{ color: color }}>
                     {icon}
                   </div>
                   {/* Ring Pulse */}
                   <div className="absolute inset-0 rounded-full border border-current opacity-30 animate-ping" style={{ color: color }} />
                </div>

                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${textAccent} opacity-80`}>
                  {/* Element mapping is tricky without DB field, just showing specialties[0] for now */}
                  {monk.specialties[0]}
                </span>

                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-1">
                   {monk.name[language]}
                </h3>
                
                <p className={`text-sm italic font-medium opacity-70 mb-6 ${textAccent}`}>
                   {monk.title[language]}
                </p>

                {/* Call to Action (Reveal) */}
                <div className="w-full border-t border-black/5 pt-4 opacity-80 group-hover:opacity-100 transition-opacity">
                   <button className="flex items-center justify-center gap-2 w-full text-xs font-bold uppercase tracking-widest text-gray-800 hover:text-orange-600 transition-colors">
                     {btnText} <MoveRight className="w-4 h-4" />
                   </button>
                </div>
            </div>

            {/* D. MONGOLIAN SCRIPT (Cultural Element) */}
            {/* Positioned absolute on the side like a seal */}
            <div className="absolute top-24 right-4 z-20 opacity-40 mix-blend-darken group-hover:opacity-80 transition-all duration-700">
               <span 
                 style={{
                   writingMode: 'vertical-rl',
                   textOrientation: 'upright',
                 }} 
                 className={`text-2xl font-serif font-bold ${textAccent} drop-shadow-md`}
               >
                  {/* Just using name for now as decorative script */}
                  {monk.name.mn.split(" ")[0]} 
               </span>
               <div className="mt-2 w-[2px] h-12 bg-current mx-auto opacity-50" style={{ color: color }} />
            </div>

            {/* E. DECORATIVE ELEMENTS */}
            <div className="absolute top-6 inset-x-0 flex justify-center z-30 opacity-60">
                <Flower className={`w-6 h-6 text-white drop-shadow-[0_0_8px_${color}]`} />
            </div>

        </div>
      </motion.div>
    </motion.div>
  )
}