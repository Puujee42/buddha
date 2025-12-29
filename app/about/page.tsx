"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  AnimatePresence
} from "framer-motion";
import {
  Flower,
  ShieldCheck,
  Users,
  HeartHandshake,
  Sparkles,
  Sun,
  Moon,
  Star,
  Eye,
  ScrollText,
  Compass
} from "lucide-react";
import GoldenNirvanaFooter from "../components/Footer";
import OverlayNavbar from "../components/Navbar";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";

// --- CUSTOM SVG ICONS ---
const DharmaWheel = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor">
    <circle cx="50" cy="50" r="45" strokeWidth="1" />
    <circle cx="50" cy="50" r="10" strokeWidth="1" />
    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M78 22 L22 78" strokeWidth="1" />
    <circle cx="50" cy="50" r="30" strokeWidth="0.5" strokeDasharray="2 2" />
  </svg>
);

// --- ATMOSPHERES ---
const CelestialStardust = ({ isNight }: { isNight: boolean }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
    {[...Array(25)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "110vh", opacity: 0 }}
        animate={{ 
          y: "-10vh", 
          opacity: [0, 0.6, 0],
          x: Math.sin(i) * 100 
        }}
        transition={{
          duration: 15 + (i % 10),
          repeat: Infinity,
          delay: i * 0.4,
        }}
        className={`absolute w-1 h-1 rounded-full blur-xs ${
          isNight ? "bg-indigo-300 shadow-[0_0_8px_white]" : "bg-amber-400 shadow-[0_0_8px_orange]"
        }`}
        style={{ left: `${(i * 4) % 100}%` }}
      />
    ))}
  </div>
);

export default function AboutPage() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  
  const yVideo = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  // Mouse Physics
  const mouseX = useSpring(0, { stiffness: 40, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 40, damping: 20 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme Logic
  const isNight = mounted && resolvedTheme === "dark";
  const glowColor = isNight ? 'rgba(79, 70, 229, 0.2)' : 'rgba(251, 191, 36, 0.15)';
  const lightBackground = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`;

  const theme = isNight ? {
    bgMain: "bg-[#020205]",
    bgSec: "bg-[#05051a]",
    textMain: "text-indigo-50",
    textSub: "text-indigo-300",
    textDesc: "text-indigo-100/60",
    accent: "text-amber-400",
    cardBorder: "border-indigo-500/30",
    cardBg: "bg-black/40",
    icon: <Moon size={32} fill="currentColor" className="animate-pulse" />
  } : {
    bgMain: "bg-[#FFFBEB]",
    bgSec: "bg-[#FEF3C7]",
    textMain: "text-[#451a03]",
    textSub: "text-amber-600",
    textDesc: "text-[#78350F]/80",
    accent: "text-[#F59E0B]",
    cardBorder: "border-amber-200",
    cardBg: "bg-white/60",
    icon: <Sun size={32} className="animate-spin-slow" />
  };

  const content = {
    heroTitle: t({ mn: "Бидний тухай", en: "Our Sacred Path" }),
    heroSubtitle: t({
      mn: "\"Цаг хугацаа, орон зайг үл хамааран оюун санааны амар амгаланг танд түгээнэ.\"",
      en: "\"Whispering spiritual peace across the infinite void of time and space.\""
    }),
    missionTag: t({ mn: "Бидний Эхлэл", en: "First Inception" }),
    missionTitle: t({ mn: "Оюун санааны холбоос", en: "The Ethereal Connection" }),
    whyUsTitle: t({ mn: "Яагаад бид гэж?", en: "Why This Path?" }),
    cards: [
      {
        number: "IX",
        title: t({ mn: "Чадварлаг Багш нар", en: "Ascended Masters" }),
        desc: t({ mn: "Гандантэгчинлэн болон бусад томоохон хийдүүдийн дээд боловсролтой багш нар.", en: "Highly lineage-educated masters from the Great Temples." }),
        icon: <Users />
      },
      {
        number: "XVII",
        title: t({ mn: "Нууцлал & Аюулгүй", en: "Seal of Silence" }),
        desc: t({ mn: "Таны яриа, хувийн мэдээлэл зөвхөн та болон багш хоёрын хооронд үлдэнэ.", en: "Your spiritual consultation is a direct bridge, fully confidential and protected." }),
        icon: <ShieldCheck />
      },
      {
        number: "XXI",
        title: t({ mn: "Эрхэм Зорилго", en: "The Grand Mission" }),
        desc: t({ mn: "Хүн бүрийн сэтгэлд амар амгалангийн үрийг тарьж, гүн ухаанаар замчлах.", en: "To plant seeds of awakening in the collective soul and guide every seeker." }),
        icon: <Compass />
      },
      {
        number: "I",
        title: t({ mn: "Хялбар Шийдэл", en: "Instant Access" }),
        desc: t({ mn: "Цаг алдалгүй өөрт хэрэгцээт засал номоо гэрээсээ, амар амгалан орчинд авах.", en: "Access divine rituals and wisdom from your sanctuary, wherever it may be." }),
        icon: <Sparkles />
      }
    ]
  };

  if (!mounted) return <div className="h-screen bg-[#FFFBEB]" />;

  return (
    <>
      <OverlayNavbar />
      
      <main 
        ref={containerRef} 
        onMouseMove={(e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); }}
        className={`relative w-full min-h-screen transition-colors duration-1000 font-ethereal overflow-hidden ${theme.bgMain} ${theme.textMain}`}
      >
        {/* --- 0. ATMOSPHERE --- */}
        <motion.div className="fixed inset-0 pointer-events-none z-10 opacity-40 mix-blend-screen blur-3xl" style={{ background: lightBackground }} />
        <CelestialStardust isNight={isNight} />


        {/* --- SECTION 1: HERO PORTAL --- */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div style={{ y: yVideo }} className="absolute inset-0 z-0">
             <div className={`absolute inset-0 z-10 transition-colors duration-1000 ${isNight ? "bg-black/60" : "bg-[#451a03]/20"}`} /> 
             <div className={`absolute inset-0 z-20 bg-linear-to-b from-transparent to-current`} /> 
             
             <video autoPlay loop muted playsInline className={`w-full h-full object-cover transition-all duration-1000 ${isNight ? "opacity-30 grayscale saturate-50" : "opacity-60"}`}>
                <source src="/try.mp4" type="video/mp4" />
             </video>
          </motion.div>

          <div className="relative z-30 text-center px-6 max-w-6xl mx-auto">
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }} style={{ y: textY }}>
               <div className="flex justify-center mb-8">
                 <DharmaWheel className={`w-20 h-20 animate-[spin_60s_linear_infinite] transition-colors duration-1000 ${isNight ? "text-indigo-400 drop-shadow-[0_0_15px_#6366f1]" : "text-amber-500"}`} />
               </div>

               <h1 className="text-6xl md:text-[9rem] font-celestial font-black tracking-tighter mb-8 drop-shadow-2xl">
                 {content.heroTitle}
               </h1>
               
               <p className={`text-xl md:text-3xl font-serif italic font-light py-8 px-12 border-y transition-colors duration-1000 ${isNight ? 'border-indigo-500/20 text-indigo-200' : 'border-amber-500/30 text-amber-50'}`}>
                 {content.heroSubtitle}
               </p>
             </motion.div>
          </div>
        </section>


        {/* --- SECTION 2: THE REVELATION --- */}
        <section className="relative py-48 z-20">
            <div className="container mx-auto px-6 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                    
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ margin: "-100px" }} className="space-y-12">
                        <span className={`font-black tracking-[0.5em] uppercase text-[10px] flex items-center gap-3 ${theme.textSub}`}>
                           {theme.icon} {content.missionTag}
                        </span>
                        
                        <h2 className="text-5xl md:text-7xl font-celestial font-bold leading-none tracking-tight">
                          {content.missionTitle}
                        </h2>
                        
                        <div className={`w-32 h-[1px] bg-linear-to-r from-current to-transparent ${theme.accent}`} />
                        
                        <div className={`text-lg md:text-xl leading-relaxed space-y-8 font-medium transition-colors ${theme.textDesc}`}>
                          <p>"{t({
                            mn: "Бид Монголын Бурхан шашны олон зуун жилийн түүхтэй зан үйл, сургаал номлолыг цаг хугацаа, орон зайнаас үл хамааран хүн бүрт хүртээмжтэй болгох зорилготой.",
                            en: "We breathe life into centuries of Mongolian Buddhist lineage, making ancient rites accessible through the digital ether, transcending physical bounds."
                          })}"</p>
                          <p>{t({
                            mn: "Цаг алдах шаардлагагүйгээр өөрт хэрэгцээт засал ном, зөвлөгөөг гэрээсээ, амар амгалан орчинд авах боломжийг бид бүрдүүллээ.",
                            en: "By bridging the physical and celestial, we allow you to welcome the Dharma into your home, finding stillness without the noise of the world."
                          })}</p>
                        </div>
                    </motion.div>

                    {/* RIGHT: CRYSTAL IMAGE PORTAL */}
                    <div className="relative group perspective-2000">
                         <div className={`absolute inset-0 blur-[120px] opacity-20 group-hover:opacity-40 transition-all duration-1000 ${isNight ? "bg-indigo-600" : "bg-amber-500"}`} />
                         
                         <motion.div initial={{ rotateY: 15, opacity: 0 }} whileInView={{ rotateY: 0, opacity: 1 }} className={`relative rounded-t-[25rem] rounded-b-[2rem] overflow-hidden border-[2px] shadow-2xl transition-all duration-1000 ${theme.cardBorder}`}>
                            <img 
                              src="https://images.unsplash.com/photo-1601633596408-f421f28b499f?q=80&w=2574&auto=format&fit=crop" 
                              alt="Temple" 
                              className={`w-full h-[750px] object-cover scale-110 group-hover:scale-100 transition-transform duration-[4s] ${isNight ? "grayscale-[0.6] brightness-125 saturate-50" : "sepia-[0.2]"}`}
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60" />
                            
                            {/* Vertical Floating Script */}
                            <div className="absolute top-20 right-8 z-30 opacity-40 hover:opacity-100 transition-opacity">
                               <span style={{ writingMode: 'vertical-rl' }} className="text-4xl font-serif font-black tracking-widest text-white">ᠡᠨᠡᠷᠡᠯ ᠦᠨ ᠰᠡᠳᠭᠢᠯ</span>
                            </div>
                         </motion.div>
                    </div>
                </div>
            </div>
        </section>


        {/* --- SECTION 3: THE ARCANA OF REASONS --- */}
        <section className={`relative py-48 transition-colors duration-1000 ${theme.bgSec}`}>
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-32 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
                       <Flower className={`w-12 h-12 mx-auto mb-8 animate-pulse ${theme.accent}`} />
                       <h2 className="text-5xl md:text-8xl font-celestial font-bold mb-6">
                          {content.whyUsTitle}
                       </h2>
                       <p className={`font-black uppercase tracking-[0.6em] text-[10px] opacity-40 ${theme.textMain}`}>
                          {language === 'mn' ? "Хувь заяаны дөрвөн үндэс" : "Four Foundations of the Path"}
                       </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {content.cards.map((card, idx) => (
                      <ArcanaCard 
                        key={idx}
                        {...card}
                        isNight={isNight}
                        theme={theme}
                        delay={idx * 0.15}
                      />
                    ))}
                </div>
            </div>
        </section>

      </main>
    </>
  );
}

// --- ARCANA CARD SUB-COMPONENT ---
interface ArcanaCardProps {
  number: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  delay: number;
  isNight: boolean;
  theme: any;
}

function ArcanaCard({ number, title, desc, icon, delay, isNight, theme }: ArcanaCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 60, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 60, damping: 20 });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="perspective-1000"
    >
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative p-10 h-[500px] flex flex-col transition-all duration-700 shadow-2xl rounded-sm border-2 group ${theme.cardBg} ${theme.cardBorder}`}
      >
        {/* Card Frame Decoration */}
        <div className={`absolute inset-2 border transition-colors opacity-20 ${isNight ? "border-indigo-400" : "border-amber-500"}`} />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex justify-between items-start mb-12">
             <span className={`text-4xl font-serif font-black transition-colors ${isNight ? "text-indigo-800" : "text-amber-100"}`}>{number}</span>
             <div className={`p-4 rounded-full border transition-all duration-500 group-hover:-translate-y-2 ${isNight ? "bg-indigo-950 border-indigo-500 text-indigo-400" : "bg-white border-amber-200 text-amber-600"}`}>
 {React.cloneElement(icon as React.ReactElement, { size: 24 } as React.SVGProps<SVGSVGElement>)}
             </div>
          </div>
          
          <h3 className="text-2xl font-celestial font-bold mb-6 leading-tight uppercase tracking-tight">{title}</h3>
          <div className={`w-12 h-1 mb-8 bg-linear-to-r from-current to-transparent ${theme.accent}`} />
          
          <p className={`text-sm leading-relaxed font-medium transition-colors opacity-80 italic`}>
            "{desc}"
          </p>

          <div className="mt-auto flex justify-center opacity-10 group-hover:opacity-40 transition-opacity">
            <Star size={20} className={isNight ? "text-indigo-400" : "text-amber-500"} />
          </div>
        </div>

        {/* Glare Reflection */}
        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}