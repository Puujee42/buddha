"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  motion, 
  useSpring, 
  useMotionTemplate, 
  useTransform,
  AnimatePresence,
  useMotionValue
} from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Scroll, 
  Sun, 
  Moon,
  Flame, 
  Coins
} from "lucide-react";
import OverlayNavbar from "../../components/Navbar"; 
import GoldenNirvanaFooter from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import { Monk } from "@/database/types";
import { useTheme } from "next-themes";

// --- CONSTANTS & TYPES ---
const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00","14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

interface LivingPortalProps {
  image: string;
  name: string;
  quote?: string;
  isNight: boolean;
}

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Jost:wght@200;300;400&display=swap');
  .font-celestial { font-family: 'Cinzel', serif; }
  .font-ethereal { font-family: 'Jost', sans-serif; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
`;

// --- ATMOSPHERIC BACKGROUNDS ---

const DayAtmosphere = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <div className="absolute inset-0 bg-linear-to-b from-[#FFFBEB] via-[#fffbf0] to-[#fff7ed]" />
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="absolute top-[-50%] right-[-20%] w-300 h-300 opacity-[0.03] text-amber-900">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="1 1" />
        </svg>
    </motion.div>
  </div>
);

const NightAtmosphere = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <div className="absolute inset-0 bg-linear-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]" />
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 200, repeat: Infinity, ease: "linear" }} className="absolute top-[-20%] left-[-20%] w-300 h-300 opacity-[0.08] text-indigo-300">
       <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current" strokeWidth="0.2">
          <circle cx="50" cy="50" r="40" strokeDasharray="2 2" />
          <path d="M50 10 L50 90 M10 50 L90 50" />
       </svg>
    </motion.div>
    <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
        <motion.div key={i} animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 3 + i%3, repeat: Infinity }} className="absolute w-1 h-1 bg-indigo-200 rounded-full shadow-[0_0_8px_white]" style={{ top: `${(i * 13) % 100}%`, left: `${(i * 17) % 100}%` }} />
        ))}
    </div>
  </div>
);

const LivingPortal = ({ image, name, quote, isNight }: LivingPortalProps) => (
  <div className="relative w-full aspect-3/4 perspective-1000 group">
       <div className={`absolute inset-10 rounded-[100px] blur-[100px] opacity-30 -z-10 transition-all duration-700 group-hover:opacity-50 ${isNight ? 'bg-indigo-600' : 'bg-amber-600'}`} />

       <motion.div 
         initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
         className={`relative w-full h-full rounded-t-[280px] rounded-b-[40px] p-0.5 shadow-2xl overflow-hidden transition-all duration-1000 ${isNight ? "bg-linear-to-b from-indigo-300 via-indigo-600 to-[#020617]" : "bg-linear-to-b from-amber-200 via-amber-500 to-[#78350F]"}`}
       >
          <div className={`absolute inset-0.75 rounded-t-[278px] rounded-b-[38px] overflow-hidden ${isNight ? "bg-[#0f172a]" : "bg-white"}`}>
             <motion.div className="w-full h-full relative" whileHover={{ scale: 1.05 }} transition={{ duration: 2 }}>
                <img src={image} alt={name} className={`w-full h-full object-cover transition-all duration-1000 ${isNight ? "opacity-70 brightness-110 saturate-[0.8]" : "opacity-90"}`} />
                <div className={`absolute inset-0 bg-linear-to-t ${isNight ? "from-indigo-950/90" : "from-amber-900/60"} via-transparent to-transparent`} />
             </motion.div>

             {quote && (
               <div className="absolute bottom-10 left-6 right-6 text-center">
                  <p className={`font-serif text-lg italic ${isNight ? "text-indigo-100" : "text-amber-50"}`}>"{quote}"</p>
               </div>
             )}
          </div>
       </motion.div>
  </div>
);

export default function MonkDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme(); 
  
  const [monk, setMonk] = useState<Monk | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mouseX = useSpring(0, { stiffness: 30, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 30, damping: 20 });
  const torchX = useTransform(mouseX, (x: number) => x - 600);
  const torchY = useTransform(mouseY, (y: number) => y - 600);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      if (!id) return;
      try {
        const res = await fetch(`/api/monks/${id}`);
        if (res.ok) setMonk(await res.json());
      } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    loadData();
  }, [id]);

  const calendarDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({ 
        day: d.getDate(), 
        weekday: d.toLocaleDateString(language==='mn'?'mn':'en', { weekday:'short'}), 
        full: d 
      });
    }
    return dates;
  }, [language]);

  useEffect(() => {
    async function fetchSlots() {
      if (selectedDateIndex === null || !id) return;
      const date = calendarDates[selectedDateIndex].full;
      const dateString = date.toISOString().split('T')[0];
      try {
        setTakenSlots([]);
        const res = await fetch(`/api/bookings?monkId=${id}&date=${dateString}`);
        if (res.ok) setTakenSlots(await res.json());
      } catch (e) { console.error(e) }
    }
    fetchSlots();
  }, [selectedDateIndex, id, calendarDates]);

  if (!mounted) return null; 
  const isNight = resolvedTheme === "dark";

  const theme = isNight ? {
      textColor: "text-indigo-50",
      borderColor: "border-indigo-800/50",
      altarBg: "bg-[#05050a]/80 backdrop-blur-2xl border-indigo-500/20",
      glowColor: "rgba(99,102,241,0.2)",
      primaryBtn: "bg-indigo-600 text-white shadow-indigo-500/20",
      icon: <Moon className="text-indigo-400" size={32} />,
      btnDefault: "bg-indigo-950/40 border-indigo-800 text-indigo-300",
      btnActive: "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20"
  } : {
      textColor: "text-[#451a03]",
      borderColor: "border-amber-200",
      altarBg: "bg-white/80 backdrop-blur-2xl border-amber-200",
      glowColor: "rgba(251,191,36,0.2)",
      primaryBtn: "bg-amber-600 text-white shadow-amber-900/20",
      icon: <Sun className="text-amber-500" size={32} />,
      btnDefault: "bg-white border-slate-100 text-slate-400 hover:border-amber-200",
      btnActive: "bg-amber-600 border-amber-500 text-white shadow-lg"
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-[#FDFBF7]"><Loader2 className="w-16 h-16 animate-spin text-amber-500" /></div>;
  if (!monk) return null;

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${isNight ? "bg-[#020205]" : "bg-[#FDFBF7]"} font-ethereal`} onMouseMove={(e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); }}>
      <OverlayNavbar />
      <style>{pageStyles}</style>
      
      {isNight ? <NightAtmosphere /> : <DayAtmosphere />}
      
      <motion.div className="fixed top-0 left-0 w-300 h-300 rounded-full pointer-events-none z-1 mix-blend-screen blur-[100px]" style={{ background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 60%)`, x: torchX, y: torchY }} />

      <main className="relative z-10 container mx-auto px-4 lg:px-12 pt-32 pb-24 text-indigo-100">
        <Link href="/monks" className={`inline-flex items-center gap-3 mb-12 group transition-colors ${theme.textColor}`}>
            <div className={`p-2 rounded-full border ${theme.borderColor} group-hover:scale-110 transition-transform`}><ArrowLeft size={16} /></div>
            <span className="uppercase tracking-widest text-[10px] font-black">{t({mn: "Буцах", en: "Return"})}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          <div className="lg:col-span-5 sticky top-32"> 
             <LivingPortal image={monk.image} name={monk.name[language]} quote={monk.quote?.[language]} isNight={isNight} />
          </div>

          <div className="lg:col-span-7 space-y-12">
            <div>
               <h1 className={`text-6xl md:text-8xl font-celestial mb-4 transition-colors ${theme.textColor}`}>{monk.name[language]}</h1>
               <div className="flex items-center gap-4 text-xl font-serif italic text-amber-600">
                  {theme.icon} <span>{monk.title[language]}</span>
               </div>
            </div>
            
            <div className={`rounded-3xl p-8 border backdrop-blur-xl transition-all duration-1000 ${theme.altarBg}`}>
               <p className={`text-lg leading-relaxed font-medium ${theme.textColor}`}>{monk.bio[language]}</p>
            </div>

            <div className={`relative rounded-[2.5rem] border p-2 transition-all duration-1000 ${theme.altarBg}`}>
                <div className="p-8 md:p-12 space-y-12">
                    {isBooked ? (
                        <div className="text-center py-20">
                            <CheckCircle2 className="mx-auto w-20 h-20 text-green-500 mb-6" />
                            <h3 className={`text-4xl font-celestial mb-4 ${theme.textColor}`}>Fate Sealed</h3>
                            <button onClick={() => setIsBooked(false)} className="text-xs font-black uppercase tracking-widest underline text-amber-600">Book Another</button>
                        </div>
                    ) : (
                        <>
                           <div className="space-y-6">
                              <h3 className={`font-celestial text-sm uppercase tracking-widest opacity-60 ${theme.textColor}`}>1. Select Date</h3>
                              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                                 {calendarDates.map((d, i) => (
                                    <button key={i} onClick={() => setSelectedDateIndex(i)} className={`shrink-0 w-20 h-28 rounded-2xl border-2 transition-all flex flex-col items-center justify-center snap-center ${selectedDateIndex === i ? theme.btnActive : theme.btnDefault}`}>
                                       <span className="text-[10px] font-black uppercase mb-1">{d.weekday}</span>
                                       <span className="text-2xl font-serif font-bold">{d.day}</span>
                                    </button>
                                 ))}
                              </div>
                           </div>

                           <AnimatePresence>
                              {selectedDateIndex !== null && (
                                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-12">
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                       {TIME_SLOTS.map(timeStr => (
                                          <button key={timeStr} disabled={takenSlots.includes(timeStr)} onClick={() => setSelectedTime(timeStr)} className={`py-4 rounded-xl text-sm font-bold border transition-all ${selectedTime === timeStr ? theme.btnActive : theme.btnDefault} disabled:opacity-10`}>{timeStr}</button>
                                       ))}
                                    </div>
                                    
                                    <div className="space-y-4">
                                       <h3 className={`font-celestial text-sm uppercase tracking-widest opacity-60 ${theme.textColor}`}>2. Select Rite</h3>
                                       {monk.services?.map(s => (
                                          <button key={s.id} onClick={() => setSelectedService(s.id)} className={`w-full p-6 rounded-2xl border-2 text-left flex justify-between items-center transition-all ${selectedService === s.id ? theme.btnActive : theme.btnDefault}`}>
                                             <div>
                                                <h4 className="font-serif font-bold text-xl">{s.name[language]}</h4>
                                                <p className="text-xs opacity-50">{s.duration}</p>
                                             </div>
                                             <span className="font-celestial text-xl">{s.price.toLocaleString()}₮</span>
                                          </button>
                                       ))}
                                    </div>

                                    <button onClick={() => { setIsSubmitting(true); setTimeout(()=> {setIsBooked(true); setIsSubmitting(false)}, 1500) }} disabled={!selectedTime || !selectedService} className={`w-full py-6 rounded-2xl font-celestial font-bold text-sm uppercase tracking-widest transition-all overflow-hidden relative ${selectedService ? theme.primaryBtn : "opacity-20 cursor-not-allowed bg-slate-500"}`}>
                                       {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Seal Fate"}
                                    </button>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </>
                    )}
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}