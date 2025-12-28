"use client";

import React from "react";
import { motion } from "framer-motion";
import { useUser, UserButton } from "@clerk/nextjs";
import { 
  Sun, 
  Moon, 
  Calendar, 
  MessageSquare, 
  BookOpen, 
  Award, 
  Clock,
  ChevronRight,
  Sparkles,
  Flower,
  Heart,
  ArrowRight
} from "lucide-react";
import OverlayNavbar from "../components/Navbar";
import GoldenNirvanaFooter from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { t } = useLanguage();

  if (!isLoaded) return null;

  // content translations
  const content = {
    title: t({ mn: "Дотоод Амар Амгалан", en: "Inner Sanctuary" }),
    subtitle: t({ mn: "Таны оюун санааны аялал энд үргэлжилнэ.", en: "Your spiritual journey continues here." }),
    welcome: t({ mn: "Сайн байна уу,", en: "Welcome back," }),
    stats: {
      karma: t({ mn: "Үйлийн үр (Карма)", en: "Karma Points" }),
      meditation: t({ mn: "Бясалгасан өдрүүд", en: "Meditation Days" }),
      merits: t({ mn: "Хурсан буян", en: "Total Merits" }),
    },
    sections: {
      upcoming: t({ mn: "Удаах Уулзалтууд", en: "Upcoming Sessions" }),
      recent: t({ mn: "Сүүлийн Үйлдлүүд", en: "Recent Activities" }),
      resources: t({ mn: "Оюуны Тэжээл", en: "Spiritual Resources" }),
    },
    noSessions: t({ mn: "Одоогоор товлосон уулзалт байхгүй байна.", en: "No sessions scheduled at the moment." }),
    bookNow: t({ mn: "Цаг захиалах", en: "Book a Session" }),
    readSutras: t({ mn: "Судар унших", en: "Read Sutras" }),
    viewAll: t({ mn: "Бүгдийг харах", en: "View All" }),
  };

  // Dummy Data for visual richness
  const upcomingSessions = [
    { id: 1, monk: "Lama Dorje", time: "Tomorrow, 10:00 AM", type: "Astrology" },
  ];

  return (
    <>
      <OverlayNavbar />
      
      <main className="min-h-screen bg-[#FFFBEB] pt-32 pb-20 font-sans selection:bg-amber-200">
        
        {/* --- 1. HERO / HEADER --- */}
        <section className="container mx-auto px-6 mb-12">
          <div className="relative overflow-hidden bg-[#451a03] rounded-[3rem] p-8 md:p-16 text-[#FFFBEB] shadow-2xl">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-[100px] -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D97706]/10 rounded-full blur-[80px] -ml-20 -mb-20" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              {/* User Avatar via Clerk */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#F59E0B] to-[#D97706] rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative scale-[2.5] md:scale-[3.5] origin-center">
                   <UserButton afterSignOutUrl="/" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-[#FDE68A]/60 font-bold uppercase tracking-[0.3em] text-xs">
                    {content.welcome}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-serif font-bold mt-2">
                    {user?.firstName || "Seeker"}
                  </h1>
                  <p className="text-xl text-[#FDE68A]/80 font-light mt-4">
                    {content.subtitle}
                  </p>
                </motion.div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#F59E0B] text-[#451a03] px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[#D97706] hover:text-white transition-all flex items-center gap-3"
              >
                <Calendar size={20} />
                {content.bookNow}
              </motion.button>
            </div>
          </div>
        </section>


        {/* --- 2. STATS GRID --- */}
        <section className="container mx-auto px-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: content.stats.karma, value: "1,240", icon: <Sparkles className="text-amber-500" />, color: "bg-amber-50" },
              { label: content.stats.meditation, value: "14", icon: <Moon className="text-blue-500" />, color: "bg-blue-50" },
              { label: content.stats.merits, value: "89", icon: <Award className="text-rose-500" />, color: "bg-rose-50" },
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
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* --- 3. MAIN DASHBOARD CONTENT --- */}
        <section className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: UPCOMING & ACTIVITIES */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* UPCOMING SESSIONS */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-amber-900/5 border border-white">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-[#451a03] flex items-center gap-3">
                  <Clock className="text-[#D97706]" />
                  {content.sections.upcoming}
                </h2>
                <button className="text-sm font-bold text-[#D97706] hover:text-[#B45309] transition-colors">
                  {content.viewAll}
                </button>
              </div>

              <div className="space-y-4">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-6 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]/30 group hover:border-[#F59E0B] transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#D97706] shadow-sm">
                          <Flower size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#451a03]">{session.monk}</h4>
                          <p className="text-sm text-[#78350F]/60">{session.time} • {session.type}</p>
                        </div>
                      </div>
                      <ChevronRight className="text-[#D97706] group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))
                ) : (
                  <p className="text-[#78350F]/50 italic">{content.noSessions}</p>
                )}
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-amber-900/5 border border-white">
              <h2 className="text-2xl font-serif font-bold text-[#451a03] mb-8 flex items-center gap-3">
                <Heart className="text-rose-500" />
                {content.sections.recent}
              </h2>
              <div className="space-y-6">
                {[
                  { title: t({ mn: "Бясалгал дуусгасан", en: "Meditation Completed" }), time: "2 hours ago", points: "+50 Karma" },
                  { title: t({ mn: "Ном уншсан", en: "Sutra Read" }), time: "Yesterday", points: "+20 Karma" },
                ].map((act, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-stone-100 last:border-0">
                    <div>
                      <h4 className="font-medium text-[#451a03]">{act.title}</h4>
                      <p className="text-xs text-stone-400">{act.time}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      {act.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: RESOURCES & QUICK LINKS */}
          <div className="space-y-12">
            
            {/* SPIRITUAL RESOURCES */}
            <div className="bg-[#451a03] rounded-[2.5rem] p-8 text-[#FFFBEB] shadow-xl shadow-amber-900/20">
              <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                <BookOpen className="text-[#FDE68A]" />
                {content.sections.resources}
              </h2>
              <div className="space-y-4">
                {[
                  { name: t({ mn: "Зүрхэн судар", en: "Heart Sutra" }), color: "bg-white/10" },
                  { name: t({ mn: "Бясалгалын заавар", en: "Meditation Guide" }), color: "bg-white/10" },
                  { name: t({ mn: "Билгийн тоолол", en: "Lunar Calendar" }), color: "bg-[#F59E0B] text-[#451a03]" },
                ].map((res, i) => (
                  <button key={i} className={`w-full flex items-center justify-between p-5 rounded-2xl ${res.color} hover:scale-[1.02] transition-transform`}>
                    <span className="font-medium">{res.name}</span>
                    <ArrowRight size={16} />
                  </button>
                ))}
              </div>
            </div>

            {/* INSPIRATIONAL QUOTE */}
            <div className="p-8 rounded-[2.5rem] bg-[#FEF3C7] border border-[#FDE68A] relative overflow-hidden">
              <Sun className="absolute -right-4 -bottom-4 w-32 h-32 text-[#F59E0B]/20" />
              <p className="text-lg font-serif italic text-[#78350F] leading-relaxed relative z-10">
                "{t({ 
                  mn: "Өөрийгөө таних нь бүх мэргэн ухааны эхлэл юм.", 
                  en: "Knowing yourself is the beginning of all wisdom." 
                })}"
              </p>
            </div>

          </div>

        </section>

      </main>

      <GoldenNirvanaFooter />
    </>
  );
}
