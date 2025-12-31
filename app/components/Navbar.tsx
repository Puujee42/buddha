"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  Home,
  Users,
  Sparkles,
  LayoutGrid,
  Compass,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useLanguage } from "../contexts/LanguageContext";

const CONTENT = {
  logo: { mn: "Нирвана", en: "Nirvana" },
  login: { mn: "Нэвтрэх", en: "Sign In" },
  register: { mn: "Бүртгүүлэх", en: "Register" },
  dashboard: { mn: "Самбар", en: "Panel" },
};

export default function OverlayNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { language: lang, setLanguage } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const { scrollY } = useScroll();

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  // Monitor scroll for desktop pill effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const toggleLanguage = () => setLanguage(lang === "mn" ? "en" : "mn");
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const desktopNav = [
    { name: { mn: "Нүүр", en: "Home" }, href: "/" },
    { name: { mn: "Үзмэрч", en: "Astrologers" }, href: "/monks" },
    { name: { mn: "Үйлчилгээ", en: "Services" }, href: "/services" },
    { name: { mn: "Бидний тухай", en: "About Us" }, href: "/about" },
  ];

  const mobileNav = [
    { id: "home", icon: Home, href: "/", label: { mn: "Нүүр", en: "Home" } },
    { id: "monks", icon: Users, href: "/monks", label: { mn: "Үзмэрч", en: "Monks" } },
    { id: "services", icon: Sparkles, href: "/services", label: { mn: "Засал", en: "Ritual" }, isMain: true },
    { id: "dashboard", icon: LayoutGrid, href: "/dashboard", label: { mn: "Самбар", en: "Panel" } },
    { id: "about", icon: Compass, href: "/about", label: { mn: "Тухай", en: "About" } },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP FLOATING HEADER                                */}
      {/* ========================================================= */}
      <motion.header 
        className="fixed z-50 left-0 right-0 hidden md:flex justify-center pointer-events-none"
        animate={{ y: isScrolled ? 12 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <nav className={`
          pointer-events-auto flex items-center justify-between transition-all duration-500
          ${isScrolled 
            ? "w-[90%] lg:w-[1200px] py-3 px-8 rounded-full border backdrop-blur-xl shadow-2xl" 
            : "w-full max-w-[1400px] py-6 px-10 bg-transparent border-transparent"}
          ${isDark 
            ? "bg-[#1a0505]/80 border-amber-900/30 text-amber-50" 
            : "bg-white/80 border-amber-100 text-[#451a03] shadow-amber-900/5"}
        `}>
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
             <div className="relative w-10 h-10 overflow-hidden rounded-full border border-amber-500/30">
                <Image src="/logo.png" alt="Logo" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
             </div>
             <span className="font-serif font-bold text-xl tracking-tight">{CONTENT.logo[lang]}</span>
          </Link>

          {/* Center Links */}
          <div className="flex items-center gap-2">
            {desktopNav.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-current/5 
                  ${pathname === item.href ? (isDark ? "text-amber-400" : "text-amber-600") : "opacity-70"}`}
              >
                {item.name[lang]}
              </Link>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
             <button onClick={toggleLanguage} className="w-10 h-10 rounded-full border flex items-center justify-center border-current/10 hover:bg-current/10 transition-colors">
                <Globe size={18}/>
             </button>
             <button onClick={toggleTheme} className="w-10 h-10 rounded-full border flex items-center justify-center border-current/10 hover:bg-current/10 transition-colors">
                {isDark ? <Sun size={18}/> : <Moon size={18}/>}
             </button>
             
             <div className="h-6 w-[1px] bg-current/10 mx-1" />

             <SignedIn>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className={`text-[10px] font-black uppercase tracking-widest border-b border-current hover:opacity-70`}>
                        {CONTENT.dashboard[lang]}
                    </Link>
                    <UserButton />
                </div>
             </SignedIn>
             
             <SignedOut>
               <Link href="/sign-up">
                  <button className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-amber-900/20 transition-all active:scale-95">
                    {CONTENT.register[lang]}
                  </button>
               </Link>
             </SignedOut>
          </div>
        </nav>
      </motion.header>


      {/* ========================================================= */}
      {/* 2. MOBILE TOP BAR (Logo + Theme/Lang Toggles)             */}
      {/* ========================================================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-between items-center pointer-events-none">
        <Link href="/" className="pointer-events-auto group">
           <div className="p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <Image src="/logo.png" alt="Logo" width={34} height={34} className="rounded-full" />
           </div>
        </Link>

        <div className="flex items-center gap-2 pointer-events-auto">
            {/* Direct Language Selection */}
            <button 
                onClick={toggleLanguage} 
                className={`px-4 h-10 rounded-full border text-[11px] font-black tracking-widest backdrop-blur-md shadow-lg transition-all active:scale-90
                  ${isDark ? "bg-amber-950/40 border-amber-500/30 text-amber-200" : "bg-white/80 border-amber-200 text-amber-800"}`}
            >
                {lang === 'mn' ? 'EN' : 'MN'}
            </button>
            
            {/* Direct Theme Toggle */}
            <button 
                onClick={toggleTheme} 
                className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md shadow-lg transition-all active:scale-90
                  ${isDark ? "bg-amber-950/40 border-amber-500/30 text-amber-200" : "bg-white/80 border-amber-200 text-amber-800"}`}
            >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <SignedIn>
                <div className="ml-1 scale-110"><UserButton /></div>
            </SignedIn>
        </div>
      </div>


      {/* ========================================================= */}
      {/* 3. MOBILE BOTTOM DOCK (The Hub)                           */}
      {/* ========================================================= */}
      <div className="md:hidden fixed bottom-5 left-0 right-0 z-50 px-4 flex justify-center">
        <nav className={`
          flex items-center justify-between w-full max-w-[420px] px-2 py-2 rounded-[2.5rem] border shadow-[0_-10px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl transition-all duration-500
          ${isDark ? "bg-[#1a0505]/95 border-amber-900/40 shadow-black" : "bg-white/95 border-amber-100"}
        `}>
          {mobileNav.map((item) => {
            const isActive = pathname === item.href;
            
            if (item.isMain) {
              return (
                <Link key={item.id} href={item.href} className="relative -top-8 flex flex-col items-center">
                  <motion.div 
                    whileTap={{ scale: 0.9 }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all relative z-10
                      ${isDark ? "bg-amber-500 text-[#1a0505]" : "bg-amber-600 text-white"}`}
                  >
                    <item.icon size={28} strokeWidth={2.5} />
                    
                    {/* Animated Outer Ring (Pulse) */}
                    <motion.div 
                      animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-amber-500"
                    />
                  </motion.div>
                  {/* Label for the center button */}
                  <span className={`mt-10 text-[9px] font-black uppercase tracking-widest ${isActive ? "text-amber-500" : "opacity-50"}`}>
                    {item.label[lang]}
                  </span>
                </Link>
              );
            }

            return (
              <Link key={item.id} href={item.href} className="flex-1 flex flex-col items-center justify-center py-2 gap-1 relative group">
                {/* Active Indicator Bar (Top) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                        layoutId="activeTabIndicator" 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className={`absolute top-0 w-8 h-1 rounded-full ${isDark ? "bg-amber-400" : "bg-amber-700"}`} 
                    />
                  )}
                </AnimatePresence>

                <div className={`transition-all duration-300 ${isActive ? (isDark ? "text-amber-400 scale-110" : "text-amber-700 scale-110") : "opacity-40 group-active:scale-90"}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                <span className={`text-[9px] font-black uppercase tracking-tighter transition-all duration-300 ${isActive ? "opacity-100" : "opacity-40"}`}>
                  {item.label[lang]}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Helper to prevent content from being cut off by the dock on mobile */}
      <div className="md:hidden h-24 pointer-events-none" />
    </>
  );
}