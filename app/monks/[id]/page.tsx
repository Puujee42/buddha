"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  Quote,
  Loader2,
  AlertCircle
} from "lucide-react";
import OverlayNavbar from "../../components/Navbar"; 
import { useLanguage } from "../../contexts/LanguageContext";
import { Monk } from "@/database/types";

// --- STYLES ---
const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Jost:wght@200;300;400&display=swap');
  .font-celestial { font-family: 'Cinzel', serif; }
  .font-ethereal { font-family: 'Jost', sans-serif; }
`;

// Define available daily time slots
const TIME_SLOTS = [
  "09:00", "10:00", "11:00", 
  "14:00", "15:00", "16:00", "17:00"
];

export default function MonkDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const { language, t } = useLanguage();
  const [monk, setMonk] = useState<Monk | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Booking State
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. FETCH MONK DATA ---
  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/monks/${id}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setMonk(data);
      } catch (error) {
        setMonk(null);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // --- 2. FETCH TAKEN SLOTS WHEN DATE CHANGES ---
  useEffect(() => {
    async function fetchAvailability() {
      if (selectedDateIndex === null || !id) return;
      
      // Reset time selection when date changes
      setSelectedTime(null);
      setTakenSlots([]); 

      const dateObj = generateCalendar()[selectedDateIndex].full;
      // Format date as YYYY-MM-DD for API
      const dateString = dateObj.toISOString().split('T')[0];

      try {
        const res = await fetch(`/api/bookings?monkId=${id}&date=${dateString}`);
        if (res.ok) {
          const bookedTimes = await res.json();
          setTakenSlots(bookedTimes);
        }
      } catch (e) {
        console.error("Failed to fetch slots", e);
      }
    }

    if (selectedDateIndex !== null) {
      fetchAvailability();
    }
  }, [selectedDateIndex, id]);

  // --- 3. HANDLE BOOKING SUBMISSION ---
  const handleBooking = async () => {
    if (selectedDateIndex === null || !selectedTime || !id) return;

    setIsSubmitting(true);
    const dateObj = generateCalendar()[selectedDateIndex].full;
    const dateString = dateObj.toISOString().split('T')[0];

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monkId: id,
          date: dateString,
          time: selectedTime,
          // In a real app, pass logged-in user info here
          userEmail: "guest@example.com" 
        })
      });

      if (res.ok) {
        setIsBooked(true);
      } else {
        alert(t({ mn: "Уучлаарай, энэ цаг дөнгөж сая захиалагдлаа.", en: "Sorry, this slot was just taken." }));
        // Refresh slots
        const refreshRes = await fetch(`/api/bookings?monkId=${id}&date=${dateString}`);
        if (refreshRes.ok) setTakenSlots(await refreshRes.json());
      }
    } catch (error) {
      alert("Booking failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper: Generate next 14 days
  const generateCalendar = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        day: d.getDate(),
        weekday: d.toLocaleDateString(language === 'mn' ? 'mn-MN' : 'en-US', { weekday: 'short' }),
        full: d
      });
    }
    return dates;
  };

  // Labels
  const labels = {
    back: t({ mn: "Буцах", en: "Return" }),
    specialties: t({ mn: "Эрдэм мэдлэг", en: "Mastery" }),
    bookTitle: t({ mn: "Цаг захиалах", en: "Request Audience" }),
    selectDate: t({ mn: "Өдөр сонгох", en: "1. Select Date" }),
    selectTime: t({ mn: "Цаг сонгох", en: "2. Select Time" }),
    confirm: t({ mn: "Баталгаажуулах", en: "Confirm Booking" }),
    booked: t({ mn: "Хүсэлт илгээгдлээ", en: "Request Sent" }),
    unavailable: t({ mn: "Одоогоор боломжгүй", en: "Currently Unavailable" }),
    location: t({ mn: "Гандантэгчинлэн хийд", en: "Gandantegchinlen Monastery" }),
    duration: t({ mn: "45 минут", en: "45 Minutes" }),
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#FDFBF7]">
      <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
    </div>
  );

  if (!monk) return (
     <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FDFBF7]">
        <h1 className="text-2xl text-slate-800 font-celestial">Monk Not Found</h1>
        <Link href="/monks" className="mt-6 text-amber-600 underline">Return</Link>
     </div>
  );

  return (
    <>
    <OverlayNavbar />
    <style>{pageStyles}</style>
    
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-ethereal overflow-x-hidden selection:bg-amber-200 selection:text-amber-900">
      
      {/* Backgrounds omitted for brevity, keep your original ones */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply" />

      <main className="relative z-10 container mx-auto px-4 lg:px-8 pt-24 pb-20">
        
        <Link href="/monks">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-700 transition-colors mb-8 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase tracking-widest text-xs font-bold">{labels.back}</span>
          </motion.div>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* LEFT COLUMN: VISUALS */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-3/4 w-full rounded-t-full rounded-b-2xl overflow-hidden shadow-2xl"
            >
              <img src={monk.image} alt={monk.name[language]} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent" />
              {monk.quote && (
                <div className="absolute bottom-8 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl relative">
                    <Quote className="absolute -top-3 -left-2 w-6 h-6 text-amber-400 fill-current opacity-80" />
                    <p className="text-white text-sm italic font-serif text-center">"{monk.quote[language]}"</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT COLUMN: BOOKING */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              
              <h1 className="text-5xl md:text-6xl font-celestial text-slate-800 mb-2">{monk.name[language]}</h1>
              <p className="text-xl text-amber-600/80 font-serif italic mb-8">{monk.title[language]}</p>
              
              <div className="prose prose-slate prose-lg mb-10">
                <p className="leading-relaxed text-slate-600">{monk.bio[language]}</p>
              </div>

              {/* BOOKING WIDGET */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-amber-100 relative overflow-hidden">
                {!monk.isAvailable ? (
                    <div className="text-center py-8">
                        <h3 className="font-celestial text-xl text-slate-700">{labels.unavailable}</h3>
                    </div>
                ) : isBooked ? (
                    // SUCCESS STATE
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-10 text-center"
                    >
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"><CheckCircle2 size={32} /></div>
                        <h3 className="font-celestial text-2xl text-slate-800 mb-2">{labels.booked}</h3>
                        <button onClick={() => { setIsBooked(false); setSelectedDateIndex(null); }} className="mt-6 text-sm text-amber-600 underline">Book another</button>
                    </motion.div>
                ) : (
                    // SELECTION STATE
                    <div>
                        {/* 1. DATE SELECTOR */}
                        <h3 className="font-celestial text-sm uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                            <Calendar size={14} /> {labels.selectDate}
                        </h3>
                        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-amber-200 mb-6">
                            {generateCalendar().map((date, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDateIndex(idx)}
                                    className={`
                                        shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border transition-all duration-300
                                        ${selectedDateIndex === idx 
                                            ? "bg-slate-800 text-white border-slate-800 shadow-lg scale-105" 
                                            : "bg-slate-50 text-slate-500 border-slate-200 hover:border-amber-400 hover:bg-white"
                                        }
                                    `}
                                >
                                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">{date.weekday}</span>
                                    <span className={`text-xl font-serif font-bold ${selectedDateIndex === idx ? "text-amber-400" : "text-slate-700"}`}>{date.day}</span>
                                </button>
                            ))}
                        </div>

                        {/* 2. TIME SELECTOR (Only shows after Date is picked) */}
                        <motion.div 
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: selectedDateIndex !== null ? 'auto' : 0, opacity: selectedDateIndex !== null ? 1 : 0 }}
                           className="overflow-hidden"
                        >
                            <h3 className="font-celestial text-sm uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                <Clock size={14} /> {labels.selectTime}
                            </h3>
                            
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                                {TIME_SLOTS.map((time) => {
                                    const isTaken = takenSlots.includes(time);
                                    const isSelected = selectedTime === time;

                                    return (
                                        <button
                                            key={time}
                                            disabled={isTaken}
                                            onClick={() => setSelectedTime(time)}
                                            className={`
                                                py-3 px-2 rounded-lg text-sm font-bold border transition-all
                                                ${isTaken 
                                                    ? "bg-slate-100 text-slate-300 border-transparent cursor-not-allowed decoration-slate-300 line-through decoration-2" 
                                                    : isSelected 
                                                        ? "bg-amber-600 text-white border-amber-600 shadow-md transform scale-105" 
                                                        : "bg-white text-slate-600 border-slate-200 hover:border-amber-400"
                                                }
                                            `}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* 3. CONFIRM BUTTON */}
                        <button
                            disabled={!selectedTime || isSubmitting}
                            onClick={handleBooking}
                            className={`w-full py-4 rounded-lg font-celestial text-sm uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2
                                ${selectedTime && !isSubmitting
                                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:shadow-orange-200 hover:scale-[1.02]" 
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                }
                            `}
                        >
                            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4"/> : labels.confirm} 
                            {!isSubmitting && <ArrowLeft className="rotate-180 w-4 h-4" />}
                        </button>
                    </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}