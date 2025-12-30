"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Calendar, Clock, CheckCircle2, Loader2,
  Sun, Orbit, Star, Users, Sparkles
} from "lucide-react";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs"; 
import OverlayNavbar from "../../components/Navbar";
import GoldenNirvanaFooter from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import { Service, Monk } from "@/database/types"; 

// --- ALTAR FRAME (Unchanged) ---
const AltarFrame = ({ color }: { color: string }) => (
  <div className="absolute inset-0 pointer-events-none z-30">
    <svg className="w-full h-full" viewBox="0 0 500 800" fill="none" preserveAspectRatio="none">
      <defs>
        <filter id="zodiac-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <motion.path
        initial={{ pathLength: 0, strokeDashoffset: 0 }}
        animate={{ pathLength: 1, strokeDashoffset: [0, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        d="M60 100 L60 60 L100 60 M400 60 L440 60 L440 100 M440 700 L440 740 L400 740 M100 740 L60 740 L60 700"
        stroke={color} strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="5 5"
      />
      <g fill={color} className="opacity-20" style={{ fontSize: '14px' }} filter="url(#zodiac-glow)">
        <motion.text
          x="25" y="300" className="[writing-mode:vertical-rl] font-serif tracking-[1em]"
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.6, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >♈ ♉ ♊ ♋ ♌ ♍</motion.text>
        <motion.text
          x="475" y="300" className="[writing-mode:vertical-rl] font-serif tracking-[1em]"
          animate={{ y: [0, 15, 0], opacity: [0.2, 0.6, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >♎ ♏ ♐ ♑ ♒ ♓</motion.text>
      </g>
      <motion.circle
        cx="250" cy="60" r="30"
        stroke={color} strokeWidth="0.5" strokeOpacity="0.2"
        animate={{ rotate: 360, scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle
        cx="250" cy="740" r="40"
        stroke={color} strokeWidth="0.5" strokeOpacity="0.2"
        animate={{ rotate: -360, scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  </div>
);

export default function RitualBookingPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { user } = useUser(); 

  const [mounted, setMounted] = useState(false);
  const [service, setService] = useState<any | null>(null); 
  const [monks, setMonks] = useState<Monk[]>([]);
  const [selectedMonk, setSelectedMonk] = useState<Monk | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userName, setUserName] = useState(user?.fullName || ""); 
  const [userEmail, setUserEmail] = useState(user?.primaryEmailAddress?.emailAddress || ""); 
  const [userNote, setUserNote] = useState("");
  const [showMonkSelector, setShowMonkSelector] = useState(false);
  const [takenSlots, setTakenSlots] = useState<string[]>([]); 

  // --- MOVED 'dates' HERE (Before useEffect) ---
  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push({
        day: d.getDate(),
        week: d.toLocaleDateString(language === 'mn' ? 'mn' : 'en', { weekday: 'short' }),
        fullDate: d
      });
    }
    return arr;
  }, [language]);
  // -------------------------------------------

  useEffect(() => {
    if (user && user.fullName) setUserName(user.fullName);
    if (user && user.primaryEmailAddress?.emailAddress) setUserEmail(user.primaryEmailAddress.emailAddress);
  }, [user]);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // 1. Fetch Service
        let fetchedService = null; // Store locally to use immediately
        
        const serviceRes = await fetch(`/api/services/${id}`);
        if (serviceRes.ok) {
          fetchedService = await serviceRes.json();
          setService(fetchedService);
        } else {
            // Fallback: Fetch all
            const allRes = await fetch('/api/services');
            const allData = await allRes.json();
            const found = allData.find((s: any) => String(s._id) === id || String(s.id) === id);
            if (found) {
                fetchedService = found;
                setService(found);
            }
        }

        // 2. Fetch Monks
        const monksRes = await fetch('/api/monks');
        if (monksRes.ok) {
          const allMonks: Monk[] = await monksRes.json();
          setMonks(allMonks);

          // 3. Set Default Monk (Using the LOCAL variable 'fetchedService', not the state)
          if (fetchedService && fetchedService.monkId) {
             const preSelected = allMonks.find(m => String(m._id) === fetchedService.monkId);
             if (preSelected) setSelectedMonk(preSelected);
          } else if (allMonks.length > 0) {
             // Only default to first monk if no specific monk was required
             setSelectedMonk(allMonks[0]);
          }
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    loadData();
    
    // REMOVED 'service' from dependencies to stop the loop
  }, [id]);
  // --- FETCH TAKEN SLOTS (Now 'dates' is defined above) ---
  useEffect(() => {
    async function fetchTakenSlots() {
      if (selectedMonk && selectedDateIndex !== null) {
        const selectedDate = dates[selectedDateIndex].fullDate.toISOString().split('T')[0]; // YYYY-MM-DD
        try {
          const res = await fetch(`/api/bookings?monkId=${selectedMonk._id?.toString()}&date=${selectedDate}`);
          if (res.ok) {
            const data = await res.json();
            setTakenSlots(data);
          } else {
            setTakenSlots([]);
          }
        } catch (error) {
          console.error("Failed to fetch taken slots:", error);
          setTakenSlots([]);
        }
      } else {
        setTakenSlots([]); 
      }
    }
    fetchTakenSlots();
  }, [selectedMonk, selectedDateIndex, dates]);


  const isDark = resolvedTheme === "dark";

  // --- SAFE DATA ACCESS HELPER ---
  const displayTitle = service 
    ? (service.title?.[language] || service.name?.[language] || (language === 'mn' ? "Нэргүй" : "Untitled")) 
    : "";

  const displayDesc = service 
    ? (service.desc?.[language] || service.description || "") 
    : "";

  const theme = isDark ? {
    accent: "#50F2CE", 
    secondary: "#C72075", 
    bg: "bg-[#05051a]",
    card: "bg-[#0C164F]/80 border-cyan-400/10 backdrop-blur-3xl",
    text: "text-white",
    subText: "text-[#C72075]",
    input: "bg-[#05051a]/60 border-cyan-400/20 text-white placeholder-cyan-400/20",
    button: "bg-gradient-to-r from-[#C72075] to-[#7B337D] text-white",
    glow: "shadow-[0_0_80px_-20px_rgba(199,32,117,0.3)]",
    icon: <Orbit className="text-cyan-400 animate-pulse" size={32} />,
    particle: "bg-cyan-400/20",
    selectorBg: "bg-cyan-950/50"
  } : {
    accent: "#d97706",
    secondary: "#f59e0b",
    bg: "bg-[#FDFBF7]",
    card: "bg-white border-stone-200",
    text: "text-stone-900",
    subText: "text-amber-700",
    input: "bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400",
    button: "bg-stone-900 text-white hover:bg-amber-700",
    glow: "shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)]",
    icon: <Sun className="text-amber-600 animate-spin-slow" size={32} />,
    particle: "bg-amber-500/20",
    selectorBg: "bg-stone-100"
  };

  const times = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

  const handleBooking = async () => {
    if (!userName || !userEmail || !selectedTime || !selectedMonk || selectedDateIndex === null || !service) {
      alert("Please fill all required fields and select a monk and time.");
      return;
    }

    setIsSubmitting(true);
    const selectedDate = dates[selectedDateIndex].fullDate.toISOString().split('T')[0]; 

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monkId: selectedMonk._id?.toString(),
          date: selectedDate,
          time: selectedTime,
          userName: userName,
          userEmail: userEmail,
          note: userNote,
          serviceId: service._id || service.id, 
        }),
      });

      if (response.ok) {
        setIsBooked(true);
        if (selectedMonk && selectedDateIndex !== null) {
            const res = await fetch(`/api/bookings?monkId=${selectedMonk._id?.toString()}&date=${selectedDate}`);
            if (res.ok) setTakenSlots(await res.json());
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to book session. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;
  if (loading) { 
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
        <Loader2 className="animate-spin text-amber-600" size={48} />
      </div>
    );
  }
  if (!service) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${theme.bg} ${theme.text}`}>
        <h1 className="text-4xl font-serif mb-4">{t({mn: "Үйлчилгээ олдсонгүй", en: "Service Not Found"})}</h1>
        <p className="mb-8 opacity-70">{t({mn: "Уучлаарай, таны хайсан үйлчилгээ олдсонгүй эсвэл устагдсан байна.", en: "Sorry, the ritual you are looking for could not be found."})}</p>
        <Link href="/services" className={`px-8 py-3 rounded-full font-bold ${theme.button}`}>
          <ArrowLeft size={16} className="inline-block mr-2" /> {t({mn: "Буцах", en: "Return to Services"})}
        </Link>
      </div>
    );
  }

  return (
    <>
      <OverlayNavbar />
      <div className={`min-h-screen transition-colors duration-1000 pt-32 pb-20 px-6 overflow-hidden ${theme.bg}`}>
        
        {/* --- BACKGROUND (Unchanged) --- */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {isDark && (
            <>
              <motion.div
                className="absolute top-1/2 left-1/4 w-[60%] h-[60%] rounded-full bg-[#C72075]/10 blur-[150px]"
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4], rotate: [0, 180, 360] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#2E1B49]/30 blur-[130px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.9, 0.2], rotate: [0, -180, -360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              />
            </>
          )}
          <div className={`absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] ${isDark ? 'invert' : ''}`} />
        </div>

        <main className="container mx-auto max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <Link href="/services" className={`inline-flex items-center gap-2 mb-12 text-[10px] font-black uppercase tracking-[0.4em] transition-opacity hover:opacity-100 ${theme.text} opacity-50`}>
              <ArrowLeft size={14} /> {t({ mn: "Буцах", en: "Return to Path" })}
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* LEFT: INFO */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
            >
              <motion.div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 mb-8 ${isDark ? "border-cyan-400/30 bg-[#0C164F]" : "border-amber-200 bg-white shadow-xl"}`}
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                {theme.icon}
              </motion.div>
              
              <motion.h1
                className={`text-6xl md:text-8xl font-serif font-black leading-[0.9] mb-8 tracking-tighter ${theme.text}`}
                animate={{ scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {displayTitle}
              </motion.h1>

              <motion.p
                className={`text-lg leading-relaxed mb-10 opacity-70 ${isDark ? 'text-cyan-50' : theme.text} max-w-md`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                {displayDesc}
              </motion.p>

              <div className="flex gap-10">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.subText}`}>Cycle</p>
                  <p className={`text-3xl font-serif ${theme.text}`}>{service?.duration}</p>
                </motion.div>
                <div className="w-px h-12 bg-current opacity-10" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.subText}`}>Offering</p>
                  <p className={`text-3xl font-serif ${theme.text}`}>{Number(service?.price || 0).toLocaleString()}₮</p>
                </motion.div>
              </div>
              
              {/* MONK SELECTOR */}
              <motion.button
                onClick={() => setShowMonkSelector(!showMonkSelector)}
                className={`mt-12 flex items-center gap-3 px-6 py-3 rounded-xl border transition-all ${isDark ? 'border-cyan-400/30 hover:bg-cyan-950/30' : 'border-amber-200 hover:bg-amber-50'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users size={18} className={theme.subText} />
                <span className={`text-xs font-black uppercase tracking-widest ${theme.text}`}>
                  {showMonkSelector ? t({mn: "Хаах", en: "Close Selection"}) : t({mn: "Лам сонгох", en: "Select Monk"})}
                </span>
              </motion.button>

              <AnimatePresence>
                {showMonkSelector && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 space-y-3 overflow-hidden"
                  >
                    {monks.map((monk: Monk) => (
                      <motion.div
                        key={monk._id?.toString()}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedMonk?._id === monk._id 
                            ? isDark ? 'bg-cyan-950/60 border-cyan-400/50' : 'bg-amber-100 border-amber-300'
                            : isDark ? 'bg-[#0C164F]/50 border-cyan-400/10 hover:border-cyan-400/30' : 'bg-white border-stone-100 hover:border-stone-300'
                        }`}
                        onClick={() => setSelectedMonk(monk)}
                        whileHover={{ x: 5 }}
                      >
                        <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${isDark ? 'border-cyan-400/30' : 'border-amber-200'}`}>
                          <img src={monk.image} alt={monk.name[language]} className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <h4 className={`font-serif text-lg ${theme.text}`}>{monk.name[language]}</h4>
                           <p className={`text-[10px] uppercase tracking-wider opacity-60 ${theme.text}`}>{monk.title?.[language] || "Monk"}</p>
                        </div>
                        {selectedMonk?._id === monk._id && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                            <CheckCircle2 size={20} className={isDark ? "text-cyan-400" : "text-amber-600"} />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {!showMonkSelector && selectedMonk && (
                 <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`mt-8 flex items-center gap-4 p-4 rounded-xl border ${isDark ? 'border-cyan-400/10 bg-cyan-950/20' : 'border-stone-200 bg-white/50'}`}
                 >
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                       <img src={selectedMonk.image} alt="selected" className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <p className={`text-[10px] uppercase opacity-50 ${theme.text}`}>Conducted by</p>
                       <p className={`font-serif ${theme.text}`}>{selectedMonk.name[language]}</p>
                    </div>
                 </motion.div>
              )}
            </motion.div>

            {/* RIGHT: BOOKING FORM */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className={`relative rounded-[3rem] p-8 md:p-12 overflow-hidden border transition-all duration-1000 ${theme.card} ${theme.glow}`}
            >
              <AltarFrame color={theme.accent} />
              
              <AnimatePresence mode="wait">
                {isBooked ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-20 text-center relative z-40"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle2 size={64} className={`${isDark ? "text-cyan-400" : "text-amber-600"} mx-auto mb-6`} />
                    </motion.div>
                    <h3 className={`text-3xl font-serif font-black mb-4 ${theme.text}`}>{t({mn: "Захиалга Баталгаажлаа", en: "Fate Aligned"})}</h3>
                    <p className={`opacity-60 mb-10 ${theme.text}`}>{t({mn: "Таны захиалгыг хүлээн авлаа.", en: "The Celestial Guard has received your signal."})}</p>
                    <Link href="/services" className={`px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest ${theme.button}`}>
                      {t({mn: "Буцах", en: "Return"})}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div key="form" className="relative z-40 space-y-10">
                    {/* STEP 1: DATE */}
                    <div className="space-y-6">
                      <h2 className={`text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2 ${theme.subText}`}>
                        <Calendar size={14} /> I. {t({mn: "Өдөр Сонгох", en: "Choose Date"})}
                      </h2>
                      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {dates.map((d, i) => (
                          <motion.button
                            key={i}
                            onClick={() => setSelectedDateIndex(i)}
                            className={`shrink-0 w-20 h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300
                              ${selectedDateIndex === i
                                ? `scale-105 ${isDark ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_#50F2CE60]' : 'bg-stone-900 text-white border-stone-900 shadow-xl'}`
                                : `border-transparent ${isDark ? 'bg-cyan-950/40 text-cyan-200/40 hover:bg-cyan-950/60' : 'bg-stone-100 text-stone-400 hover:bg-stone-200'}`
                              }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="text-[10px] uppercase font-black mb-1">{d.week}</span>
                            <span className="text-2xl font-serif font-bold">{d.day}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* STEP 2: TIME */}
                    <AnimatePresence>
                      {selectedDateIndex !== null && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-6"
                        >
                          <h2 className={`text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2 ${theme.subText}`}>
                            <Clock size={14} /> II. {t({mn: "Цаг Сонгох", en: "Choose Time"})}
                          </h2>
                          <div className="grid grid-cols-3 gap-3">
                            {times.map((time, idx) => {
                                const isTaken = takenSlots.includes(time);
                                return (
                                <motion.button
                                    key={time}
                                    onClick={() => !isTaken && setSelectedTime(time)} // Only select if not taken
                                    disabled={isTaken} // Disable if taken
                                    className={`py-3 rounded-xl font-black text-[10px] transition-all border-2
                                    ${selectedTime === time
                                        ? `${isDark ? 'bg-cyan-400 text-[#05051a] border-cyan-400' : 'bg-amber-700 text-white border-amber-700'}`
                                        : isTaken // Style for taken slots
                                            ? `bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed`
                                            : `border-transparent ${isDark ? 'bg-cyan-950/40 text-cyan-200/40 hover:bg-cyan-950/60' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`
                                    }`}
                                    whileHover={!isTaken ? { scale: 1.05 } : {}}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    {time} {isTaken && (language === 'mn' ? "(Завгүй)" : "(Taken)")}
                                </motion.button>
                                );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* STEP 3: DETAILS */}
                    <AnimatePresence>
                      {selectedTime && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <h2 className={`text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2 ${theme.subText}`}>
                            <Star size={14} /> III. {t({mn: "Мэдээлэл", en: "Your Details"})}
                          </h2>
                          <motion.input
                            className={`w-full p-4 rounded-2xl border-2 outline-none transition-all font-serif text-lg ${theme.input} focus:border-opacity-100`}
                            placeholder={t({mn: "Таны нэр", en: "Your Name"})}
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            whileFocus={{ scale: 1.01 }}
                          />
                          <motion.input
                            type="email"
                            className={`w-full p-4 rounded-2xl border-2 outline-none transition-all font-serif text-lg ${theme.input} focus:border-opacity-100`}
                            placeholder={t({mn: "Таны И-мэйл", en: "Your Email"})}
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            whileFocus={{ scale: 1.01 }}
                          />
                          <motion.textarea
                            className={`w-full p-4 rounded-2xl border-2 outline-none h-24 resize-none transition-all font-serif text-lg ${theme.input} focus:border-opacity-100`}
                            placeholder={t({mn: "Тэмдэглэл (заавал биш)", en: "Notes (Optional)"})}
                            value={userNote}
                            onChange={(e) => setUserNote(e.target.value)}
                            whileFocus={{ scale: 1.01 }}
                          />
                          <motion.button
                            disabled={!userName || !userEmail || !selectedMonk || selectedDateIndex === null || !selectedTime || isSubmitting}
                            onClick={handleBooking}
                            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 disabled:opacity-30 shadow-xl ${theme.button}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <>
                              {t({mn: "Захиалах", en: "Book Ritual"})} <Sparkles size={16} />
                            </>}
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}