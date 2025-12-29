"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Calendar, Clock, CheckCircle2, Loader2, 
  Sun, Moon, Sparkles, User, Gem 
} from "lucide-react";
import { useTheme } from "next-themes"; // Integrated
import OverlayNavbar from "../../components/Navbar";
import GoldenNirvanaFooter from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import { Service, Monk } from "@/database/types";

// --- CUSTOM VIKING FRAME FOR THE ALTAR ---
const AltarFrame = ({ color }: { color: string }) => (
  <div className="absolute inset-0 pointer-events-none z-30">
    <svg className="w-full h-full" viewBox="0 0 500 800" fill="none" preserveAspectRatio="none">
      <path 
        d="M50 100 L50 50 L100 50 M400 50 L450 50 L450 100 M450 700 L450 750 L400 750 M100 750 L50 750 L50 700" 
        stroke={color} strokeWidth="2" strokeOpacity="0.4" 
      />
      <text x="25" y="400" fill={color} fontSize="14" className="opacity-20 [writing-mode:vertical-rl] font-serif uppercase tracking-[0.5em]">
        ᚦᛅᛏ᛫ᛋᚴᛅᛚ᛫ᚢᛖᚱᚦᛅ
      </text>
      <circle cx="250" cy="50" r="4" fill={color} className="animate-pulse" />
    </svg>
  </div>
);

export default function RitualBookingPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme(); // Use the chosen theme
  
  const [mounted, setMounted] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [selectedMonk, setSelectedMonk] = useState<Monk | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userNote, setUserNote] = useState("");

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const servicesRes = await fetch('/api/services'); 
        if (servicesRes.ok) {
          const services: Service[] = await servicesRes.json();
          const found = services.find((s) => String(s._id) === id);
          if (found) setService(found);
        }
        const monksRes = await fetch('/api/monks');
        if (monksRes.ok) {
            const allMonks: Monk[] = await monksRes.json();
            if (allMonks.length > 0) setSelectedMonk(allMonks[0]);
        }
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    }
    loadData();
  }, [id]);

  const isDark = resolvedTheme === "dark";

  // DYNAMIC THEME PALETTE
  const theme = isDark ? {
    accent: "#818cf8", // Indigo
    bg: "bg-[#020205]",
    card: "bg-[#0a0a14] border-white/5",
    text: "text-white",
    subText: "text-indigo-400",
    input: "bg-white/5 border-white/10 text-white placeholder-indigo-300/30",
    button: "bg-white text-black hover:bg-indigo-400",
    glow: "shadow-[0_0_50px_-10px_rgba(99,102,241,0.2)]",
    icon: <Moon className="text-indigo-400 animate-pulse" />
  } : {
    accent: "#d97706", // Amber
    bg: "bg-[#FDFBF7]",
    card: "bg-white border-stone-200",
    text: "text-stone-900",
    subText: "text-amber-700",
    input: "bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400",
    button: "bg-stone-900 text-white hover:bg-amber-700",
    glow: "shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)]",
    icon: <Sun className="text-amber-600 animate-spin-slow" />
  };

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

  const times = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

  const handleBooking = async () => {
    if (!userName || !selectedTime) return;
    setIsSubmitting(true);
    setTimeout(() => { setIsBooked(true); setIsSubmitting(false); }, 1500);
  };

  if (!mounted) return null;

  return (
    <>
      <OverlayNavbar />
      <div className={`min-h-screen transition-colors duration-1000 pt-32 pb-20 px-6 overflow-hidden ${theme.bg}`}>
        
        {/* TEXTURE & ATMOSPHERE */}
        <div className={`fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] ${isDark ? 'invert' : ''}`} />
        <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full blur-[150px] opacity-[0.08] pointer-events-none ${isDark ? "bg-indigo-500" : "bg-amber-500"}`} />

        <main className="container mx-auto max-w-6xl relative z-10">
          
          <Link href="/services" className={`inline-flex items-center gap-2 mb-12 text-[10px] font-black uppercase tracking-[0.4em] transition-opacity hover:opacity-100 ${theme.text} opacity-50`}>
            <ArrowLeft size={14} /> {t({mn: "Буцах", en: "Return to Path"})}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* LEFT: THE SERVICE ARCANA */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 mb-8 ${isDark ? "border-indigo-500/30 bg-indigo-950/30" : "border-amber-200 bg-white shadow-xl"}`}>
                {theme.icon}
              </div>
              <h1 className={`text-6xl md:text-8xl font-serif font-black leading-[0.9] mb-8 tracking-tighter ${theme.text}`}>
                {service?.title[language]}
              </h1>
              <p className={`text-lg leading-relaxed mb-10 opacity-70 ${theme.text} max-w-md`}>
                {service?.desc[language]}
              </p>
              
              <div className="flex gap-10">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.subText}`}>Cycle</p>
                  <p className={`text-3xl font-serif ${theme.text}`}>{service?.duration}</p>
                </div>
                <div className="w-px h-12 bg-current opacity-10" />
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.subText}`}>Offering</p>
                  <p className={`text-3xl font-serif ${theme.text}`}>{service?.price.toLocaleString()}₮</p>
                </div>
              </div>

              {selectedMonk && (
                <div className={`mt-16 flex items-center gap-5 p-5 rounded-[1.5rem] border transition-all ${isDark ? "border-white/5 bg-white/[0.02]" : "border-amber-900/5 bg-white shadow-sm"}`}>
                   <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500/20 grayscale group-hover:grayscale-0 transition-all">
                      <img src={selectedMonk.image} alt="monk" className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <p className={`text-[10px] uppercase font-black tracking-[0.2em] opacity-40 ${theme.text}`}> Ritual Conductor</p>
                      <p className={`font-serif text-xl ${theme.text}`}>{selectedMonk.name[language]}</p>
                   </div>
                </div>
              )}
            </motion.div>

            {/* RIGHT: THE RITUAL ALTAR */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className={`relative rounded-[2.5rem] p-10 overflow-hidden border transition-all duration-1000 ${theme.card} ${theme.glow}`}
            >
              <AltarFrame color={theme.accent} />

              <AnimatePresence mode="wait">
                {isBooked ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="py-20 text-center relative z-40"
                  >
                    <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-6" />
                    <h3 className={`text-3xl font-serif font-black mb-4 ${theme.text}`}>Fate Sealed.</h3>
                    <p className={`opacity-60 mb-10 ${theme.text}`}>The Ancient Guard has noted your request.</p>
                    <Link href="/services" className={`px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest ${theme.button}`}>
                       Confirm Finality
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div key="form" className="relative z-40 space-y-10">
                    
                    {/* STEP 1: DATE */}
                    <div className="space-y-6">
                      <h2 className={`text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2 ${theme.subText}`}>
                        <Calendar size={14} /> I. Choose Alignment Date
                      </h2>
                      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {dates.map((d, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedDateIndex(i)}
                            className={`shrink-0 w-20 h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-500 
                              ${selectedDateIndex === i 
                                ? `scale-105 ${isDark ? 'bg-white text-black border-white' : 'bg-stone-900 text-white border-stone-900 shadow-xl'}` 
                                : `border-transparent ${isDark ? 'bg-white/5 text-white/30' : 'bg-stone-100 text-stone-400 hover:bg-stone-200'}`
                              }`}
                          >
                            <span className="text-[10px] uppercase font-black mb-1">{d.week}</span>
                            <span className="text-2xl font-serif font-bold">{d.day}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* STEP 2: TIME */}
                    <AnimatePresence>
                      {selectedDateIndex !== null && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
                           <h2 className={`text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2 ${theme.subText}`}>
                             <Clock size={14} /> II. Align the Hour
                           </h2>
                           <div className="grid grid-cols-3 gap-3">
                             {times.map((time) => (
                               <button
                                 key={time}
                                 onClick={() => setSelectedTime(time)}
                                 className={`py-4 rounded-xl font-black text-[10px] transition-all border-2
                                   ${selectedTime === time 
                                     ? `${isDark ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-amber-700 text-white border-amber-700'}` 
                                     : `border-transparent ${isDark ? 'bg-white/5 text-white/40' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}`}
                               >
                                 {time}
                               </button>
                             ))}
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* STEP 3: DATA */}
                    <AnimatePresence>
                      {selectedTime && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                          <h2 className={`text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2 ${theme.subText}`}>
                            <Gem size={14} /> III. Enter Your Vessel
                          </h2>
                          <input 
                            className={`w-full p-5 rounded-2xl border-2 outline-none transition-all font-serif text-lg ${theme.input} focus:border-current`} 
                            placeholder="Identify yourself..."
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                          <textarea 
                            className={`w-full p-5 rounded-2xl border-2 outline-none h-28 resize-none transition-all font-serif text-lg ${theme.input} focus:border-current`} 
                            placeholder="State your intention..."
                            value={userNote}
                            onChange={(e) => setUserNote(e.target.value)}
                          />
                          <button 
                            disabled={!userName || isSubmitting}
                            onClick={handleBooking}
                            className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 disabled:opacity-30 ${theme.button}`}
                          >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <>Initiate Sacrifice <Sparkles size={16} /></>}
                          </button>
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
      <GoldenNirvanaFooter />
    </>
  );
}