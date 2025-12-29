"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowUp, 
  Mail, 
  Instagram, 
  Facebook, 
  Youtube, 
  MapPin, 
  Phone,
  Sun,
  Moon,
  Flower,
  Sparkles,
  Infinity as InfinityIcon
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";

export default function GoldenNirvanaFooter() {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const content = {
    newsletterTag: t({ mn: "Үйлийн үрийн холбоос", en: "Karmic Connection" }),
    newsletterTitle: isDark ? t({ mn: "Оддын хэлхээ", en: "Voices of the Cosmos" }) : t({ mn: "Өглөөний судар", en: "The Morning Sutras" }),
    newsletterDesc: t({ 
      mn: "Манай хамт олонд нэгдэж, эртний мэргэн ухаан, билэгт өдрүүд болон сүмийн мэдээг шууд хүлээн аваарай.", 
      en: "Join our sangha to receive ancient wisdom, auspicious dates, and temple news directly to your spirit." 
    }),
    emailPlaceholder: t({ mn: "Таны цахим хаяг...", en: "Your spiritual address..." }),
    btnJoin: isDark ? t({ mn: "Холбогдох", en: "Align Spirit" }) : t({ mn: "Нэгдэх", en: "Join Circle" }),
    monastery: isDark ? t({ mn: "Тэнгэрийн Зам", en: "Celestial Path" }) : t({ mn: "Хийд", en: "Monastery" }),
    aboutDesc: t({ 
      mn: "Орчин цагийн аялагчдад зориулсан Бурхан багшийн эртний сургаалыг хадгалан үлдэх оюун санааны ариун газар. Хамаг амьтан амгалан байх болтугай.", 
      en: "A sanctuary for the soul, preserving the ancient teachings of the Buddha for the modern wanderer. May all beings be happy." 
    }),
    location: t({ mn: "Улаанбаатар, Монгол", en: "Ulaanbaatar, Mongolia" }),
    peace: t({ mn: "Энх тайван", en: "Peace" }),
    gandantitle: t({ mn: "Гандан", en: "Nirvana" }),
  };

  const theme = isDark ? {
    bg: "bg-[#020205]",
    textMain: "text-indigo-50",
    textSub: "text-indigo-300",
    accent: "text-amber-400",
    border: "border-indigo-500/20",
    altarBg: "bg-indigo-950/40",
    altarBorder: "border-indigo-400/30",
    btn: "bg-indigo-600 text-white shadow-indigo-500/20",
    mandala: "text-indigo-500",
  } : {
    bg: "bg-[#FFFBEB]",
    textMain: "text-[#451a03]",
    textSub: "text-[#92400E]",
    accent: "text-[#F59E0B]",
    border: "border-amber-200",
    altarBg: "bg-white/80",
    altarBorder: "border-amber-200",
    btn: "bg-[#78350F] text-[#FDE68A]",
    mandala: "text-[#B45309]",
  };

  return (
    <footer className={`relative w-full transition-colors duration-1000 overflow-hidden pt-40 pb-12 font-sans ${theme.bg} ${theme.textMain}`}>
      
      {/* ================= ATMOSPHERE ================= */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Base Gradient */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${
           isDark ? "bg-gradient-to-b from-[#05051a] via-[#020205] to-black opacity-100" : "bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#F59E0B] opacity-100"
        }`} />
        
        {/* Spinning Giant Mandala */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[1200px] h-[1200px] opacity-[0.08] animate-[spin_240s_linear_infinite] origin-center">
           <svg viewBox="0 0 100 100" className={`w-full h-full ${theme.mandala}`}>
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.1" fill="none" />
              <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" fill="currentColor" opacity="0.3" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" fill="none" />
           </svg>
        </div>

        {/* Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
      </div>


      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        
        {/* --- NEWSLETTER ARCANA --- */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className={`relative max-w-5xl mx-auto mb-32 p-[1px] rounded-[4rem] transition-all duration-1000 ${
             isDark ? "bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-indigo-500/40 shadow-[0_0_80px_rgba(79,70,229,0.15)]" : "bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#FDE68A]"
           }`}
        >
           <div className={`${theme.altarBg} backdrop-blur-3xl rounded-[3.9rem] px-8 py-16 md:px-16 md:py-24 text-center border ${theme.altarBorder}`}>
              
              <div className={`inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full border transition-colors duration-1000 ${
                  isDark ? "bg-indigo-900/40 border-indigo-400/40 text-amber-300" : "bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]"
              }`}>
                 {isDark ? <Sparkles size={14} className="animate-pulse" /> : <Flower size={14} className="animate-spin-slow" />}
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">{content.newsletterTag}</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-serif font-black mb-8 tracking-tighter">
                 {content.newsletterTitle}
              </h2>
              
              <p className={`mb-12 max-w-xl mx-auto leading-relaxed text-lg font-medium transition-colors ${isDark ? 'text-indigo-200/70' : 'text-[#92400E]/80'}`}>
                 {content.newsletterDesc}
              </p>

              <form className="flex flex-col md:flex-row gap-5 max-w-xl mx-auto relative group">
                 <div className="relative flex-1">
                    <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-indigo-400' : 'text-[#D97706]'}`} size={22} />
                    <input 
                      type="email" 
                      placeholder={content.emailPlaceholder}
                      className={`w-full pl-14 pr-8 py-5 rounded-2xl outline-none transition-all duration-500 font-medium ${
                         isDark 
                         ? "bg-black/40 border-indigo-800 text-white placeholder-indigo-400/30 focus:border-indigo-400" 
                         : "bg-white border-[#FDE68A] text-[#451a03] placeholder-[#B45309]/40 focus:border-[#F59E0B]"
                      } border`}
                    />
                 </div>
                 <button className={`group relative overflow-hidden px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${theme.btn}`}>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                       {content.btnJoin} <ArrowUp size={18} className="rotate-45 group-hover:rotate-90 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                 </button>
              </form>
           </div>
           
           {/* Floating Totem */}
           <div className={`absolute -top-8 left-1/2 -translate-x-1/2 p-4 rounded-full border-4 shadow-2xl transition-all duration-1000 ${
               isDark ? "bg-[#05051a] border-indigo-500 text-amber-300" : "bg-[#FFFBEB] border-[#FDE68A] text-[#F59E0B]"
           }`}>
              {isDark ? <Moon size={36} fill="currentColor" /> : <Sun size={36} className="animate-spin-slow" />}
           </div>
        </motion.div>


        {/* --- LINKS GRID --- */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-16 border-t pt-20 ${isDark ? 'border-white/5' : 'border-[#F59E0B]/30'}`}>
           
           {/* BRANDING */}
           <div className="md:col-span-5 flex flex-col items-start gap-8">
              <Link href="/" className="flex items-center gap-4 group">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-1000 ${
                     isDark ? "bg-indigo-600 shadow-indigo-500/40" : "bg-gradient-to-br from-[#F59E0B] to-[#B45309]"
                 }`}>
                    <InfinityIcon size={28} />
                 </div>
                 <div className="flex flex-col">
                    <span className="font-serif font-black text-3xl leading-none tracking-tight">
                       {content.gandantitle}
                    </span>
                    <span className={`text-[11px] font-bold uppercase tracking-[0.4em] transition-colors ${isDark ? 'text-indigo-400' : 'text-[#92400E]'}`}>
                       {content.monastery}
                    </span>
                 </div>
              </Link>
              
              <p className={`text-lg leading-relaxed font-medium transition-colors opacity-80 ${isDark ? 'text-indigo-100' : 'text-[#78350F]'}`}>
                 {content.aboutDesc}
              </p>

              {/* Social Stars */}
              <div className="flex gap-6">
                 {[Facebook, Instagram, Youtube].map((Icon, i) => (
                    <a key={i} href="#" className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 hover:-translate-y-2 ${
                        isDark ? "border-indigo-500/30 text-indigo-300 hover:bg-indigo-500 hover:text-white" : "border-[#D97706]/30 text-[#78350F] hover:bg-[#F59E0B] hover:text-white"
                    }`}>
                       <Icon size={20} />
                    </a>
                 ))}
              </div>
           </div>

           {/* LINKS */}
           <div className="md:col-span-3">
              <h4 className="font-black text-[11px] uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                 <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-amber-500'}`} /> The Path
              </h4>
              <ul className="space-y-5">
                 {['Our Temple', 'Dharma Teachings', 'Meditation', 'Vajra Monks', 'Archive'].map((name) => (
                    <li key={name}>
                       <Link href="#" className="group flex items-center gap-3 opacity-60 hover:opacity-100 transition-all">
                          <span className={`h-[1px] w-0 group-hover:w-6 transition-all duration-500 ${isDark ? 'bg-indigo-400' : 'bg-amber-600'}`} />
                          <span className="font-medium">{name}</span>
                       </Link>
                    </li>
                 ))}
              </ul>
           </div>

           {/* CONTACT & SACRED SCRIPT */}
           <div className="md:col-span-4 flex justify-between">
              <div className="space-y-8">
                 <div className="flex items-start gap-4">
                    <MapPin className={`mt-1 transition-colors ${isDark ? 'text-indigo-400' : 'text-[#D97706]'}`} size={20} />
                    <span className="font-medium opacity-80 leading-relaxed">{content.location}</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <Phone className={`transition-colors ${isDark ? 'text-indigo-400' : 'text-[#D97706]'}`} size={20} />
                    <span className="font-medium opacity-80">+976 11 1234 5678</span>
                 </div>
              </div>

              {/* Vertical Calligraphy Element */}
              <div className="hidden lg:block opacity-20 hover:opacity-100 transition-opacity duration-1000">
                 <span style={{ writingMode: 'vertical-rl' }} className="text-6xl font-serif font-black tracking-widest uppercase">
                    {content.peace}
                 </span>
              </div>
           </div>
        </div>


        {/* --- BOTTOM BAR --- */}
        <div className={`mt-24 pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-8 ${isDark ? 'border-white/5' : 'border-[#78350F]/10'}`}>
           
           <p className="text-xs font-bold uppercase tracking-widest opacity-40">
              © {new Date().getFullYear()} {content.gandantitle} {content.monastery}. All Karma Reserved.
           </p>

           <div className="flex items-center gap-12">
              <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity">Privacy</Link>
              <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity">Terms</Link>
              
              {/* ASCENSION BUTTON */}
              <button 
                 onClick={scrollToTop}
                 className={`group relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-700 hover:-translate-y-3 ${
                    isDark ? "bg-indigo-600 shadow-[0_0_30px_rgba(79,70,229,0.5)]" : "bg-gradient-to-t from-[#B45309] to-[#F59E0B] shadow-xl"
                 } text-white`}
              >
                 {isDark ? <Moon size={24} className="group-hover:rotate-12 transition-transform" /> : <Sun size={24} className="group-hover:rotate-180 transition-transform duration-700" />}
                 
                 {/* Floating Aura */}
                 <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white" />
              </button>
           </div>
        </div>

      </div>
    </footer>
  );
}