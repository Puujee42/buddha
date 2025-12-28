"use client";

import React from "react";
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
  Flower,
  Infinity as InfinityIcon
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function GoldenNirvanaFooter() {
  const { t } = useLanguage();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const content = {
    newsletterTag: t({ mn: "Үйлийн үрийн холбоос", en: "Karmic Connection" }),
    newsletterTitle: t({ mn: "Өглөөний судар хүлээн авах", en: "Receive the Morning Sutras" }),
    newsletterDesc: t({ 
      mn: "Манай хамт олонд нэгдэж, эртний мэргэн ухаан, билэгт өдрүүд болон сүмийн мэдээг шууд хүлээн аваарай.", 
      en: "Join our sangha to receive ancient wisdom, auspicious dates, and temple news directly to your spirit." 
    }),
    emailPlaceholder: t({ mn: "Таны цахим хаяг...", en: "Your spiritual address..." }),
    btnJoin: t({ mn: "Нэгдэх", en: "Join Circle" }),
    monastery: t({ mn: "Хийд", en: "Monastery" }),
    aboutDesc: t({ 
      mn: "Орчин цагийн аялагчдад зориулсан Бурхан багшийн эртний сургаалыг хадгалан үлдэх оюун санааны ариун газар. Хамаг амьтан амгалан байх болтугай.", 
      en: "A sanctuary for the soul, preserving the ancient teachings of the Buddha for the modern wanderer. May all beings be happy." 
    }),
    pathTitle: t({ mn: "Замнал", en: "The Path" }),
    pathLinks: [
      { name: t({ mn: "Сүмийн тухай", en: "About the Temple" }), href: "/about" },
      { name: t({ mn: "Номын сургаал", en: "Dharma Teachings" }), href: "#" },
      { name: t({ mn: "Бясалгал", en: "Meditation" }), href: "#" },
      { name: t({ mn: "Лам хуврагууд", en: "Our Monks" }), href: "/monks" },
      { name: t({ mn: "Түүх", en: "History" }), href: "#" },
    ],
    sanctuaryTitle: t({ mn: "Ариун газар", en: "Sanctuary" }),
    sanctuaryLinks: [
      { name: t({ mn: "Цаг захиалах", en: "Book a Session" }), href: "/booking" },
      { name: t({ mn: "Хандив", en: "Donate" }), href: "#" },
      { name: t({ mn: "Сайн дурын ажил", en: "Volunteer" }), href: "#" },
      { name: t({ mn: "Мөргөлийн хөтөч", en: "Pilgrimage Guide" }), href: "#" },
      { name: t({ mn: "Билгийн тоолол", en: "Lunar Calendar" }), href: "#" },
    ],
    location: t({ mn: "Улаанбаатар, Монгол", en: "Ulaanbaatar, Mongolia" }),
    peace: t({ mn: "Энх тайван", en: "Peace" }),
    privacy: t({ mn: "Нууцлал", en: "Privacy" }),
    terms: t({ mn: "Нөхцөл", en: "Terms" }),
    ascend: t({ mn: "Дээшлэх", en: "Ascend" }),
    allRights: t({ mn: "Бүх эрх хуулиар хамгаалагдсан", en: "All Karma Reserved" }),
    gandantitle: t({ mn: "Гандан", en: "Gandan" }),
  };

  return (
    <footer className="relative w-full bg-[#FFFBEB] overflow-hidden pt-32 pb-12 font-sans text-[#451a03]">
      
      {/* 1. ATMOSPHERIC BACKGROUND LAYERS */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* A. The Gradient (Sunrise/Sunset) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#F59E0B]" />
        
        {/* B. The Endless Knot (Spinning Giant) */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[1200px] h-[1200px] opacity-[0.07] animate-[spin_300s_linear_infinite] origin-center">
           <svg viewBox="0 0 100 100" className="w-full h-full text-[#B45309]">
              {/* Abstract Mandala Geometry */}
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.2" fill="none" />
              <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" fill="none" />
              <path d="M50 0 L50 100 M0 50 L100 50" stroke="currentColor" strokeWidth="0.2" />
              <path d="M15 15 L85 85 M15 85 L85 15" stroke="currentColor" strokeWidth="0.2" />
              <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
           </svg>
        </div>

        {/* C. Gold Dust Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
        
        {/* D. Top Fade (Seamless transition from previous section) */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FFFBEB] to-transparent" />
      </div>


      {/* 2. MAIN CONTENT CONTAINER */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        
        {/* --- NEWSLETTER ALTAR --- */}
        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="relative max-w-4xl mx-auto mb-24 p-1 rounded-[3rem] bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#FDE68A]"
        >
           <div className="bg-[#FFFBEB]/90 backdrop-blur-xl rounded-[2.8rem] px-8 py-12 md:px-12 md:py-16 text-center border border-white/50 shadow-2xl">
              
              <div className="inline-flex items-center gap-2 mb-4 text-[#D97706] bg-[#FEF3C7] px-4 py-1 rounded-full border border-[#FDE68A]">
                 <Flower size={14} className="animate-spin-slow" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{content.newsletterTag}</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#78350F] mb-6">
                 {content.newsletterTitle.split(t({ mn: "сутрууд", en: "Sutras" }))[0]} <span className="italic text-[#D97706]">{t({ mn: "Судрууд", en: "Morning Sutras" })}</span>
              </h2>
              
              <p className="text-[#92400E]/80 mb-8 max-w-lg mx-auto leading-relaxed">
                 {content.newsletterDesc}
              </p>

              <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto relative">
                 <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D97706]" size={20} />
                    <input 
                      type="email" 
                      placeholder={content.emailPlaceholder}
                      className="w-full pl-12 pr-6 py-4 bg-white border border-[#FDE68A] rounded-full text-[#451a03] placeholder-[#B45309]/40 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] shadow-inner transition-all"
                    />
                 </div>
                 <button className="group relative overflow-hidden bg-[#78350F] text-[#FDE68A] px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-[0_10px_20px_rgba(120,53,15,0.3)] transition-all">
                    <span className="relative z-10 flex items-center gap-2">
                       {content.btnJoin} <ArrowUp size={16} className="rotate-45 group-hover:rotate-90 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-[#92400E] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                 </button>
              </form>
           </div>
           
           {/* Decorative Lotus Floating Top */}
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FFFBEB] p-3 rounded-full border-4 border-[#FDE68A] shadow-lg">
              <Sun size={32} className="text-[#F59E0B] animate-pulse" />
           </div>
        </motion.div>


        {/* --- MAIN LINKS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 border-t border-[#F59E0B]/30 pt-16">
           
           {/* COL 1: BRANDING (Span 4) */}
           <div className="md:col-span-4 flex flex-col items-start gap-6">
              <Link href="/" className="flex items-center gap-3 group">
                 <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#B45309] rounded-lg flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                    <InfinityIcon size={24} />
                 </div>
                 <div className="flex flex-col">
                    <span className="font-serif font-bold text-2xl text-[#451a03] leading-none">
                       {content.gandantitle}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#92400E]">
                       {content.monastery}
                    </span>
                 </div>
              </Link>
              
              <p className="text-[#78350F]/80 leading-relaxed font-medium">
                 {content.aboutDesc}
              </p>

              {/* Social Orbs */}
              <div className="flex gap-4 pt-4">
                 {[Facebook, Instagram, Youtube].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 rounded-full border border-[#D97706]/30 flex items-center justify-center text-[#78350F] hover:bg-[#F59E0B] hover:text-white hover:border-[#F59E0B] transition-all duration-300">
                       <Icon size={18} />
                    </a>
                 ))}
              </div>
           </div>

           {/* COL 2: THE PATH (Links) */}
           <div className="md:col-span-3">
              <h4 className="font-bold text-[#451a03] mb-8 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> {content.pathTitle}
              </h4>
              <ul className="space-y-4">
                 {content.pathLinks.map((item) => (
                    <li key={item.name}>
                       <Link href={item.href} className="group flex items-center gap-2 text-[#78350F]/80 hover:text-[#92400E] transition-colors">
                          <span className="w-0 group-hover:w-4 h-[1px] bg-[#F59E0B] transition-all duration-300" />
                          <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                       </Link>
                    </li>
                 ))}
              </ul>
           </div>

           {/* COL 3: SANCTUARY (Links) */}
           <div className="md:col-span-3">
              <h4 className="font-bold text-[#451a03] mb-8 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> {content.sanctuaryTitle}
              </h4>
              <ul className="space-y-4">
                 {content.sanctuaryLinks.map((item) => (
                    <li key={item.name}>
                       <Link href={item.href} className="group flex items-center gap-2 text-[#78350F]/80 hover:text-[#92400E] transition-colors">
                          <span className="w-0 group-hover:w-4 h-[1px] bg-[#F59E0B] transition-all duration-300" />
                          <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                       </Link>
                    </li>
                 ))}
              </ul>
           </div>

           {/* COL 4: CONTACT & VERTICAL SCRIPT */}
           <div className="md:col-span-2 flex justify-between">
              
              <div className="space-y-6">
                 <div className="flex items-start gap-3 text-[#78350F]">
                    <MapPin className="mt-1 text-[#D97706] shrink-0" size={18} />
                    <span className="text-sm font-medium">{content.location.split(',')[0]}, <br/>{content.location.split(',')[1]}</span>
                 </div>
                 <div className="flex items-center gap-3 text-[#78350F]">
                    <Phone className="text-[#D97706] shrink-0" size={18} />
                    <span className="text-sm font-medium">+976 11 1234</span>
                 </div>
              </div>

              {/* Cultural Touch: Vertical Script */}
              <div className="hidden md:block h-full opacity-30 mix-blend-multiply hover:opacity-100 transition-opacity duration-700 select-none">
                 <span style={{ writingMode: 'vertical-rl' }} className="text-4xl font-serif font-bold text-[#78350F]">
                    {content.peace}
                 </span>
              </div>
           </div>

        </div>


        {/* --- BOTTOM BAR (The Foundation) --- */}
        <div className="mt-20 pt-8 border-t border-[#78350F]/10 flex flex-col md:flex-row justify-between items-center gap-6">
           
           <p className="text-xs text-[#78350F]/60 font-medium">
              © {new Date().getFullYear()} {content.gandantitle} {content.monastery}. {content.allRights}.
           </p>

           <div className="flex items-center gap-8">
              <Link href="#" className="text-xs font-bold uppercase tracking-wider text-[#92400E] hover:text-[#451a03]">{content.privacy}</Link>
              <Link href="#" className="text-xs font-bold uppercase tracking-wider text-[#92400E] hover:text-[#451a03]">{content.terms}</Link>
              
              {/* THE RISING SUN BUTTON */}
              <button 
                 onClick={scrollToTop}
                 className="group flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-t from-[#B45309] to-[#F59E0B] text-white shadow-lg hover:-translate-y-2 transition-transform duration-500"
              >
                 <Sun size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                 {/* Tooltip */}
                 <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-[#78350F] whitespace-nowrap">
                    {content.ascend}
                 </span>
              </button>
           </div>
        </div>

      </div>
    </footer>
  );
}
