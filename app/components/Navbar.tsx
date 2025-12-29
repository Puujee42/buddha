"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Menu, 
  X, 
  Flower, 
  Globe,
  Sun,
  Moon,
  Sparkles
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
  logo: { mn: "Гандан", en: "Nirvana" },
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
                <Flower size={20} />
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

          {/* --- 2. CENTER NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-2">
            {CONTENT.nav.map((item) => (
              <div key={item.id} className="relative" onMouseEnter={() => setHoveredNav(item.id)} onMouseLeave={() => setHoveredNav(null)}>
                <Link
                  href={item.href}
                  className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 z-10 ${
                    isScrolled 
                      ? (isDark ? "text-indigo-100 hover:text-cyan-300" : "text-black hover:text-amber-600") 
                      : "text-black hover:text-cyan-200"
                  }`}
                >
                  {hoveredNav === item.id && (
                    <motion.div 
                      layoutId="nav-pill" 
                      className={`absolute inset-0 rounded-full ${isDark ? "bg-gradient-to-r from-[#C72075]/20 to-[#7B337D]/30" : "bg-amber-500/10"}`} 
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
             
             {/* THE THEME TOGGLER */}
             <motion.button 
               whileTap={{ scale: 0.9 }}
               onClick={toggleTheme}
               className={`relative flex items-center justify-center w-11 h-11 rounded-full border transition-all duration-500 overflow-hidden ${
                 isScrolled 
                  ? (isDark ? "border-cyan-400/40 bg-[#0C164F] text-cyan-300 shadow-[0_0_10px_rgba(80,242,206,0.2)]" : "border-amber-300 bg-amber-50 text-amber-600") 
                  : "border-white/20 bg-white/5 text-white"
               }`}
             >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isDark ? "moon" : "sun"}
                        initial={{ y: 20, opacity: 0, rotate: 45 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -20, opacity: 0, rotate: -45 }}
                        transition={{ duration: 0.4, ease: "backOut" }}
                    >
                        {isDark ? <Moon size={20} fill="currentColor" className="text-cyan-300" /> : <Sun size={20} fill="currentColor" />}
                    </motion.div>
                </AnimatePresence>
                
                {isDark && (
                  <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 pointer-events-none">
                     <Sparkles size={8} className="absolute top-1 right-2 text-white" />
                  </motion.div>
                )}
             </motion.button>

             {/* Language */}
             <button 
               onClick={toggleLanguage}
               className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
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
              <div className="flex justify-between items-center mb-12">
                 <div className="flex items-center gap-2">
                    <Flower size={24} className={isDark ? "text-cyan-400" : "text-amber-500"} />
                    <span className="font-serif font-bold text-2xl">{CONTENT.logo[lang]}</span>
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><X size={32} /></button>
              </div>

              <div className="space-y-6">
                {CONTENT.nav.map((item) => (
                  <Link key={item.id} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className=" text-black block text-4xl font-serif border-b border-current/10 pb-4">
                    {item.name[lang]}
                  </Link>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-4">
                 <button onClick={toggleTheme} className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 border ${isDark ? 'border-cyan-400/30' : 'border-black/10'}`}>
                    {isDark ? <Sun size={20} className="text-cyan-300" /> : <Moon size={20} />}
                    <span className="font-bold uppercase tracking-widest text-xs">
                      {isDark ? "Solar Path" : "Cosmic Path"}
                    </span>
                 </button>
                 <button onClick={toggleLanguage} className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs ${isDark ? 'bg-cyan-500 text-[#0C164F]' : 'bg-amber-500 text-white'}`}>
                    {lang === 'mn' ? 'English' : 'Монгол'}
                 </button>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}