"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { TypeAnimation } from "react-type-animation";
import { Flower, Users, Globe, ArrowDown, ShieldCheck, Sparkles, Star, ArrowRight, Quote, Heart, Sun, Feather } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";
import OverlayNavbar from "../components/Navbar"; 
import GoldenГэваболFooter from "../components/Footer";

const RitualViewportFrame = ({ theme }: { theme: any }) => (
  <div className="fixed inset-0 pointer-events-none z-[100] p-4 md:p-8">
    <div className={`w-full h-full border-[1px] opacity-20 rounded-[2rem] md:rounded-[3rem] transition-colors duration-1000 ${theme.borderColor}`} />
    <div className="absolute left-10 top-1/2 -rotate-90 origin-left hidden lg:block">
        <span className={`text-[8px] tracking-[1em] opacity-30 font-bold uppercase ${theme.textColor}`}>
          SPIRITUAL HERITAGE • TECHNOLOGY • PEACE
        </span>
    </div>
  </div>
);

export default function AboutUsHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-[#05051a]" />;
  return (
    <>
      <ActualAboutContent />
    </>
  );
}

function ActualAboutContent() {
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isNight = false; 
  const containerRef = useRef<HTMLDivElement>(null);

  // --- FULLY POPULATED MONGOLIAN & ENGLISH CONTENT ---
  const content = {
    mn: {
      badge: "Бидний Эрхэм Зорилго",
      typeSequence: ["Уламжлалт Соёлыг", 1500, "Орчин үеийн Технологиор", 1500, "Таны Гартаа", 2000],
      subheadline: "Монголчуудын олон зуун жилийн оюун санааны өв соёлыг дижитал шилжилттэй холбож, хүн бүрт амар амгаланг хүртээмжтэй түгээх нь бидний зорилго юм.",
      cta: "Үйлчилгээ үзэх",
      masters: "120+ Багш нар",
      philosophyTitle: "Бидний Баримтлах",
      philosophySubtitle: "Гурван Тулгуур",
      philosophyDesc: "Эртний мэргэн ухааныг гэрлийн хурдтай холбож, орчин үеийн хүмүүсийн сэтгэл зүйд нийцүүлэх нь бидний гүүр юм.",
      philosophies: [
        { title: "Оюун санаа", desc: "Дотоод амар амгаланг олоход тань туслах зөвлөгөө.", icon: <Star /> },
        { title: "Уламжлал", desc: "Монгол зан заншил, өв соёлоо дижитал хэлбэрт хадгалах.", icon: <Flower /> },
        { title: "Технологи", desc: "Дэлхийн хаанаас ч холбогдох хязгааргүй боломжийг нээх.", icon: <Globe /> }
      ],
      marquee: ["МОНГОЛ ӨВ СОЁЛ", "ДИЖИТАЛ АМАР АМГАЛАН", "УЛАМЖЛАЛТ МЭРГЭН УХААН"],
      stats: [
        { label: "Мэргэжлийн Багш нар", end: 120, icon: <Users /> },
        { label: "Нийт Хамрах Хүрээ", end: 21, icon: <Globe /> },
        { label: "Амар Амгаланг Эрэлхийлэгчид", end: 5000, icon: <Heart /> }
      ],
      storyTitle: "Мэргэн Ухааны Зам",
      storyText: "Бид зөвхөн вэбсайт биш, энэ бол оюун санааны аялал юм. Технологийн тусламжтайгаар орон зай, цаг хугацааны саадыг даван туулж, таныг жинхэнэ өөртэйгөө уулзахад тусална.",
      liveText: "Шуд дамжуулалт"
    },
    en: {
      badge: "Our Noble Mission",
      typeSequence: ["Traditional Heritage", 1500, "Modern Technology", 1500, "In Your Hands", 2000],
      subheadline: "Our mission is to bridge centuries of Mongolian spiritual wisdom with digital innovation, making inner peace accessible to everyone, everywhere.",
      cta: "Explore Services",
      masters: "120+ Masters",
      philosophyTitle: "Our Philosophy",
      philosophySubtitle: "Three Pillars",
      philosophyDesc: "Merging ancient wisdom with the speed of light to serve the modern soul through accessible connection.",
      philosophies: [
        { title: "Mindset", desc: "Guiding you toward inner stillness and mental clarity.", icon: <Star /> },
        { title: "Heritage", desc: "Preserving  Mongolian traditions for the digital age.", icon: <Flower /> },
        { title: "Innovation", desc: "Unlocking borderless access to spiritual guidance via tech.", icon: <Globe /> }
      ],
      marquee: ["MONGOLIAN HERITAGE", "DIGITAL PEACE", "TRADITIONAL WISDOM"],
      stats: [
        { label: "Trusted Masters", end: 120, icon: <Users /> },
        { label: "Global Coverage", end: 21, icon: <Globe /> },
        { label: "Peace Seekers", end: 5000, icon: <Heart /> }
      ],
      storyTitle: "The Wisdom Path",
      storyText: "We are more than just a platform; we are a spiritual vessel. Through technology, we dissolve the barriers of time and distance, connecting you to the source of peace.",
      liveText: "Live Atmosphere"
    }
  };

  const t = content[language as keyof typeof content] || content.en;
  const { scrollYProgress } = useScroll();
  const mantraX = useTransform(scrollYProgress, [0, 1], [0, -500]);

  const theme = isNight ? {
      mainBg: "bg-[#05051a]", textColor: "text-amber-50", accentText: "text-amber-500",
      mutedText: "text-amber-100/40", borderColor: "border-amber-500/20",
      altarBg: "bg-amber-950/20 backdrop-blur-xl border-amber-500/10",
      btnPrimary: "bg-amber-600 text-[#05051a] shadow-amber-900/40",
  } : {
      mainBg: "bg-[#FDFBF7]", textColor: "text-[#451a03]", accentText: "text-amber-600",
      mutedText: "text-[#78350F]/50", borderColor: "border-amber-900/10",
      altarBg: "bg-white/80 backdrop-blur-md border-amber-900/5",
      btnPrimary: "bg-[#451a03] text-white shadow-orange-900/20",
  };

  return (
    <div ref={containerRef} className={`relative w-full ${theme.mainBg} ${theme.textColor} transition-colors duration-1000 font-serif overflow-hidden`}>
      <RitualViewportFrame theme={theme} />
      
      {/* FLOATING BACKGROUND TEXT */}
      <div className="absolute top-40 left-0 w-full whitespace-nowrap pointer-events-none opacity-[0.03] z-0 select-none">
        <motion.h2 style={{ x: mantraX }} className="text-[20vw] font-black uppercase tracking-tighter">
          Peace Wisdom Harmony Compassion Tradition Modernity
        </motion.h2>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
              <div className="flex items-center gap-4 mb-8">
                 <div className={`h-[1px] w-12 ${theme.accentText} bg-current`} />
                 <span className="text-[10px] uppercase tracking-[0.4em] font-black">{t.badge}</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic mb-10">
                 <TypeAnimation sequence={t.typeSequence} wrapper="span" speed={50} repeat={Infinity} />
              </h1>
              
              <p className={`max-w-md text-base md:text-xl font-sans tracking-wide leading-relaxed mb-12 ${theme.mutedText}`}>
                 {t.subheadline}
              </p>

              <div className="flex flex-wrap gap-6">
                <Link href="/services">
                  <motion.button whileHover={{ scale: 1.05 }} className={`px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 ${theme.btnPrimary}`}>
                    <Sparkles size={16} /> {t.cta}
                  </motion.button>
                </Link>
                <div className="flex items-center gap-4 px-6 border-l border-current opacity-30">
                   <div className="flex -space-x-3">
                      {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-amber-400" />)}
                   </div>
                   <span className="text-[10px] font-bold">{t.masters}</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
              <div className={`absolute -inset-8 border border-current opacity-5 rounded-full animate-[spin_30s_linear_infinite]`} />
              <div className={`relative aspect-[4/5] overflow-hidden rounded-[4rem] border-[12px] ${theme.altarBg} shadow-2xl`}>
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                  <source src="/num2.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end text-white">
                   <div>
                      <p className="text-[8px] uppercase tracking-widest opacity-60">{t.liveText}</p>
                      <h4 className="text-lg font-bold">Divine Wisdom</h4>
                   </div>
                   <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md">
                      <Flower size={20} className="animate-pulse" />
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- PHILOSOPHY SECTION --- */}
      <section className="relative py-32 bg-current/[0.02]">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
              <div className="max-w-2xl">
                <Quote size={40} className={`mb-6 opacity-20 ${theme.accentText}`} />
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                  {t.philosophyTitle} <br/> <span className={theme.accentText}>{t.philosophySubtitle}</span>
                </h2>
              </div>
              <p className={`max-w-xs text-xs uppercase tracking-widest leading-loose font-bold ${theme.mutedText}`}>
                {t.philosophyDesc}
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {t.philosophies.map((p, i) => (
                <div key={i} className="group p-8 rounded-[2rem] border border-transparent hover:border-current/10 transition-all duration-500">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:bg-current group-hover:text-white border ${theme.borderColor}`}>
                      {React.cloneElement(p.icon as React.ReactElement, { size: 28, strokeWidth: 1 } as any)}
                   </div>
                   <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">{p.title}</h3>
                   <div className="h-[1px] w-12 bg-current opacity-20 mb-4" />
                   <p className={`text-sm leading-relaxed ${theme.mutedText}`}>{p.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- STORY SECTION (Added to fill space) --- */}
      <section className="py-32 px-6">
         <div className="container mx-auto max-w-5xl">
            <div className={`p-12 md:p-24 rounded-[4rem] relative overflow-hidden border ${theme.borderColor} ${theme.altarBg}`}>
               <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Feather size={200} />
               </div>
               <div className="relative z-10 text-center">
                  <Sun size={48} className={`mx-auto mb-8 ${theme.accentText}`} />
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">{t.storyTitle}</h2>
                  <p className="text-lg md:text-2xl leading-relaxed italic opacity-80 max-w-3xl mx-auto">
                    "{t.storyText}"
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* --- MARQUEE --- */}
      <section className="py-24 border-y border-current/10 overflow-hidden">
        <div className="flex gap-20 animate-[marquee_40s_linear_infinite] whitespace-nowrap">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="flex gap-20 items-center">
                <span className="text-6xl md:text-8xl font-black opacity-10 italic">{t.marquee[0]}</span>
                <Flower className="opacity-20" size={40} />
                <span className="text-6xl md:text-8xl font-black opacity-10 italic">{t.marquee[1]}</span>
                <Sparkles className="opacity-20" size={40} />
             </div>
           ))}
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="relative py-32 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {t.stats.map((stat, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className={`p-12 rounded-[3rem] text-center border ${theme.altarBg} ${theme.borderColor}`}>
                <div className={`mx-auto w-12 h-12 flex items-center justify-center mb-6 ${theme.accentText}`}>
                  {React.cloneElement(stat.icon as React.ReactElement, { size: 32 } as any)}
                </div>
                <div className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                  <CountUp end={stat.end} duration={3} />+
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-50">{stat.label}</p>
              </motion.div>
            ))}
         </div>
      </section>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}