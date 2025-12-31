"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Menu, 
  X, 
  Globe,
  Sun,
  Moon,
  Sparkles,
  Flower,
  ArrowRight,
  User
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useLanguage } from "../contexts/LanguageContext";

const CONTENT = {
  nav: [
    { id: "home", name: { mn: "Нүүр хуудас", en: "Home" }, href: "/" },
    { id: "monks", name: { mn: "Зурхайчид", en: "Astrologers" }, href: "/monks" },
    { id: "services", name: { mn: "Үйлчилгээ", en: "Services" }, href: "/services" },
    { id: "about", name: { mn: "Бидний тухай", en: "Our Path" }, href: "/about" },
  ],
  logo: { mn: "", en: "Nirvana" },
  login: { mn: "Нэвтрэх", en: "Sign In" },
  register: { mn: "Бүртгүүлэх", en: "Register" },
  dashboard: { mn: "Хяналтын самбар", en: "Dashboard" },
};

export default function OverlayNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const { language: lang, setLanguage } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { scrollY } = useScroll();

  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const toggleLanguage = () => setLanguage(lang === "mn" ? "en" : "mn");
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  if (!mounted) return null;

  // FIX: Make this dynamic so the UI updates
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <motion.header
        className="fixed z-50 left-0 right-0 flex justify-center pointer-events-none"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: isScrolled ? 10 : 0, opacity: 1 }}
      >
        <motion.nav
          layout
          className={`
            pointer-events-auto relative flex items-center justify-between
            transition-all duration-700 ease-in-out
            ${
              isScrolled
                ? "w-[95%] lg:w-[1250px] mt-2 py-3 px-8 rounded-full shadow-2xl backdrop-blur-xl border"
                : "w-full max-w-[1450px] py-6 px-10 bg-transparent border-transparent"
            }
            ${/* Light Mode: Warm Buddha */ ""}
            ${isScrolled && !isDark ? "bg-orange-50/80 border-amber-200 shadow-amber-900/10 text-black" : ""}
            ${/* Dark Mode: Zodiac Galaxy Theme */ ""}
            ${isScrolled && isDark ? "bg-[#0C164F]/80 border-indigo-400/30 shadow-[0_0_30px_rgba(123,51,125,0.3)] text-white" : ""}
          `}
        >
          {/* --- 1. LOGO --- */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="group flex items-center gap-3 relative z-10">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                  isDark 
                    ? "bg-gradient-to-tr from-[#2E1B49] to-[#C72075] border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(80,242,206,0.5)]" 
                    : "bg-amber-100 border-amber-300 text-amber-600 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                }`}
              >
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full object-cover" />
              </motion.div>
              <div className="flex flex-col">
                <span className={`font-serif font-bold text-xl tracking-tight transition-colors duration-500 ${
                  isScrolled ? (isDark ? "text-cyan-50" : "text-amber-950") : "text-white"
                }`}>
                   {CONTENT.logo[lang]}
                </span>
                <span className={`text-[9px] uppercase tracking-[0.3em] font-bold ${
                  isScrolled ? (isDark ? "text-[#C72075]" : "text-amber-700/60") : "text-white/60"
                }`}>
                   {isDark ? "Celestial Zodiac" : "Sacred Path"}
                </span>
              </div>
            </Link>
          </div>

          {/* --- 2. CENTER NAVIGATION (Desktop) --- */}
          <div className="hidden md:flex items-center gap-2">
            {CONTENT.nav.map((item) => (
              <div key={item.id} className="relative" onMouseEnter={() => setHoveredNav(item.id)} onMouseLeave={() => setHoveredNav(null)}>
                <Link
                  href={item.href}
                  className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 z-10 ${
                    isScrolled 
                      ? (isDark ? "text-indigo-100 hover:text-cyan-300" : "text-black hover:text-amber-600") 
                      : "text-white hover:text-cyan-200"
                  }`}
                >
                  {hoveredNav === item.id && (
                    <motion.div 
                      layoutId="nav-pill" 
                      className={`absolute inset-0 rounded-full ${isDark ? "bg-gradient-to-r from-[#C72075]/20 to-[#7B337D]/30" : "bg-white/20"}`} 
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} 
                    />
                  )}
                  {item.name[lang]}
                </Link>
              </div>
            ))}
          </div>

          {/* --- 3. RIGHT ACTIONS --- */}
          <div className="flex items-center gap-3">
             {/* Language (Desktop) */}
             <button 
               onClick={toggleLanguage}
               className={`hidden md:flex w-11 h-11 rounded-full border items-center justify-center transition-all ${
                 isScrolled 
                 ? (isDark ? "border-indigo-400/30 text-cyan-100 bg-indigo-500/10" : "border-amber-200 text-black") 
                 : "border-white/20 text-white"
               }`}
             >
                <Globe size={18} />
             </button>

            

             <div className="hidden md:flex items-center gap-3 ml-2">
                <SignedOut>
                  <Link href="/sign-up">
                      <motion.button
                          whileHover={{ scale: 1.05, boxShadow: isDark ? "0 0 20px rgba(199, 32, 117, 0.4)" : "0 0 20px rgba(251, 191, 36, 0.2)" }}
                          className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all ${
                              isDark 
                              ? "bg-gradient-to-r from-[#C72075] to-[#7B337D] text-white shadow-lg" 
                              : "bg-amber-600 text-white hover:bg-amber-700"
                          }`}
                      >
                          {CONTENT.register[lang]}
                      </motion.button>
                  </Link>
                </SignedOut>

                <SignedIn>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <button className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${
                                isDark ? "border-cyan-400 text-cyan-100 bg-cyan-950/40" : "border-amber-600 text-amber-600"
                            }`}>
                                {CONTENT.dashboard[lang]}
                            </button>
                        </Link>
                        <UserButton appearance={{ elements: { userButtonAvatarBox: `w-9 h-9 border-2 ${isDark ? 'border-cyan-400' : 'border-amber-400'}` } }} />
                    </div>
                </SignedIn>
             </div>

             {/* Mobile Menu Toggle */}
             <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2">
                <Menu size={28} className={isScrolled ? (isDark ? "text-cyan-200" : "text-black") : "text-white"} />
             </button>
          </div>
        </motion.nav>
      </motion.header>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
           <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed inset-0 z-[60] flex flex-col p-8 ${
                isDark 
                ? "bg-gradient-to-b from-[#0C164F] via-[#2E1B49] to-[#7B337D] text-white" 
                : "bg-[#fffdfa] text-amber-950"
            }`}
           >
              {/* Mobile Header */}
              <div className="flex justify-between items-center mb-12">
                 <div className="flex items-center gap-2">
                    <Flower size={24} className={isDark ? "text-cyan-400" : "text-amber-500"} />
                    <span className="font-serif font-bold text-2xl">{CONTENT.logo[lang]}</span>
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-black/5 rounded-full"><X size={28} /></button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-6 flex-1 overflow-y-auto">
                {CONTENT.nav.map((item) => (
                  <Link 
                    key={item.id} 
                    href={item.href} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className={`block text-4xl font-serif border-b pb-4 transition-colors ${
                        isDark ? "border-white/10 hover:text-cyan-300" : "border-black/5 hover:text-amber-600 text-black"
                    }`}
                  >
                    {item.name[lang]}
                  </Link>
                ))}
              </div>

              {/* Mobile Bottom Actions (Refined) */}
              <div className="mt-8 space-y-6">
                 
                 {/* Mobile Auth */}
                 <SignedOut>
                    <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                        <button className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg ${
                            isDark ? "bg-cyan-500 text-[#0C164F]" : "bg-amber-600 text-white"
                        }`}>
                            {CONTENT.register[lang]} <ArrowRight size={16} />
                        </button>
                    </Link>
                    <div className="text-center">
                        <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold opacity-60 hover:opacity-100 uppercase tracking-widest">
                            {CONTENT.login[lang]}
                        </Link>
                    </div>
                 </SignedOut>

                 <SignedIn>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className={`w-full py-4 rounded-2xl border-2 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 ${
                            isDark ? "border-cyan-400 text-cyan-200" : "border-amber-600 text-amber-800"
                        }`}>
                            {CONTENT.dashboard[lang]} <User size={16} />
                        </button>
                    </Link>
                 </SignedIn>

                 {/* Divider */}
                 <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

                 {/* Utility Grid (Side by Side) */}
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={toggleTheme} 
                        className={`py-3 rounded-xl flex items-center justify-center gap-2 border transition-all ${
                            isDark ? 'border-cyan-400/30 bg-cyan-950/30 text-cyan-200' : 'border-black/10 bg-white text-black'
                        }`}
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        <span className="font-bold uppercase text-[10px] tracking-widest">
                            {isDark ? "Light" : "Dark"}
                        </span>
                    </button>

                    <button 
                        onClick={toggleLanguage} 
                        className={`py-3 rounded-xl flex items-center justify-center gap-2 border transition-all ${
                            isDark ? 'border-cyan-400/30 bg-cyan-950/30 text-cyan-200' : 'border-black/10 bg-white text-black'
                        }`}
                    >
                        <Globe size={18} />
                        <span className="font-bold uppercase text-[10px] tracking-widest">
                            {lang === 'mn' ? 'EN' : 'MN'}
                        </span>
                    </button>
                 </div>

              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}