"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, UserButton } from "@clerk/nextjs";
import { 
  Sun, Moon, Calendar, BookOpen, Award, Clock, Sparkles, Flower, Heart, 
  ArrowRight, User, ScrollText, Briefcase, Quote, Loader2, Check, X, Bell, 
  History, Video, Hourglass, CheckCircle, Plus, Pencil, Trash2, Save 
} from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import LiveRitualRoom from "../components/LiveRitualRoom";

// --- TYPES ---
interface ServiceItem {
  id: string;
  name: { mn: string; en: string };
  price: number;
  duration: string;
}

interface UserProfile {
  _id: string;
  clerkId: string;
  role: "client" | "monk";
  name?: { mn: string; en: string };
  bio?: { mn: string; en: string };
  image?: string;
  title?: { mn: string; en: string };
  education?: { mn: string; en: string };
  philosophy?: { mn: string; en: string };
  services?: ServiceItem[];
  yearsOfExperience?: number;
  karma: number;
  meditationDays: number;
  totalMerits: number;
}

interface Booking {
  _id: string;
  clientId: string;
  clientName: string;
  serviceName: { mn: string; en: string } | string; 
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  note?: string;
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { t, language } = useLanguage();
  
  // Data State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]); 
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Video Call State
  const [activeRoomToken, setActiveRoomToken] = useState<string | null>(null);
  const [activeRoomName, setActiveRoomName] = useState<string | null>(null);
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);

  // Service Management State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    nameEn: "", nameMn: "", price: 0, duration: "30 min"
  });
  const [isSavingService, setIsSavingService] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        setLoadingProfile(true);
        const userEmail = user.primaryEmailAddress?.emailAddress;

        // 1. Fetch Profile
        const profileRes = await fetch(`/api/monks/${user.id}`);
        
        let currentRole = "client";
        let dbId = null;

        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data);
          currentRole = data.role;
          dbId = data._id;
        } else {
          setProfile({
            _id: "temp", clerkId: user.id, role: "client",
            name: { mn: user.fullName || "", en: user.fullName || "" },
            karma: 0, meditationDays: 0, totalMerits: 0
          });
        }

        // 2. Fetch Bookings based on Role
        let bookingsRes = null;
        if (currentRole === 'monk' && dbId) {
            bookingsRes = await fetch(`/api/bookings?monkId=${dbId}`, { cache: 'no-store' });
        } else if (userEmail) {
            bookingsRes = await fetch(`/api/bookings?userEmail=${userEmail}`, { cache: 'no-store' });
        }

        if (bookingsRes && bookingsRes.ok) {
            const bookingData = await bookingsRes.json();
            const sorted = bookingData.sort((a: Booking, b: Booking) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setBookings(sorted);
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoadingProfile(false);
      }
    }

    if (isLoaded && user) fetchData();
  }, [isLoaded, user]);

  // --- BOOKING ACTIONS ---
  const handleBookingAction = async (bookingId: string, action: 'confirmed' | 'rejected' | 'completed') => {
    setProcessingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });

      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: action } : b));
      }
    } catch (error) { console.error(error); } finally { setProcessingId(null); }
  };

  // --- VIDEO CALL ACTIONS ---
  const joinVideoCall = async (bookingId: string) => {
    setJoiningRoomId(bookingId);
    try {
      const username = profile?.name?.en || user?.fullName || "User";
      const res = await fetch(`/api/livekit?room=${bookingId}&username=${encodeURIComponent(username)}`);
      const data = await res.json();
      if (data.token) { setActiveRoomToken(data.token); setActiveRoomName(bookingId); }
      else { alert("Failed to join room"); }
    } catch (error) { console.error(error); alert("Error joining video call"); } 
    finally { setJoiningRoomId(null); }
  };

  const handleCallEnd = async () => {
    const bookingId = activeRoomName;
    setActiveRoomToken(null); setActiveRoomName(null);
    if (bookingId) await handleBookingAction(bookingId, 'completed');
  };

  // --- SERVICE MANAGEMENT ACTIONS ---
  const openAddService = () => {
    setEditingServiceId(null);
    setServiceForm({ nameEn: "", nameMn: "", price: 0, duration: "30 min" });
    setIsServiceModalOpen(true);
  };

  const openEditService = (svc: ServiceItem) => {
    setEditingServiceId(svc.id);
    setServiceForm({ nameEn: svc.name.en, nameMn: svc.name.mn, price: svc.price, duration: svc.duration });
    setIsServiceModalOpen(true);
  };

  const saveService = async () => {
    if (!profile) return;
    setIsSavingService(true);

    let updatedServices = [...(profile.services || [])];
    
    if (editingServiceId) {
      updatedServices = updatedServices.map(s => s.id === editingServiceId ? {
        ...s,
        name: { en: serviceForm.nameEn, mn: serviceForm.nameMn },
        price: Number(serviceForm.price),
        duration: serviceForm.duration
      } : s);
    } else {
      updatedServices.push({
        id: crypto.randomUUID(),
        name: { en: serviceForm.nameEn, mn: serviceForm.nameMn },
        price: Number(serviceForm.price),
        duration: serviceForm.duration
      });
    }

    try {
      const res = await fetch(`/api/monks/${profile._id}/services`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: updatedServices })
      });

      if (res.ok) {
        setProfile({ ...profile, services: updatedServices });
        setIsServiceModalOpen(false);
      } else {
        alert("Failed to save service");
      }
    } catch (e) { 
        console.error(e); alert("Error saving service"); 
    } finally { 
        setIsSavingService(false); 
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!profile || !confirm("Are you sure?")) return;
    setIsSavingService(true); 

    const updatedServices = (profile.services || []).filter(s => s.id !== serviceId);

    try {
        const res = await fetch(`/api/monks/${profile._id}/services`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ services: updatedServices })
        });

        if (res.ok) {
            setProfile({ ...profile, services: updatedServices });
        }
    } catch (e) { console.error(e); } 
    finally { setIsSavingService(false); }
  };

  if (!isLoaded) return null;
  const langKey = language === 'mn' ? 'mn' : 'en';
  const userRole = profile?.role || 'client';
  const displayName = profile?.name?.[langKey] || user?.fullName || "Guest";
  const getServiceName = (b: Booking) => typeof b.serviceName === 'string' ? b.serviceName : b.serviceName?.[langKey] || "Ritual";

  const content = {
    welcome: t({ mn: "Сайн байна уу,", en: "Welcome back," }),
    bookNow: t({ mn: "Цаг захиалах", en: "Book a Session" }),
    servicesTitle: t({ mn: "Үйлчилгээ", en: "Services Offered" }),
    addService: t({ mn: "Нэмэх", en: "Add Service" }),
    modalTitle: editingServiceId ? t({ mn: "Үйлчилгээ засах", en: "Edit Service" }) : t({ mn: "Шинэ үйлчилгээ", en: "New Service" }),
    save: t({ mn: "Хадгалах", en: "Save" }),
    cancel: t({ mn: "Болих", en: "Cancel" }),
    stats: {
      karma: t({ mn: "Карма", en: "Karma" }),
      meditation: t({ mn: "Бясалгал", en: "Meditation Days" }),
      merits: t({ mn: "Халамжит", en: "Total Merits" })
    },
    clientBookings: {
        title: t({ mn: "Миний Захиалгууд", en: "My Rituals" }),
        empty: t({ mn: "Та одоогоор захиалга хийгээгүй байна.", en: "You have no scheduled rituals yet." }),
        status: {
            pending: t({ mn: "Хүлээгдэж буй", en: "Pending" }),
            confirmed: t({ mn: "Баталгаажсан", en: "Confirmed" }),
            rejected: t({ mn: "Цуцлагдсан", en: "Declined" }),
            completed: t({ mn: "Дууссан", en: "Completed" })
        },
        join: t({ mn: "Нэгдэх", en: "Join Ritual" })
    },
    requests: {
        title: t({ mn: "Ирж буй хүсэлтүүд", en: "Incoming Requests" }),
        historyTitle: t({ mn: "Захиалгын Түүх", en: "Booking History" }),
        empty: t({ mn: "Одоогоор хүлээгдэж буй хүсэлт алга.", en: "No pending requests." }),
        emptyHistory: t({ mn: "Түүх олдсонгүй.", en: "No booking history yet." }),
        accept: t({ mn: "Зөвшөөрөх", en: "Accept" }),
        reject: t({ mn: "Татгалзах", en: "Decline" }),
        joinCall: t({ mn: "Видео дуудлага", en: "Start Ritual" }),
        complete: t({ mn: "Дуусгах", en: "Complete" }),
        waitingAdmin: t({ mn: "Админыг хүлээж байна", en: "Waiting for Admin Approval" }), // NEW TRANSLATION
        status: {
            confirmed: t({ mn: "Баталгаажсан", en: "Confirmed" }),
            rejected: t({ mn: "Татгалзсан", en: "Declined" }),
            completed: t({ mn: "Дууссан", en: "Completed" })
        }
    },
    sections: {
      recent: t({ mn: "Сүүлийн Үйлдлүүд", en: "Recent Activities" }),
      resources: t({ mn: "Оюуны Тэжээл", en: "Spiritual Resources" }),
    },
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const historyBookings = bookings.filter(b => b.status !== 'pending');

  if (activeRoomToken && activeRoomName) {
    return (
      <LiveRitualRoom
        token={activeRoomToken} 
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!} 
        roomName={activeRoomName}
        onLeave={handleCallEnd} 
      />
    );
  }

  return (
    <>
      <OverlayNavbar />
      
      <main className="min-h-screen bg-[#FFFBEB] pt-32 pb-20 font-sans selection:bg-amber-200 relative">
        
        {/* --- HERO SECTION --- */}
        <section className="container mx-auto px-6 mb-12">
          <div className="relative overflow-hidden bg-[#451a03] rounded-[3rem] p-8 md:p-16 text-[#FFFBEB] shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-[100px] -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D97706]/10 rounded-full blur-[80px] -ml-20 -mb-20" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#F59E0B] to-[#D97706] rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative scale-[2.5] md:scale-[3.5] origin-center">
                   <UserButton afterSignOutUrl="/" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <span className="text-[#FDE68A]/60 font-bold uppercase tracking-[0.3em] text-xs">
                    {content.welcome}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-serif font-bold mt-2">
                    {displayName}
                  </h1>
                  {userRole === 'monk' && profile?.title?.[langKey] && (
                    <span className="inline-block mt-2 px-3 py-1 bg-[#F59E0B]/20 text-[#F59E0B] rounded-full text-xs font-bold uppercase tracking-widest border border-[#F59E0B]/30">
                      {profile.title[langKey]}
                    </span>
                  )}
                </motion.div>
              </div>

              {userRole === 'client' && (
                <motion.button whileHover={{ scale: 1.05 }} className="bg-[#F59E0B] text-[#451a03] px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[#D97706] hover:text-white transition-all flex items-center gap-3">
                    <Calendar size={20} /> {content.bookNow}
                </motion.button>
              )}
            </div>
          </div>
        </section>

        {/* --- STATS GRID --- */}
        <section className="container mx-auto px-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: content.stats.karma, value: profile?.karma || 0, icon: <Sparkles className="text-amber-500" />, color: "bg-amber-50" },
              { label: content.stats.meditation, value: profile?.meditationDays || 0, icon: <Moon className="text-blue-500" />, color: "bg-blue-50" },
              { label: content.stats.merits, value: profile?.totalMerits || 0, icon: <Award className="text-rose-500" />, color: "bg-rose-50" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`p-8 rounded-3xl ${stat.color} border border-white/50 shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">{stat.icon}</div>
                  <span className="text-sm font-bold text-[#92400E] uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-4xl font-serif font-bold text-[#451a03]">{stat.value.toLocaleString()}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- MAIN CONTENT GRID --- */}
        <section className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            
            {loadingProfile ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-amber-600" /></div>
            ) : (
              <>
                {/* === CLIENT: MY BOOKINGS === */}
                {userRole === 'client' && (
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-amber-900/5 border border-white">
                    <div className="flex items-center gap-3 mb-8">
                       <Sparkles className="text-[#D97706]" />
                       <h2 className="text-2xl font-serif font-bold text-[#451a03]">{content.clientBookings.title}</h2>
                    </div>
                    {/* ... (Client List Same as Before) ... */}
                    <div className="space-y-4">
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <div key={booking._id} className="p-6 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex gap-4 items-start">
                                        <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center 
                                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                                              booking.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                                              booking.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {booking.status === 'confirmed' ? <Check size={18} /> : 
                                             booking.status === 'completed' ? <Check size={18} /> :
                                             booking.status === 'rejected' ? <X size={18} /> : <Hourglass size={18} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#451a03] text-lg">{getServiceName(booking)}</h4>
                                            <div className="flex flex-wrap gap-4 mt-1 text-sm text-[#78350F]/70">
                                                <span className="flex items-center gap-1"><Calendar size={12}/> {booking.date}</span>
                                                <span className="flex items-center gap-1"><Clock size={12}/> {booking.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 self-end md:self-center">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border
                                            ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-200' : 
                                              booking.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                              booking.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                            {content.clientBookings.status[booking.status]}
                                        </span>
                                        {booking.status === 'confirmed' && (
                                            <button onClick={() => joinVideoCall(booking._id)} disabled={joiningRoomId === booking._id} className="flex items-center gap-2 px-4 py-2 bg-[#05051a] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-cyan-900 transition-colors disabled:opacity-50 shadow-lg ml-2">
                                                {joiningRoomId === booking._id ? <Loader2 className="animate-spin" size={14}/> : <Video size={14} />} {content.clientBookings.join}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10"><p className="text-[#78350F]/50 italic">{content.clientBookings.empty}</p></div>
                        )}
                    </div>
                  </div>
                )}

                {/* === MONK: DASHBOARD === */}
                {userRole === 'monk' && (
                  <>
                     {/* 1. INCOMING REQUESTS (Modified: Removed Buttons, Added Info Badge) */}
                     <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-amber-900/5 border border-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -z-10" />
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-serif font-bold text-[#451a03] flex items-center gap-3"><Bell className="text-[#D97706]" /> {content.requests.title}</h2>
                            {pendingBookings.length > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">{pendingBookings.length} new</span>}
                        </div>
                        <div className="space-y-4">
                          <AnimatePresence>
                            {pendingBookings.length > 0 ? (
                              pendingBookings.map((booking) => (
                                <motion.div key={booking._id} initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="p-6 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] transition-all">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-[#D97706]"><User size={24}/></div>
                                            <div>
                                                <h4 className="font-bold text-[#451a03]">{booking.clientName}</h4>
                                                <p className="text-[#D97706] text-sm">{getServiceName(booking)}</p>
                                                <p className="text-xs text-stone-500 mt-1">{booking.date} • {booking.time}</p>
                                                {booking.note && <p className="text-xs italic text-stone-500 mt-1">"{booking.note}"</p>}
                                            </div>
                                        </div>
                                        
                                        {/* CHANGED: Removed Action Buttons, Added Info Badge */}
                                        <div className="flex gap-2 self-end md:self-center">
                                            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 text-xs font-bold uppercase tracking-widest">
                                                <Hourglass size={14} className="animate-pulse" />
                                                {content.requests.waitingAdmin}
                                            </span>
                                        </div>

                                    </div>
                                </motion.div>
                              ))
                            ) : ( <p className="text-stone-400 italic text-center py-6">{content.requests.empty}</p> )}
                          </AnimatePresence>
                        </div>
                     </div>

                     {/* 2. BOOKING HISTORY (With Complete Action) */}
                     <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-amber-900/5 border border-white">
                        <div className="flex items-center gap-3 mb-8">
                           <History className="text-[#78350F]" />
                           <h2 className="text-2xl font-serif font-bold text-[#451a03]">{content.requests.historyTitle}</h2>
                        </div>
                        <div className="space-y-4">
                            {historyBookings.length > 0 ? (
                                historyBookings.map((booking) => (
                                    <div key={booking._id} className="p-4 rounded-xl border border-stone-100 flex flex-col md:flex-row md:items-center justify-between hover:bg-stone-50 transition-colors gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                                                  booking.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                                                  'bg-red-100 text-red-600'}`}>
                                                {booking.status === 'confirmed' ? <Check size={18} /> : 
                                                 booking.status === 'completed' ? <Check size={18} /> : <X size={18} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#451a03]">{booking.clientName}</h4>
                                                <p className="text-xs text-stone-500">{booking.date} • {booking.time}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 self-end md:self-auto flex-wrap justify-end">
                                            {booking.status === 'confirmed' && (
                                                <>
                                                    <button onClick={() => joinVideoCall(booking._id)} disabled={joiningRoomId === booking._id} className="flex items-center gap-2 px-4 py-2 bg-[#05051a] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-cyan-900 transition-colors disabled:opacity-50 shadow-lg">
                                                        {joiningRoomId === booking._id ? <Loader2 className="animate-spin" size={14}/> : <Video size={14} />} {content.requests.joinCall}
                                                    </button>
                                                    <button onClick={() => handleBookingAction(booking._id, 'completed')} disabled={processingId === booking._id} className="flex items-center gap-2 px-4 py-2 border-2 border-green-200 text-green-700 bg-green-50 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-green-100 transition-colors disabled:opacity-50">
                                                        {processingId === booking._id ? <Loader2 className="animate-spin" size={14}/> : <CheckCircle size={14} />} {content.requests.complete}
                                                    </button>
                                                </>
                                            )}
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider 
                                                ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                                                  booking.status === 'completed' ? 'bg-blue-50 text-blue-600' :
                                                  'bg-red-50 text-red-600'}`}>
                                                {booking.status === 'confirmed' ? content.requests.status.confirmed : 
                                                 booking.status === 'completed' ? content.requests.status.completed : 
                                                 content.requests.status.rejected}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : ( <p className="text-stone-400 italic text-center py-4">{content.requests.emptyHistory}</p> )}
                        </div>
                     </div>

                     {/* 3. MONK SERVICES MANAGEMENT (NEW) */}
                     {profile && (
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-amber-900/5 border border-white">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-serif font-bold text-[#451a03] flex items-center gap-3">
                                    <ScrollText className="text-[#D97706]" /> {content.servicesTitle}
                                </h2>
                                <button onClick={openAddService} className="flex items-center gap-2 px-4 py-2 bg-[#D97706] text-white rounded-xl text-xs font-bold uppercase hover:bg-[#B45309] transition-colors">
                                    <Plus size={16} /> {content.addService}
                                </button>
                            </div>

                            <div className="space-y-4">
                                {profile.services && profile.services.length > 0 ? (
                                    profile.services.map((svc) => (
                                        <div key={svc.id} className="flex items-center justify-between p-6 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]/50 hover:border-[#F59E0B] transition-all group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#D97706] shadow-sm"><Flower size={24} /></div>
                                                <div>
                                                    <h4 className="font-bold text-[#451a03]">{svc.name?.[langKey]}</h4>
                                                    <p className="text-sm text-[#78350F]/60">{svc.duration} • {svc.price.toLocaleString()}₮</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEditService(svc)} className="p-2 bg-white text-amber-600 rounded-lg shadow-sm hover:bg-amber-50"><Pencil size={16} /></button>
                                                <button onClick={() => deleteService(svc.id)} className="p-2 bg-white text-red-400 rounded-lg shadow-sm hover:bg-red-50"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-stone-400 italic text-center py-4">No services listed yet.</p>
                                )}
                            </div>
                        </div>
                     )}
                  </>
                )}
              </>
            )}
          </div>
          
          {/* RIGHT COLUMN (Unchanged) */}
          <div className="space-y-12">
              <div className="bg-[#451a03] rounded-[2.5rem] p-8 text-[#FFFBEB] shadow-xl shadow-amber-900/20">
                <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3"><BookOpen className="text-[#FDE68A]" /> {content.sections.resources}</h2>
                <div className="space-y-4">
                  {[
                    { name: t({ mn: "Зүрхэн судар", en: "Heart Sutra" }), color: "bg-white/10" },
                    { name: t({ mn: "Бясалгалын заавар", en: "Meditation Guide" }), color: "bg-white/10" },
                  ].map((res, i) => (
                    <button key={i} className={`w-full flex items-center justify-between p-5 rounded-2xl ${res.color} hover:scale-[1.02] transition-transform`}>
                      <span className="font-medium">{res.name}</span>
                      <ArrowRight size={16} />
                    </button>
                  ))}
                </div>
              </div>
          </div>
          
        </section>

        {/* --- SERVICE MODAL --- */}
        <AnimatePresence>
            {isServiceModalOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-serif text-[#451a03]">{content.modalTitle}</h3>
                            <button onClick={() => setIsServiceModalOpen(false)} className="text-stone-400 hover:text-stone-600"><X size={24}/></button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-xs font-bold text-[#D97706] mb-1 uppercase">Name (English)</label><input className="w-full p-3 rounded-xl border border-stone-200 outline-none focus:border-[#D97706]" value={serviceForm.nameEn} onChange={(e) => setServiceForm({...serviceForm, nameEn: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-[#D97706] mb-1 uppercase">Name (Mongolian)</label><input className="w-full p-3 rounded-xl border border-stone-200 outline-none focus:border-[#D97706]" value={serviceForm.nameMn} onChange={(e) => setServiceForm({...serviceForm, nameMn: e.target.value})} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-[#D97706] mb-1 uppercase">Price (₮)</label><input type="number" className="w-full p-3 rounded-xl border border-stone-200 outline-none focus:border-[#D97706]" value={serviceForm.price} onChange={(e) => setServiceForm({...serviceForm, price: Number(e.target.value)})} /></div>
                                <div><label className="block text-xs font-bold text-[#D97706] mb-1 uppercase">Duration</label><input className="w-full p-3 rounded-xl border border-stone-200 outline-none focus:border-[#D97706]" value={serviceForm.duration} onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})} /></div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setIsServiceModalOpen(false)} className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-500 font-bold hover:bg-stone-50">{content.cancel}</button>
                            <button onClick={saveService} disabled={isSavingService} className="flex-1 py-3 rounded-xl bg-[#D97706] text-white font-bold hover:bg-[#B45309] flex justify-center items-center gap-2">{isSavingService ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}{content.save}</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

      </main>
    </>
  );
}