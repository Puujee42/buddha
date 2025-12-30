"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, UserButton } from "@clerk/nextjs";
import { 
  Sun, Moon, Calendar, BookOpen, Award, Clock, Sparkles, Flower, Heart, 
  ArrowRight, User, ScrollText, Briefcase, Quote, Loader2, Check, X, Bell, 
  History, Video, Hourglass
} from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import LiveRitualRoom from "../components/LiveRitualRoom";

// --- TYPES ---
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
  services?: any[];
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
  status: 'pending' | 'confirmed' | 'rejected';
  note?: string;
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { t, language } = useLanguage();
  
  // State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]); 
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Video Call State
  const [activeRoomToken, setActiveRoomToken] = useState<string | null>(null);
  const [activeRoomName, setActiveRoomName] = useState<string | null>(null);
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        setLoadingProfile(true);
        const userEmail = user.primaryEmailAddress?.emailAddress;

        // 1. Try to fetch Profile from DB
        const profileRes = await fetch(`/api/monks/${user.id}`);
        
        let currentRole = "client";
        let dbId = null;

        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data);
          currentRole = data.role;
          dbId = data._id;
        } else {
          // Fallback if user not in DB yet (Standard Client)
          console.log("User profile not found in DB, using Clerk data.");
          setProfile({
            _id: "temp",
            clerkId: user.id,
            role: "client",
            name: { mn: user.fullName || "", en: user.fullName || "" },
            karma: 0, meditationDays: 0, totalMerits: 0
          });
        }

        // 2. Fetch Bookings based on Role
        let bookingsRes = null;

        if (currentRole === 'monk' && dbId) {
            // Monk: Fetch by Monk ID
            bookingsRes = await fetch(`/api/bookings?monkId=${dbId}`, { cache: 'no-store' });
        } else if (userEmail) {
            // Client (or Profile not found): Fetch by Email
            bookingsRes = await fetch(`/api/bookings?userEmail=${userEmail}`, { cache: 'no-store' });
        }

        if (bookingsRes && bookingsRes.ok) {
            const bookingData = await bookingsRes.json();
            // Sort: Upcoming (future dates) first
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

  // --- ACTIONS ---
  const handleBookingAction = async (bookingId: string, action: 'confirmed' | 'rejected') => {
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

  const joinVideoCall = async (bookingId: string) => {
    setJoiningRoomId(bookingId);
    try {
      const username = profile?.name?.en || user?.fullName || "Seeker";
      const res = await fetch(`/api/livekit?room=${bookingId}&username=${encodeURIComponent(username)}`);
      const data = await res.json();
      
      if (data.token) {
        setActiveRoomToken(data.token);
        setActiveRoomName(bookingId);
      } else {
        alert("Failed to join room");
      }
    } catch (error) {
      console.error(error);
      alert("Error joining video call");
    } finally {
      setJoiningRoomId(null);
    }
  };

  if (!isLoaded) return null;
  const langKey = language === 'mn' ? 'mn' : 'en';

  const getServiceName = (b: Booking) => {
    if (typeof b.serviceName === 'string') return b.serviceName;
    return b.serviceName?.[langKey] || "Ritual";
  };

  const content = {
    welcome: t({ mn: "Сайн байна уу,", en: "Welcome back," }),
    bookNow: t({ mn: "Цаг захиалах", en: "Book a Session" }),
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
            rejected: t({ mn: "Цуцлагдсан", en: "Declined" })
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
        status: {
            confirmed: t({ mn: "Баталгаажсан", en: "Confirmed" }),
            rejected: t({ mn: "Татгалзсан", en: "Declined" })
        }
    },
    sections: {
      recent: t({ mn: "Сүүлийн Үйлдлүүд", en: "Recent Activities" }),
      resources: t({ mn: "Оюуны Тэжээл", en: "Spiritual Resources" }),
    },
  };

  const displayName = profile?.name?.[langKey] || user?.firstName || "Seeker";
  const userRole = profile?.role || "client";

  // --- RENDER VIDEO ROOM ---
  if (activeRoomToken && activeRoomName) {
    return (
      <LiveRitualRoom
        token={activeRoomToken} 
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!} 
        roomName={activeRoomName}
        onLeave={() => { setActiveRoomToken(null); setActiveRoomName(null); }} 
      />
    );
  }

  // --- CONSTANTS FOR MONK ---
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const historyBookings = bookings.filter(b => b.status !== 'pending');

  return (
    <>
      <OverlayNavbar />
      
      <main className="min-h-screen bg-[#FFFBEB] pt-32 pb-20 font-sans selection:bg-amber-200">
        
        {/* --- HERO --- */}
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
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-[#F59E0B] text-[#451a03] px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[#D97706] hover:text-white transition-all flex items-center gap-3"
                >
                    <Calendar size={20} />
                    {content.bookNow}
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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-3xl ${stat.color} border border-white/50 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    {stat.icon}
                  </div>
                  <span className="text-sm font-bold text-[#92400E] uppercase tracking-widest">
                    {stat.label}
                  </span>
                </div>
                <div className="text-4xl font-serif font-bold text-[#451a03]">
                  {stat.value.toLocaleString()}
                </div>
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
                {/* ----------------------------------------------------- */}
                {/* CLIENT SECTION: MY BOOKINGS                           */}
                {/* ----------------------------------------------------- */}
                {userRole === 'client' && (
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-amber-900/5 border border-white">
                    <div className="flex items-center gap-3 mb-8">
                       <Sparkles className="text-[#D97706]" />
                       <h2 className="text-2xl font-serif font-bold text-[#451a03]">{content.clientBookings.title}</h2>
                    </div>

                    <div className="space-y-4">
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <div key={booking._id} className="p-6 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    
                                    <div className="flex gap-4 items-start">
                                        <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center 
                                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                                              booking.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {booking.status === 'confirmed' ? <Check size={18} /> : 
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
                                              booking.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                            {content.clientBookings.status[booking.status]}
                                        </span>

                                        {booking.status === 'confirmed' && (
                                            <button 
                                                onClick={() => joinVideoCall(booking._id)}
                                                disabled={joiningRoomId === booking._id}
                                                className="flex items-center gap-2 px-4 py-2 bg-[#05051a] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-cyan-900 transition-colors disabled:opacity-50 shadow-lg ml-2"
                                            >
                                                {joiningRoomId === booking._id ? <Loader2 className="animate-spin" size={14}/> : <Video size={14} />}
                                                {content.clientBookings.join}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-[#78350F]/50 italic">{content.clientBookings.empty}</p>
                            </div>
                        )}
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------- */}
                {/* MONK SECTIONS (INCOMING & HISTORY)                    */}
                {/* ----------------------------------------------------- */}
                {userRole === 'monk' && (
                  <>
                     {/* 1. INCOMING REQUESTS (Pending) */}
                     <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-amber-900/5 border border-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -z-10" />
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-serif font-bold text-[#451a03] flex items-center gap-3">
                                <Bell className="text-[#D97706]" /> {content.requests.title}
                            </h2>
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
                                        <div className="flex gap-2 self-end md:self-center">
                                            <button onClick={() => handleBookingAction(booking._id, 'rejected')} disabled={processingId === booking._id} className="p-3 rounded-xl border-2 border-red-100 text-red-500 hover:bg-red-50"><X size={18}/></button>
                                            <button onClick={() => handleBookingAction(booking._id, 'confirmed')} disabled={processingId === booking._id} className="px-6 py-3 rounded-xl bg-[#D97706] text-white hover:bg-[#B45309] flex gap-2 items-center">{processingId === booking._id ? <Loader2 className="animate-spin" size={18}/> : <Check size={18}/>} {content.requests.accept}</button>
                                        </div>
                                    </div>
                                </motion.div>
                              ))
                            ) : ( <p className="text-stone-400 italic text-center py-6">{content.requests.empty}</p> )}
                          </AnimatePresence>
                        </div>
                     </div>

                     {/* 2. HISTORY & VIDEO */}
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
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {booking.status === 'confirmed' ? <Check size={18} /> : <X size={18} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#451a03]">{booking.clientName}</h4>
                                                <p className="text-xs text-stone-500">{booking.date} • {booking.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 self-end md:self-auto">
                                            {booking.status === 'confirmed' && (
                                                <button onClick={() => joinVideoCall(booking._id)} disabled={joiningRoomId === booking._id} className="flex items-center gap-2 px-4 py-2 bg-[#05051a] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-cyan-900 transition-colors disabled:opacity-50 shadow-lg">
                                                    {joiningRoomId === booking._id ? <Loader2 className="animate-spin" size={14}/> : <Video size={14} />} {content.requests.joinCall}
                                                </button>
                                            )}
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                {booking.status === 'confirmed' ? content.requests.status.confirmed : content.requests.status.rejected}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : ( <p className="text-stone-400 italic text-center py-4">{content.requests.emptyHistory}</p> )}
                        </div>
                     </div>
                  </>
                )}
              </>
            )}
          </div>
          
          {/* RIGHT COLUMN */}
          <div className="space-y-12">
              <div className="bg-[#451a03] rounded-[2.5rem] p-8 text-[#FFFBEB] shadow-xl shadow-amber-900/20">
                <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                  <BookOpen className="text-[#FDE68A]" />
                  {content.sections.resources}
                </h2>
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
      </main>
    </>
  );
}