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
  BookOpen, 
  Eye,
  Star,
  Cloud,
  Loader2,
  AlertCircle
} from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { Service } from "@/database/types";

// --- FALLBACK MOCK DATA (In case DB connection is pending) ---
const FALLBACK_SERVICES: Service[] = [
  { _id: "1", type: "teaching", title: { mn: "Гандангийн Ном", en: "Sutra Chanting" }, subtitle: { mn: "Ариусал", en: "Purification" }, desc: { mn: "Гэр бүл, үр хүүхдийн заяа буяныг даатгаж ном хурах.", en: "Chanting sacred sutras for the well-being and purification of your family." }, duration: "30 min", price: 30000 },
  { _id: "2", type: "divination", title: { mn: "Төрөлх Зурхай", en: "Natal Astrology" }, subtitle: { mn: "Хувь Заяа", en: "Destiny Chart" }, desc: { mn: "Таны төрсөн цаг, гараг эрхсийн байрлалаар хувь заяаг тольдох.", en: "Mapping your destiny through the alignment of stars at your birth." }, duration: "45 min", price: 50000 },
  { _id: "3", type: "teaching", title: { mn: "Сэтгэл Зүйн Зөвлөгөө", en: "Dharma Counseling" }, subtitle: { mn: "Амар Амгалан", en: "Inner Peace" }, desc: { mn: "Буддын гүн ухаанд суурилсан сэтгэл зүйн ганцаарчилсан ярилцлага.", en: "One-on-one counseling grounded in Buddhist philosophy to find mental clarity." }, duration: "60 min", price: 80000 },
  { _id: "4", type: "divination", title: { mn: "Таро Мэргэ", en: "Tarot Reading" }, subtitle: { mn: "Зөн Совин", en: "Intuition" }, desc: { mn: "Таро картын нууцлаг бэлгэдлээр ирээдүйн чиг хандлагыг харах.", en: "Unveiling the path ahead through the mystical archetypes of Tarot." }, duration: "40 min", price: 45000 },
];

// --- STYLES ---
const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Jost:wght@200;300;400&display=swap');
  .font-celestial { font-family: 'Cinzel', serif; }
  .font-ethereal { font-family: 'Jost', sans-serif; }
`;

// --- ATMOSPHERES ---
const DayBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2rem]">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-20"
      style={{ background: "conic-gradient(from 0deg, transparent 0%, #fbbf24 10%, transparent 20%, #fbbf24 30%, transparent 50%)" }}
    />
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "120%", opacity: 0 }}
        animate={{ y: "-20%", opacity: [0, 0.8, 0] }}
        transition={{ duration: 8 + Math.random() * 5, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
        className="absolute bottom-0 w-1 h-1 bg-amber-500 rounded-full blur-[1px]"
        style={{ left: `${Math.random() * 100}%` }}
      />
    ))}
  </div>
);

const NightBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2rem]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#312e81_0%,_transparent_70%)] opacity-40" />
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse" />
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
        transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
        className="absolute w-[2px] h-[2px] bg-indigo-100 rounded-full shadow-[0_0_4px_white]"
        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
      />
    ))}
  </div>
);

export default function ServicesPage() {
  const { t, language } = useLanguage();
  const { scrollYProgress } = useScroll();
  const rotateWheel = useTransform(scrollYProgress, [0, 1], [0, 45]);

  // --- STATE ---
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- FETCH DATA (With Debugging & Fallback) ---
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/services');
        console.log("API Status:", res.status); // Check console

        if (res.ok) {
          const data = await res.json();
          console.log("API Data:", data); // Check console to see if array is empty

          if (Array.isArray(data) && data.length > 0) {
            setServices(data);
          } else {
            console.warn("DB returned empty array. Using Fallback Data.");
            setServices(FALLBACK_SERVICES);
          }
        } else {
          throw new Error("API responded with error");
        }
      } catch (e) {
        console.error("Failed to load services:", e);
        setError("Could not connect to temple archives. Using offline wisdom.");
        setServices(FALLBACK_SERVICES); // Safe fallback
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <OverlayNavbar />
      <style>{pageStyles}</style>
      
      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 bg-[#FDFBF7] -z-20" />
      <div className="fixed inset-0 bg-gradient-to-b from-[#FFFBEB] via-[#fffbf0] to-white -z-10" />
      
      {/* Mandala */}
      <motion.div style={{ rotate: rotateWheel }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vh] h-[150vh] opacity-[0.03] text-amber-900 pointer-events-none -z-10">
         <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 1" />
         </svg>
      </motion.div>

      <main className="relative min-h-screen container mx-auto px-4 lg:px-12 pt-32 pb-24 text-[#1c100b]">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1 }}
             className="mb-4 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-amber-500/20 bg-white/40 backdrop-blur-md"
           >
              <Sparkles size={14} className="text-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-800">
                {t({mn: "Ариун Үйлс", en: "Divine Services"})}
              </span>
           </motion.div>
           
           <h1 className="text-5xl md:text-7xl font-serif text-[#451a03] mb-6 drop-shadow-sm">
             {t({mn: "Өөрийн Замыг", en: "Choose Your"})} <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 italic font-light">
                {t({mn: "Сонгоно уу", en: "Sacred Path"})}
             </span>
           </h1>
        </div>

        {/* --- DYNAMIC GRID --- */}
        {loading ? (
            <div className="h-64 w-full flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
        ) : (
            <>
              {/* Optional Error Warning (Only shows if API failed completely) */}
              {error && (
                <div className="flex items-center justify-center gap-2 mb-8 text-amber-600/70 text-xs uppercase tracking-widest">
                   <AlertCircle size={14} /> <span>{error}</span>
                </div>
              )}

              {services.length === 0 ? (
                 // Truly Empty State (Should be rare with fallback)
                 <div className="text-center py-20 opacity-50">
                    <p>No services found in the archives.</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 perspective-1000">
                    {services.map((service, index) => (
                        <ServiceCard 
                            key={service._id?.toString() || index} 
                            service={service} 
                            index={index} 
                            language={language} 
                        />
                    ))}
                 </div>
              )}
            </>
        )}

      </main>
      <GoldenNirvanaFooter />
    </>
  );
}

// =========================================================================
// SERVICE CARD COMPONENT
// =========================================================================
function ServiceCard({ service, index, language }: { service: Service, index: number, language: "mn" | "en" }) {
  
  // Safe language access check
  const title = service.title?.[language] || "Unknown Service";
  const subtitle = service.subtitle?.[language] || "Service";
  const desc = service.desc?.[language] || "";

  // Theme Detection based on DB 'type' field
  const isNight = service.type === "divination"; 
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-200, 200], [5, -5]), { stiffness: 60, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-200, 200], [-5, 5]), { stiffness: 60, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  // Styles Map
  const styles = isNight ? {
     container: "bg-gradient-to-b from-[#0f172a] via-[#172554] to-[#020617] border-blue-800/30",
     shadow: "shadow-[0_20px_50px_-10px_rgba(30,27,75,0.5)] group-hover:shadow-[0_30px_70px_-10px_rgba(79,70,229,0.3)]",
     textTitle: "text-white",
     textSub: "text-indigo-300",
     textDesc: "text-slate-300/80",
     iconColor: "text-indigo-200",
     iconBg: "bg-indigo-900/50 border-indigo-500/30",
     ringColor: "border-indigo-500/20",
     btn: "bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-400/30",
     accent: <Moon size={100} className="text-indigo-500/5 absolute -top-10 -right-10 animate-pulse" />
  } : {
     container: "bg-gradient-to-b from-white via-[#fffbeb] to-[#fff7ed] border-amber-200/50",
     shadow: "shadow-[0_20px_50px_-10px_rgba(245,158,11,0.15)] group-hover:shadow-[0_30px_70px_-10px_rgba(245,158,11,0.25)]",
     textTitle: "text-[#451a03]",
     textSub: "text-amber-600",
     textDesc: "text-amber-900/70",
     iconColor: "text-amber-600",
     iconBg: "bg-amber-100 border-amber-200",
     ringColor: "border-amber-500/20",
     btn: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-amber-200/50",
     accent: <Sun size={100} className="text-amber-500/5 absolute -top-10 -right-10 animate-[spin_20s_linear_infinite]" />
  };

  // Icon Logic with Safe Check
  let Icon = BookOpen;
  const lowerTitle = (service.title?.en || "").toLowerCase();
  if (lowerTitle.includes("tarot") || lowerTitle.includes("mystic")) Icon = Eye;
  if (lowerTitle.includes("astrology") || lowerTitle.includes("star")) Icon = Star;
  if (lowerTitle.includes("meditation")) Icon = Cloud;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[500px]"
      style={{ perspective: 1000 }}
    >
      <Link href={`/booking/${service._id}`} className="block h-full">
        <motion.div
           animate={{ y: [-8, 8, -8] }}
           transition={{ duration: 6 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
           style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
           className={`relative w-full h-full rounded-[2.5rem] border ${styles.container} ${styles.shadow} overflow-hidden group transition-all duration-500`}
        >
           {/* Internal Backgrounds */}
           {isNight ? <NightBackground /> : <DayBackground />}
           <div className="absolute inset-0 z-0 pointer-events-none" style={{ transform: "translateZ(10px)" }}>{styles.accent}</div>
           
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-100" style={{ transform: "translateZ(20px)" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className={`w-[350px] h-[350px] rounded-full border border-dashed ${styles.ringColor}`} />
           </div>

           {/* Content */}
           <div className="absolute inset-0 p-8 flex flex-col items-center text-center z-10" style={{ transform: "translateZ(40px)" }}>
              <div className={`p-5 rounded-full mb-6 ${styles.iconBg} border backdrop-blur-md shadow-md group-hover:scale-110 transition-transform duration-500`}>
                 <Icon className={`${styles.iconColor}`} size={28} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-3 ${styles.textSub}`}>{subtitle}</span>
              <h3 className={`text-3xl font-serif font-bold mb-4 leading-tight ${styles.textTitle} drop-shadow-sm`}>{title}</h3>
              <p className={`text-base leading-relaxed font-medium max-w-[260px] ${styles.textDesc}`}>{desc}</p>
              
              <div className="flex-1" />
              
              <div className="w-full flex items-end justify-between border-t border-white/10 pt-6 mt-4">
                 <div className="text-left">
                    <p className={`text-xs uppercase tracking-wide opacity-60 ${isNight ? "text-slate-400" : "text-amber-900"}`}>{service.duration}</p>
                    <p className={`font-serif text-lg font-bold ${styles.textTitle}`}>{service.price.toLocaleString()}₮</p>
                 </div>
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-110 ${styles.btn}`}><ArrowRight size={20} /></div>
              </div>
           </div>

           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem]" />
        </motion.div>
        
        <div className={`absolute -bottom-8 left-10 right-10 h-4 blur-xl rounded-[100%] transition-all duration-700 group-hover:scale-x-125 ${isNight ? "bg-indigo-900/50" : "bg-amber-700/20"}`} />
      </Link>
    </motion.div>
  );
}