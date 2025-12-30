"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Users, Calendar, LayoutDashboard, 
  Search, Trash2, CheckCircle, XCircle, MoreHorizontal,
  Loader2, UserCog, ScrollText, TrendingUp, Check, X,
  Briefcase, Plus, Save
} from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import { useTheme } from "next-themes";

// --- TYPES ---
interface AdminData {
  users: any[];
  bookings: any[];
  services: any[];
  stats: {
    totalUsers: number;
    totalMonks: number;
    totalBookings: number;
    revenue: number;
  };
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "bookings" | "services">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Modals State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Forms State
  const [serviceForm, setServiceForm] = useState({ titleEn: "", titleMn: "", price: 0, type: "ritual", duration: "30 min", descEn: "", descMn: "" });
  const [bookingForm, setBookingForm] = useState({ userEmail: "", userName: "", monkId: "", serviceId: "", date: "", time: "10:00", note: "Admin scheduled" });

  const isAdmin = user?.publicMetadata?.role === "admin";
  const isDark = resolvedTheme === "dark";

  // --- FETCH DATA ---
  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/data", { cache: "no-store" });
      if (res.ok) setData(await res.json());
      else router.push("/");
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (isLoaded) {
      if (!user || !isAdmin) { router.push("/"); return; }
      fetchAdminData();
    }
  }, [isLoaded, user, isAdmin, router]);

  // --- ACTIONS: USERS ---
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Delete this user?")) return;
    setProcessingId(userId);
    try {
      await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      await fetchAdminData(); // Refresh data
    } catch (e) { console.error(e); } finally { setProcessingId(null); }
  };

  // --- ACTIONS: BOOKINGS ---
  const handleBookingAction = async (bookingId: string, action: string) => {
    setProcessingId(bookingId);
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });
      await fetchAdminData();
    } catch (e) { console.error(e); } finally { setProcessingId(null); }
  };

  const handleCreateBooking = async () => {
    if (!bookingForm.userEmail || !bookingForm.monkId || !bookingForm.date) return alert("Missing fields");
    setProcessingId("create-booking");
    try {
      // Find selected service name for convenience
      const selectedService = data?.services.find(s => s._id === bookingForm.serviceId);
      const payload = {
        ...bookingForm,
        serviceName: selectedService ? selectedService.title : { en: "Custom Session", mn: "Custom Session" }
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsBookingModalOpen(false);
        setBookingForm({ userEmail: "", userName: "", monkId: "", serviceId: "", date: "", time: "10:00", note: "Admin scheduled" });
        await fetchAdminData();
        alert("Booking created successfully");
      } else {
        alert("Failed to create booking");
      }
    } catch (e) { console.error(e); } finally { setProcessingId(null); }
  };

  // --- ACTIONS: SERVICES ---
  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Delete service?")) return;
    setProcessingId(serviceId);
    try {
      await fetch(`/api/admin/services/${serviceId}`, { method: "DELETE" });
      await fetchAdminData();
    } catch (e) { console.error(e); } finally { setProcessingId(null); }
  };

  const handleCreateService = async () => {
    if (!serviceForm.titleEn || !serviceForm.price) return alert("Title and Price required");
    setProcessingId("create-service");
    try {
      const payload = {
        title: { en: serviceForm.titleEn, mn: serviceForm.titleMn },
        desc: { en: serviceForm.descEn, mn: serviceForm.descMn },
        price: Number(serviceForm.price),
        type: serviceForm.type,
        duration: serviceForm.duration
      };

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsServiceModalOpen(false);
        setServiceForm({ titleEn: "", titleMn: "", price: 0, type: "ritual", duration: "30 min", descEn: "", descMn: "" });
        await fetchAdminData();
      } else {
        alert("Failed to create service");
      }
    } catch (e) { console.error(e); } finally { setProcessingId(null); }
  };

  if (!isLoaded || loading) return <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]"><Loader2 className="animate-spin text-amber-600" size={48} /></div>;
  if (!isAdmin) return null;

  // --- FILTERS ---
  const filteredUsers = data?.users.filter(u => (u.name?.en?.toLowerCase() || "").includes(searchTerm.toLowerCase()));
  const filteredBookings = data?.bookings.filter(b => (b.clientName?.toLowerCase() || "").includes(searchTerm.toLowerCase()));
  const filteredServices = data?.services.filter(s => (s.title?.en?.toLowerCase() || "").includes(searchTerm.toLowerCase()));
  const monks = data?.users.filter(u => u.role === 'monk') || [];

  return (
    <div className={`min-h-screen font-sans ${isDark ? "bg-[#05051a] text-white" : "bg-[#FFFBEB] text-[#451a03]"}`}>
      <OverlayNavbar />
      <main className="container mx-auto px-6 pt-32 pb-20">
        
        {/* HEADER & TABS (Same as before) */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <ShieldAlert className="text-red-500" />
               <span className="text-xs font-black uppercase tracking-[0.3em] opacity-60">System Core</span>
            </div>
            <h1 className="text-4xl font-serif font-black">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4"><UserButton /></div>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
           <div className="flex gap-2 bg-black/5 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
              {[
                { id: "overview", icon: LayoutDashboard, label: "Overview" },
                { id: "users", icon: Users, label: "Users" },
                { id: "bookings", icon: Calendar, label: "Bookings" },
                { id: "services", icon: Briefcase, label: "Services" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id ? "bg-[#D97706] text-white shadow-lg" : "hover:bg-white/50 opacity-60 hover:opacity-100"
                  }`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
           </div>
           <div className="relative w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`pl-12 pr-4 py-3 rounded-xl w-full md:w-80 outline-none border transition-all ${isDark ? "bg-[#0C164F] border-cyan-900 focus:border-cyan-400" : "bg-white border-amber-200 focus:border-amber-500"}`} />
           </div>
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          
          {/* 1. OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <StatCard title="Total Users" value={data?.stats.totalUsers || 0} icon={Users} color="bg-blue-500" />
               <StatCard title="Active Monks" value={data?.stats.totalMonks || 0} icon={UserCog} color="bg-amber-500" />
               <StatCard title="Total Bookings" value={data?.stats.totalBookings || 0} icon={Calendar} color="bg-purple-500" />
               <StatCard title="Completed Sessions" value={data?.stats.revenue || 0} icon={TrendingUp} color="bg-green-500" />
            </motion.div>
          )}

          {/* 2. USERS */}
          {activeTab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`rounded-3xl overflow-hidden border ${isDark ? "bg-[#0C164F]/30 border-cyan-900" : "bg-white border-amber-100"}`}>
               <table className="w-full text-left border-collapse">
                  <thead className={isDark ? "bg-[#0C164F]" : "bg-amber-50"}>
                     <tr><th className="p-6 opacity-60">Name</th><th className="p-6 opacity-60">Role</th><th className="p-6 opacity-60">Status</th><th className="p-6 opacity-60 text-right">Action</th></tr>
                  </thead>
                  <tbody>
                     {filteredUsers?.map((u) => (
                        <tr key={u._id} className={`border-t ${isDark ? "border-cyan-900/30" : "border-amber-100"}`}>
                           <td className="p-6"><div className="flex items-center gap-3"><img src={u.image || `https://ui-avatars.com/api/?name=${u.name?.en}`} className="w-10 h-10 rounded-full" /><div><p className="font-bold">{u.name?.en}</p><p className="text-xs opacity-50">{u.email}</p></div></div></td>
                           <td className="p-6"><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${u.role === 'monk' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{u.role || "Client"}</span></td>
                           <td className="p-6"><span className="text-xs font-bold text-green-600">Active</span></td>
                           <td className="p-6 text-right"><button onClick={() => handleDeleteUser(u._id)} disabled={processingId === u._id} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg">{processingId === u._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}</button></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </motion.div>
          )}

          {/* 3. BOOKINGS (With Add Booking) */}
          {activeTab === "bookings" && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="flex justify-end mb-4">
                  <button onClick={() => setIsBookingModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#D97706] text-white rounded-lg text-sm font-bold uppercase hover:bg-[#B45309] shadow-lg">
                     <Plus size={16} /> New Booking
                  </button>
               </div>
               <div className={`rounded-3xl overflow-hidden border ${isDark ? "bg-[#0C164F]/30 border-cyan-900" : "bg-white border-amber-100"}`}>
                  <table className="w-full text-left border-collapse">
                     <thead className={isDark ? "bg-[#0C164F]" : "bg-amber-50"}>
                        <tr><th className="p-6 opacity-60">Client</th><th className="p-6 opacity-60">Service</th><th className="p-6 opacity-60">Time</th><th className="p-6 opacity-60">Status</th><th className="p-6 opacity-60 text-right">Actions</th></tr>
                     </thead>
                     <tbody>
                        {filteredBookings?.map((b) => (
                           <tr key={b._id} className={`border-t ${isDark ? "border-cyan-900/30" : "border-amber-100"}`}>
                              <td className="p-6 font-bold">{b.clientName}</td>
                              <td className="p-6 text-sm opacity-80">{typeof b.serviceName === 'object' ? b.serviceName.en : b.serviceName}</td>
                              <td className="p-6 text-sm">{b.date} {b.time}</td>
                              <td className="p-6"><StatusBadge status={b.status} /></td>
                              <td className="p-6 text-right">{b.status === 'pending' && <div className="flex justify-end gap-2"><button onClick={() => handleBookingAction(b._id, 'confirmed')} className="p-2 bg-green-100 text-green-600 rounded-lg"><Check size={16}/></button><button onClick={() => handleBookingAction(b._id, 'rejected')} className="p-2 bg-red-100 text-red-600 rounded-lg"><X size={16}/></button></div>}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
          )}

          {/* 4. SERVICES (With Add Service) */}
          {activeTab === "services" && (
            <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="flex justify-end mb-4">
                  <button onClick={() => setIsServiceModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#D97706] text-white rounded-lg text-sm font-bold uppercase hover:bg-[#B45309] shadow-lg">
                     <Plus size={16} /> New Service
                  </button>
               </div>
               <div className={`rounded-3xl overflow-hidden border ${isDark ? "bg-[#0C164F]/30 border-cyan-900" : "bg-white border-amber-100"}`}>
                  <table className="w-full text-left border-collapse">
                     <thead className={isDark ? "bg-[#0C164F]" : "bg-amber-50"}>
                        <tr><th className="p-6 opacity-60">Service Name</th><th className="p-6 opacity-60">Type</th><th className="p-6 opacity-60">Price</th><th className="p-6 opacity-60 text-right">Action</th></tr>
                     </thead>
                     <tbody>
                        {filteredServices?.map((s) => (
                           <tr key={s._id} className={`border-t ${isDark ? "border-cyan-900/30" : "border-amber-100"}`}>
                              <td className="p-6 font-bold">{s.title?.en}</td>
                              <td className="p-6 text-sm uppercase">{s.type}</td>
                              <td className="p-6 text-sm">{s.price?.toLocaleString()}₮</td>
                              <td className="p-6 text-right"><button onClick={() => handleDeleteService(s._id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={18} /></button></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* --- MODAL: CREATE SERVICE --- */}
        <AnimatePresence>
            {isServiceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-6 text-[#451a03]">New Global Service</h3>
                        <div className="space-y-4">
                            <input className="w-full p-3 border rounded-xl" placeholder="Title (English)" value={serviceForm.titleEn} onChange={(e) => setServiceForm({...serviceForm, titleEn: e.target.value})} />
                            <input className="w-full p-3 border rounded-xl" placeholder="Title (Mongolian)" value={serviceForm.titleMn} onChange={(e) => setServiceForm({...serviceForm, titleMn: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" className="p-3 border rounded-xl" placeholder="Price" value={serviceForm.price} onChange={(e) => setServiceForm({...serviceForm, price: Number(e.target.value)})} />
                                <select className="p-3 border rounded-xl" value={serviceForm.type} onChange={(e) => setServiceForm({...serviceForm, type: e.target.value})}>
                                    <option value="ritual">Ritual</option>
                                    <option value="divination">Divination</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsServiceModalOpen(false)} className="flex-1 py-3 border rounded-xl">Cancel</button>
                            <button onClick={handleCreateService} disabled={processingId === 'create-service'} className="flex-1 py-3 bg-[#D97706] text-white rounded-xl font-bold">{processingId === 'create-service' ? <Loader2 className="animate-spin mx-auto"/> : "Create"}</button>
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>

        {/* --- MODAL: CREATE BOOKING (SCHEDULE SERVICE) --- */}
        <AnimatePresence>
            {isBookingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-6 text-[#451a03]">Schedule Booking</h3>
                        <div className="space-y-4">
                            <input className="w-full p-3 border rounded-xl" placeholder="Client Name" value={bookingForm.userName} onChange={(e) => setBookingForm({...bookingForm, userName: e.target.value})} />
                            <input className="w-full p-3 border rounded-xl" placeholder="Client Email" value={bookingForm.userEmail} onChange={(e) => setBookingForm({...bookingForm, userEmail: e.target.value})} />
                            <select className="w-full p-3 border rounded-xl" value={bookingForm.monkId} onChange={(e) => setBookingForm({...bookingForm, monkId: e.target.value})}>
                                <option value="">Select Monk</option>
                                {monks.map((m: any) => <option key={m._id} value={m._id}>{m.name.en}</option>)}
                            </select>
                            <select className="w-full p-3 border rounded-xl" value={bookingForm.serviceId} onChange={(e) => setBookingForm({...bookingForm, serviceId: e.target.value})}>
                                <option value="">Select Service</option>
                                {data?.services.map((s: any) => <option key={s._id} value={s._id}>{s.title.en}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" className="p-3 border rounded-xl" value={bookingForm.date} onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})} />
                                <input type="time" className="p-3 border rounded-xl" value={bookingForm.time} onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsBookingModalOpen(false)} className="flex-1 py-3 border rounded-xl">Cancel</button>
                            <button onClick={handleCreateBooking} disabled={processingId === 'create-booking'} className="flex-1 py-3 bg-[#D97706] text-white rounded-xl font-bold">{processingId === 'create-booking' ? <Loader2 className="animate-spin mx-auto"/> : "Schedule"}</button>
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>

      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---
function StatCard({ title, value, icon: Icon, color }: any) {
    const { resolvedTheme } = useTheme(); const isDark = resolvedTheme === "dark";
    return (<div className={`p-6 rounded-3xl border flex items-center gap-4 ${isDark ? "bg-[#0C164F]/50 border-cyan-900" : "bg-white border-amber-100"}`}><div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}><Icon size={24} /></div><div><p className="text-xs font-bold uppercase tracking-widest opacity-60">{title}</p><p className="text-3xl font-serif font-black">{value}</p></div></div>)
}
function StatusBadge({ status }: { status: string }) {
    const styles: any = { pending: "bg-amber-100 text-amber-700", confirmed: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700", completed: "bg-blue-100 text-blue-700" };
    return <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${styles[status] || "bg-gray-100"}`}>{status}</span>
}