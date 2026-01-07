"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  motion, 
  useSpring, 
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Sun, 
  Moon,
  CreditCard,
  Scroll,
  Ban
} from "lucide-react";
import OverlayNavbar from "../../components/Navbar"; 
import { useLanguage } from "../../contexts/LanguageContext";
import { Monk, Service } from "@/database/types";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs";

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Jost:wght@200;300;400&display=swap');
  .font-celestial { font-family: 'Cinzel', serif; }
  .font-ethereal { font-family: 'Jost', sans-serif; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

// --- VISUAL COMPONENTS ---

const DayAtmosphere = () => (
  <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
    <div className="absolute inset-0 bg-gradient-to-b from-[#FFFBEB] via-[#fffbf0] to-[#fff7ed]" />
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="absolute top-[-50%] right-[-20%] w-[800px] h-[800px] opacity-[0.03] text-amber-900">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current"><path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" /></svg>
    </motion.div>
  </div>
);

const NightAtmosphere = () => (
  <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
    <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]" />
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 200, repeat: Infinity, ease: "linear" }} className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] opacity-[0.08] text-indigo-300">
       <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current" strokeWidth="0.2"><circle cx="50" cy="50" r="40" strokeDasharray="2 2" /><path d="M50 10 L50 90 M10 50 L90 50" /></svg>
    </motion.div>
  </div>
);

// Portal displays MONK details primarily
const LivingPortal = ({ image, name, title, isNight }: { image: string, name: string, title: string, isNight: boolean }) => (
  <div className="relative w-full aspect-[3/4] perspective-1000 group">
       <div className={`absolute inset-10 rounded-[100px] blur-[100px] opacity-30 -z-10 transition-all duration-700 group-hover:opacity-50 ${isNight ? 'bg-indigo-600' : 'bg-amber-600'}`} />
       <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`relative w-full h-full rounded-t-[280px] rounded-b-[40px] p-0.5 shadow-2xl overflow-hidden transition-all duration-1000 ${isNight ? "bg-gradient-to-b from-indigo-300 via-indigo-600 to-[#020617]" : "bg-gradient-to-b from-amber-200 via-amber-500 to-[#78350F]"}`}>
          <div className={`absolute inset-[2px] rounded-t-[278px] rounded-b-[38px] overflow-hidden ${isNight ? "bg-[#0f172a]" : "bg-white"}`}>
             <div className="w-full h-full relative">
                <img src={image} alt={name} className={`w-full h-full object-cover transition-all duration-1000 ${isNight ? "opacity-70 brightness-110 saturate-[0.8]" : "opacity-90"}`} />
                <div className={`absolute inset-0 bg-gradient-to-t ${isNight ? "from-indigo-950/90" : "from-amber-900/60"} via-transparent to-transparent`} />
             </div>
             <div className="absolute bottom-10 left-6 right-6 text-center">
                 <p className={`text-xs uppercase tracking-widest font-bold mb-2 ${isNight ? "text-indigo-200" : "text-amber-100"}`}>{title}</p>
                 <h2 className={`font-celestial text-3xl ${isNight ? "text-indigo-50" : "text-white"}`}>{name}</h2>
             </div>
          </div>
       </motion.div>
  </div>
);

// --- MAIN PAGE ---

export default function MonkBookingPage() {
  const params = useParams();
  const monkId = Array.isArray(params.id) ? params.id[0] : params.id; // Monk ID from URL
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme(); 
  const { user, isSignedIn } = useUser();
  
  // Data State
  const [monk, setMonk] = useState<Monk | null>(null);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  
  // Selection State
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // User Form State
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userNote, setUserNote] = useState("");
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  // Mouse Effects
  const mouseX = useSpring(0, { stiffness: 30, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 30, damping: 20 });
  const torchX = useTransform(mouseX, (x: number) => x - 400); 
  const torchY = useTransform(mouseY, (y: number) => y - 400);

  // --- 1. INITIAL FETCH ---
  useEffect(() => {
    setMounted(true);
    if (user) {
        setUserName(user.fullName || "");
        setUserEmail(user.primaryEmailAddress?.emailAddress || "");
    }

    async function loadMonkAndServices() {
      if (!monkId) return;
      try {
        setLoading(true);
        
        // A. Fetch Monk Details
        const mRes = await fetch(`/api/monks/${monkId}`);
        if (!mRes.ok) throw new Error("Monk not found");
        const mData = await mRes.json();
        setMonk(mData);

        // B. Fetch All Services & Filter for this Monk
        // Logic: Check if service.monkId matches OR if monk.services array contains service ID
        const sRes = await fetch('/api/services');
        const sData = await sRes.json();
        
        const filteredServices = sData.filter((s: any) => {
            // Check direct assignment
            if (s.monkId === monkId) return true;
            // Check if monk object has a list of service IDs (if your DB structure uses that)
            if (mData.services && Array.isArray(mData.services)) {
                return mData.services.some((id: any) => String(id) === String(s._id || s.id));
            }
            return false;
        });

        setAvailableServices(filteredServices);

      } catch (error) { 
          console.error(error); 
      } finally { 
          setLoading(false); 
      }
    }
    loadMonkAndServices();
  }, [monkId, user]);

  // --- 2. CALENDAR DATES ---
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

  // --- 3. DYNAMIC TIME SLOTS ---
  const currentDaySlots = useMemo(() => {
      if (selectedDateIndex === null) return [];
      
      const dateObj = calendarDates[selectedDateIndex].full;
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }); 
      
      // Default Schedule if none set
      const defaultSchedule = { start: "09:00", end: "19:00", active: true };
      
      // Find schedule for this day
      const dayConfig = monk?.schedule?.find(s => s.day === dayName) || (monk?.schedule ? null : defaultSchedule);

      if (!dayConfig || !dayConfig.active) return []; // Day off

      const slots: string[] = [];
      const [startH, startM] = dayConfig.start.split(':').map(Number);
      const [endH, endM] = dayConfig.end.split(':').map(Number);
      
      let current = new Date(dateObj);
      current.setHours(startH, startM, 0, 0);
      const end = new Date(dateObj);
      end.setHours(endH, endM, 0, 0);

      while (current < end) {
          slots.push(current.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' }));
          current.setMinutes(current.getMinutes() + 60); 
      }
      return slots;
  }, [selectedDateIndex, monk, calendarDates]);

  // --- 4. CHECK BOOKINGS ---
  useEffect(() => {
    async function fetchSlots() {
      if (selectedDateIndex === null || !monkId) return;
      
      const date = calendarDates[selectedDateIndex].full;
      const dateString = date.toISOString().split('T')[0];
      
      try {
        const res = await fetch(`/api/bookings?monkId=${monkId}&date=${dateString}`);
        if (res.ok) {
            const booked = await res.json();
            setTakenSlots(booked);
        } else {
            setTakenSlots([]);
        }
      } catch (e) { console.error(e) }
    }
    fetchSlots();
  }, [selectedDateIndex, monkId, calendarDates]);

  // --- 5. SUBMIT BOOKING ---
  const handleBooking = async () => {
    if (!isSignedIn) {
      alert(t({mn: "Та захиалга өгөхийн тулд нэвтрэх шаардлагатай.", en: "Please sign in to book a ritual."}));
      return;
    }
    if(!monkId || selectedDateIndex === null || !selectedTime || !selectedService) return;
    
    setIsSubmitting(true);
    const dateString = calendarDates[selectedDateIndex].full.toISOString().split('T')[0];

    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                monkId: monkId,
                serviceId: selectedService._id || selectedService.id,
                date: dateString,
                time: selectedTime,
                userName,
                userEmail,
                note: userNote
            })
        });

        if(res.ok) {
            setIsBooked(true);
        } else {
            alert(t({mn: "Захиалга амжилтгүй боллоо.", en: "Booking failed. Slot might be taken."}));
        }
    } catch (e) { console.error(e); }
    finally { setIsSubmitting(false); }
  };

  // --- RENDER ---
  if (!mounted) return null;
  const isNight = false;

  const theme = isNight ? {
      textColor: "text-indigo-50",
      borderColor: "border-indigo-800/50",
      altarBg: "bg-[#05050a]/80 backdrop-blur-2xl border-indigo-500/20",
      inputBg: "bg-indigo-950/30 border-indigo-500/30 text-indigo-100",
      glowColor: "rgba(99,102,241,0.15)",
      primaryBtn: "bg-indigo-600 text-white shadow-indigo-500/20",
      btnDefault: "bg-indigo-950/40 border-indigo-800 text-indigo-300",
      btnActive: "bg-indigo-500 border-indigo-400 text-white",
      serviceCard: "bg-indigo-900/20 border-indigo-500/30 hover:bg-indigo-900/40"
  } : {
      textColor: "text-[#451a03]",
      borderColor: "border-amber-200",
      altarBg: "bg-white/80 backdrop-blur-2xl border-amber-200",
      inputBg: "bg-white border-amber-200 text-amber-900",
      glowColor: "rgba(251,191,36,0.15)",
      primaryBtn: "bg-amber-600 text-white shadow-amber-900/20",
      btnDefault: "bg-white border-amber-100 text-stone-500 hover:border-amber-300 hover:text-amber-700",
      btnActive: "bg-amber-600 border-amber-600 text-white",
      serviceCard: "bg-white border-amber-200 hover:border-amber-400 hover:shadow-lg"
  };

  if (loading) return <div className={`h-screen w-full flex items-center justify-center ${isNight ? "bg-[#020205]" : "bg-[#FDFBF7]"}`}><Loader2 className="w-12 h-12 animate-spin text-amber-500" /></div>;
  if (!monk) return <div className="h-screen flex items-center justify-center">Monk not found</div>;

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${isNight ? "bg-[#020205]" : "bg-[#FDFBF7]"} font-ethereal overflow-x-hidden`} onMouseMove={(e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); }}>
      <OverlayNavbar />
      <style>{pageStyles}</style>
      
      {isNight ? <NightAtmosphere /> : <DayAtmosphere />}
      <motion.div className="fixed top-0 left-0 w-[800px] h-[800px] rounded-full pointer-events-none z-1 mix-blend-screen blur-[100px]" style={{ background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)`, x: torchX, y: torchY }} />

      <main className="relative z-10 container mx-auto px-4 lg:px-12 pt-28 pb-24 text-indigo-100">
        <Link href="/monks" className={`inline-flex items-center gap-3 mb-8 group transition-colors ${theme.textColor} opacity-60 hover:opacity-100`}>
            <div className={`p-2 rounded-full border ${theme.borderColor} group-hover:-translate-x-1 transition-transform`}><ArrowLeft size={14} /></div>
            <span className="uppercase tracking-widest text-[10px] font-black">{t({mn: "Буцах", en: "Return"})}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* --- LEFT: MONK INFO --- */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8"> 
             <LivingPortal 
                image={monk.image} 
                name={monk.name[language]} 
                title={monk.title[language]}
                isNight={isNight} 
             />
             <div className={`p-6 md:p-8 rounded-3xl border backdrop-blur-md ${theme.altarBg} ${theme.textColor}`}>
                <h3 className="font-celestial text-lg mb-4 opacity-80">{t({mn: "Намтар", en: "Biography"})}</h3>
                <p className="text-sm md:text-base leading-relaxed opacity-80">{monk.bio[language]}</p>
             </div>
          </div>

          {/* --- RIGHT: BOOKING FLOW --- */}
          <div className="lg:col-span-7">
            <div className={`relative rounded-[3rem] border p-1 transition-all duration-1000 ${theme.altarBg}`}>
                <div className="p-6 md:p-12 space-y-8 min-h-[600px] flex flex-col">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-6 border-b border-current border-opacity-10">
                         <div className="flex items-center gap-3">
                             {isNight ? <Moon className="text-indigo-400" /> : <Sun className="text-amber-500" />}
                             <span className={`font-celestial text-xl ${theme.textColor}`}>{t({mn: "Захиалга", en: "Booking"})}</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs font-bold opacity-50">
                             <Sparkles size={14} />
                             {/* Progress Step Logic */}
                             <span>
                                {isBooked ? "Complete" 
                                : selectedTime ? "Step 4/4" 
                                : selectedDateIndex !== null ? "Step 3/4" 
                                : selectedService ? "Step 2/4" 
                                : "Step 1/4"}
                             </span>
                         </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {isBooked ? (
                            /* SUCCESS STATE */
                            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center flex-1">
                                <CheckCircle2 size={64} className={`${isNight ? "text-cyan-400" : "text-amber-600"} mb-6`} />
                                <h3 className={`text-3xl font-celestial mb-4 ${theme.textColor}`}>{t({mn: "Амжилттай", en: "Fate Sealed"})}</h3>
                                <p className={`mb-8 opacity-60 max-w-xs mx-auto ${theme.textColor}`}>{t({mn: "Таны цаг амжилттай баталгаажлаа.", en: "Your ritual has been scheduled."})}</p>
                                <Link href="/services" className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest ${theme.btnActive}`}>{t({mn: "Буцах", en: "Return Home"})}</Link>
                            </motion.div>
                        ) : (
                            /* FORM STEPS */
                            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                                
                                {/* 1. SERVICE SELECTION */}
                                <div className="space-y-4">
                                    <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 opacity-70 ${theme.textColor}`}>
                                        <Scroll size={14} /> I. {t({mn: "Зан үйл сонгох", en: "Select Ritual"})}
                                    </h4>
                                    
                                    {availableServices.length === 0 ? (
                                        <p className="opacity-50 text-sm">No services found for this monk.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-3">
                                            {availableServices.map((s) => (
                                                <button 
                                                    key={s._id}
                                                    onClick={() => { setSelectedService(s); setSelectedDateIndex(null); setSelectedTime(null); }}
                                                    className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${selectedService?._id === s._id ? theme.btnActive : theme.serviceCard}`}
                                                >
                                                    <div>
                                                        <span className="font-serif font-bold text-lg block">{s.name[language] || s.title[language]}</span>
                                                        <span className="text-xs opacity-70">{s.duration}</span>
                                                    </div>
                                                    <span className="font-celestial font-bold">{Number(s.price).toLocaleString()}₮</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 2. DATE SELECTION */}
                                <AnimatePresence>
                                    {selectedService && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 overflow-hidden">
                                            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 opacity-70 ${theme.textColor}`}>
                                                <Calendar size={14} /> II. {t({mn: "Өдөр Сонгох", en: "Select Day"})}
                                            </h4>
                                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x -mx-4 px-4 md:mx-0 md:px-0">
                                                {calendarDates.map((d, i) => (
                                                    <button 
                                                        key={i} 
                                                        onClick={() => { setSelectedDateIndex(i); setSelectedTime(null); }} 
                                                        className={`shrink-0 w-20 h-24 rounded-2xl border transition-all flex flex-col items-center justify-center snap-center ${selectedDateIndex === i ? theme.btnActive : theme.btnDefault}`}
                                                    >
                                                        <span className="text-[10px] font-black uppercase mb-1">{d.weekday}</span>
                                                        <span className="text-2xl font-serif font-bold">{d.day}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* 3. TIME SELECTION */}
                                <AnimatePresence>
                                    {selectedDateIndex !== null && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 overflow-hidden">
                                            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 opacity-70 ${theme.textColor}`}>
                                                <Clock size={14} /> III. {t({mn: "Цаг Сонгох", en: "Select Hour"})}
                                            </h4>
                                            {currentDaySlots.length > 0 ? (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                                    {currentDaySlots.map((time, idx) => {
                                                        const isTaken = takenSlots.includes(time);
                                                        const isBlocked = monk?.blockedSlots?.some(b => 
                                                            b.date === calendarDates[selectedDateIndex].full.toISOString().split('T')[0] && 
                                                            b.time === time
                                                        );
                                                        const isDisabled = isTaken || isBlocked;
                                                        
                                                        return (
                                                            <motion.button 
                                                                key={time}
                                                                initial={{ opacity: 0, y: 10 }} 
                                                                animate={{ opacity: 1, y: 0 }} 
                                                                transition={{ delay: idx * 0.05 }}
                                                                disabled={isDisabled} 
                                                                onClick={() => setSelectedTime(time)} 
                                                                className={`relative py-3 rounded-xl text-sm font-bold border transition-all flex flex-col items-center justify-center overflow-hidden ${
                                                                    selectedTime === time 
                                                                        ? theme.btnActive 
                                                                        : isDisabled 
                                                                            ? "opacity-40 cursor-not-allowed bg-stone-100 border-stone-200 grayscale scale-95" 
                                                                            : theme.btnDefault
                                                                }`}
                                                            >
                                                                <span className={isDisabled ? "line-through opacity-50" : ""}>{time}</span>
                                                                {isTaken && (
                                                                    <span className="text-[8px] absolute bottom-1 font-black uppercase tracking-tighter text-stone-400">
                                                                        {t({mn: "Дүүрсэн", en: "Taken"})}
                                                                    </span>
                                                                )}
                                                                {isBlocked && !isTaken && (
                                                                    <span className="text-[8px] absolute bottom-1 font-black uppercase tracking-tighter text-red-300/70">
                                                                        {t({mn: "Завгүй", en: "Busy"})}
                                                                    </span>
                                                                )}
                                                            </motion.button>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 opacity-50 border-2 border-dashed border-stone-200 rounded-xl">
                                                    <p className="text-sm font-bold">{t({mn: "Энэ өдөр боломжгүй", en: "Monk is unavailable on this day"})}</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* 4. USER DETAILS */}
                                <AnimatePresence>
                                    {selectedTime && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-6 border-t border-current border-opacity-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${theme.textColor}`}>Name</label>
                                                    <input value={userName} onChange={e => setUserName(e.target.value)} className={`w-full p-4 rounded-xl border outline-none font-serif transition-all focus:ring-2 focus:ring-opacity-50 ${theme.inputBg}`} placeholder="Your Name" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${theme.textColor}`}>Email</label>
                                                    <input value={userEmail} onChange={e => setUserEmail(e.target.value)} className={`w-full p-4 rounded-xl border outline-none font-serif transition-all focus:ring-2 focus:ring-opacity-50 ${theme.inputBg}`} placeholder="contact@email.com" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${theme.textColor}`}>Intention / Note</label>
                                                <textarea value={userNote} onChange={e => setUserNote(e.target.value)} className={`w-full p-4 rounded-xl border outline-none font-serif h-24 resize-none transition-all focus:ring-2 focus:ring-opacity-50 ${theme.inputBg}`} placeholder={t({mn: "Тусгай хүсэлт...", en: "Special requests..."})} />
                                            </div>
                                            {isSignedIn ? (
                                                <button onClick={handleBooking} disabled={!userName || !userEmail || isSubmitting} className={`w-full py-5 rounded-2xl font-celestial font-bold text-sm uppercase tracking-widest transition-all overflow-hidden relative group disabled:opacity-50 disabled:cursor-not-allowed ${theme.primaryBtn}`}>
                                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <>{t({mn: "Баталгаажуулах", en: "Seal Fate"})} <CreditCard size={16} /></>}
                                                    </span>
                                                </button>
                                            ) : (
                                                <Link href="/sign-in" className="block w-full">
                                                    <button className={`w-full py-5 rounded-2xl font-celestial font-bold text-sm uppercase tracking-widest transition-all overflow-hidden relative group bg-amber-600 text-white shadow-amber-900/20`}>
                                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                                            {t({mn: "Нэвтэрч захиалга өгөх", en: "Sign In to Book"})} <Sparkles size={16} />
                                                        </span>
                                                    </button>
                                                </Link>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}