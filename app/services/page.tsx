"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  AnimatePresence 
} from "framer-motion";
import { 
  Sun, 
  Moon, 
  Sparkles, 
  ArrowRight, 
  Zap,
  Eye,
  Star,
  Flame,
  Compass,
  Loader2,
  ShieldCheck,
  Gem
} from "lucide-react";
import { useTheme } from "next-themes";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { Service } from "@/database/types";

// --- THE SACRED ARCHES (VIKING FRAMES) ---
const VikingServiceFrame = ({ isNight, color }: { isNight: boolean, color: string }) => (
  <div className="absolute inset-0 pointer-events-none z-30">
    <svg className="w-full h-full" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M40 60 L40 40 L60 40 M340 40 L360 40 L360 60 M360 540 L360 560 L340 560 M60 560 L40 560 L40 540" 
        stroke={color} strokeWidth="1" strokeOpacity="0.5" 
      />
      {/* Ornate Knots at center edges */}
      <circle cx="200" cy="40" r="3" fill={color} />
      <path d="M160 40 Q200 10 240 40" stroke={color} strokeWidth="2" />
      <path d="M160 560 Q200 590 240 560" stroke={color} strokeWidth="2" />
      
      {/* Runic Stamps */}
      <text x="365" y="300" fill={color} fontSize="12" className="font-serif opacity-30" style={{ writingMode: 'vertical-rl' }}>
        {isNight ? "ᚢᚦᚬᚱᚴ" : "ᛋᚼᚠᛅᛚ"}
      </text>
    </svg>
  </div>
);

export default function VikingServices() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <OverlayNavbar />
      
      {/* ATMOSPHERE */}
      <div className={`fixed inset-0 transition-colors duration-1000 -z-20 ${isDark ? "bg-[#050508]" : "bg-[#fcfaf7]"}`} />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <main className="relative min-h-screen pt-40 pb-32 overflow-hidden">
        {/* HERO SECTION */}
        <div className="container mx-auto px-6 text-center mb-24 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-8"
          >
            <span className={`text-[10px] font-black tracking-[0.6em] uppercase px-4 py-2 border rounded-full ${isDark ? "text-indigo-400 border-indigo-500/30" : "text-amber-700 border-amber-900/10"}`}>
              {t({mn: "Орчлонгийн Хүрдийг Эргүүлэх", en: "Turn the Wheel of Fate"})}
            </span>
          </motion.div>

          <h1 className={`text-6xl md:text-9xl font-serif leading-[0.8] mb-12 tracking-tighter ${isDark ? "text-white" : "text-stone-900"}`}>
            {t({mn: "Ариун", en: "Ancient"})} <br />
            <span className="italic font-light text-amber-500">{t({mn: "Зөвлөгөө", en: "Rituals"})}</span>
          </h1>

          <p className={`max-w-2xl mx-auto text-lg ${isDark ? "text-indigo-200/50" : "text-stone-500"}`}>
            {t({mn: "Эртний мэргэн ухаан, орчин үеийн гэгээрлийн нэгдэл.", en: "Bridging the void between Viking tenacity and Buddhist serenity. Choose your catalyst for transformation."})}
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={48} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {services.map((service, idx) => (
                <ServiceTarotCard key={idx} service={service} index={idx} isDark={isDark} lang={language} />
              ))}
            </div>
          )}
        </div>
      </main>
      <GoldenNirvanaFooter />
    </>
  );
}

function ServiceTarotCard({ service, index, isDark, lang }: { service: any, index: number, isDark: boolean, lang: "mn"|"en" }) {
  const isNight = service.type === "divination" || index % 2 !== 0;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 60, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 60, damping: 20 });

  const colors = isNight ? {
    accent: "#818cf8",
    bg: "bg-[#0a0a14]",
    text: "text-indigo-100",
    sub: "text-indigo-400",
    btn: "bg-indigo-600 hover:bg-white hover:text-indigo-950",
    ring: "border-indigo-500/20"
  } : {
    accent: "#d97706",
    bg: "bg-[#ffffff]",
    text: "text-stone-900",
    sub: "text-amber-600",
    btn: "bg-amber-600 hover:bg-black hover:text-white",
    ring: "border-amber-900/10"
  };

  const Icons = [Eye, Star, Flame, Zap, ShieldCheck, Compass];
  const Icon = Icons[index % Icons.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative group h-[650px]"
    >
      <Link href={`/booking/${service._id}`} className="block h-full cursor-none">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={`relative h-full w-full rounded-2xl border transition-all duration-700 p-8 flex flex-col items-center text-center
            ${colors.bg} ${isDark ? 'border-white/5 shadow-2xl shadow-indigo-500/10' : 'border-stone-200 shadow-xl'}`}
        >
          {/* Grain Texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
          
          <VikingServiceFrame isNight={isNight} color={colors.accent} />

          {/* Floating Background Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none" style={{ transform: "translateZ(10px)" }}>
             <Icon size={300} strokeWidth={1} />
          </div>

          {/* CARD TOP: SACRED NUMBER */}
          <div className="relative z-40 mb-12">
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-serif text-sm font-bold ${colors.sub} ${colors.ring}`}>
              {index + 1}
            </div>
          </div>

          {/* CARD MID: IDENTITY */}
          <div style={{ transform: "translateZ(50px)" }} className="relative z-40 flex flex-col items-center">
            <div className={`mb-6 p-5 rounded-xl border-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${colors.ring} ${isNight ? 'bg-indigo-950/40' : 'bg-stone-50'}`}>
               <Icon className={colors.sub} size={40} />
            </div>
            
            <span className={`text-[10px] font-black tracking-[0.4em] uppercase mb-3 ${colors.sub}`}>
              {service.subtitle?.[lang] || (isNight ? "The Oracle" : "The Healer")}
            </span>
            
            <h3 className={`text-4xl font-serif font-black leading-tight mb-6 px-4 ${colors.text}`}>
              {service.title?.[lang]}
            </h3>
            
            <p className={`text-sm leading-relaxed max-w-[240px] mb-8 opacity-70 ${isDark ? 'text-indigo-100' : 'text-stone-600'}`}>
              {service.desc?.[lang]?.substring(0, 100)}...
            </p>
          </div>

          <div className="flex-1" />

          {/* CARD FOOTER: THE CALL TO ACTION */}
          <div style={{ transform: "translateZ(30px)" }} className="w-full relative z-40">
            <div className={`flex justify-between items-end mb-8 border-b pb-4 ${colors.ring}`}>
               <div className="text-left">
                  <span className={`text-[9px] font-bold uppercase tracking-widest opacity-50 ${colors.text}`}>Offering</span>
                  <p className={`text-2xl font-serif font-black ${colors.text}`}>{service.price.toLocaleString()}₮</p>
               </div>
               <div className="text-right text-[10px] font-bold opacity-50 uppercase tracking-tighter">
                  {service.duration} <br /> {lang === 'mn' ? 'Хугацаа' : 'Session'}
               </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`w-full py-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-black/10 ${colors.btn}`}
            >
              {lang === 'mn' ? 'Зан үйлийг эхлүүлэх' : 'Initiate Ritual'}
              <ArrowRight size={16} />
            </motion.button>
          </div>
          
          {/* Ritual Aura (Glow) */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-1000 ${isNight ? 'bg-indigo-400' : 'bg-amber-400'}`} />
        </motion.div>
        
        {/* Dynamic Card Shadow */}
        <div className={`absolute -bottom-10 left-10 right-10 h-10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 ${isNight ? 'bg-indigo-900/40' : 'bg-amber-900/10'}`} />
      </Link>
    </motion.div>
  );
}