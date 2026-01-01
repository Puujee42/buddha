"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, UserButton } from "@clerk/nextjs";
import { 
  Sun, Clock, ScrollText, Plus, Trash2, X, History, Video, 
  Loader2, Save, Ban, CheckCircle
} from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import { useLanguage } from "../contexts/LanguageContext";
import LiveRitualRoom from "../components/LiveRitualRoom";

// --- TYPES ---
interface ServiceItem {
  id: string;
  name: { mn: string; en: string };
  price: number;
  duration: string;
  status?: 'pending' | 'approved' | 'rejected' | 'active';
}

interface BlockedSlot {
  id: string;
  date: string;
  time: string;
}

interface UserProfile {
  _id: string;
  role: "client" | "monk";
  name?: { mn: string; en: string };
  title?: { mn: string; en: string };
  services?: ServiceItem[];
  schedule?: { day: string; start: string; end: string; active: boolean }[]; 
  blockedSlots?: BlockedSlot[];
  earnings?: number;
}

interface Booking {
  _id: string;
  monkId: string;
  clientName: string;
  serviceName: any;
  date: string;
  time: string;
  status: string;
}

// English keys for DB/Logic, Mongolian for Display
const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_MN = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];

export default function DashboardPage() {
  const { isLoaded, user } = useUser();
  const { language } = useLanguage(); // assuming language is 'en' or 'mn'
  const langKey = language === 'mn' ? 'mn' : 'en';
  
  // --- TRANSLATION DICTIONARY ---
  const TEXT = {
    en: {
      clientRole: "Seeker",
      earnings: "Total Earnings",
      bookBtn: "Book New Ritual",
      availability: "Availability Manager",
      updateBtn: "Update System",
      step1: "Step 1: Set Weekly Hours",
      step2: "Step 2: Manage Exceptions",
      step2Desc: "Pick a date to mark specific hours as",
      busy: "Busy",
      unblockDay: "Unblock Day",
      blockDay: "Block Day",
      noHours: "No working hours set for this day.",
      checkAbove: "Check your Weekly Schedule above.",
      ritualsClient: "Client Rituals",
      ritualsMy: "My Rituals",
      join: "Join",
      noRituals: "No scheduled rituals.",
      services: "Services",
      active: "Active",
      pending: "Pending",
      deleteSvc: "Delete Service",
      wisdomTitle: "Daily Wisdom",
      wisdomQuote: "Peace comes from within. Do not seek it without.",
      modalBookTitle: "Book a Ritual",
      selectGuide: "Select Guide",
      selectDate: "Select Date",
      unavailable: "Unavailable on this day.",
      selectService: "Select Service",
      confirmBook: "Confirm Booking",
      modalSvcTitle: "New Service",
      cancel: "Cancel",
      submitReview: "Submit for Review",
      alertSaved: "Availability updated successfully!",
      alertSent: "Request sent!",
      alertDelete: "Delete this service?",
    },
    mn: {
      clientRole: "Эрхэм сүсэгтэн",
      earnings: "Нийт орлого",
      bookBtn: "Засал захиалах",
      availability: "Цагийн хуваарь",
      updateBtn: "Хадгалах",
      step1: "Алхам 1: 7 хоногийн цаг тохируулах",
      step2: "Алхам 2: Тусгай өдөр тохируулах",
      step2Desc: "Тодорхой өдрийн цагийг хаах бол өдрөө сонгоно уу",
      busy: "Завгүй",
      unblockDay: "Өдрийг нээх",
      blockDay: "Өдрийг хаах",
      noHours: "Энэ өдөр цагийн хуваарь байхгүй байна.",
      checkAbove: "Дээрх 7 хоногийн хуваарийг шалгана уу.",
      ritualsClient: "Сүсэгтний засал",
      ritualsMy: "Миний засал",
      join: "Нэгдэх",
      noRituals: "Захиалга алга байна.",
      services: "Үйлчилгээ",
      active: "Идэвхтэй",
      pending: "Хүлээгдэж буй",
      deleteSvc: "Устгах",
      wisdomTitle: "Өдрийн сургаал",
      wisdomQuote: "Амар амгалан дотроос ирдэг. Гаднаас бүү хай.",
      modalBookTitle: "Засал захиалах",
      selectGuide: "Лам сонгох",
      selectDate: "Өдөр сонгох",
      unavailable: "Энэ өдөр боломжгүй.",
      selectService: "Үйлчилгээ сонгох",
      confirmBook: "Баталгаажуулах",
      modalSvcTitle: "Шинэ үйлчилгээ",
      cancel: "Болих",
      submitReview: "Илгээх",
      alertSaved: "Амжилттай хадгалагдлаа!",
      alertSent: "Хүсэлт илгээгдлээ!",
      alertDelete: "Та энэ үйлчилгээг устгахдаа итгэлтэй байна уу?",
    }
  }[langKey];

  // --- DATA STATE ---
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]); 
  const [allMonks, setAllMonks] = useState<UserProfile[]>([]); 
  const [loading, setLoading] = useState(true);

  // --- VIDEO CALL STATE ---
  const [activeRoomToken, setActiveRoomToken] = useState<string | null>(null);
  const [activeRoomName, setActiveRoomName] = useState<string | null>(null);
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);

  // --- MODALS ---
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); 

  // --- FORMS ---
  const [serviceForm, setServiceForm] = useState({ nameEn: "", nameMn: "", price: 0, duration: "30 min" });
  const [bookingForm, setBookingForm] = useState({ monkId: "", serviceId: "", date: "", time: "" });
  
  // --- SCHEDULE STATE (Monk Side) ---
  const [schedule, setSchedule] = useState<{ day: string; start: string; end: string; active: boolean }[]>(
    DAYS_EN.map(d => ({ day: d, start: "09:00", end: "17:00", active: true }))
  );
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  
  // Block Time UI State
  const [selectedBlockDate, setSelectedBlockDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        setLoading(true);
        const userEmail = user.primaryEmailAddress?.emailAddress;

        // 1. Try to fetch Monk Profile
        const res = await fetch(`/api/monks/${user.id}`);
        
        if (res.ok) {
            // === SCENARIO A: MONK (OR EXISTING CLIENT) ===
            const data = await res.json();
            setProfile(data);
            
            // If Monk, load schedule
            if (data.role === 'monk') {
                if (data.schedule) setSchedule(data.schedule);
                if (data.blockedSlots) setBlockedSlots(data.blockedSlots);
                // Fetch Monk's Bookings (By Monk ID)
                const bRes = await fetch(`/api/bookings?monkId=${data._id}`);
                if (bRes.ok) setBookings(await bRes.json());
            } else {
                // If Client in DB, fetch by email
                if (userEmail) {
                    const bRes = await fetch(`/api/bookings?userEmail=${userEmail}`);
                    if (bRes.ok) setBookings(await bRes.json());
                }
                // Fetch monks for booking modal
                const monksRes = await fetch('/api/monks');
                if (monksRes.ok) setAllMonks(await monksRes.json());
            }

        } else {
            // === SCENARIO B: NEW CLIENT (404 Not Found) ===
            const tempClientProfile: UserProfile = {
                _id: "temp_client",
                role: "client",
                name: { mn: user.fullName || "Хэрэглэгч", en: user.fullName || "User" },
            };
            setProfile(tempClientProfile);

            if (userEmail) {
                const bRes = await fetch(`/api/bookings?userEmail=${userEmail}`);
                if (bRes.ok) setBookings(await bRes.json());
            }

            const monksRes = await fetch('/api/monks');
            if (monksRes.ok) setAllMonks(await monksRes.json());
        }

      } catch (e) { 
          console.error(e); 
      } finally { 
          setLoading(false); 
      }
    }
    if (isLoaded && user) fetchData();
  }, [isLoaded, user]);

  // --- LOGIC: GENERATE SLOTS FOR BLOCKING UI ---
  const dailySlotsForBlocking = useMemo(() => {
      if (!selectedBlockDate) return [];
      const dateObj = new Date(selectedBlockDate);
      const dayName = DAYS_EN[dateObj.getDay()]; 
      const dayConfig = schedule.find(s => s.day === dayName);
      if (!dayConfig || !dayConfig.active) return []; 

      const slots: string[] = [];
      let [startH, startM] = dayConfig.start.split(':').map(Number);
      let [endH, endM] = dayConfig.end.split(':').map(Number);
      
      let current = new Date(dateObj);
      current.setHours(startH, startM, 0, 0);
      const end = new Date(dateObj);
      end.setHours(endH, endM, 0, 0);

      while (current < end) {
          slots.push(current.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' }));
          current.setMinutes(current.getMinutes() + 60); 
      }
      return slots;
  }, [selectedBlockDate, schedule]);

  // --- ACTIONS ---

  const saveScheduleSettings = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
        const res = await fetch(`/api/monks/${profile._id}/schedule`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ schedule, blockedSlots })
        });
        if (res.ok) alert(TEXT.alertSaved);
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const toggleBlockSlot = (time: string) => {
      const exists = blockedSlots.find(b => b.date === selectedBlockDate && b.time === time);
      if (exists) {
          setBlockedSlots(blockedSlots.filter(b => b.id !== exists.id));
      } else {
          setBlockedSlots([...blockedSlots, { id: crypto.randomUUID(), date: selectedBlockDate, time }]);
      }
  };

  const toggleBlockWholeDay = () => {
      const allBlocked = dailySlotsForBlocking.every(time => 
          blockedSlots.some(b => b.date === selectedBlockDate && b.time === time)
      );
      if (allBlocked) {
          setBlockedSlots(blockedSlots.filter(b => b.date !== selectedBlockDate));
      } else {
          const newBlocks = dailySlotsForBlocking
              .filter(time => !blockedSlots.some(b => b.date === selectedBlockDate && b.time === time))
              .map(time => ({ id: crypto.randomUUID(), date: selectedBlockDate, time }));
          setBlockedSlots([...blockedSlots, ...newBlocks]);
      }
  };

  const submitBooking = async () => {
    if(!bookingForm.monkId || !bookingForm.date || !bookingForm.time) return;
    setIsSaving(true);
    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                ...bookingForm,
                clientName: profile?.name?.en || user?.fullName,
                clientId: profile?._id
            })
        });
        if(res.ok) { 
            alert(TEXT.alertSent); 
            setIsBookingModalOpen(false); 
            window.location.reload(); 
        }
    } catch(e) { console.error(e); } finally { setIsSaving(false); }
  };

  const submitService = async () => {
    if (!profile) return;
    setIsSaving(true);
    const newService: ServiceItem = { 
        id: crypto.randomUUID(), 
        name: { en: serviceForm.nameEn, mn: serviceForm.nameMn }, 
        price: Number(serviceForm.price), 
        duration: serviceForm.duration, 
        status: 'pending' 
    };
    const updatedServices = [...(profile.services || []), newService];
    try {
      const res = await fetch(`/api/monks/${profile._id}/service`, { 
          method: 'PATCH', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ services: updatedServices }) 
      });
      if (res.ok) { 
          setProfile({ ...profile, services: updatedServices }); 
          setIsServiceModalOpen(false); 
      }
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const deleteService = async (serviceId: string) => {
    if (!profile || !confirm(TEXT.alertDelete)) return;
    const updatedServices = (profile.services || []).filter(s => s.id !== serviceId);
    try {
        const res = await fetch(`/api/monks/${profile._id}/service`, { 
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ services: updatedServices }) 
        });
        if (res.ok) {
            setProfile({ ...profile, services: updatedServices });
        }
    } catch (e) { console.error(e); }
  };

  const joinVideoCall = async (id: string) => {
      setJoiningRoomId(id);
      try {
        const res = await fetch(`/api/livekit?room=${id}&username=${user?.fullName}`);
        const data = await res.json();
        setActiveRoomToken(data.token); 
        setActiveRoomName(id);
      } catch (e) { console.error(e); } finally { setJoiningRoomId(null); }
  };

  if (!isLoaded) return null;
  const isMonk = profile?.role === 'monk';

  if (activeRoomToken && activeRoomName) {
    return <LiveRitualRoom token={activeRoomToken} serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!} roomName={activeRoomName} onLeave={async () => { 
        if(activeRoomName) {
            try {
                // End call logic: Add payment and complete booking
                await fetch(`/api/bookings/${activeRoomName}/complete`, { method: 'POST' });
            } catch(e) { console.error(e); }
        }
        setActiveRoomToken(null); 
        setActiveRoomName(null);
        window.location.reload(); 
    }} />;
  }

  return (
    <>
      <OverlayNavbar />
      <main className="min-h-screen bg-[#FFFBEB] pt-32 pb-20 font-sans px-6">
        
        {/* HERO SECTION */}
        <section className="container mx-auto mb-12">
            <div className="bg-[#451a03] rounded-[3rem] p-8 md:p-12 text-[#FFFBEB] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                    <div className="scale-[2] origin-center"><UserButton /></div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold">{profile?.name?.[langKey] || user?.fullName}</h1>
                        <p className="text-[#FDE68A]/80 uppercase tracking-widest mt-2">{isMonk ? profile?.title?.[langKey] : TEXT.clientRole}</p>
                        {isMonk && (
                            <div className="mt-4 inline-flex items-center gap-2 bg-[#FDE68A]/20 px-4 py-2 rounded-xl backdrop-blur-sm border border-[#FDE68A]/30">
                                <span className="text-xs uppercase tracking-widest opacity-80">{TEXT.earnings}:</span>
                                <span className="text-xl font-bold text-[#FDE68A]">{profile?.earnings?.toLocaleString() || 0}₮</span>
                            </div>
                        )}
                    </div>
                </div>
                {!isMonk && (
                    <button onClick={() => setIsBookingModalOpen(true)} className="bg-[#D97706] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#B45309] shadow-lg flex items-center gap-3">
                        <Plus size={18} /> {TEXT.bookBtn}
                    </button>
                )}
            </div>
        </section>

        <section className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
             
             {/* --- SCHEDULE SETTINGS (MONK ONLY) --- */}
             {isMonk && (
                 <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
                     <div className="flex justify-between items-center mb-6">
                         <h2 className="text-2xl font-serif font-bold text-[#451a03] flex items-center gap-3"><Clock className="text-[#D97706]"/> {TEXT.availability}</h2>
                         <button onClick={saveScheduleSettings} disabled={isSaving} className="flex items-center gap-2 bg-[#D97706] text-white px-4 py-2 rounded-full font-bold text-xs hover:bg-[#B45309]">
                             {isSaving ? <Loader2 className="animate-spin" size={14}/> : <Save size={14}/>} {TEXT.updateBtn}
                         </button>
                     </div>

                     {/* 1. Weekly Schedule */}
                    
                     {/* 2. Block Specific Times */}
                     <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                             <div>
                                 <h3 className="font-bold text-xs uppercase text-stone-400 tracking-widest mb-1">{TEXT.step2}</h3>
                                 <p className="text-xs text-stone-500">{TEXT.step2Desc} <span className="text-red-500 font-bold">{TEXT.busy}</span>.</p>
                             </div>
                             <div className="flex gap-2 items-center">
                                <input 
                                    type="date" 
                                    className="p-3 rounded-xl border-2 border-[#D97706]/20 bg-white font-bold text-[#451a03] outline-none focus:border-[#D97706]"
                                    value={selectedBlockDate}
                                    onChange={(e) => setSelectedBlockDate(e.target.value)}
                                />
                                {dailySlotsForBlocking.length > 0 && (
                                    <button 
                                        onClick={toggleBlockWholeDay}
                                        className={`px-4 py-3 rounded-xl text-xs font-bold uppercase transition-colors border ${
                                            dailySlotsForBlocking.every(time => blockedSlots.some(b => b.date === selectedBlockDate && b.time === time))
                                            ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                                            : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                        }`}
                                    >
                                        {dailySlotsForBlocking.every(time => blockedSlots.some(b => b.date === selectedBlockDate && b.time === time)) ? TEXT.unblockDay : TEXT.blockDay}
                                    </button>
                                )}
                             </div>
                         </div>

                         {dailySlotsForBlocking.length > 0 ? (
                             <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                 {dailySlotsForBlocking.map((time) => {
                                     const isBlocked = blockedSlots.some(b => b.date === selectedBlockDate && b.time === time);
                                     return (
                                         <button 
                                            key={time}
                                            onClick={() => toggleBlockSlot(time)}
                                            className={`py-3 rounded-xl text-xs font-black transition-all border-2 relative
                                                ${isBlocked 
                                                    ? 'bg-red-500 text-white border-red-500 shadow-md transform scale-95 opacity-90' 
                                                    : 'bg-white text-[#451a03] border-stone-200 hover:border-[#D97706] hover:shadow-lg' 
                                                }`}
                                         >
                                             {time}
                                             {isBlocked ? (
                                                 <Ban size={12} className="absolute top-1 right-1 opacity-50" />
                                             ) : (
                                                 <CheckCircle size={12} className="absolute top-1 right-1 opacity-20 text-green-500" />
                                             )}
                                         </button>
                                     );
                                 })}
                             </div>
                         ) : (
                             <div className="text-center py-8 opacity-50 border-2 border-dashed border-stone-200 rounded-xl">
                                 <Ban className="mx-auto mb-2 w-8 h-8 text-stone-400"/>
                                 <p className="text-sm font-bold">{TEXT.noHours}</p>
                                 <p className="text-xs">{TEXT.checkAbove}</p>
                             </div>
                         )}
                     </div>
                 </div>
             )}

             {/* --- BOOKINGS LIST --- */}
             <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
                 <h2 className="text-2xl font-serif font-bold text-[#451a03] mb-6 flex items-center gap-3"><History className="text-[#78350F]"/> {isMonk ? TEXT.ritualsClient : TEXT.ritualsMy}</h2>
                 <div className="space-y-4">
                     {bookings.length > 0 ? bookings.map((b) => (
                         <div key={b._id} className="p-5 rounded-2xl border border-stone-100 flex justify-between items-center">
                             <div>
                                 <h4 className="font-bold text-[#451a03]">{b.clientName}</h4>
                                 <p className="text-xs text-stone-500">{b.date} • {b.time}</p>
                                 <p className="text-[10px] text-[#D97706] font-bold mt-1">
                                     {typeof b.serviceName === 'string' ? b.serviceName : b.serviceName?.[langKey]}
                                 </p>
                             </div>
                             <div className="flex gap-2">
                                 {b.status === 'confirmed' ? (
                                     <button 
                                        onClick={() => joinVideoCall(b._id)} 
                                        disabled={joiningRoomId === b._id}
                                        className="px-4 py-2 bg-[#05051a] text-white rounded-lg text-xs font-black uppercase flex items-center gap-2"
                                     >
                                         {joiningRoomId === b._id ? <Loader2 className="animate-spin" size={14}/> : <Video size={14}/>} {TEXT.join}
                                     </button>
                                 ) : (
                                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${b.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-stone-100 text-stone-500 border-stone-200'}`}>
                                         {b.status === 'pending' ? TEXT.pending : b.status}
                                     </span>
                                 )}
                             </div>
                         </div>
                     )) : <p className="text-stone-400 italic text-center py-4">{TEXT.noRituals}</p>}
                 </div>
             </div>

             {/* --- SERVICES (Monk) --- */}
             {isMonk && (
                 <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="text-2xl font-serif font-bold text-[#451a03] flex items-center gap-3"><ScrollText className="text-[#D97706]"/> {TEXT.services}</h2>
                         <button onClick={() => setIsServiceModalOpen(true)} className="bg-[#D97706] text-white p-2 rounded-full hover:bg-[#B45309]"><Plus size={20}/></button>
                     </div>
                     <div className="space-y-3">
                         {profile?.services?.map((svc) => (
                             <div key={svc.id} className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]/30 flex justify-between items-center group">
                                 <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#D97706] shadow-sm"><ScrollText size={18} /></div>
                                     <div>
                                         <h4 className="font-bold text-[#451a03]">{svc.name[langKey]}</h4>
                                         <p className="text-xs text-stone-500">{svc.price}₮ • {svc.duration}</p>
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${svc.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                         {svc.status === 'active' ? TEXT.active : TEXT.pending}
                                     </span>
                                     <button 
                                        onClick={() => deleteService(svc.id)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title={TEXT.deleteSvc}
                                     >
                                         <Trash2 size={16} />
                                     </button>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             )}
          </div>
          
          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
              <div className="bg-[#FEF3C7] border border-[#FDE68A] p-8 rounded-[2.5rem]">
                  <Sun className="w-16 h-16 text-[#F59E0B]/30 mb-4"/>
                  <h3 className="text-xl font-bold text-[#78350F] mb-2">{TEXT.wisdomTitle}</h3>
                  <p className="italic text-[#78350F]/80 text-sm">"{TEXT.wisdomQuote}"</p>
              </div>
          </div>
        </section>

        {/* --- CLIENT BOOKING MODAL --- */}
        <AnimatePresence>
            {isBookingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold font-serif text-[#451a03]">{TEXT.modalBookTitle}</h3><button onClick={() => setIsBookingModalOpen(false)}><X size={24}/></button></div>
                        <div className="space-y-6">
                            
                            {/* 1. Select Guide */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-stone-400 mb-2">{TEXT.selectGuide}</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {allMonks.map(m => (
                                        <button key={m._id} onClick={() => setBookingForm({ ...bookingForm, monkId: m._id, serviceId: "", time: "" })} className={`p-3 rounded-xl border text-left transition-all ${bookingForm.monkId === m._id ? 'bg-[#451a03] text-white' : 'bg-stone-50 border-stone-100'}`}><p className="font-bold text-sm">{m.name?.[langKey]}</p></button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Date */}
                            {bookingForm.monkId && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">{TEXT.selectDate}</label>
                                    <input type="date" className="w-full p-3 border rounded-xl" value={bookingForm.date} onChange={e => setBookingForm({ ...bookingForm, date: e.target.value, time: "" })} />
                                </div>
                            )}

                            {/* 3. Smart Time Slots */}
                            {bookingForm.date && (
                                <div className="grid grid-cols-4 gap-2">
                                    {(() => {
                                        const selectedMonk = allMonks.find(m => m._id === bookingForm.monkId);
                                        const dayName = new Date(bookingForm.date).toLocaleDateString('en-US', { weekday: 'long' });
                                        const daySchedule = selectedMonk?.schedule?.find(s => s.day === dayName);
                                        if (!daySchedule || !daySchedule.active) return <p className="col-span-4 text-xs text-center text-red-400">{TEXT.unavailable}</p>;

                                        const slots = [];
                                        let [sH, sM] = daySchedule.start.split(':').map(Number);
                                        let [eH, eM] = daySchedule.end.split(':').map(Number);
                                        let curr = new Date(); curr.setHours(sH, sM, 0); 
                                        const end = new Date(); end.setHours(eH, eM, 0);
                                        
                                        while(curr < end) {
                                            const timeStr = curr.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' });
                                            // Check if blocked by Monk
                                            const isBlocked = selectedMonk?.blockedSlots?.some(b => b.date === bookingForm.date && b.time === timeStr);
                                            
                                            slots.push(
                                                <button 
                                                    key={timeStr} 
                                                    disabled={isBlocked} 
                                                    onClick={() => setBookingForm({...bookingForm, time: timeStr})}
                                                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${isBlocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : bookingForm.time === timeStr ? 'bg-[#05051a] text-white' : 'bg-white border-stone-200'}`}
                                                >
                                                    {timeStr}
                                                </button>
                                            );
                                            curr.setMinutes(curr.getMinutes() + 60);
                                        }
                                        return slots;
                                    })()}
                                </div>
                            )}

                            {/* 4. Service */}
                            {bookingForm.time && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">{TEXT.selectService}</label>
                                    <div className="space-y-2">
                                        {allMonks.find(m => m._id === bookingForm.monkId)?.services?.filter(s => s.status !== 'rejected').map(s => (
                                            <button key={s.id} onClick={() => setBookingForm({ ...bookingForm, serviceId: s.id })} className={`w-full p-3 rounded-xl border flex justify-between items-center transition-all ${bookingForm.serviceId === s.id ? 'bg-[#FDE68A] border-[#D97706] text-[#451a03]' : 'bg-white border-stone-200'}`}><span className="font-bold text-sm">{s.name[langKey]}</span><span className="text-xs">{s.price}₮</span></button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button onClick={submitBooking} disabled={isSaving || !bookingForm.serviceId} className="w-full py-4 bg-[#D97706] text-white rounded-2xl font-bold uppercase tracking-widest disabled:opacity-50">
                                {isSaving ? <Loader2 className="animate-spin mx-auto"/> : TEXT.confirmBook}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* --- SERVICE MODAL --- */}
        <AnimatePresence>
            {isServiceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-[#451a03]">{TEXT.modalSvcTitle}</h3>
                        <div className="space-y-3 mb-6">
                            <input className="w-full p-3 border rounded-xl" placeholder="Name (EN)" value={serviceForm.nameEn} onChange={e => setServiceForm({...serviceForm, nameEn: e.target.value})} />
                            <input className="w-full p-3 border rounded-xl" placeholder="Нэр (MN)" value={serviceForm.nameMn} onChange={e => setServiceForm({...serviceForm, nameMn: e.target.value})} />
                            <div className="flex gap-2">
                                <input type="number" className="w-full p-3 border rounded-xl" placeholder="Price" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: Number(e.target.value)})} />
                                <input className="w-full p-3 border rounded-xl" placeholder="Duration" value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setIsServiceModalOpen(false)} className="flex-1 py-3 border rounded-xl font-bold text-stone-500">{TEXT.cancel}</button>
                            <button onClick={submitService} className="flex-1 py-3 bg-[#D97706] text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                {isSaving ? <Loader2 className="animate-spin"/> : TEXT.submitReview}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </main>
    </>
  );
}