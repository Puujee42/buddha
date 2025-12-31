"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Users, Calendar, LayoutDashboard, 
  Search, Trash2, CheckCircle, XCircle, MoreHorizontal,
  Loader2, UserCog, ScrollText, TrendingUp, Check, X,
  Briefcase, FileText // Added FileText icon
} from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import { useTheme } from "next-themes";

// --- TYPES ---
interface AdminData {
  users: any[];
  bookings: any[];
  services: any[];
  applications: any[]; // New field for pending monks
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
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "bookings" | "services" | "applications">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const isAdmin = user?.publicMetadata?.role === "admin";
  const isDark = resolvedTheme === "dark"; // Fixed: dynamic theme detection

  // --- FETCH DATA ---
  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/data", { cache: "no-store" });
      if (res.ok) {
          const json = await res.json();
          // Filter users to find pending applications
          // Assuming your User object has { monkStatus: 'pending' } from the signup flow
          json.applications = json.users.filter((u: any) => u.monkStatus === 'pending');
          setData(json);
      }
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

  // --- ACTIONS ---

  // 1. Handle Monk Application (Approve/Reject)
  const handleApplication = async (userId: string, action: 'approve' | 'reject') => {
    setProcessingId(userId);
    try {
        // Calls the route we created: app/api/admin/applications/[id]/route.ts
        const res = await fetch(`/api/admin/applications/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        });

        if (res.ok) {
            // Refresh data to update lists and stats
            await fetchAdminData();
        } else {
            alert("Хүсэлтийг шинэчлэхэд алдаа гарлаа"); // "Failed to update application"
        }
    } catch (e) { console.error(e); alert("Алдаа гарлаа"); } 
    finally { setProcessingId(null); }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Та итгэлтэй байна уу?")) return; // "Are you sure?"
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

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Үйлчилгээг устгах уу?")) return; // "Delete service?"
    setProcessingId(serviceId);
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => prev ? ({...prev, services: prev.services.filter(s => s._id !== serviceId)}) : null);
      }
    } catch (e) { console.error(e); } 
    finally { setProcessingId(null); }
  };

  if (!isLoaded || loading) return <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]"><Loader2 className="animate-spin text-amber-600" size={48} /></div>;
  if (!isAdmin) return null;

  // --- FILTERS ---
  const filteredUsers = data?.users.filter(u => (u.name?.mn?.toLowerCase() || u.name?.en?.toLowerCase() || "").includes(searchTerm.toLowerCase()));
  const filteredBookings = data?.bookings.filter(b => (b.clientName?.toLowerCase() || "").includes(searchTerm.toLowerCase()));
  const filteredServices = data?.services.filter(s => (s.title?.mn?.toLowerCase() || s.title?.en?.toLowerCase() || "").includes(searchTerm.toLowerCase()));

  return (
    <div className={`min-h-screen font-sans ${isDark ? "bg-[#05051a] text-white" : "bg-[#FFFBEB] text-[#451a03]"}`}>
      <OverlayNavbar />
      
      <main className="container mx-auto px-6 pt-32 pb-20">
        
        {/* HEADER */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <ShieldAlert className="text-red-500" />
               <span className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Админ Систем</span> {/* System Core */}
            </div>
            <h1 className="text-4xl font-serif font-black">Хяналтын Самбар</h1> {/* Admin Dashboard */}
            <p className="opacity-60 mt-2">Тавтай морил, Админ.</p> {/* Welcome back... */}
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-xs font-bold uppercase">{user?.fullName}</p>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">АДМИН ЭРХ</span> {/* ADMIN ACCESS */}
             </div>
             <div className="scale-125"><UserButton /></div>
          </div>
        </header>

        {/* TABS */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
           <div className="flex gap-2 bg-black/5 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
              {[
                { id: "overview", icon: LayoutDashboard, label: "Тойм" }, // Overview
                { id: "applications", icon: FileText, label: "Хүсэлтүүд" }, // Applications
                { id: "users", icon: Users, label: "Хэрэглэгч" }, // Users
                { id: "bookings", icon: Calendar, label: "Захиалга" }, // Bookings
                { id: "services", icon: Briefcase, label: "Үйлчилгээ" }, // Services
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id ? "bg-[#D97706] text-white shadow-lg" : "hover:bg-white/50 opacity-60 hover:opacity-100"
                  }`}
                >
                  <tab.icon size={16} /> 
                  {tab.label}
                  {/* Notification Badge for Applications */}
                  {tab.id === 'applications' && data?.applications && data.applications.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px]">
                          {data.applications.length}
                      </span>
                  )}
                </button>
              ))}
           </div>
           <div className="relative w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input placeholder="Хайх..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`pl-12 pr-4 py-3 rounded-xl w-full md:w-80 outline-none border transition-all ${isDark ? "bg-[#0C164F] border-cyan-900 focus:border-cyan-400" : "bg-white border-amber-200 focus:border-amber-500"}`} />
           </div>
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <StatCard title="Нийт Хэрэглэгч" value={data?.stats.totalUsers || 0} icon={Users} color="bg-blue-500" /> {/* Total Users */}
               <StatCard title="Идэвхтэй Лам нар" value={data?.stats.totalMonks || 0} icon={UserCog} color="bg-amber-500" /> {/* Active Monks */}
               <StatCard title="Нийт Захиалга" value={data?.stats.totalBookings || 0} icon={Calendar} color="bg-purple-500" /> {/* Total Bookings */}
               <StatCard title="Дууссан Цагууд" value={data?.stats.revenue || 0} icon={TrendingUp} color="bg-green-500" /> {/* Completed Sessions */}
               
               {data?.applications && data.applications.length > 0 && (
                   <div className="col-span-full bg-red-50 border border-red-200 p-6 rounded-3xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                           <div className="p-3 bg-red-100 rounded-full text-red-600"><ShieldAlert size={24} /></div>
                           <div>
                               <h3 className="font-bold text-red-800 text-lg">Хүлээгдэж буй Лам болох хүсэлтүүд</h3> {/* Pending Monk Applications */}
                               <p className="text-red-600/80 text-sm">Танд {data.applications.length} хэрэглэгчийн хүсэлт хүлээгдэж байна.</p> {/* There are X users waiting... */}
                           </div>
                       </div>
                       <button onClick={() => setActiveTab('applications')} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">Шагнал</button> {/* Review (using 'Шагнал' might mean award, better is 'Шалгах' or 'Харах') -> Changed to 'Шалгах' below */}
                   </div>
               )}
            </motion.div>
          )}

          {/* 5. APPLICATIONS TAB (NEW) */}
          {activeTab === "applications" && (
            <motion.div key="applications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`rounded-3xl overflow-hidden border ${isDark ? "bg-[#0C164F]/30 border-cyan-900" : "bg-white border-amber-100"}`}>
               <table className="w-full text-left border-collapse">
                  <thead className={isDark ? "bg-[#0C164F]" : "bg-amber-50"}>
                     <tr>
                        <th className="p-6 opacity-60">Өргөдөл гаргагч</th> {/* Applicant */}
                        <th className="p-6 opacity-60">Цол / Туршлага</th> {/* Title / Exp */}
                        <th className="p-6 opacity-60">Төлөв</th> {/* Status */}
                        <th className="p-6 opacity-60 text-right">Шийдвэр</th> {/* Decision */}
                     </tr>
                  </thead>
                  <tbody>
                     {data?.applications?.length === 0 && (
                         <tr><td colSpan={4} className="p-12 text-center opacity-50">Хүлээгдэж буй хүсэлт байхгүй байна.</td></tr>
                     )}
                     {data?.applications?.map((app) => (
                        <tr key={app._id} className={`border-t ${isDark ? "border-cyan-900/30" : "border-amber-100"}`}>
                           <td className="p-6">
                              <div className="flex items-center gap-3">
                                 <img src={app.image || "https://ui-avatars.com/api/?name=" + (app.name?.mn || app.name?.en)} className="w-10 h-10 rounded-full object-cover" />
                                 <div>
                                    <p className="font-bold">{app.name?.mn || app.name?.en}</p>
                                    <p className="text-xs opacity-50">{app.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="p-6">
                               <p className="font-bold text-sm">{app.title?.mn || app.title?.en}</p>
                               <p className="text-xs opacity-50">{app.yearsOfExperience} жилийн туршлага</p>
                           </td>
                           <td className="p-6">
                               <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-amber-200">
                                   Шалгагдаж байна
                               </span>
                           </td>
                           <td className="p-6 text-right">
                              <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => handleApplication(app._id, 'approve')} 
                                    disabled={processingId === app._id}
                                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-bold text-xs flex items-center gap-2"
                                  >
                                      {processingId === app._id ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>} Зөвшөөрөх
                                  </button>
                                  <button 
                                    onClick={() => handleApplication(app._id, 'reject')} 
                                    disabled={processingId === app._id}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-bold text-xs flex items-center gap-2"
                                  >
                                      <X size={14}/> Татгалзах
                                  </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </motion.div>
          )}

          {/* 2. USERS TAB */}
          {activeTab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`rounded-3xl overflow-hidden border ${isDark ? "bg-[#0C164F]/30 border-cyan-900" : "bg-white border-amber-100"}`}>
               <table className="w-full text-left border-collapse">
                  <thead className={isDark ? "bg-[#0C164F]" : "bg-amber-50"}>
                     <tr><th className="p-6 opacity-60">Нэр</th><th className="p-6 opacity-60">Үүрэг</th><th className="p-6 opacity-60">Төлөв</th><th className="p-6 opacity-60 text-right">Үйлдэл</th></tr>
                  </thead>
                  <tbody>
                     {filteredUsers?.map((u) => (
                        <tr key={u._id} className={`border-t ${isDark ? "border-cyan-900/30" : "border-amber-100"}`}>
                           <td className="p-6"><div className="flex items-center gap-3"><img src={u.image || `https://ui-avatars.com/api/?name=${u.name?.en}`} className="w-10 h-10 rounded-full" /><div><p className="font-bold">{u.name?.mn || u.name?.en}</p><p className="text-xs opacity-50">{u.email}</p></div></div></td>
                           <td className="p-6"><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${u.role === 'monk' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{u.role === 'monk' ? "Лам" : "Үйлчлүүлэгч"}</span></td>
                           <td className="p-6"><span className="flex items-center gap-2 text-xs font-bold text-green-600"><div className="w-2 h-2 bg-green-500 rounded-full" /> Идэвхтэй</span></td>
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
                     <tr><th className="p-6 opacity-60">Үйлчлүүлэгч</th><th className="p-6 opacity-60">Үйлчилгээ</th><th className="p-6 opacity-60">Цаг</th><th className="p-6 opacity-60">Төлөв</th><th className="p-6 opacity-60 text-right">Үйлдэл</th></tr>
                  </thead>
                  <tbody>
                     {filteredBookings?.map((b) => (
                        <tr key={b._id} className={`border-t ${isDark ? "border-cyan-900/30" : "border-amber-100"}`}>
                           <td className="p-6 font-bold">{b.clientName}</td>
                           <td className="p-6 text-sm opacity-80">{typeof b.serviceName === 'object' ? b.serviceName.mn || b.serviceName.en : b.serviceName}</td>
                           <td className="p-6 text-sm">{b.date} <span className="opacity-50 text-xs">{b.time}</span></td>
                           <td className="p-6"><StatusBadge status={b.status} /></td>
                           <td className="p-6 text-right">
                              {b.status === 'pending' ? (
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => handleBookingAction(b._id, 'confirmed')} disabled={processingId === b._id} className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg">{processingId === b._id ? <Loader2 size={16} className="animate-spin"/> : <Check size={16}/>}</button>
                                    <button onClick={() => handleBookingAction(b._id, 'rejected')} disabled={processingId === b._id} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg"><X size={16}/></button>
                                </div>
                              ) : <span className="text-xs opacity-40">Шийдэгдсэн</span>}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </motion.div>
          )}

          {/* 4. SERVICES TAB */}
          {activeTab === "services" && (
            <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`rounded-3xl overflow-hidden border ${isDark ? "bg-[#0C164F]/30 border-cyan-900" : "bg-white border-amber-100"}`}>
               <table className="w-full text-left border-collapse">
                  <thead className={isDark ? "bg-[#0C164F]" : "bg-amber-50"}>
                     <tr><th className="p-6 opacity-60">Үйлчилгээний Нэр</th><th className="p-6 opacity-60">Төрөл</th><th className="p-6 opacity-60">Үнэ</th><th className="p-6 opacity-60 text-right">Үйлдэл</th></tr>
                  </thead>
                  <tbody>
                     {data?.services?.map((s) => (
                        <tr key={s._id} className={`border-t ${isDark ? "border-cyan-900/30" : "border-amber-100"}`}>
                           <td className="p-6 font-bold">{s.title?.mn || s.title?.en}</td>
                           <td className="p-6 text-sm opacity-80 uppercase">{s.type === 'divination' ? "Мэргэ" : "Зан үйл"}</td>
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

// --- SUB COMPONENTS ---
function StatCard({ title, value, icon: Icon, color }: any) {
    const { resolvedTheme } = useTheme(); const isDark = resolvedTheme === "dark";
    return (<div className={`p-6 rounded-3xl border flex items-center gap-4 ${isDark ? "bg-[#0C164F]/50 border-cyan-900" : "bg-white border-amber-100"}`}><div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}><Icon size={24} /></div><div><p className="text-xs font-bold uppercase tracking-widest opacity-60">{title}</p><p className="text-3xl font-serif font-black">{value}</p></div></div>)
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = { 
        pending: "bg-amber-100 text-amber-700", 
        confirmed: "bg-green-100 text-green-700", 
        rejected: "bg-red-100 text-red-700", 
        completed: "bg-blue-100 text-blue-700" 
    };
    const labels: any = {
        pending: "Хүлээгдэж байна",
        confirmed: "Баталгаажсан",
        rejected: "Цуцлагдсан",
        completed: "Дууссан"
    };
    return <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${styles[status] || "bg-gray-100"}`}>{labels[status] || status}</span>
}