"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  motion, 
  AnimatePresence, 
  useSpring, 
  useTransform
} from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Sun, 
  Moon, 
  Sparkles, 
  User,
  AlertCircle
} from "lucide-react";
import OverlayNavbar from "../../components/Navbar";
import GoldenNirvanaFooter from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import { Service, Monk } from "@/database/types";

// --- STYLES ---
const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Jost:wght@200;300;400&display=swap');
  .font-celestial { font-family: 'Cinzel', serif; }
  .font-ethereal { font-family: 'Jost', sans-serif; }
  
  .scrollbar-day::-webkit-scrollbar { height: 4px; }
  .scrollbar-day::-webkit-scrollbar-track { background: rgba(251, 191, 36, 0.1); }
  .scrollbar-day::-webkit-scrollbar-thumb { background: rgba(245, 158, 11, 0.5); border-radius: 10px; }

  .scrollbar-night::-webkit-scrollbar { height: 4px; }
  .scrollbar-night::-webkit-scrollbar-track { background: rgba(79, 70, 229, 0.1); }
  .scrollbar-night::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.5); border-radius: 10px; }
`;

// --- BACKGROUNDS ---

const HeavenlyBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#FFFBEB] via-[#fffbf0] to-[#fff7ed]" />
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] opacity-30"
      style={{ background: "conic-gradient(from 0deg, transparent 0%, #fbbf24 10%, transparent 20%, #fbbf24 30%, transparent 50%)" }}
    />
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse mix-blend-multiply" />
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "110vh", opacity: 0 }}
        animate={{ y: "-10vh", opacity: [0, 0.6, 0] }}
        transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, delay: i * 0.8, ease: "linear" }}
        className="absolute bottom-0 w-2 h-2 bg-amber-400 rounded-full blur-[2px]"
        style={{ left: `${Math.random() * 100}%` }}
      />
    ))}
  </div>
);

const CosmicBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]" />
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] right-[-20%] w-[120vw] h-[120vw] opacity-20"
      style={{ background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)" }}
    />
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse" />
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
);

export default function BookingPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { t, language } = useLanguage();

  const [service, setService] = useState<Service | null>(null);
  const [selectedMonk, setSelectedMonk] = useState<Monk | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [userNote, setUserNote] = useState("");

  // --- MOUSE PHYSICS HOOKS (MUST BE UNCONDITIONAL) ---
  const mouseX = useSpring(0, { stiffness: 40, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 40, damping: 20 });
  const flashX = useTransform(mouseX, x => x - 600);
  const flashY = useTransform(mouseY, y => y - 600);

  function onMouseMove({ clientX, clientY }: React.MouseEvent) {
    mouseX.set(clientX);
    mouseY.set(clientY);
  }

  // --- 1. INITIAL DATA FETCH ---
  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        
        // 1. Get Services
        const servicesRes = await fetch('/api/services'); 
        if (servicesRes.ok) {
          const services: Service[] = await servicesRes.json();
          // Flexible comparison in case ID types mismatch (string vs ObjectId)
          const found = services.find((s) => String(s._id) === id);
          if (found) setService(found);
        }

        // 2. Find a Monk (Simple logic: just grab first for now)
        const monksRes = await fetch('/api/monks');
        if (monksRes.ok) {
            const allMonks: Monk[] = await monksRes.json();
            if (allMonks.length > 0) setSelectedMonk(allMonks[0]);
        }

      } catch (error) {
        console.error("Data Load Error", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push({ 
        day: d.getDate(), 
        week: d.toLocaleDateString(language==='mn'?'mn':'en',{weekday:'short'}),
        fullDate: d
      });
    }
    return arr;
  }, [language]);

  const times = ["10:00", "11:30", "14:00", "16:00", "18:00"];

  // --- 2. CHECK AVAILABILITY ---
  useEffect(() => {
    async function checkSlots() {
      if (!selectedMonk || selectedDateIndex === null) return;
      
      const dateObj = dates[selectedDateIndex].fullDate;
      const dateStr = dateObj.toISOString().split('T')[0];
      
      try {
        setTakenSlots([]); 
        const res = await fetch(`/api/bookings?monkId=${selectedMonk._id}&date=${dateStr}`);
        if (res.ok) {
          const taken = await res.json();
          setTakenSlots(taken);
        }
      } catch (e) { console.error(e); }
    }
    checkSlots();
  }, [selectedDateIndex, selectedMonk, dates]);


  // --- 3. SUBMIT BOOKING ---
  const handleBooking = async () => {
    if (!selectedMonk || selectedDateIndex === null || !selectedTime || !service) return;

    setIsSubmitting(true);
    try {
      const dateObj = dates[selectedDateIndex].fullDate;
      const dateStr = dateObj.toISOString().split('T')[0];

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monkId: selectedMonk._id,
          serviceId: service._id,
          serviceName: service.title[language],
          date: dateStr,
          time: selectedTime,
          userName: userName || "Guest",
          userEmail: "guest@example.com",
          notes: userNote
        })
      });

      if (res.ok) {
        setIsBooked(true);
      } else {
        alert("This time slot was just taken. Please choose another.");
        const refreshRes = await fetch(`/api/bookings?monkId=${selectedMonk._id}&date=${dateStr}`);
        if (refreshRes.ok) setTakenSlots(await refreshRes.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- UI THEME CONFIG ---
  // We define themes here but don't return early to avoid hook errors later if we used hooks in theme objects.
  // Although styling variables are safe.
  const isNight = service?.type === "divination";
  const theme = isNight ? {
      textColor: "text-indigo-100",
      accentColor: "text-indigo-400",
      borderColor: "border-indigo-800/50",
      cardBg: "bg-[#0f172a]/60",
      inputBg: "bg-indigo-950/50 text-indigo-100 placeholder-indigo-400/50 border-indigo-800",
      glowColor: "rgba(99,102,241,0.2)",
      primaryBtn: "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)]",
      icon: <Moon className="text-indigo-400" size={32} />,
      scrollbar: "scrollbar-night",
      selection: "bg-indigo-500/20 border-indigo-400 text-white"
  } : {
      textColor: "text-[#451a03]",
      accentColor: "text-amber-600",
      borderColor: "border-amber-200",
      cardBg: "bg-[#fffbeb]/80",
      inputBg: "bg-white/60 text-[#451a03] placeholder-amber-900/30 border-amber-200",
      glowColor: "rgba(251,191,36,0.25)",
      primaryBtn: "bg-gradient-to-r from-amber-500 to-orange-600 shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)]",
      icon: <Sun className="text-amber-500" size={32} />,
      scrollbar: "scrollbar-day",
      selection: "bg-amber-100 border-amber-500 text-amber-900"
  };

  // --- RENDER ---

  // 1. Loading State (Bright & Heavenly)
  if (loading) return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center font-ethereal text-amber-900">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
        <p className="uppercase tracking-[0.3em] text-xs opacity-70 animate-pulse">Entering Sanctuary...</p>
    </div>
  );

  // 2. Error State
  if (!service) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] text-amber-900 gap-4">
        <AlertCircle size={40} className="text-red-400" />
        <p className="font-serif">Service unavailable.</p>
        <Link href="/services" className="underline hover:text-amber-600">Return to Hall</Link>
    </div>
  );

  return (
    <>
      <OverlayNavbar />
      <style>{pageStyles}</style>

      <div className={`min-h-screen relative font-ethereal overflow-hidden ${isNight ? "selection:bg-indigo-500 selection:text-white" : "selection:bg-amber-300 selection:text-amber-900"}`} onMouseMove={onMouseMove}>
        
        {/* DYNAMIC BACKGROUND COMPONENT */}
        {isNight ? <CosmicBackground /> : <HeavenlyBackground />}

        {/* MOUSE FLASHLIGHT */}
        <motion.div
          className="fixed top-0 left-0 w-[1200px] h-[1200px] rounded-full pointer-events-none z-[1] mix-blend-screen blur-[100px]"
          style={{ 
            background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 60%)`, // Fixed string, no hook here
            x: flashX, 
            y: flashY 
          }}
        />

        <main className="relative z-10 container mx-auto px-4 lg:px-12 pt-32 pb-20 flex flex-col items-center justify-center min-h-screen">
          
          {/* NAVIGATION */}
          <div className="absolute top-28 left-6 lg:left-20 z-20">
             <Link href="/services">
                <button className={`p-3 rounded-full border backdrop-blur-md transition-all ${theme.borderColor} ${theme.textColor} hover:scale-110`}>
                   <ArrowLeft size={20} />
                </button>
             </Link>
          </div>

          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
             
             {/* --- LEFT: SERVICE INFO --- */}
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 1 }}
               className="text-center lg:text-left relative"
             >
                {/* Back Glow */}
                <div className={`absolute top-1/2 left-1/2 lg:left-0 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] ${isNight ? "bg-indigo-900/10" : "bg-amber-500/10"} blur-3xl -z-10 rounded-full`} />

                <div className="mb-6 flex justify-center lg:justify-start">
                   <div className={`p-4 rounded-full border ${theme.borderColor} ${theme.cardBg} backdrop-blur-md shadow-lg animate-float`}>
                      {theme.icon}
                   </div>
                </div>

                <div className={`text-xs font-bold uppercase tracking-[0.4em] mb-4 flex items-center justify-center lg:justify-start gap-2 ${theme.accentColor}`}>
                   <Sparkles size={12} /> {service.subtitle[language]}
                </div>

                <h1 className={`text-6xl md:text-7xl font-celestial leading-none mb-6 drop-shadow-xl ${theme.textColor}`}>
                   {service.title[language]}
                </h1>

                <p className={`text-lg md:text-xl font-medium leading-relaxed opacity-80 ${theme.textColor}`}>
                   {service.desc[language]}
                </p>

                <div className="mt-10 flex items-center justify-center lg:justify-start gap-8">
                   <div className={`${theme.textColor}`}>
                      <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Duration</p>
                      <p className="font-celestial text-2xl">{service.duration}</p>
                   </div>
                   <div className={`h-10 w-[1px] ${isNight ? "bg-indigo-500/30" : "bg-amber-500/30"}`} />
                   <div className={`${theme.textColor}`}>
                      <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Offering</p>
                      <p className="font-celestial text-2xl">{service.price.toLocaleString()}₮</p>
                   </div>
                </div>

                {/* Assigned Monk Indicator (Optional) */}
                {selectedMonk && (
                    <div className={`mt-8 inline-flex items-center gap-3 p-3 rounded-xl border bg-opacity-20 ${theme.borderColor} ${theme.textColor}`}>
                        <User size={16} />
                        <span className="text-xs uppercase tracking-wider">
                            Conducted by: <span className="font-bold">{selectedMonk.name[language]}</span>
                        </span>
                    </div>
                )}
             </motion.div>


             {/* --- RIGHT: BOOKING ALTAR --- */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className={`relative rounded-[2.5rem] p-[2px] ${isNight ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-slate-900" : "bg-gradient-to-br from-amber-300 via-orange-300 to-amber-100"} shadow-2xl`}
             >
                <div className={`relative rounded-[2.4rem] p-8 md:p-10 ${theme.cardBg} backdrop-blur-xl border ${theme.borderColor} overflow-hidden`}>
                   
                   {isBooked ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                         <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isNight ? "bg-indigo-500/20 text-indigo-300" : "bg-green-100 text-green-600"}`}>
                            <CheckCircle2 size={48} />
                         </div>
                         <h3 className={`text-3xl font-celestial ${theme.textColor}`}>
                            {language === 'mn' ? "Таны хүсэлт илгээгдлээ" : "Sacred Request Sent"}
                         </h3>
                         <p className={`opacity-60 max-w-xs ${theme.textColor}`}>
                            The universe acknowledges your intention. We will guide you shortly.
                         </p>
                         <button onClick={() => { setIsBooked(false); setSelectedDateIndex(null); }} className={`text-xs font-bold uppercase tracking-widest underline ${theme.accentColor}`}>
                            Book Another
                         </button>
                      </div>
                   ) : (
                      <div className="space-y-8">
                         
                         {/* CALENDAR */}
                         <div>
                            <h3 className={`font-celestial text-sm uppercase tracking-widest mb-4 opacity-70 ${theme.textColor} flex items-center gap-2`}>
                               <Calendar size={14}/> {language === 'mn' ? "Өдөр сонгох" : "Select Date"}
                            </h3>
                            <div className={`flex gap-3 overflow-x-auto pb-4 ${theme.scrollbar}`}>
                               {dates.map((d, i) => (
                                  <button 
                                    key={i} 
                                    onClick={() => setSelectedDateIndex(i)}
                                    className={`shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border transition-all ${selectedDateIndex === i ? theme.selection : `bg-transparent ${theme.borderColor} ${theme.textColor} hover:border-opacity-100 opacity-60 hover:opacity-100`}`}
                                  >
                                     <span className="text-[10px] font-bold uppercase">{d.week}</span>
                                     <span className="text-xl font-serif">{d.day}</span>
                                  </button>
                               ))}
                            </div>
                         </div>

                         {/* TIME SELECT */}
                         <AnimatePresence>
                            {selectedDateIndex !== null && (
                               <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                  <h3 className={`font-celestial text-sm uppercase tracking-widest mb-4 opacity-70 ${theme.textColor} flex items-center gap-2`}>
                                     <Clock size={14}/> {language === 'mn' ? "Цаг сонгох" : "Select Hour"}
                                  </h3>
                                  <div className="grid grid-cols-3 gap-3">
                                     {times.map((time) => {
                                        const isTaken = takenSlots.includes(time);
                                        return (
                                          <button 
                                            key={time} 
                                            disabled={isTaken}
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-3 rounded-lg text-sm font-bold border transition-all ${
                                                isTaken 
                                                    ? "opacity-30 cursor-not-allowed line-through decoration-current" 
                                                    : selectedTime === time 
                                                        ? theme.selection 
                                                        : `bg-transparent ${theme.borderColor} ${theme.textColor} opacity-60 hover:opacity-100`
                                            }`}
                                          >
                                             {time}
                                          </button>
                                        );
                                     })}
                                  </div>
                               </motion.div>
                            )}
                         </AnimatePresence>

                         {/* FORM */}
                         <AnimatePresence>
                            {selectedTime && (
                               <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                                  <div className="space-y-4">
                                     <input 
                                       type="text" 
                                       placeholder={language === 'mn' ? "Таны нэр" : "Your Name"}
                                       className={`w-full p-4 rounded-xl outline-none transition-all ${theme.inputBg} focus:ring-2 focus:ring-opacity-50 font-medium`}
                                       value={userName}
                                       onChange={(e) => setUserName(e.target.value)}
                                     />
                                     <textarea 
                                       placeholder={language === 'mn' ? "Хүсэлт / Тэмдэглэл" : "Your Intentions / Note"}
                                       className={`w-full p-4 rounded-xl outline-none h-24 resize-none transition-all ${theme.inputBg} focus:ring-2 focus:ring-opacity-50 font-medium`}
                                       value={userNote}
                                       onChange={(e) => setUserNote(e.target.value)}
                                     />
                                  </div>
                               </motion.div>
                            )}
                         </AnimatePresence>

                         {/* BUTTON */}
                         <button 
                            disabled={!selectedTime || !userName || isSubmitting}
                            onClick={handleBooking}
                            className={`w-full py-5 rounded-xl font-celestial font-bold text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed ${theme.primaryBtn} text-white`}
                         >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : (
                               <>
                                  <span className="relative z-10">{language === 'mn' ? "Баталгаажуулах" : "Seal Your Fate"}</span>
                                  {/* Shine animation */}
                                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 z-0" />
                               </>
                            )}
                         </button>

                      </div>
                   )}
                </div>
             </motion.div>

          </div>
        </main>
      </div>
      <GoldenNirvanaFooter />
    </>
  );
}