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
  const { isLoaded, user } = useUser();
  const { t, language } = useLanguage();
  
  // --- DATA STATE ---
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]); 
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // --- VIDEO CALL STATE ---
  const [activeRoomToken, setActiveRoomToken] = useState<string | null>(null);
  const [activeRoomName, setActiveRoomName] = useState<string | null>(null);
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);

  // --- SERVICE MANAGEMENT STATE ---
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({ nameEn: "", nameMn: "", price: 0, duration: "30 min" });
  const [isSavingService, setIsSavingService] = useState(false);

  // --- FETCH DATA (PROFILE & BOOKINGS) ---
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        setLoadingProfile(true);
        const userEmail = user.primaryEmailAddress?.emailAddress;

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

        let bookingsRes = null;
        if (currentRole === 'monk' && dbId) {
            bookingsRes = await fetch(`/api/bookings?monkId=${dbId}`, { cache: 'no-store' });
        } else if (userEmail) {
            bookingsRes = await fetch(`/api/bookings?userEmail=${userEmail}`, { cache: 'no-store' });
        }

        if (bookingsRes && bookingsRes.ok) {
            const bookingData = await bookingsRes.json();
            const sorted = bookingData.sort((a: Booking, b: Booking) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setBookings(sorted);
        }
      } catch (error) { console.error(error); } finally { setLoadingProfile(false); }
    }
    if (isLoaded && user) fetchData();
  }, [isLoaded, user]);

  // --- ACTIONS: BOOKINGS ---
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

  const joinVideoCall = async (bookingId: string) => {
    setJoiningRoomId(bookingId);
    try {
      const username = profile?.name?.en || user?.fullName || "User";
      const res = await fetch(`/api/livekit?room=${bookingId}&username=${encodeURIComponent(username)}`);
      const data = await res.json();
      if (data.token) { 
        setActiveRoomToken(data.token); 
        setActiveRoomName(bookingId); 
      }
    } catch (error) { console.error(error); } finally { setJoiningRoomId(null); }
  };

  // --- AUTOMATIC COMPLETION ON CALL END ---
  const handleCallEnd = async () => {
    const bookingId = activeRoomName;
    setActiveRoomToken(null);
    setActiveRoomName(null);
    if (bookingId) {
        // MONK: Automatically update to completed when room is closed
        await handleBookingAction(bookingId, 'completed');
    }
  };

  // --- ACTIONS: SERVICE MANAGEMENT ---
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
      updatedServices = updatedServices.map(s => s.id === editingServiceId ? { ...s, name: { en: serviceForm.nameEn, mn: serviceForm.nameMn }, price: Number(serviceForm.price), duration: serviceForm.duration } : s);
    } else {
      updatedServices.push({ id: crypto.randomUUID(), name: { en: serviceForm.nameEn, mn: serviceForm.nameMn }, price: Number(serviceForm.price), duration: serviceForm.duration });
    }
    try {
      const res = await fetch(`/api/monks/${profile._id}/services`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ services: updatedServices }) });
      if (res.ok) { setProfile({ ...profile, services: updatedServices }); setIsServiceModalOpen(false); }
    } catch (e) { console.error(e); } finally { setIsSavingService(false); }
  };

  const deleteService = async (serviceId: string) => {
    if (!profile || !confirm("Delete this service?")) return;
    const updatedServices = (profile.services || []).filter(s => s.id !== serviceId);
    try {
        const res = await fetch(`/api/monks/${profile._id}/services`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ services: updatedServices }) });
        if (res.ok) setProfile({ ...profile, services: updatedServices });
    } catch (e) { console.error(e); }
  };

  if (!isLoaded) return null;
  const langKey = language === 'mn' ? 'mn' : 'en';
  const userRole = profile?.role || "client";
  const displayName = profile?.name?.[langKey] || user?.fullName || "Guest";
  const getServiceName = (b: Booking) => typeof b.serviceName === 'string' ? b.serviceName : b.serviceName?.[langKey] || "Ritual";

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const historyBookings = bookings.filter(b => b.status !== 'pending');

  const content = {
    waitingAdmin: t({ mn: "Админ зөвшөөрөхийг хүлээж байна", en: "Awaiting Admin Approval" }),
    startCall: t({ mn: "Зан үйл эхлэх", en: "Start Ritual" }),
    historyTitle: t({ mn: "Захиалгын түүх", en: "Ritual Records" }),
    incomingTitle: t({ mn: "Шинэ хүсэлтүүд", en: "Incoming Calls" }),
    servicesTitle: t({ mn: "Миний үйлчилгээнүүд", en: "My Services" }),
  };

  if (activeRoomToken && activeRoomName) {
    return <LiveRitualRoom token={activeRoomToken} serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!} roomName={activeRoomName} onLeave={handleCallEnd} />;
  }

  return (
    <>
      <OverlayNavbar />
      <main className="min-h-screen bg-[#FFFBEB] pt-32 pb-20 font-sans px-6">
        
        {/* --- 1. HERO SECTION --- */}
        <section className="container mx-auto mb-12">
            <div className="relative overflow-hidden bg-[#451a03] rounded-[3rem] p-8 md:p-16 text-[#FFFBEB] shadow-2xl flex items-center gap-10">
                <div className="scale-[2.5] origin-center"><UserButton /></div>
                <div className="flex-1">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold">{displayName}</h1>
                    <p className="text-xl text-[#FDE68A]/80 font-light mt-2 uppercase tracking-widest">{userRole === 'monk' ? profile?.title?.[langKey] : "Sacred Seeker"}</p>
                </div>
            </div>
        </section>

        {/* --- 2. MAIN GRID --- */}
        <section className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {loadingProfile ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-600" size={40} /></div> : (
              <>
                {/* --- MONK: INCOMING REQUESTS (NO BUTTONS - ADMIN ONLY) --- */}
                {userRole === 'monk' && (
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
                    <h2 className="text-2xl font-serif font-bold text-[#451a03] mb-8 flex items-center gap-3"><Bell className="text-[#D97706]" /> {content.incomingTitle}</h2>
                    <div className="space-y-4">
                        {pendingBookings.length > 0 ? pendingBookings.map((b) => (
                            <div key={b._id} className="p-6 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h4 className="font-bold text-[#451a03]">{b.clientName}</h4>
                                    <p className="text-[#D97706] text-sm font-medium">{getServiceName(b)}</p>
                                    <p className="text-xs text-stone-500 mt-1">{b.date} • {b.time}</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                    <Hourglass size={14} className="animate-pulse" /> {content.waitingAdmin}
                                </div>
                            </div>
                        )) : <p className="text-stone-400 italic text-center py-6">No pending requests.</p>}
                    </div>
                  </div>
                )}

                {/* --- MONK: HISTORY & ACTIVE CALLS --- */}
                {userRole === 'monk' && (
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
                        <h2 className="text-2xl font-serif font-bold text-[#451a03] mb-8 flex items-center gap-3"><History className="text-[#78350F]" /> {content.historyTitle}</h2>
                        <div className="space-y-4">
                            {historyBookings.length > 0 ? historyBookings.map((b) => (
                                <div key={b._id} className="p-5 rounded-2xl border border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${b.status === 'confirmed' ? 'bg-green-100 text-green-600' : b.status === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                            {b.status === 'confirmed' ? <Video size={18} /> : b.status === 'completed' ? <CheckCircle size={18} /> : <X size={18} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#451a03]">{b.clientName}</h4>
                                            <p className="text-xs text-stone-500">{b.date} • {b.time}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 self-end md:self-auto">
                                        {b.status === 'confirmed' ? (
                                            <button 
                                                onClick={() => joinVideoCall(b._id)} 
                                                disabled={joiningRoomId === b._id}
                                                className="flex items-center gap-2 px-6 py-2 bg-[#05051a] text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-cyan-900 transition-all shadow-lg"
                                            >
                                                {joiningRoomId === b._id ? <Loader2 className="animate-spin" size={14}/> : <Video size={14} />} {content.startCall}
                                            </button>
                                        ) : (
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border ${b.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                {b.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )) : <p className="text-stone-400 italic text-center py-6">Empty history.</p>}
                        </div>
                    </div>
                )}
                
                {/* --- CLIENT: VIEW RITUALS --- */}
                {userRole === 'client' && (
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
                        <h2 className="text-2xl font-serif font-bold text-[#451a03] mb-8 flex items-center gap-3"><Sparkles className="text-[#D97706]" /> My Rituals</h2>
                        <div className="space-y-4">
                            {bookings.length > 0 ? bookings.map((b) => (
                                <div key={b._id} className="p-6 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-[#451a03]">{getServiceName(b)}</h4>
                                        <p className="text-sm text-stone-500">{b.date} • {b.time}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {b.status === 'confirmed' ? (
                                            <button onClick={() => joinVideoCall(b._id)} className="px-5 py-2 bg-[#05051a] text-white rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                                <Video size={14} /> Join Call
                                            </button>
                                        ) : (
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border ${b.status === 'pending' ? 'bg-amber-50 text-amber-600' : b.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                                {b.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )) : <p className="text-stone-400 italic text-center py-6">No scheduled rituals.</p>}
                        </div>
                    </div>
                )}

                {/* --- MONK: SERVICE MANAGEMENT --- */}
                {userRole === 'monk' && profile && (
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-serif font-bold text-[#451a03] flex items-center gap-3"><ScrollText className="text-[#D97706]" /> {content.servicesTitle}</h2>
                            <button onClick={openAddService} className="bg-[#D97706] text-white p-2 rounded-full hover:bg-[#B45309] transition-colors"><Plus size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            {profile.services?.map((svc) => (
                                <div key={svc.id} className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]/30 flex justify-between items-center group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#D97706] shadow-sm"><Flower size={20} /></div>
                                        <div><h4 className="font-bold text-[#451a03]">{svc.name[langKey]}</h4><p className="text-xs text-stone-500">{svc.price.toLocaleString()}₮ • {svc.duration}</p></div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditService(svc)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"><Pencil size={16} /></button>
                                        <button onClick={() => deleteService(svc.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
              </>
            )}
          </div>

          {/* --- SIDEBAR --- */}
          <div className="space-y-8">
              <div className="bg-[#451a03] rounded-[2.5rem] p-8 text-[#FFFBEB] shadow-xl">
                <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3"><BookOpen className="text-[#FDE68A]" /> Resources</h2>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-medium"><span>Heart Sutra</span><ArrowRight size={16} /></button>
                  <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-medium"><span>Meditation Guide</span><ArrowRight size={16} /></button>
                </div>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-[#FEF3C7] border border-[#FDE68A] relative overflow-hidden">
                <Sun className="absolute -right-4 -bottom-4 w-32 h-32 text-[#F59E0B]/20" />
                <p className="text-lg font-serif italic text-[#78350F] leading-relaxed relative z-10">"Knowing yourself is the beginning of all wisdom."</p>
              </div>
          </div>
        </section>

        {/* --- MODAL: SERVICE FORM --- */}
        <AnimatePresence>
            {isServiceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold font-serif text-[#451a03]">Service Details</h3><button onClick={() => setIsServiceModalOpen(false)}><X size={24}/></button></div>
                        <div className="space-y-4">
                            <input className="w-full p-3 border rounded-xl" placeholder="Name (English)" value={serviceForm.nameEn} onChange={e => setServiceForm({...serviceForm, nameEn: e.target.value})} />
                            <input className="w-full p-3 border rounded-xl" placeholder="Name (Mongolian)" value={serviceForm.nameMn} onChange={e => setServiceForm({...serviceForm, nameMn: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" className="p-3 border rounded-xl" placeholder="Price" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: Number(e.target.value)})} />
                                <input className="p-3 border rounded-xl" placeholder="Duration" value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setIsServiceModalOpen(false)} className="flex-1 py-3 border rounded-xl font-bold text-stone-500">Cancel</button>
                            <button onClick={saveService} className="flex-1 py-3 bg-[#D97706] text-white rounded-xl font-bold">{isSavingService ? <Loader2 className="animate-spin mx-auto" /> : "Save"}</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </main>
    </>
  );
}