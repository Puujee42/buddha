"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Users, Zap, Lock, Globe, Orbit,
  Compass
} from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";

// ==========================================
// 1. ANIMATION UTILS
// ==========================================

const RevealText = ({ children, delay = 0, className = "" }: { children: string, delay?: number, className?: string }) => {
  const words = children.split(" ");
  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-top">
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: delay + (i * 0.03) }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

const CosmicDust = ({ isDark }: { isDark: boolean }) => (
  <div className="fixed inset-0 pointer-events-none z-0">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: "-100vh", opacity: [0, 0.5, 0] }}
        transition={{ duration: Math.random() * 20 + 20, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }}
        className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-amber-200' : 'bg-amber-600'}`}
        style={{ left: `${Math.random() * 100}%` }}
      />
    ))}
  </div>
);

// ==========================================
// 2. MAIN PAGE
// ==========================================

export default function AboutPage() {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // 1. Ref and Scroll Hook
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  
  // 2. Animations derived from scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "50%"]);

  useEffect(() => { setMounted(true); }, []);

  // Default to light if not mounted to prevent hydration mismatch on visual props
  // We DO NOT return early here anymore to ensure the ref is attached.
  const isDark = false;

  // --- THEME CONFIG ---
  const theme = isDark ? {
    bg: "bg-[#05050a]",
    bgSection: "bg-[#0a0a1a]",
    text: "text-amber-50",
    textMuted: "text-amber-100/60",
    accent: "text-amber-400",
    cardBg: "bg-[#0f0f2a]/60 border-indigo-500/20",
    border: "border-indigo-500/20"
  } : {
    bg: "bg-[#FDFBF7]",
    bgSection: "bg-[#F5F2EA]",
    text: "text-[#451a03]",
    textMuted: "text-[#78350F]/60",
    accent: "text-amber-600",
    cardBg: "bg-white border-amber-900/10",
    border: "border-amber-900/10"
  };

  const cards = [
    { 
      title: t({ mn: "Мэргэжлийн Баг", en: "Expert Guidance" }),
      desc: t({ mn: "Туршлагатай зурхайч, лам нар танд үйлчилнэ.", en: "Experienced masters guiding your path." }),
      icon: <Users />, color: "text-orange-500", grad: "from-orange-500/20"
    },
    { 
      title: t({ mn: "Цаг Хугацаа", en: "Anytime Access" }),
      desc: t({ mn: "Дэлхийн хаанаас ч холбогдох боломжтой.", en: "Connect instantly from anywhere on Earth." }),
      icon: <Globe />, color: "text-blue-500", grad: "from-blue-500/20"
    },
    { 
      title: t({ mn: "Нууцлал", en: "Full Privacy" }),
      desc: t({ mn: "Таны мэдээлэл бүрэн хамгаалагдана.", en: "Your sessions are strictly confidential." }),
      icon: <Lock />, color: "text-emerald-500", grad: "from-emerald-500/20"
    },
    { 
      title: t({ mn: "Хялбар Шийдэл", en: "Seamless Tech" }),
      desc: t({ mn: "Цахим төлбөр, хялбар захиалгын систем.", en: "Effortless booking & secure payments." }),
      icon: <Zap />, color: "text-amber-500", grad: "from-amber-500/20"
    }
  ];

  // 3. Render Wrapper with Ref immediately
  return (
    <div 
        ref={targetRef} 
        className={`relative min-h-screen ${theme.bg} ${theme.text} transition-colors duration-1000 overflow-x-hidden font-ethereal`}
    >
      <OverlayNavbar />
      
      {/* 4. Render content only after mount to avoid hydration mismatch (optional but good for themes) */}
      {/* Or render immediately with defaults if SEO is priority. Here we fade in for smoothness. */}
      <AnimatePresence>
        {mounted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                
                <CosmicDust isDark={isDark} />

                {/* --- SECTION 1: CINEMATIC HERO --- */}
                <section className="relative h-screen flex items-center justify-center overflow-hidden">
                    {/* Parallax Video Background */}
                    <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0 z-0">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
                        <source src="/try.mp4" type="video/mp4" />
                    </video>
                    <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-black/80 via-transparent to-[#05050a]' : 'from-white/90 via-transparent to-[#FDFBF7]'}`} />
                    </motion.div>

                    <div className="relative z-10 container px-6 text-center">
                    <motion.div style={{ y: textY }} className="space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
                            className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border backdrop-blur-md ${theme.cardBg} ${theme.accent}`}
                        >
                            <Orbit className="animate-spin-slow" size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t({mn: "Бидний Түүх", en: "Our Story"})}</span>
                        </motion.div>

                        <h1 className="text-6xl md:text-9xl font-serif font-black tracking-tighter leading-[0.85]">
                            <RevealText delay={0.2} className="block">{t({ mn: "Өв Соёл", en: "Heritage" })}</RevealText>
                            <RevealText delay={0.4} className={`block italic font-light ${theme.accent}`}>{t({ mn: "& Технологи", en: "& Future" })}</RevealText>
                        </h1>

                        <motion.p 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
                            className={`max-w-2xl mx-auto text-lg md:text-2xl font-light leading-relaxed ${theme.textMuted}`}
                        >
                            {t({ 
                            mn: "Эртний мэргэн ухааныг орчин үеийн технологитой хослуулан, хүн бүрт амар амгаланг түгээх нь бидний зорилго.",
                            en: "Bridging ancient wisdom with modern technology to bring peace and clarity to the digital age."
                            })}
                        </motion.p>
                    </motion.div>
                    </div>
                </section>

                {/* --- SECTION 2: HORIZONTAL SCROLL STORY --- */}
                <section className={`relative py-32 ${theme.bgSection}`}>
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className={`absolute -inset-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-[3rem] blur-2xl opacity-20`} />
                            <motion.div 
                                initial={{ clipPath: "inset(0 100% 0 0)" }}
                                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl"
                            >
                                <img src="/monk3.png" alt="Monk" className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[2s]" />
                            </motion.div>
                        </div>

                        <div className="space-y-10">
                            <h2 className="text-4xl md:text-7xl font-serif font-bold leading-[0.9]">
                                <RevealText>{t({ mn: "Бидний Эрхэм", en: "Our Noble" })}</RevealText> <br/>
                                <span className={`italic ${theme.accent}`}>{t({ mn: "Зорилго", en: "Mission" })}</span>
                            </h2>
                            
                            <div className={`space-y-6 text-lg leading-relaxed ${theme.textMuted}`}>
                                <p>
                                    {t({ 
                                    mn: "Бид Монголын Бурхан шашны олон зуун жилийн түүхтэй зан үйл, сургаал номлолыг цаг хугацаа, орон зайнаас үл хамааран хүн бүрт хүртээмжтэй болгохыг зорьдог.",
                                    en: "We aim to make centuries-old Mongolian Buddhist rituals accessible to everyone, transcending the barriers of time and space."
                                    })}
                                </p>
                                <div className={`pl-6 border-l-2 ${theme.border}`}>
                                    <p className="font-bold italic text-xl">
                                    "{t({ mn: "Амар амгалан таны гарт.", en: "Inner peace in your hands." })}"
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl border bg-current/5 border-current/10">
                                    <div className={`text-4xl font-black mb-2 ${theme.accent}`}>120+</div>
                                    <div className="text-[10px] uppercase tracking-widest font-bold">Masters</div>
                                </div>
                                <div className="p-6 rounded-2xl border bg-current/5 border-current/10">
                                    <div className={`text-4xl font-black mb-2 ${theme.accent}`}>5K+</div>
                                    <div className="text-[10px] uppercase tracking-widest font-bold">Seekers</div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 3: HOLOGRAPHIC CARDS --- */}
                <section className="py-32 px-6">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-24">
                        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
                            <h2 className="text-5xl md:text-8xl font-serif font-black mb-6">
                                {t({ mn: "Давуу Тал", en: "Why Choose Us" })}
                            </h2>
                            <div className={`w-24 h-1 mx-auto bg-current opacity-20`} />
                        </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cards.map((card, i) => (
                            <HoloCard key={i} card={card} index={i} theme={theme} />
                        ))}
                        </div>
                    </div>
                </section>

            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- 3D TILT CARD COMPONENT (Correctly Typed) ---
function HoloCard({ card, index, theme }: any) {
  // Use Framer Motion hooks for physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 100, damping: 20 });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate center-relative coordinates
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(offsetX);
    y.set(offsetY);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ perspective: 1000 }}
      className="h-[400px] w-full"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative h-full w-full rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden border transition-shadow duration-500 hover:shadow-2xl ${theme.cardBg}`}
      >
        {/* Hover Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${card.grad} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
        
        {/* Floating Number */}
        <div className="absolute top-4 right-6 text-6xl font-black opacity-5 pointer-events-none select-none">
           0{index + 1}
        </div>

        <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border bg-current/5 border-current/10 ${card.color}`}>
              {/* Note: React.cloneElement works best if the icon component accepts props */}
              {React.cloneElement(card.icon, { size: 28, strokeWidth: 1.5 })}
           </div>
           <h3 className="text-2xl font-bold mb-4 leading-tight">{card.title}</h3>
           <div className={`h-[2px] w-10 mb-4 bg-current opacity-20`} />
           <p className={`text-sm leading-relaxed opacity-70`}>{card.desc}</p>
        </div>

        <div className="relative z-10 pt-6" style={{ transform: "translateZ(10px)" }}>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
              <Compass size={12} /> Explore
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}