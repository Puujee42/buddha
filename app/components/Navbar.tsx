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
  Menu,
  X,
  Flower
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useLanguage } from "../contexts/LanguageContext";

const CONTENT = {
  logo: { mn: "", en: "Nirvana" },
  login: { mn: "Нэвтрэх", en: "Sign In" },
  register: { mn: "Бүртгүүлэх", en: "Register" },
  dashboard: { mn: "Хяналтын самбар", en: "Dashboard" },
};

export default function OverlayNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // For Language/Theme on mobile
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const pathname = usePathname();
  const { language: lang, setLanguage } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const { scrollY } = useScroll();

  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const toggleLanguage = () => setLanguage(lang === "mn" ? "en" : "mn");
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  if (!mounted) return null;

  const isDark = false;

  // --- DESKTOP NAV ITEMS ---
  const desktopNav = [
    { id: "home", name: { mn: "Нүүр", en: "Home" }, href: "/" },
    { id: "monks", name: { mn: "Үзмэрч", en: "Astrologers" }, href: "/monks" },
    { id: "services", name: { mn: "Үйлчилгээ", en: "Services" }, href: "/services" },
    { id: "about", name: { mn: "Бидний тухай", en: "Our Path" }, href: "/about" },
  ];

  // --- MOBILE DOCK ITEMS ---
  // Matches the style: Home | Monks | SERVICES (Center) | Dashboard | About
  const mobileNav = [
    { id: "home", icon: Home, href: "/", label: "Home" },
    { id: "monks", icon: Users, href: "/monks", label: "Monks" },
    { id: "services", icon: Sparkles, href: "/services", label: "Rituals", isMain: true }, // Center Button
    { id: "dashboard", icon: LayoutGrid, href: "/dashboard", label: "Grid" },
    { id: "about", icon: Compass, href: "/about", label: "Path" },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* DESKTOP HEADER (Floating Pill)                            */}
      {/* ========================================================= */}
      <motion.header
        className="fixed z-50 left-0 right-0 hidden md:flex justify-center pointer-events-none"
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
            ${isScrolled && !isDark ? "bg-orange-50/80 border-amber-200 shadow-amber-900/10 text-black" : ""}
            ${isScrolled && isDark ? "bg-[#0C164F]/80 border-indigo-400/30 shadow-[0_0_30px_rgba(123,51,125,0.3)] text-white" : ""}
          `}
        >
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="group flex items-center gap-3 relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${isDark ? "bg-gradient-to-tr from-[#2E1B49] to-[#C72075] border-cyan-400/50" : "bg-amber-100 border-amber-300"}`}>
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className={`font-serif font-bold text-xl tracking-tight ${isScrolled ? (isDark ? "text-cyan-50" : "text-amber-950") : "text-white"}`}>{CONTENT.logo[lang]}</span>
              </div>
            </Link>
          </div>

          {/* Links */}
          <div className="flex items-center gap-2">
            {desktopNav.map((item) => (
              <div key={item.id} className="relative" onMouseEnter={() => setHoveredNav(item.id)} onMouseLeave={() => setHoveredNav(null)}>
                <Link href={item.href} className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 z-10 ${isScrolled ? (isDark ? "text-indigo-100 hover:text-cyan-300" : "text-black hover:text-amber-600") : "text-white hover:text-cyan-200"}`}>
                  {hoveredNav === item.id && <motion.div layoutId="nav-pill" className={`absolute inset-0 rounded-full ${isDark ? "bg-white/10" : "bg-black/5"}`} />}
                  {item.name[lang]}
                </Link>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
             <button onClick={toggleLanguage} className={`w-11 h-11 rounded-full border flex items-center justify-center ${isScrolled ? (isDark ? "border-cyan-400/30 text-cyan-200" : "border-amber-200 text-amber-800") : "border-white/20 text-white"}`}><Globe size={18}/></button>
             <button onClick={toggleTheme} className={`w-11 h-11 rounded-full border flex items-center justify-center ${isScrolled ? (isDark ? "border-cyan-400/30 text-cyan-200" : "border-amber-200 text-amber-800") : "border-white/20 text-white"}`}>{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
             <SignedOut>
               <Link href="/sign-up"><button className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all ${isDark ? "bg-gradient-to-r from-[#C72075] to-[#7B337D] text-white" : "bg-amber-600 text-white"}`}>{CONTENT.register[lang]}</button></Link>
             </SignedOut>
             <SignedIn>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard"><button className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest ${isDark ? "border-cyan-400 text-cyan-100" : "border-amber-600 text-amber-600"}`}>{CONTENT.dashboard[lang]}</button></Link>
                    <UserButton />
                </div>
             </SignedIn>
          </div>
        </motion.nav>
      </motion.header>


      {/* ========================================================= */}
      {/* MOBILE TOP BAR (Logo + Settings + Auth)                   */}
      {/* ========================================================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-between items-center pointer-events-none">
         {/* Logo */}
         <Link href="/" className="pointer-events-auto flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${isDark ? 'bg-[#05051a] border border-cyan-500/30' : 'bg-white border border-amber-200'}`}>
                <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
            </div>
         </Link>

         {/* Right Side: Settings & User */}
         <div className="pointer-events-auto flex items-center gap-3">
            <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md border ${
                    isDark ? 'bg-[#05051a]/80 border-cyan-500/30 text-cyan-400' : 'bg-white/80 border-amber-200 text-amber-600'
                }`}
            >
                {isSettingsOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <SignedIn>
                <UserButton appearance={{ elements: { userButtonAvatarBox: `w-10 h-10 border-2 ${isDark ? 'border-cyan-400' : 'border-amber-400'}` } }} />
            </SignedIn>
            <SignedOut>
                <Link href="/sign-in" className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border font-bold text-xs ${isDark ? 'bg-[#C72075] border-[#C72075] text-white' : 'bg-amber-500 border-amber-500 text-white'}`}>
                    IN
                </Link>
            </SignedOut>
         </div>
      </div>

      {/* --- SETTINGS DROPDOWN (Mobile) --- */}
      <AnimatePresence>
        {isSettingsOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className={`fixed top-20 right-6 z-40 p-4 rounded-3xl border shadow-2xl flex flex-col gap-3 w-40 ${
                    isDark ? 'bg-[#0C164F] border-cyan-500/30' : 'bg-white border-amber-200'
                }`}
            >
                <button onClick={toggleTheme} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-cyan-100' : 'hover:bg-black/5 text-amber-900'}`}>
                    {isDark ? <Sun size={18} /> : <Moon size={18} />} <span className="text-xs font-bold uppercase">{isDark ? "Light" : "Dark"}</span>
                </button>
                <button onClick={toggleLanguage} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-cyan-100' : 'hover:bg-black/5 text-amber-900'}`}>
                    <Globe size={18} /> <span className="text-xs font-bold uppercase">{lang === 'mn' ? 'English' : 'Монгол'}</span>
                </button>
            </motion.div>
        )}
      </AnimatePresence>


      {/* ========================================================= */}
      {/* MOBILE BOTTOM DOCK (The Requested Style)                  */}
      {/* ========================================================= */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
         <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`flex items-center justify-around px-2 h-[72px] rounded-[2.5rem] shadow-2xl backdrop-blur-2xl border transition-colors duration-500 ${
                isDark 
                ? "bg-[#05051a]/80 border-cyan-500/20 shadow-[0_10px_40px_-10px_rgba(80,242,206,0.15)]" 
                : "bg-white/80 border-white/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]"
            }`}
         >
            {mobileNav.map((item) => {
                const isActive = pathname === item.href;
                const isMain = item.isMain;

                return (
                    <Link key={item.id} href={item.href} className="relative group flex flex-col items-center justify-center w-14">
                        {isMain ? (
                            // --- CENTRAL MAIN BUTTON (Services) ---
                            <div className="relative -top-6">
                                <motion.div 
                                    whileTap={{ scale: 0.9 }}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                                        isDark 
                                        ? "bg-gradient-to-tr from-[#C72075] to-[#7B337D] text-white shadow-[#C72075]/40" 
                                        : "bg-gradient-to-tr from-[#F59E0B] to-[#FDE68A] text-[#451a03] shadow-[#F59E0B]/40"
                                    }`}
                                >
                                    <item.icon size={28} strokeWidth={2} />
                                    {/* Pulse Effect */}
                                    <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping pointer-events-none" />
                                </motion.div>
                            </div>
                        ) : (
                            // --- STANDARD DOCK ICONS ---
                            <div className="flex flex-col items-center gap-1">
                                <div className={`transition-all duration-300 ${
                                    isActive 
                                    ? (isDark ? "text-cyan-400 scale-110" : "text-[#D97706] scale-110") 
                                    : (isDark ? "text-cyan-100/40 group-hover:text-cyan-100" : "text-stone-400 group-hover:text-stone-600")
                                }`}>
                                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                {isActive && (
                                    <motion.div layoutId="active-dot" className={`w-1 h-1 rounded-full ${isDark ? "bg-cyan-400" : "bg-[#D97706]"}`} />
                                )}
                            </div>
                        )}
                    </Link>
                );
            })}
         </motion.div>
      </div>

    </>
  );
}