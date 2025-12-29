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
  Flower,
  Star,
  Eye,
  BookOpen,
  Coins
} from "lucide-react";
import OverlayNavbar from "../../components/Navbar"; 
import { useLanguage } from "../../contexts/LanguageContext";
import { Monk, Service } from "@/database/types";
import GoldenNirvanaFooter from "../../components/Footer";

// --- GLOBAL STYLES & ASSETS ---
const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Jost:wght@200;300;400&display=swap');
  .font-celestial { font-family: 'Cinzel', serif; }
  .font-ethereal { font-family: 'Jost', sans-serif; }
  
  /* Scrollbar Theme will be injected dynamically */
  .scrollbar-hide::-webkit-scrollbar { display: none; }
`;

// --- ATMOSPHERIC BACKGROUNDS ---

// Day Theme (Heavenly)
const DayAtmosphere = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-[#FFFBEB] via-[#fffbf0] to-[#fff7ed]" />
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-50%] right-[-20%] w-[120vw] h-[120vw] opacity-[0.03] text-amber-900 pointer-events-none"
    >
        {/* Dharma Wheel SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="1 1" />
            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.2" fill="none" />
        </svg>
    </motion.div>
    <div className="absolute inset-0 z-0 mix-blend-soft-light opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
    
    {/* Rising Golden Dust */}
    <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
        <motion.div
            key={i}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "-10%", opacity: [0, 0.5, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
            className="absolute bottom-0 w-1 h-1 bg-amber-400 rounded-full blur-[1px]"
            style={{ left: `${Math.random() * 100}%` }}
        />
        ))}
    </div>
  </div>
);

// Night Theme (Cosmic)
const NightAtmosphere = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]" />
    
    {/* Galaxy Swirl */}
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] left-[-20%] w-[120vw] h-[120vw] opacity-[0.05] pointer-events-none text-indigo-300"
    >
       <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current" strokeWidth="0.2">
          <circle cx="50" cy="50" r="40" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="25" />
          <path d="M50 10 L50 90 M10 50 L90 50" />
       </svg>
    </motion.div>

    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse" />
    
    {/* Twinkling Stars */}
    <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
        <motion.div
            key={i}
            animate={{ opacity: [0.1, 1, 0.1], scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
            className="absolute w-1 h-1 bg-indigo-100 rounded-full shadow-[0_0_4px_white]"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
        />
        ))}
    </div>
  </div>
);

// --- COMPONENT: THE LIVING PORTAL (Image) ---
const LivingPortal = ({ image, name, quote, isNight }: { image: string, name: string, quote?: string, isNight: boolean }) => {
  return (
    <div className="relative w-full h-full aspect-[3/4] perspective-1000 group">
       {/* 1. OUTER HALO */}
       <div className={`absolute -inset-10 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000 ${isNight ? "bg-gradient-to-t from-indigo-500/30 via-purple-900/20 to-transparent" : "bg-gradient-to-t from-amber-500/20 via-transparent to-blue-200/10"}`} />

       {/* 2. THE FRAME */}
       <motion.div 
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ duration: 1 }}
         className={`relative w-full h-full rounded-t-[280px] rounded-b-[40px] p-[2px] shadow-2xl overflow-hidden ${isNight ? "bg-gradient-to-b from-indigo-300 via-indigo-600 to-[#020617]" : "bg-gradient-to-b from-amber-200 via-amber-500 to-[#78350F]"}`}
       >
          {/* Inner Frame */}
          <div className="absolute inset-[3px] bg-current rounded-t-[278px] rounded-b-[38px] z-0 overflow-hidden text-transparent"> {/* bg-current trick fails on image, used specific bg below */}
             <div className={`absolute inset-0 ${isNight ? "bg-[#0f172a]" : "bg-white"}`} />
             
             {/* PARALLAX IMAGE */}
             <motion.div className="w-full h-full relative" whileHover={{ scale: 1.05 }} transition={{ duration: 2 }}>
                <img src={image} alt={name} className={`w-full h-full object-cover transition-all duration-700 group-hover:opacity-100 ${isNight ? "opacity-80 contrast-125 brightness-110" : "opacity-90 sepia-[0.1] group-hover:sepia-0"}`} />
                
                {/* Image Overlay Gradients */}
                <div className={`absolute inset-0 bg-gradient-to-t ${isNight ? "from-indigo-950/80" : "from-amber-900/60"} via-transparent to-transparent z-10`} />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent z-10 mix-blend-soft-light" />
             </motion.div>

             {/* QUOTE OVERLAY */}
             {quote && (
               <div className="absolute bottom-10 left-6 right-6 z-20 text-center">
                  <div className="relative inline-block">
                     <Sparkles className={`absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 animate-spin-slow ${isNight ? "text-indigo-300" : "text-amber-300"}`} />
                     <p className={`font-serif text-lg leading-relaxed drop-shadow-md italic ${isNight ? "text-indigo-100" : "text-amber-50"}`}>"{quote}"</p>
                  </div>
               </div>
             )}
          </div>
          
          {/* GLASS REFLECTION */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent pointer-events-none z-30 opacity-60 rounded-t-[280px]" />
       </motion.div>
       
       {/* 3. GROUND SHADOW */}
       <div className={`absolute -bottom-12 left-10 right-10 h-6 blur-xl rounded-[100%] transition-transform duration-700 group-hover:scale-x-110 ${isNight ? "bg-indigo-900/50" : "bg-black/20"}`} />
    </div>
  )
}

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00","14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

export default function MonkDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { language, t } = useLanguage();
  
  const [monk, setMonk] = useState<Monk | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Booking Logic
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mouse Interaction
  const mouseX = useSpring(0, { stiffness: 30, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 30, damping: 20 });
  // Top Level Transforms
  const torchX = useTransform(mouseX, x => x - 600);
  const torchY = useTransform(mouseY, y => y - 600);

  function onMouseMove({ clientX, clientY }: React.MouseEvent) {
    mouseX.set(clientX);
    mouseY.set(clientY);
  }

  // --- FETCH DATA ---
  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const res = await fetch(`/api/monks/${id}`);
        if (res.ok) setMonk(await res.json());
      } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    loadData();
  }, [id]);

  useEffect(() => {
    async function fetchSlots() {
      if (selectedDateIndex === null || !id) return;
      const date = generateCalendar()[selectedDateIndex].full;
      const dateString = date.toISOString().split('T')[0];
      try {
        setTakenSlots([]); setSelectedTime(null);
        const res = await fetch(`/api/bookings?monkId=${id}&date=${dateString}`);
        if (res.ok) setTakenSlots(await res.json());
      } catch (e) { console.error(e) }
    }
    fetchSlots();
  }, [selectedDateIndex]);

  const handleBooking = async () => {
    if (selectedDateIndex === null || !selectedTime || !id || !selectedService) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsBooked(true);
    setIsSubmitting(false);
  };

  const generateCalendar = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({ day: d.getDate(), weekday: d.toLocaleDateString(language==='mn'?'mn':'en', { weekday:'short'}), full: d });
    }
    return dates;
  };

  const labels = {
    back: t({ mn: "Жагсаалт руу Буцах", en: "Return to List" }),
    booked: t({ mn: "Захиалга Баталгаажлаа", en: "Booking Confirmed" }),
    unavailable: t({ mn: "Боломжгүй", en: "Unavailable" }),
    philosophy: t({ mn: "Багшийн Үг", en: "Master's Wisdom" }),
    education: t({ mn: "Боловсрол", en: "Lineage" }),
    exp: t({ mn: "Туршлага", en: "Path" }),
    btn: t({ mn: "Цаг Авах", en: "Request Audience" })
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-[#FDFBF7]"><Loader2 className="w-16 h-16 animate-spin text-amber-500" /></div>;
  if (!monk) return <div className="h-screen flex items-center justify-center">Monk Not Found</div>;

  // --- THEME DETECTION ---
  const keywords = [...(monk.specialties || []), monk.title?.en || ""].join(" ").toLowerCase();
  const isNight = keywords.includes("tarot") || keywords.includes("star") || keywords.includes("divination") || keywords.includes("astrology") || keywords.includes("oracle");

  const theme = isNight ? {
      textColor: "text-indigo-100",
      accentColor: "text-indigo-400",
      borderColor: "border-indigo-800/50",
      cardBg: "bg-[#0f172a]/60",
      altarBg: "bg-slate-900/80 backdrop-blur-xl border-indigo-700/30",
      cornerColor: "border-indigo-500",
      glowColor: "rgba(99,102,241,0.2)",
      primaryBtn: "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-900/50",
      icon: <Moon className="text-indigo-400" size={32} />,
      serviceSelected: "border-indigo-500 bg-indigo-900/40 shadow-lg text-white",
      serviceDefault: "border-indigo-900/50 bg-[#0f172a]/40 text-indigo-200 hover:border-indigo-600",
      calendarSelected: "bg-indigo-600 border-indigo-600 text-white",
      calendarDefault: "bg-[#0f172a]/40 border-indigo-900 text-indigo-400 hover:border-indigo-500"
  } : {
      textColor: "text-[#451a03]",
      accentColor: "text-amber-600",
      borderColor: "border-amber-200",
      cardBg: "bg-[#fffbeb]/80",
      altarBg: "bg-white/80 backdrop-blur-xl border-amber-200",
      cornerColor: "border-amber-400",
      glowColor: "rgba(251,191,36,0.25)",
      primaryBtn: "bg-gradient-to-r from-[#451a03] to-[#78350F] shadow-amber-900/30 text-amber-50",
      icon: <Sun className="text-amber-500" size={32} />,
      serviceSelected: "border-amber-500 bg-amber-50/50 shadow-md",
      serviceDefault: "border-slate-100 bg-white hover:border-amber-200",
      calendarSelected: "bg-[#451a03] border-[#451a03] text-amber-100",
      calendarDefault: "bg-white border-slate-100 text-slate-400 hover:border-amber-300"
  };

  return (
    <div className={`min-h-screen ${isNight ? "bg-[#020617] text-indigo-100" : "bg-[#FDFBF7] text-[#1c100b]"} font-ethereal overflow-x-hidden`} onMouseMove={onMouseMove}>
      <OverlayNavbar />
      <style>{pageStyles}</style>
      
      {/* 1. ATMOSPHERE */}
      {isNight ? <NightAtmosphere /> : <DayAtmosphere />}
      
      {/* 2. DIVINE FLASHLIGHT */}
      <motion.div
        className="fixed top-0 left-0 w-[1200px] h-[1200px] rounded-full pointer-events-none z-[1] mix-blend-screen blur-[100px]"
        style={{ 
            background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 60%)`,
            x: torchX, 
            y: torchY 
        }}
      />

      <main className="relative z-10 container mx-auto px-4 lg:px-12 pt-32 pb-24">
        
        {/* NAV BACK */}
        <Link href="/monks">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`inline-flex items-center gap-3 transition-colors mb-12 cursor-pointer group ${isNight ? "text-indigo-400 hover:text-indigo-200" : "text-amber-800/60 hover:text-amber-700"}`}>
            <div className={`p-2 rounded-full border group-hover:bg-opacity-20 ${theme.borderColor} ${isNight ? "group-hover:bg-indigo-500" : "group-hover:bg-amber-100"}`}>
               <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="uppercase tracking-[0.2em] text-xs font-bold">{labels.back}</span>
          </motion.div>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* --- LEFT: THE PORTAL --- */}
          <div className="lg:col-span-5 sticky top-32"> 
             <LivingPortal 
                image={monk.image} 
                name={monk.name[language]} 
                quote={monk.quote?.[language]} 
                isNight={isNight} // Actually need to pass this prop if using it inside Shrine component, updated below?
             />
          </div>

          {/* --- RIGHT: CONTENT & ALTAR --- */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              
              {/* HEADER */}
              <div className="mb-10 relative">
                 <div className={`absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b to-transparent ${isNight ? "from-indigo-500" : "from-amber-400"}`} />
                 <h1 className={`text-6xl md:text-8xl font-celestial mb-2 leading-none drop-shadow-sm ${theme.textColor}`}>
                    {monk.name[language]}
                 </h1>
                 <p className={`text-2xl font-serif italic flex items-center gap-3 ${theme.accentColor}`}>
                    {theme.icon} {monk.title[language]}
                 </p>
              </div>
              
              {/* BIO CARD */}
              <div className={`rounded-2xl p-8 shadow-sm mb-10 relative overflow-hidden group border ${theme.borderColor} ${isNight ? "bg-slate-900/50" : "bg-white/60"} backdrop-blur-xl`}>
                 <p className={`relative z-10 leading-loose text-lg font-medium ${theme.textColor}`}>
                    {monk.bio[language]}
                 </p>
              </div>

              {/* CREDENTIALS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                 {[
                    { label: labels.exp, val: `${monk.yearsOfExperience} Years`, icon: <Flame className={isNight ? "text-purple-400" : "text-orange-500"} /> },
                    { label: labels.education, val: monk.education?.[language], icon: <Scroll className={theme.accentColor} /> }
                 ].map((item, idx) => (
                    item.val && (
                        <div key={idx} className={`border rounded-xl p-5 flex items-center gap-4 transition-colors shadow-sm ${theme.borderColor} ${isNight ? "bg-[#0f172a]/60 hover:border-indigo-500" : "bg-white hover:border-amber-200"}`}>
                            <div className={`p-3 rounded-full ${isNight ? "bg-indigo-900/50" : "bg-amber-50"}`}>{item.icon}</div>
                            <div>
                                <p className={`text-[10px] uppercase tracking-widest font-bold opacity-50 ${theme.textColor}`}>{item.label}</p>
                                <p className={`font-serif text-lg ${theme.textColor}`}>{item.val}</p>
                            </div>
                        </div>
                    )
                 ))}
                 
                 {/* Philosophy Full Width */}
                 {monk.philosophy && (
                    <div className={`md:col-span-2 border p-6 rounded-xl flex gap-5 items-start ${theme.borderColor} ${isNight ? "bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950" : "bg-gradient-to-r from-amber-50 via-white to-amber-50"}`}>
                        <Sparkles className={`mt-1 shrink-0 ${theme.accentColor}`} />
                        <div>
                            <p className={`text-[10px] uppercase tracking-widest font-bold mb-2 opacity-50 ${theme.textColor}`}>{labels.philosophy}</p>
                            <p className={`font-serif italic text-xl ${isNight ? "text-indigo-200" : "text-[#78350F]"}`}>"{monk.philosophy[language]}"</p>
                        </div>
                    </div>
                 )}
              </div>

              {/* --- BOOKING ALTAR (SCROLL UI) --- */}
              <div className={`relative rounded-[2rem] border shadow-2xl p-1 ${theme.borderColor} ${isNight ? "bg-indigo-950/30" : "bg-[#fffbeb]"}`}>
                {/* Ornate corners */}
                <div className={`absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg ${theme.cornerColor}`} />
                <div className={`absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg ${theme.cornerColor}`} />
                <div className={`absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg ${theme.cornerColor}`} />
                <div className={`absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 rounded-br-lg ${theme.cornerColor}`} />

                <div className={`rounded-[1.8rem] p-6 md:p-10 relative z-10 overflow-hidden ${theme.altarBg}`}>
                    
                    {!monk.isAvailable ? (
                        <div className="text-center py-10 font-celestial text-xl opacity-50">{labels.unavailable}</div>
                    ) : isBooked ? (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner ${isNight ? "bg-indigo-500/20 text-indigo-400" : "bg-green-100 text-green-600"}`}><CheckCircle2 size={40} /></div>
                            <h3 className={`font-celestial text-3xl mb-2 ${theme.textColor}`}>{labels.booked}</h3>
                            <p className="opacity-60 mb-8">Your request has been received by the spirits.</p>
                            <button onClick={() => { setIsBooked(false); setSelectedDateIndex(null); }} className={`text-xs font-bold uppercase tracking-widest underline decoration-2 ${theme.accentColor}`}>Book Another</button>
                        </motion.div>
                    ) : (
                        <div className="space-y-10">
                            
                            {/* 1. DATE SCROLL */}
                            <div>
                                <h3 className={`font-celestial text-sm uppercase tracking-widest mb-6 flex items-center gap-2 opacity-60 ${theme.textColor}`}><Calendar size={14}/> {language==='mn' ? 'Өдөр сонгох' : 'Select Moon Phase'}</h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {generateCalendar().map((date, idx) => (
                                        <button key={idx} onClick={() => setSelectedDateIndex(idx)} 
                                            className={`shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 ${selectedDateIndex === idx ? theme.calendarSelected : theme.calendarDefault}`}
                                        >
                                            <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">{date.weekday}</span>
                                            <span className="text-2xl font-serif">{date.day}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. TIME GRID */}
                            <AnimatePresence>
                                {selectedDateIndex !== null && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                        <h3 className={`font-celestial text-sm uppercase tracking-widest mb-6 flex items-center gap-2 opacity-60 ${theme.textColor}`}><Clock size={14}/> {language==='mn' ? 'Цаг' : 'Hour'}</h3>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                            {TIME_SLOTS.map(time => {
                                                const taken = takenSlots.includes(time);
                                                const active = selectedTime === time;
                                                return (
                                                    <button key={time} disabled={taken} onClick={() => { setSelectedTime(time); setSelectedService(null); }}
                                                        className={`py-4 rounded-xl text-sm font-bold border transition-all ${taken ? "opacity-20 cursor-not-allowed decoration-current line-through" : active ? theme.calendarSelected : theme.calendarDefault}`}
                                                    >
                                                        {time}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 3. OFFERING SELECT (Themed) */}
                            <AnimatePresence>
                                {selectedTime !== null && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                                        <h3 className={`font-celestial text-sm uppercase tracking-widest mb-6 flex items-center gap-2 opacity-60 ${theme.textColor}`}><Coins size={14}/> {language==='mn' ? 'Өргөл' : 'Offering'}</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {monk.services?.map(service => (
                                                <button key={service.id} onClick={() => setSelectedService(service.id)}
                                                    className={`relative p-5 rounded-xl border-2 transition-all text-left flex justify-between items-center group ${selectedService === service.id ? theme.serviceSelected : theme.serviceDefault}`}
                                                >
                                                    <div>
                                                        <h4 className="font-serif font-bold text-lg">{service.name[language]}</h4>
                                                        <p className="text-xs opacity-60 mt-1">{service.duration}</p>
                                                    </div>
                                                    <span className={`font-bold font-celestial ${selectedService === service.id ? "text-white" : theme.accentColor}`}>
                                                        {service.price.toLocaleString()}₮
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 4. CONFIRM BUTTON */}
                            <button 
                                disabled={!selectedTime || !selectedService || isSubmitting}
                                onClick={handleBooking}
                                className={`w-full py-5 rounded-xl font-celestial font-bold text-sm uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 overflow-hidden relative group ${selectedTime && selectedService ? theme.primaryBtn : "bg-slate-200/20 text-slate-400 cursor-not-allowed"}`}
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : (
                                    <>
                                       <span className="relative z-10">{labels.btn}</span>
                                       <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 z-0" />
                                    </>
                                )}
                            </button>

                        </div>
                    )}
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </main>
      <GoldenNirvanaFooter />
    </div>
  );
}