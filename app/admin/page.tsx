"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Users, Calendar, LayoutDashboard, 
  Search, Trash2, CheckCircle, XCircle, MoreHorizontal,
  Loader2, UserCog, ScrollText, TrendingUp, Check, X,
  Briefcase // Added icon for Services tab
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
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "bookings" | "services">("overview"); // Added services
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const isAdmin = user?.publicMetadata?.role === "admin";
  const isDark = resolvedTheme === "dark";

  // --- FETCH DATA ---
  useEffect(() => {
    if (!isLoaded) return;
    if (!user || !isAdmin) { router.push("/"); return; }

    async function fetchAdminData() {
      try {
        const res = await fetch("/api/admin/data", { cache: "no-store" });
        if (res.ok) { setData(await res.json()); }
        else { router.push("/"); }
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    }
    fetchAdminData();
  }, [isLoaded, user, isAdmin, router]);

  // --- ACTIONS ---
  
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure?")) return;
    setProcessingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) setData((prev) => prev ? ({...prev, users: prev.users.filter(u => u._id !== userId)}) : null);
    } catch (e) { console.error(e); } finally { setProcessingId(null); }
  };

  const handleBookingAction = async (bookingId: string, action: 'confirmed' | 'rejected') => {
    setProcessingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });
      if (res.ok) {
        setData((prev) => prev ? ({...prev, bookings: prev.bookings.map(b => b._id === bookingId ? { ...b, status: action } : b)}) : null);
      }
    } catch (e) { console.error(e); } finally { setProcessingId(null); }
  };

  // NEW: Delete Service
  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Delete this global service?")) return;
    setProcessingId(serviceId);
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => prev ? ({...prev, services: prev.services.filter(s => s._id !== serviceId)}) : null);
      } else {
        alert("Failed to delete service");
      }
    } catch (e) { console.error(e); alert("Error deleting service"); } 
    finally { setProcessingId(null); }
  };

  if (!isLoaded || loading) return <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]"><Loader2 className="animate-spin text-amber-600" size={48} /></div>;
  if (!isAdmin) return null;

  // --- FILTERS ---
  const filteredUsers = data?.users.filter(u => (u.name?.en?.toLowerCase() || "").includes(searchTerm.toLowerCase()));
  const filteredBookings = data?.bookings.filter(b => (b.clientName?.toLowerCase() || "").includes(searchTerm.toLowerCase()));
  const filteredServices = data?.services.filter(s => (s.title?.en?.toLowerCase() || "").includes(searchTerm.toLowerCase()));

  return (
    <div className={`min-h-screen font-sans ${isDark ? "bg-[#05051a] text-white" : "bg-[#FFFBEB] text-[#451a03]"}`}>
      <OverlayNavbar />
      
      <main className="container mx-auto px-6 pt-32 pb-20">
        
        {/* HEADER */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <ShieldAlert className="text-red-500" />
               <span className="text-xs font-black uppercase tracking-[0.3em] opacity-60">System Core</span>
            </div>
            <h1 className="text-4xl font-serif font-black">Admin Dashboard</h1>
            <p className="opacity-60 mt-2">Welcome back, Root Administrator.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-xs font-bold uppercase">{user?.fullName}</p>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">ADMIN ACCESS</span>
             </div>
             <div className="scale-125"><UserButton /></div>
          </div>
        </header>

        {/* TABS */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
           <div className="flex gap-2 bg-black/5 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
              {[
                { id: "overview", icon: LayoutDashboard, label: "Overview" },
                { id: "users", icon: Users, label: "Users" },
                { id: "bookings", icon: Calendar, label: "Bookings" },
                { id: "services", icon: Briefcase, label: "Services" }, // Added Tab
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
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <StatCard title="Total Users" value={data?.stats.totalUsers || 0} icon={Users} color="bg-blue-500" />
               <StatCard title="Active Monks" value={data?.stats.totalMonks || 0} icon={UserCog} color="bg-amber-500" />
               <StatCard title="Total Bookings" value={data?.stats.totalBookings || 0} icon={Calendar} color="bg-purple-500" />
               <StatCard title="Completed Sessions" value={data?.stats.revenue || 0} icon={TrendingUp} color="bg-green-500" />
            </motion.div>
          )}

          {/* 2. USERS TAB */}
          {activeTab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`rounded-3xl overflow-hidden border ${isDark ? "bg-[#0C164F]/30 border-cyan-900" : "bg-white border-amber-100"}`}>
               <table className="w-full text-left border-collapse">
                  <thead className={isDark ? "bg-[#0C164F]" : "bg-amber-50"}>
                     <tr><th className="p-6 opacity-60">Name</th><th className="p-6 opacity-60">Role</th><th className="p-6 opacity-60">Status</th><th className="p-6 opacity-60 text-right">Action</th></tr>
                  </thead>
                  <tbody>
                     {filteredUsers?.map((u) => (
                        <tr key={u._id} className={`border-t ${isDark ? "border-cyan-900/30" : "border-amber-100"}`}>
                           <td className="p-6"><div className="flex items-center gap-3"><img src={u.image || "https://ui-avatars.com/api/?name=" + u.name?.en} className="w-10 h-10 rounded-full object-cover" /><div><p className="font-bold">{u.name?.en}</p><p className="text-xs opacity-50">{u.email}</p></div></div></td>
                           <td className="p-6"><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${u.role === 'monk' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{u.role || "Client"}</span></td>
                           <td className="p-6"><span className="flex items-center gap-2 text-xs font-bold text-green-600"><div className="w-2 h-2 bg-green-500 rounded-full" /> Active</span></td>
                           <td className="p-6 text-right"><button onClick={() => handleDeleteUser(u._id)} disabled={processingId === u._id} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg">{processingId === u._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}</button></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </motion.div>
          )}

          {/* 3. BOOKINGS TAB */}
          {activeTab === "bookings" && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`rounded-3xl overflow-hidden border ${isDark ? "bg-[#0C164F]/30 border-cyan-900" : "bg-white border-amber-100"}`}>
               <table className="w-full text-left border-collapse">
                  <thead className={isDark ? "bg-[#0C164F]" : "bg-amber-50"}>
                     <tr><th className="p-6 opacity-60">Client</th><th className="p-6 opacity-60">Service</th><th className="p-6 opacity-60">Time</th><th className="p-6 opacity-60">Status</th><th className="p-6 opacity-60 text-right">Actions</th></tr>
                  </thead>
                  <tbody>
                     {filteredBookings?.map((b) => (
                        <tr key={b._id} className={`border-t ${isDark ? "border-cyan-900/30" : "border-amber-100"}`}>
                           <td className="p-6 font-bold">{b.clientName}</td>
                           <td className="p-6 text-sm opacity-80">{typeof b.serviceName === 'object' ? b.serviceName.en : b.serviceName}</td>
                           <td className="p-6 text-sm">{b.date} <span className="opacity-50 text-xs">{b.time}</span></td>
                           <td className="p-6"><StatusBadge status={b.status} /></td>
                           <td className="p-6 text-right">
                              {b.status === 'pending' ? (
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => handleBookingAction(b._id, 'confirmed')} disabled={processingId === b._id} className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg">{processingId === b._id ? <Loader2 size={16} className="animate-spin"/> : <Check size={16}/>}</button>
                                    <button onClick={() => handleBookingAction(b._id, 'rejected')} disabled={processingId === b._id} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg"><X size={16}/></button>
                                </div>
                              ) : <span className="text-xs opacity-40">Resolved</span>}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </motion.div>
          )}

          {/* 4. SERVICES TAB (NEW) */}
          {activeTab === "services" && (
            <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`rounded-3xl overflow-hidden border ${isDark ? "bg-[#0C164F]/30 border-cyan-900" : "bg-white border-amber-100"}`}>
               <table className="w-full text-left border-collapse">
                  <thead className={isDark ? "bg-[#0C164F]" : "bg-amber-50"}>
                     <tr><th className="p-6 opacity-60">Service Name</th><th className="p-6 opacity-60">Type</th><th className="p-6 opacity-60">Price</th><th className="p-6 opacity-60 text-right">Action</th></tr>
                  </thead>
                  <tbody>
                     {filteredServices?.map((s) => (
                        <tr key={s._id} className={`border-t ${isDark ? "border-cyan-900/30" : "border-amber-100"}`}>
                           <td className="p-6 font-bold">{s.title?.en}</td>
                           <td className="p-6 text-sm opacity-80 uppercase">{s.type}</td>
                           <td className="p-6 text-sm font-mono">{s.price?.toLocaleString()}₮</td>
                           <td className="p-6 text-right">
                              <button onClick={() => handleDeleteService(s._id)} disabled={processingId === s._id} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg">
                                 {processingId === s._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS (Unchanged) ---
function StatCard({ title, value, icon: Icon, color }: any) {
    const { resolvedTheme } = useTheme(); const isDark = resolvedTheme === "dark";
    return (<div className={`p-6 rounded-3xl border flex items-center gap-4 ${isDark ? "bg-[#0C164F]/50 border-cyan-900" : "bg-white border-amber-100"}`}><div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}><Icon size={24} /></div><div><p className="text-xs font-bold uppercase tracking-widest opacity-60">{title}</p><p className="text-3xl font-serif font-black">{value}</p></div></div>)
}
function StatusBadge({ status }: { status: string }) {
    const styles: any = { pending: "bg-amber-100 text-amber-700", confirmed: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700", completed: "bg-blue-100 text-blue-700" };
    return <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${styles[status] || "bg-gray-100"}`}>{status}</span>
}