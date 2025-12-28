"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useMotionValue,
  useMotionTemplate
} from "framer-motion";
import {
  Heart,
  Globe,
  BookOpen,
  Sun,
  Sparkles,
  HandHeart,
  ArrowDown,
  Infinity as InfinityIcon
} from "lucide-react";
import GoldenNirvanaFooter from "../components/Footer";
import OverlayNavbar from "../components/Navbar";
import { useLanguage } from "../contexts/LanguageContext";

// --- CUSTOM SVG: The Endless Knot (Background Geometry) ---
const EndlessKnot = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor">
     <path d="M30 30 L70 30 L70 70 L30 70 Z" strokeWidth="0.5" className="opacity-50" />
     <path d="M30 30 Q50 10 70 30 T70 70 Q50 90 30 70 T30 30" strokeWidth="1" />
     <path d="M20 50 L80 50" strokeWidth="0.5" strokeDasharray="2 2" />
     <path d="M50 20 L50 80" strokeWidth="0.5" strokeDasharray="2 2" />
     <circle cx="50" cy="50" r="45" strokeWidth="0.5" className="opacity-30" />
  </svg>
);

export default function MissionPage() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Mouse Glow Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent) {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  }

  const glowBg = useMotionTemplate`radial-gradient(
    800px circle at ${mouseX}px ${mouseY}px, 
    rgba(253, 230, 138, 0.4),
    transparent 80%
  )`;

  const content = {
    heroTag: t({ mn: "Цаг хугацаа үгүй, орон зай үгүй", en: "No Time, No Space" }),
    heroHeadline1: t({ mn: "Цаг хугацаа, орон зайг", en: "Regardless of" }),
    heroHeadline2: t({ mn: "үл хамааран", en: "Time and Space" }),
    heroSubtitle: t({ mn: "Оюун санааны амар амгаланг танд түгээнэ.", en: "Spreading peace of mind to you." }),
    heroSubEng: t({ mn: "Spreading peace of mind regardless of time and space", en: "Spreading peace of mind regardless of time and space" }),
    missionTag: t({ mn: "Бидний Эрхэм Зорилго", en: "Our Mission" }),
    missionTitle: t({ mn: "Сэтгэл бүрд Амар амгалангийн үрийг тарих.", en: "Planting Seeds of Peace in every heart." }),
    missionDesc: t({
      mn: "\"Бидний эрхэм зорилго бол хүн бүрийн сэтгэлд амар амгалангийн үрийг тарьж, амьдралын аливаа асуултад нь Бурхны шашны гүн ухаанаар дамжуулан хариулт өгөхөд оршино.\"",
      en: "\"Our mission is to plant seeds of peace in everyone's soul and provide answers to life's questions through Buddhist philosophy.\""
    }),
    pillar1: {
      title: t({ mn: "Үрийг Тарих", en: "Planting Seeds" }),
      desc: t({ mn: "Хүн бүрийн сэтгэлд амар амгалангийн үрийг тарих.", en: "Planting Seeds of Peace in every heart." })
    },
    pillar2: {
      title: t({ mn: "Гүн Ухаан", en: "Philosophy" }),
      desc: t({ mn: "Амьдралын асуултуудад Бурхны шашны гүн ухаанаар хариулах.", en: "Answering life's questions through Buddhist philosophy." })
    },
    pillar3: {
      title: t({ mn: "Хүн Бүрд", en: "For Everyone" }),
      desc: t({ mn: "Хаана ч, хэн бүхэнд хүртээмжтэй байх.", en: "Accessible to everyone, everywhere." })
    },
    impactTitle: t({ mn: "Дижитал Сангха", en: "Digital Sangha" }),
    impactSubtitle: t({ mn: "\"Гандантэгчинлэн хийд таны гарт\"", en: "\"Gandantegchinlen Monastery in your hand\"" }),
    stats: [
      { number: "24/7", label: t({ mn: "Онлайн Зөвлөгөө", en: "Online Consultation" }), icon: <Globe /> },
      { number: "100+", label: t({ mn: "Ном Судар", en: "Sutras & Books" }), icon: <BookOpen /> },
      { number: "50+", label: t({ mn: "Лам Хувраг", en: "Venerable Monks" }), icon: <Sun /> },
      { number: "∞", label: t({ mn: "Амар Амгалан", en: "Infinite Peace" }), icon: <Heart /> }
    ],
    quote: t({ mn: "\"Амар амгалан гаднаас ирдэггүй, дотроосоо ундардаг.\"", en: "\"Peace does not come from outside, it wells up from within.\"" }),
    monastery: t({ mn: "Гандантэгчинлэн хийд", en: "Gandantegchinlen Monastery" })
  };

  return (
    <>
      <OverlayNavbar />
      
      <main 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full min-h-screen bg-[#FFFBEB] text-[#451a03] font-serif overflow-hidden selection:bg-[#F59E0B] selection:text-white"
      >
        {/* ATMOSPHERE */}
        <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ background: glowBg }} />
        <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] mix-blend-multiply" />


        {/* --- SECTION 1: THE GREAT VOW (Hero) --- */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-20">
           
           {/* Floating Background Mandala */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[#F59E0B]/10 pointer-events-none"
           >
              <EndlessKnot className="w-full h-full" />
           </motion.div>

           <div className="relative z-10 text-center max-w-5xl space-y-10">
              
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#D97706]/20 bg-[#FFFBEB]/50 backdrop-blur-sm"
              >
                 <InfinityIcon className="w-4 h-4 text-[#D97706]" />
                 <span className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#92400E]">
                    {content.heroTag}
                 </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] text-[#451a03]"
              >
                {content.heroHeadline1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-[#F59E0B]">
                   {content.heroHeadline2}
                </span>
              </motion.h1>

              {/* Sub Headline */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="text-xl md:text-3xl text-[#78350F] font-light max-w-3xl mx-auto leading-relaxed"
              >
                {content.heroSubtitle}
              </motion.p>
              
              {/* English Translation (Subtle) */}
              <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 0.6 }}
                 transition={{ delay: 1 }}
                 className="text-sm font-sans uppercase tracking-widest text-[#92400E]"
              >
                 {content.heroSubEng}
              </motion.p>
           </div>

           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             transition={{ delay: 1, duration: 1 }}
             className="absolute bottom-12 animate-bounce text-[#D97706]/50"
           >
             <ArrowDown size={32} />
           </motion.div>
        </section>


        {/* --- SECTION 2: THE SACRED GOAL (Our Mission) --- */}
        <section className="relative py-32 bg-[#FEF3C7]/50">
           <div className="container mx-auto px-6">
              
              <div className="flex flex-col md:flex-row gap-16 items-center">
                 {/* Left: Manifesto Text */}
                 <div className="w-full md:w-1/2 space-y-8">
                     <h2 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#D97706]">
                        {content.missionTag}
                     </h2>
                     <h3 className="text-4xl md:text-5xl font-bold text-[#451a03] leading-tight">
                        {content.missionTitle.split(t({ mn: "Амар", en: "Peace" }))[0]} <br />
                        <span className="italic text-[#D97706]">{t({ mn: "Амар амгалангийн үрийг", en: "Seeds of Peace" })}</span> {t({ mn: "тарих", en: "in every heart" })}.
                     </h3>
                     <div className="w-20 h-1 bg-[#F59E0B]" />
                     <p className="text-lg md:text-xl text-[#78350F] leading-relaxed font-light">
                        {content.missionDesc}
                     </p>
                 </div>

                 {/* Right: The 3 Pillars Cards */}
                 <div className="w-full md:w-1/2 grid grid-cols-1 gap-6">
                     
                     <MissionRow 
                        icon={<Sparkles className="w-6 h-6" />}
                        title={content.pillar1.title}
                        desc={content.pillar1.desc}
                     />
                     <MissionRow 
                        icon={<BookOpen className="w-6 h-6" />}
                        title={content.pillar2.title}
                        desc={content.pillar2.desc}
                     />
                     <MissionRow 
                        icon={<Globe className="w-6 h-6" />}
                        title={content.pillar3.title}
                        desc={content.pillar3.desc}
                     />
                 </div>
              </div>

           </div>
        </section>


        {/* --- SECTION 3: THE RIPPLE EFFECT (Impact) --- */}
        <section className="relative py-40 overflow-hidden">
           {/* Visual Decoration */}
           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-10 pointer-events-none">
              <img src="https://www.svgrepo.com/show/9658/lotus-flower.svg" alt="Lotus" className="w-full h-full animate-spin-slow" />
           </div>
           
           <div className="container mx-auto px-6 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-20">
                 <h2 className="text-4xl md:text-5xl font-bold text-[#451a03] mb-6">
                    {content.impactTitle}
                 </h2>
                 <p className="text-xl text-[#78350F] italic">
                    {content.impactSubtitle}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {content.stats.map((stat, idx) => (
                   <StatCard key={idx} number={stat.number} label={stat.label} icon={stat.icon} />
                 ))}
              </div>
           </div>
        </section>


        {/* --- SECTION 4: FOOTER QUOTE --- */}
        <section className="relative py-32 bg-[#451a03] text-[#FDE68A]">
           <div className="container mx-auto px-6 text-center max-w-4xl">
              <HandHeart className="w-16 h-16 mx-auto mb-8 text-[#F59E0B]" />
              
              <div className="space-y-8 text-xl md:text-2xl font-light leading-relaxed opacity-90">
                 <p>
                    {content.quote}
                 </p>
              </div>

              <div className="mt-16 pt-8 border-t border-[#FDE68A]/20">
                 <span className="font-sans text-xs uppercase tracking-[0.4em] text-[#F59E0B]">
                    {content.monastery}
                 </span>
              </div>
           </div>
        </section>

      </main>
      <GoldenNirvanaFooter />
    </>
  );
}

// --- SUB-COMPONENTS ---

function MissionRow({ icon, title, desc }: any) {
   return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-[#FDE68A] shadow-sm hover:shadow-md transition-all"
      >
         <div className="w-12 h-12 rounded-full bg-[#FFFBEB] flex items-center justify-center text-[#D97706] shrink-0">
            {icon}
         </div>
         <div>
            <h4 className="text-xl font-bold text-[#451a03] font-serif">{title}</h4>
            <p className="text-sm text-[#78350F] font-sans opacity-80">{desc}</p>
         </div>
      </motion.div>
   )
}

function StatCard({ number, label, icon }: any) {
   return (
      <motion.div 
        whileHover={{ y: -5 }}
        className="flex flex-col items-center justify-center p-10 bg-[#FFFBEB] rounded-[2rem] border border-[#FDE68A] shadow-lg text-center"
      >
         <div className="text-[#D97706] mb-4 opacity-80">{icon}</div>
         <span className="text-4xl font-bold text-[#451a03] mb-2">{number}</span>
         <span className="text-xs font-sans uppercase tracking-widest text-[#92400E]">{label}</span>
      </motion.div>
   )
}

