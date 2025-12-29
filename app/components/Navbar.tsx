"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Flower, 
  Globe,
  User, 
  LayoutDashboard,
  LogIn 
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

// --- CLERK IMPORTS ---
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useLanguage } from "../contexts/LanguageContext";

// --- CONTENT DATA ---
const CONTENT = {
  nav: [
    { 
      id: "home",
      name: { mn: "Нүүр хуудас", en: "Home" }, 
      href: "/", 
    },
    { 
      id: "monks",
      name: { mn: "Зурхайчид", en: "Astrologers" }, 
      href: "/monks",
    },
    {
      id: "services",
      name: { mn: "Үйлчилгээ", en: "Services" }, 
      href: "/services",
    },
    { 
      id: "about",
      name: { mn: "Бидний тухай", en: "Our Path" }, 
      href: "/about", 
    },
    { 
      id: "mission", 
      name: { mn: "Эрхэм зорилго", en: "Mission" }, 
      href: "/mission",
    }
  ],
  logo: { mn: "Гандан", en: "Nirvana" },
  login: { mn: "Нэвтрэх", en: "Sign In" },
  register: { mn: "Бүртгүүлэх", en: "Register" },
  dashboard: { mn: "Хяналтын самбар", en: "Dashboard" },
  myAccount: { mn: "Миний бүртгэл", en: "My Account" },
  managedByClerk: { mn: "Clerk-ээр хамгаалагдсан", en: "Managed by Clerk" }
};

export default function OverlayNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  
  const { language: lang, setLanguage } = useLanguage();
  
  const { scrollY } = useScroll();

  // Scroll Detection Logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 50;
    if (isScrolled !== shouldBeScrolled) setIsScrolled(shouldBeScrolled);
  });

  const toggleLanguage = () => setLanguage(lang === "mn" ? "en" : "mn");

  return (
    <>
      <motion.header
        className="fixed z-50 left-0 right-0 flex justify-center pointer-events-none"
        initial={{ y: 0 }}
        animate={{ y: isScrolled ? 10 : 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
      >
        <motion.nav
          layout
          className={`
            pointer-events-auto relative flex items-center justify-between
            transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${
              isScrolled
                ? "w-[95%] lg:w-[1250px] mt-2 py-3 px-6 rounded-full bg-[#FFFBEB]/90 backdrop-blur-xl border border-[#FDE68A]/60 shadow-lg shadow-amber-900/5"
                : "w-full max-w-[1450px] py-6 px-8 bg-transparent border-transparent"
            }
          `}
        >
          {/* Noise Texture Overlay */}
          <div className={`absolute inset-0 rounded-full opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />

          {/* --- 1. LEFT: LOGO --- */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-3 relative z-10">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.8, ease: "anticipate" }}
                className={`
                   w-10 h-10 rounded-full flex items-center justify-center
                   border transition-colors duration-500
                   ${isScrolled 
                      ? "bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border-[#FDE68A] text-[#D97706] shadow-sm" 
                      : "bg-white/10 border-white/20 text-white backdrop-blur-sm"}
                `}
              >
                <Flower size={18} strokeWidth={1.5} />
              </motion.div>

              <div className="flex flex-col">
                <span className={`font-serif font-bold text-lg leading-none tracking-wide transition-colors duration-500 ${isScrolled ? "text-[#451a03]" : "text-white"}`}>
                   {CONTENT.logo[lang]}
                </span>
                <span className={`text-[10px] uppercase tracking-[0.25em] font-medium transition-colors duration-500 ${isScrolled ? "text-[#92400E]" : "text-white/60"}`}>
                   Monastery
                </span>
              </div>
            </Link>
          </div>

          {/* --- 2. CENTER: NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-2">
            {CONTENT.nav.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <Link
                  href={item.href}
                  className={`
                    relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-1.5 z-10
                    ${isScrolled ? "text-[#572718] hover:text-[#451a03]" : "text-[#FDFBF7]/90 hover:text-white"}
                  `}
                >
                  {/* Magnetic Hover Pill */}
                  {hoveredNav === item.id && (
                    <motion.div
                      layoutId="nav-pill"
                      className={`absolute inset-0 rounded-full ${isScrolled ? "bg-[#F59E0B]/10" : "bg-white/10"}`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {item.name[lang]}
                </Link>
              </div>
            ))}
          </div>

          {/* --- 3. RIGHT: ACTIONS & AUTH --- */}
          <div className="flex items-center gap-3 relative z-20">
             
             {/* Language Toggler */}
             <button 
               onClick={toggleLanguage}
               className={`
                  group relative flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300
                  ${isScrolled ? "border-[#D97706]/10 hover:border-[#D97706]/40 hover:bg-[#FDE68A]/20 text-[#78350F]" : "border-white/10 hover:border-white/30 hover:bg-white/10 text-white"}
               `}
             >
                <motion.div 
                   key={lang}
                   initial={{ rotateY: 90, opacity: 0 }}
                   animate={{ rotateY: 0, opacity: 1 }}
                   transition={{ duration: 0.3 }}
                >
                   <Globe size={16} strokeWidth={1.5} />
                </motion.div>
             </button>

             {/* Search Button */}
             <button className={`p-2 rounded-full transition-colors hover:scale-110 active:scale-95 duration-200 hidden sm:block ${isScrolled ? "text-[#78350F]" : "text-white"}`}>
                <Search size={18} />
             </button>

             {/* Divider */}
             <div className={`h-4 w-[1px] ${isScrolled ? "bg-[#78350F]/10" : "bg-white/20"} hidden md:block`} />

             {/* --- AUTHENTICATION AREA (DESKTOP) --- */}
             <div className="hidden md:flex items-center gap-3">
                
                <SignedOut>
                    {/* Login Button */}
                    <Link href="/sign-in">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full border transition-all duration-300
                                ${isScrolled 
                                    ? "border-transparent bg-transparent text-[#78350F] hover:bg-[#FDE68A]/20" 
                                    : "border-transparent bg-transparent text-white hover:bg-white/10"}
                            `}
                        >
                            <span className="text-xs font-bold tracking-wide uppercase">{CONTENT.login[lang]}</span>
                        </motion.button>
                    </Link>

                    {/* Register Button (Highlighted) */}
                    <Link href="/sign-up">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full border shadow-sm transition-all duration-300
                                ${isScrolled 
                                    ? "border-[#D97706]/20 bg-[#FDE68A]/30 text-[#78350F]" 
                                    : "border-white/20 bg-white/10 text-white backdrop-blur-md"}
                            `}
                        >
                           <div className={`p-1 rounded-full ${isScrolled ? "bg-[#D97706] text-white" : "bg-white text-[#451a03]"}`}>
                                <User size={12} strokeWidth={3} />
                            </div>
                            <span className="text-xs font-bold tracking-wide uppercase">{CONTENT.register[lang]}</span>
                        </motion.button>
                    </Link>
                </SignedOut>

                <SignedIn>
                    {/* Dashboard Button */}
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300
                                ${isScrolled 
                                    ? "border-[#D97706] bg-[#D97706] text-white hover:bg-[#B45309] hover:border-[#B45309]" 
                                    : "border-white bg-white/10 text-white hover:bg-white/20"}
                            `}
                        >
                            <LayoutDashboard size={14} strokeWidth={2} />
                            <span className="text-xs font-bold tracking-wide uppercase">{CONTENT.dashboard[lang]}</span>
                        </motion.button>
                    </Link>
                    
                    {/* Clerk Avatar - Invert colors when on dark background for visibility */}
                    <div className={isScrolled ? "" : "brightness-0 invert hover:brightness-100 hover:invert-0 transition-all"}>
                         <UserButton afterSignOutUrl="/" />
                    </div>
                </SignedIn>
             </div>

             {/* Mobile Menu Toggle */}
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className={`md:hidden p-1 ${isScrolled ? "text-[#78350F]" : "text-white"}`}
             >
                <Menu size={24} />
             </button>
          </div>
        </motion.nav>
      </motion.header>

      {/* --- 4. MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[60] bg-[#1a0a05] text-[#FFFBEB]"
           >
              {/* Texture & Decor */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-10 mix-blend-overlay pointer-events-none" />
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#F59E0B] rounded-full blur-[150px] opacity-20 pointer-events-none" />

              {/* Close Button */}
              <div className="absolute top-6 right-6 z-20">
                 <button 
                   onClick={() => setIsMobileMenuOpen(false)} 
                   className="p-2 text-[#FDE68A] hover:rotate-90 transition-transform duration-300"
                 >
                    <X size={32} />
                 </button>
              </div>

              {/* Menu Content */}
              <div className="h-full flex flex-col items-center justify-center p-8 space-y-8 relative z-10">
                 
                 {/* Nav Links */}
                 <div className="flex flex-col items-center gap-6">
                    {CONTENT.nav.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 + (i * 0.1) }}
                        >
                            <Link 
                                href={item.href} 
                                onClick={() => setIsMobileMenuOpen(false)} 
                                className="text-4xl font-serif text-[#FFFBEB] hover:text-[#F59E0B] transition-colors"
                            >
                                {item.name[lang]}
                            </Link>
                        </motion.div>
                    ))}
                 </div>

                 {/* Divider */}
                 <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="w-12 h-[1px] bg-[#FDE68A]/30"
                 />

                 {/* Mobile Actions & Auth */}
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center gap-5 w-full max-w-xs"
                 >
                    {/* Language */}
                    <button onClick={toggleLanguage} className="flex items-center gap-2 text-[#FDE68A]/70 uppercase tracking-widest text-xs border border-[#FDE68A]/30 px-4 py-2 rounded-full hover:bg-[#FDE68A]/10">
                       <Globe size={14} />
                       {lang === 'mn' ? 'Switch to English' : 'Монгол хэл'}
                    </button>
                    
                    {/* MOBILE AUTHENTICATION LOGIC */}
                    <SignedOut>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 border border-[#FDE68A]/30 text-[#FDE68A] py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#FDE68A]/10 transition-colors">
                                <LogIn size={16} />
                                {CONTENT.login[lang]}
                            </Link>
                            <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-[#D97706] text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#B45309] shadow-lg transition-colors">
                                <User size={16} />
                                {CONTENT.register[lang]}
                            </Link>
                        </div>
                    </SignedOut>

                    <SignedIn>
                        <div className="w-full flex flex-col items-center gap-4 p-6 bg-[#2a1209] rounded-2xl border border-[#FDE68A]/10">
                            {/* User Profile Area */}
                            <div className="flex items-center gap-3">
                                <div className="scale-125">
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-bold text-[#FDE68A]">{CONTENT.myAccount[lang]}</span>
                                    <span className="text-xs text-[#FDE68A]/50">{CONTENT.managedByClerk[lang]}</span>
                                </div>
                            </div>
                            
                            {/* Dashboard Button */}
                            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 bg-[#F59E0B] text-[#451a03] py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#D97706] hover:text-white transition-colors">
                                <LayoutDashboard size={16} />
                                {CONTENT.dashboard[lang]}
                            </Link>
                        </div>
                    </SignedIn>

                 </motion.div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}