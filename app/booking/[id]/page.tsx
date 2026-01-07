"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Calendar, Clock, CheckCircle2, Loader2,
  Sparkles, Star, User, ArrowRight, Hourglass, Shield, Info, ChevronDown
} from "lucide-react";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs"; 
import OverlayNavbar from "../../components/Navbar";
import { useLanguage } from "../../contexts/LanguageContext";
import { Monk } from "@/database/types"; 

// ... (CosmicBackground remains the same) ...
const CosmicBackground = ({ isNight }: { isNight: boolean }) => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className={`absolute inset-0 transition-colors duration-1000 ${
      isNight 
        ? "bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#020617_100%)]" 
        : "bg-[radial-gradient(ellipse_at_top,_#fffbeb_0%,_#fff7ed_100%)]"
    }`} />
    
    <motion.div 
      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      className={`absolute top-[-30%] left-[-20%] w-[80vw] h-[80vw] rounded-full blur-[120px] opacity-20 ${isNight ? "bg-cyan-900" : "bg-amber-200"}`}
    />
    <motion.div 
      animate={{ rotate: -360, scale: [1, 1.3, 1] }}
      transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      className={`absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-20 ${isNight ? "bg-fuchsia-900" : "bg-orange-100"}`}
    />

    <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
  </div>
);

// --- COMPONENT: THE HOLOGRAPHIC TICKET (Updated Monk Name Highlight) ---
const ServiceTicket = ({ service, monkName, theme, lang }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className={`relative w-full p-6 md:p-8 rounded-[2rem] overflow-hidden border backdrop-blur-md mb-8 ${theme.glassPanel}`}
  >
    <div className={`absolute top-0 left-0 w-1 h-full ${theme.accentBg}`} />
    
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
            {/* Top Badges */}
            <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${theme.badgeBorder} ${theme.badgeText}`}>
                    {service.type === 'divination' ? (lang === 'mn' ? "Мэргэ" : "Divination") : (lang === 'mn' ? "Зан үйл" : "Ritual")}
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-bold opacity-60 ${theme.text}`}>
                    <Hourglass size={12} /> {service.duration}
                </span>
            </div>

            {/* Service Name */}
            <h1 className={`text-3xl md:text-4xl font-serif font-black tracking-tight mb-2 ${theme.text}`}>
                {service.name?.[lang]}
            </h1>

            {/* Monk Attribution (Highlighted) */}
            <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs opacity-60 ${theme.text}`}>{lang === 'mn' ? 'Багш:' : 'Guide:'}</span>
                <div className="relative group">
                    {/* The Highlighted Name */}
                    <span className={`text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme.monkGradient} drop-shadow-sm`}>
                        {monkName}
                    </span>
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-current to-transparent opacity-50" />
                </div>
                <div className={`p-1 rounded-full bg-yellow-500/10 text-yellow-600`}>
                    <Star size={12} fill="currentColor" />
                </div>
            </div>

            {/* Description */}
            <p className={`mt-4 text-sm max-w-lg leading-relaxed opacity-70 ${theme.text}`}>
                {service.description?.[lang] || (lang==='mn' ? "Таны хувь заяаны зам мөрийг тольдох ариун үйл." : "A sacred session to align your destiny path.")}
            </p>
        </div>

        <div className="text-right">
            <span className={`text-[10px] uppercase tracking-widest opacity-50 block mb-1 ${theme.text}`}>
                {lang === 'mn' ? "Өргөл" : "Offering"}
            </span>
            <div className={`text-4xl font-serif font-medium ${theme.accentText}`}>
                {Number(service.price).toLocaleString()}₮
            </div>
        </div>
    </div>
  </motion.div>
);

// --- COMPONENT: INFO ACCORDION ---
const InfoItem = ({ icon, title, text, theme }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`border-b ${theme.borderColor} last:border-0`}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex items-center justify-between py-4 text-left group"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-current/5 ${theme.accentText}`}>{icon}</div>
                    <span className={`text-xs font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100 ${theme.text}`}>{title}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${theme.text}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className={`pb-4 pl-12 text-sm leading-relaxed opacity-60 ${theme.text}`}>{text}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function RitualBookingPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { t, language: lang } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { user, isSignedIn } = useUser(); 

  const [mounted, setMounted] = useState(false);
  const [service, setService] = useState<any | null>(null); 
  const [monks, setMonks] = useState<Monk[]>([]);
  const [selectedMonk, setSelectedMonk] = useState<Monk | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  
  const [userName, setUserName] = useState(""); 
  const [userEmail, setUserEmail] = useState(""); 
  const [userNote, setUserNote] = useState("");

  const isNight = resolvedTheme === "dark";

  // --- THEME CONFIG (Updated with Monk Gradient) ---
  const theme = isNight ? {
    bg: "bg-[#020617]",
    text: "text-indigo-50",
    accentText: "text-cyan-400",
    accentBg: "bg-cyan-500",
    glassPanel: "bg-[#0f172a]/60 border-indigo-500/20",
    badgeBorder: "border-cyan-500/30",
    badgeText: "text-cyan-300",
    borderColor: "border-white/10",
    monkGradient: "from-cyan-400 to-blue-500", // Bright Cyan-Blue for Night
    slotActive: "bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]",
    slotDisabled: "opacity-30 bg-white/5 cursor-not-allowed",
    slotDefault: "border-white/10 hover:bg-white/10 text-indigo-200",
    input: "bg-black/20 border-white/10 focus:border-cyan-500/50 text-white placeholder-white/20",
    btnGradient: "from-cyan-600 to-blue-600"
  } : {
    bg: "bg-[#FDFBF7]",
    text: "text-amber-950",
    accentText: "text-amber-600",
    accentBg: "bg-amber-500",
    glassPanel: "bg-white/60 border-amber-900/10 shadow-xl",
    badgeBorder: "border-amber-600/20",
    badgeText: "text-amber-700",
    borderColor: "border-amber-900/10",
    monkGradient: "from-amber-600 to-orange-700", // Deep Amber-Orange for Day
    slotActive: "bg-amber-500 border-amber-500 text-white shadow-[0_5px_15px_rgba(245,158,11,0.3)] scale-105",
    slotDisabled: "opacity-30 bg-black/5 cursor-not-allowed",
    slotDefault: "border-amber-900/10 hover:bg-amber-50 text-amber-900",
    input: "bg-white border-amber-900/10 focus:border-amber-500/50 text-amber-900 placeholder-amber-900/30",
    btnGradient: "from-amber-500 to-orange-600"
  };

  useEffect(() => {
    setMounted(true);
    if(user) { setUserName(user.fullName || ""); setUserEmail(user.primaryEmailAddress?.emailAddress || ""); }

    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        let fetchedService = null;
        const sRes = await fetch(`/api/services/${id}`);
        if(sRes.ok) fetchedService = await sRes.json();
        else {
            const all = await (await fetch('/api/services')).json();
            fetchedService = all.find((s:any) => s._id === id || s.id === id);
        }
        setService(fetchedService);

        const mRes = await fetch('/api/monks');
        const allMonks = await mRes.json();
        setMonks(allMonks);

        if(fetchedService?.monkId) {
            const assigned = allMonks.find((m: Monk) => m._id === fetchedService.monkId);
            if(assigned) setSelectedMonk(assigned);
        } else if (allMonks.length > 0) {
            setSelectedMonk(allMonks[0]); 
        }

      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    loadData();
  }, [id, user]);

  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push({
        day: d.getDate(),
        week: d.toLocaleDateString(lang === 'mn' ? 'mn' : 'en', { weekday: 'short' }),
        fullDate: d
      });
    }
    return arr;
  }, [lang]);

  const times = useMemo(() => ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"], []);

  useEffect(() => {
    async function checkSlots() {
        if(selectedMonk && selectedDateIndex !== null) {
            const d = dates[selectedDateIndex].fullDate.toISOString().split('T')[0];
            try {
                const res = await fetch(`/api/bookings?monkId=${selectedMonk._id}&date=${d}`);
                if(res.ok) setTakenSlots(await res.json());
            } catch(e) {}
        }
    }
    checkSlots();
  }, [selectedMonk, selectedDateIndex, dates]);

  const handleBooking = async () => {
    if (!isSignedIn) { alert("Please sign in."); return; }
    setIsSubmitting(true);
    try {
        const d = dates[selectedDateIndex!].fullDate.toISOString().split('T')[0];
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                monkId: selectedMonk?._id, serviceId: service._id,
                date: d, time: selectedTime,
                userName, userEmail, note: userNote
            })
        });
        if(res.ok) setIsBooked(true);
        else alert("Booking Failed");
    } catch(e) { console.error(e); }
    finally { setIsSubmitting(false); }
  };

  if (!mounted) return null;
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]"><Loader2 className="animate-spin text-amber-600" /></div>;
  if (!service) return <div>Not Found</div>;

  return (
    <div className={`min-h-screen font-ethereal relative overflow-x-hidden ${theme.bg}`}>
      <OverlayNavbar />
      <CosmicBackground isNight={isNight} />

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-24">
        
        <Link href="/services" className={`inline-flex items-center gap-2 mb-8 opacity-60 hover:opacity-100 transition-opacity ${theme.text}`}>
            <div className={`p-2 rounded-full border ${theme.borderColor}`}><ArrowLeft size={16} /></div>
            <span className="text-[10px] uppercase tracking-widest font-bold">{t({mn: "Буцах", en: "Return"})}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* --- LEFT: MONK PROFILE (STICKY) --- */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
             <div className="group relative aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl">
                <div className={`absolute inset-0 bg-gradient-to-t ${isNight ? "from-[#020617]" : "from-[#451a03]"} via-transparent to-transparent opacity-80 z-10`} />
                <img src={selectedMonk?.image || "/default-monk.jpg"} alt="Monk" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 z-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70 mb-2">{selectedMonk?.title?.[lang]}</p>
                    <h2 className="text-3xl font-serif text-white">{selectedMonk?.name?.[lang]}</h2>
                </div>
             </div>

             <div className={`p-6 rounded-3xl border backdrop-blur-md ${theme.glassPanel}`}>
                <h3 className={`font-celestial text-sm opacity-80 mb-4 pb-2 border-b ${theme.borderColor} ${theme.text}`}>
                    {t({mn: "Багшийн тухай", en: "About the Guide"})}
                </h3>
                <p className={`text-sm leading-relaxed opacity-70 mb-6 ${theme.text}`}>
                    {selectedMonk?.bio?.[lang]}
                </p>
                
                <div className="flex gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-current/5 ${theme.accentText}`}>
                        <Star size={12} fill="currentColor" /> <span className="text-[10px] font-bold uppercase tracking-wider">Master</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-current/5 ${theme.accentText}`}>
                        <User size={12} /> <span className="text-[10px] font-bold uppercase tracking-wider">Certified</span>
                    </div>
                </div>
             </div>
          </div>

          {/* --- RIGHT: BOOKING ENGINE (SCROLLABLE) --- */}
          <div className="lg:col-span-8">
            
            {/* 1. Service Ticket (Hero) with Monk Name Passed Down */}
            <ServiceTicket service={service} monkName={selectedMonk?.name?.[lang]} theme={theme} lang={lang} />

            <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className={`relative rounded-[40px] border backdrop-blur-3xl overflow-hidden shadow-2xl ${theme.glassPanel}`}
            >
               <div className="p-8 md:p-12 space-y-12">
                  <AnimatePresence mode="wait">
                    {isBooked ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 mx-auto bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg mb-6">
                                <CheckCircle2 size={48} />
                            </motion.div>
                            <h2 className={`text-3xl font-serif font-bold mb-4 ${theme.text}`}>{t({mn: "Баталгаажлаа", en: "Confirmed"})}</h2>
                            <p className={`opacity-60 mb-8 ${theme.text}`}>{t({mn: "Таны цаг амжилттай бүртгэгдлээ.", en: "Your ritual has been securely booked."})}</p>
                            <Link href="/">
                                <button className={`px-10 py-3 rounded-full font-bold uppercase tracking-widest text-xs ${isNight ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                    {t({mn: "Нүүр хуудас", en: "Return Home"})}
                                </button>
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="space-y-10">
                            
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] opacity-60 ${theme.text}`}>
                                        <Calendar size={14} /> {t({mn: "I. Өдөр Сонгох", en: "I. Select Date"})}
                                    </h4>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {dates.map((d, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => { setSelectedDateIndex(i); setSelectedTime(null); }}
                                            className={`
                                                relative shrink-0 w-20 h-28 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2
                                                ${selectedDateIndex === i ? theme.slotActive : theme.slotDefault}
                                            `}
                                        >
                                            <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{d.week}</span>
                                            <span className="text-3xl font-serif font-bold">{d.day}</span>
                                            {selectedDateIndex === i && <motion.div layoutId="dot" className="absolute bottom-3 w-1 h-1 bg-white rounded-full" />}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <AnimatePresence>
                                {selectedDateIndex !== null && (
                                    <motion.section 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="space-y-6 overflow-hidden"
                                    >
                                        <h4 className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] opacity-60 ${theme.text}`}>
                                            <Clock size={14} /> {t({mn: "II. Цаг Сонгох", en: "II. Select Time"})}
                                        </h4>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                            {times.map((time) => {
                                                const isTaken = takenSlots.includes(time);
                                                return (
                                                    <button 
                                                        key={time} disabled={isTaken}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`
                                                            py-4 rounded-xl text-xs font-bold border transition-all relative overflow-hidden
                                                            ${selectedTime === time ? theme.slotActive : isTaken ? theme.slotDisabled : theme.slotDefault}
                                                        `}
                                                    >
                                                        {time}
                                                        {isTaken && <div className="absolute inset-0 flex items-center justify-center"><div className="w-[80%] h-[1px] bg-current opacity-50 rotate-45" /></div>}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </motion.section>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {selectedTime && (
                                    <motion.section
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className={`space-y-8 pt-8 border-t ${theme.borderColor}`}
                                    >
                                        <div className={`rounded-2xl border ${theme.borderColor} p-1`}>
                                            <InfoItem 
                                                icon={<Shield size={14}/>} 
                                                title={t({mn: "Бэлтгэл", en: "Protocol"})} 
                                                text={t({mn: "Та тайван орчинд, өөрийгөө бэлдсэн байх хэрэгтэй.", en: "Ensure you are in a quiet space. Center your mind prior to the session."})}
                                                theme={theme}
                                            />
                                            <InfoItem 
                                                icon={<Info size={14}/>} 
                                                title={t({mn: "Нууцлал", en: "Privacy"})} 
                                                text={t({mn: "Таны мэдээлэл бүрэн нууцлагдана.", en: "All sessions are strictly confidential."})}
                                                theme={theme}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <input value={userName} onChange={e => setUserName(e.target.value)} className={`w-full p-4 rounded-xl border outline-none font-serif text-sm transition-all ${theme.input}`} placeholder={t({mn:"Таны Нэр", en:"Full Name"})} />
                                            <input value={userEmail} onChange={e => setUserEmail(e.target.value)} className={`w-full p-4 rounded-xl border outline-none font-serif text-sm transition-all ${theme.input}`} placeholder={t({mn:"И-мэйл", en:"Email Address"})} />
                                        </div>
                                        <textarea value={userNote} onChange={e => setUserNote(e.target.value)} className={`w-full p-4 rounded-xl border outline-none font-serif h-24 resize-none transition-all ${theme.input}`} placeholder={t({mn: "Хүсэлт / Зорилго...", en: "Intention or questions..."})} />

                                        {isSignedIn ? (
                                            <motion.button 
                                                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                                                onClick={handleBooking} disabled={!userName || !userEmail || isSubmitting}
                                                className={`w-full h-16 rounded-2xl overflow-hidden relative group mt-4 shadow-xl ${!userName || !userEmail ? 'opacity-50 grayscale' : ''}`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-r ${theme.btnGradient}`} />
                                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_linear_infinite]" />
                                                <div className="relative z-10 flex items-center justify-center gap-3 text-white h-full font-black uppercase tracking-[0.2em] text-sm">
                                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <> <Sparkles size={18}/> {t({mn: "Баталгаажуулах", en: "Confirm Booking"})} <ArrowRight size={18}/></>}
                                                </div>
                                            </motion.button>
                                        ) : (
                                            <Link href="/sign-in" className="block w-full">
                                                <button className="w-full h-14 rounded-2xl bg-zinc-800 text-white font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 transition-colors">
                                                    {t({mn: "Нэвтэрч захиалга өгөх", en: "Sign In to Book"})}
                                                </button>
                                            </Link>
                                        )}
                                    </motion.section>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                  </AnimatePresence>
               </div>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}