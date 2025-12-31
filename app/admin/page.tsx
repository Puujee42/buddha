"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Users, Calendar, LayoutDashboard, 
  Search, Trash2, CheckCircle, XCircle, MoreHorizontal,
  Loader2, UserCog, ScrollText, TrendingUp, Check, X,
  Briefcase, Plus, FileText // Added FileText icon
} from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import { useTheme } from "next-themes";

// --- TYPES ---
interface AdminData {
  users: any[];
  bookings: any[];
  services: any[];
  applications: any[]; // New field
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
  const isDark = resolvedTheme === "dark";

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/data", { cache: "no-store" });
      if (res.ok) {
          const json = await res.json();
          // Filter users with monkStatus = pending for the application list
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
  const handleApplication = async (userId: string, action: 'approve' | 'reject') => {
    setProcessingId(userId);
    try {
        await fetch(`/api/admin/applications/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        });
        await fetchAdminData(); // Refresh data
    } catch (e) { console.error(e); } 
    finally { setProcessingId(null); }
  };

  // ... (Keep existing Delete/Booking actions) ...
  const handleDeleteUser = async (userId: string) => { /* ... */ };
  const handleBookingAction = async (bookingId: string, action: string) => { /* ... */ };
  const handleDeleteService = async (serviceId: string) => { /* ... */ };

  if (!isLoaded || loading) return <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]"><Loader2 className="animate-spin text-amber-600" size={48} /></div>;
  if (!isAdmin) return null;

  return (
    <div className={`min-h-screen font-sans ${isDark ? "bg-[#05051a] text-white" : "bg-[#FFFBEB] text-[#451a03]"}`}>
      <OverlayNavbar />
      
      <main className="container mx-auto px-6 pt-32 pb-20">
        
        {/* HEADER (Same as before) */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl font-serif font-black">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4"><UserButton /></div>
        </header>

        {/* TABS */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
           <div className="flex gap-2 bg-black/5 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
              {[
                { id: "overview", icon: LayoutDashboard, label: "Overview" },
                { id: "applications", icon: FileText, label: "Applications" }, // NEW TAB
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
                  {tab.id === 'applications' && data?.applications?.length ? (
                      <span className="ml-1 bg-red-500 text-white text-[10px] px-2 rounded-full">{data.applications.length}</span>
                  ) : null}
                </button>
              ))}
           </div>
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          
          {/* ... (Overview, Users, Bookings, Services Tabs remain mostly same) ... */}
          {activeTab === "overview" && (/* ... */ <div/>)}
          {activeTab === "users" && (/* ... */ <div/>)}
          {activeTab === "bookings" && (/* ... */ <div/>)}
          {activeTab === "services" && (/* ... */ <div/>)}

          {/* 5. APPLICATIONS TAB (NEW) */}
          {activeTab === "applications" && (
            <motion.div key="applications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`rounded-3xl overflow-hidden border ${isDark ? "bg-[#0C164F]/30 border-cyan-900" : "bg-white border-amber-100"}`}>
               <table className="w-full text-left border-collapse">
                  <thead className={isDark ? "bg-[#0C164F]" : "bg-amber-50"}>
                     <tr><th className="p-6 opacity-60">Applicant</th><th className="p-6 opacity-60">Title</th><th className="p-6 opacity-60">Exp</th><th className="p-6 opacity-60 text-right">Actions</th></tr>
                  </thead>
                  <tbody>
                     {data?.applications?.length === 0 && (
                         <tr><td colSpan={4} className="p-12 text-center opacity-50">No pending applications</td></tr>
                     )}
                     {data?.applications?.map((app) => (
                        <tr key={app._id} className={`border-t ${isDark ? "border-cyan-900/30" : "border-amber-100"}`}>
                           <td className="p-6">
                              <div className="flex items-center gap-3">
                                 <img src={app.image || "https://ui-avatars.com/api/?name=" + app.name?.en} className="w-10 h-10 rounded-full object-cover" />
                                 <div>
                                    <p className="font-bold">{app.name?.en}</p>
                                    <p className="text-xs opacity-50">{app.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="p-6 text-sm">{app.title?.en}</td>
                           <td className="p-6 text-sm">{app.yearsOfExperience} years</td>
                           <td className="p-6 text-right">
                              <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => handleApplication(app._id, 'approve')} 
                                    disabled={processingId === app._id}
                                    className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg flex items-center gap-2"
                                  >
                                      {processingId === app._id ? <Loader2 size={16} className="animate-spin"/> : <Check size={16}/>} Approve
                                  </button>
                                  <button 
                                    onClick={() => handleApplication(app._id, 'reject')} 
                                    disabled={processingId === app._id}
                                    className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg"
                                  >
                                      <X size={16}/>
                                  </button>
                              </div>
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