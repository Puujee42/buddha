"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  Home, School, HandHeart, Compass, Megaphone,
  Globe, LayoutGrid,
  LucideIcon,
  LogIn
} from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useLanguage } from "../contexts/LanguageContext";

// 1. DEFINE TYPES
type Language = 'mn' | 'en';

interface LocalizedContent {
  mn: string;
  en: string;
}

interface NavItem {
  name: LocalizedContent;
  href: string;
}

interface MobileDockItem {
  id: string;
  icon: LucideIcon;
  href: string;
  label: LocalizedContent;
  isMain?: boolean;
}

// 2. TYPED CONTENT OBJECT
const CONTENT: Record<string, LocalizedContent> = {
  logo: { mn: "Гэвабол", en: "Gevabol" },
  login: { mn: "Нэвтрэх", en: "Sign In" },
  dashboard: { mn: "Самбар", en: "Panel" },
};

// --- Magnetic Physics ---
const MagneticWrapper = memo(({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.3, y: y * 0.3 });
  }, []);

  const handleMouseLeave = useCallback(() => setPosition({ x: 0, y: 0 }), []);

  return (
    <motion.div 
      ref={ref} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }} 
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
});
MagneticWrapper.displayName = "MagneticWrapper";

// --- Desktop Nav ---
interface DesktopNavProps {
  isScrolled: boolean;
  isDark: boolean;
  lang: Language; // Strict type here fixes the indexing error
  pathname: string;
  toggleLanguage: () => void;
  desktopNav: NavItem[];
}

const DesktopNav = memo(({ isScrolled, isDark, lang, pathname, toggleLanguage, desktopNav }: DesktopNavProps) => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ 
          y: 20,
          paddingLeft: "2%",
          paddingRight: "2%"
      }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="fixed z-[100] left-0 right-0 hidden lg:flex justify-center pointer-events-none"
    >
      <nav className={`
        pointer-events-auto flex items-center justify-between transition-all duration-700 ease-in-out
        relative border
        ${isScrolled 
          ? "w-[90%] lg:w-[1100px] py-2 px-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)]" 
          : "w-full max-w-[1400px] py-5 px-14 rounded-[4rem] shadow-lg"}
        bg-white/90 backdrop-blur-2xl border-white/20 text-zinc-900
      `}>
        
        {/* Glow */}
        <AnimatePresence>
          {isScrolled && (
              <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-[3rem] bg-gradient-to-r from-amber-500 to-yellow-500 -z-10"
              />
          )}
        </AnimatePresence>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group shrink-0">
           <motion.div 
             animate={{ scale: isScrolled ? 1 : 1.2 }}
             className="relative w-12 h-12 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.3)]"
           >
              <Image src="/logo.png" alt="Logo" fill className="object-cover group-hover:scale-110 transition-transform duration-700" priority />
           </motion.div>
           <motion.span 
              animate={{ scale: isScrolled ? 1 : 1.1, x: isScrolled ? 0 : 5 }}
              className="font-serif font-black text-2xl tracking-tighter text-amber-600 dark:text-amber-500"
           >
              {CONTENT.logo[lang]}
           </motion.span>
        </Link>

        {/* Links */}
        <div className={`
          flex items-center gap-2 p-1 rounded-full transition-all duration-500
          ${isScrolled ? "bg-amber-500/5 border border-amber-500/10" : "bg-transparent"}
        `}>
          {desktopNav.map((item) => (
            <Link key={item.href} href={item.href} className="relative px-5 py-2 group">
              {pathname === item.href && (
                <motion.div 
                  layoutId="desktopActive"
                  className={`absolute inset-0 rounded-full shadow-lg ${isDark ? "bg-amber-600" : "bg-[#451a03]"}`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={`relative z-10 text-[15px] font-black uppercase tracking-widest transition-colors duration-300
                ${pathname === item.href 
                  ? (isDark ? "text-amber-950" : "text-white") 
                  : "opacity-60 group-hover:opacity-100 group-hover:text-amber-500"}`}
              >
                {item.name[lang]}
              </span>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
           <div className="flex items-center gap-2">
              <MagneticWrapper>
                  <button onClick={toggleLanguage} className="w-10 h-10 rounded-full border border-amber-500/20 hover:bg-amber-500/10 flex items-center justify-center transition-all">
                      <Globe size={18}/>
                  </button>
              </MagneticWrapper>
           </div>
         
           <div className="h-6 w-px bg-amber-500/20" />

           <SignedIn>
              <div className="flex items-center gap-4 py-1.5 pl-4 pr-1.5 rounded-full border border-amber-500/30 bg-amber-500/5">
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">
                      {CONTENT.dashboard[lang]}
                  </span>
                  <div className="scale-110 shadow-lg rounded-full overflow-hidden">
                      <UserButton />
                  </div>
              </div>
           </SignedIn>
           
           <SignedOut>
             <Link href="/sign-in">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -5px rgba(217,119,6,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[11px] font-black uppercase tracking-widest shadow-xl"
                >
                  {CONTENT.login[lang]}
                </motion.button>
             </Link>
           </SignedOut>
        </div>
      </nav>
    </motion.header>
  );
});
DesktopNav.displayName = "DesktopNav";

// --- Mobile Top Bar ---
interface MobileTopBarProps {
  lang: Language;
  toggleLanguage: () => void;
}

const MobileTopBar = memo(({ lang, toggleLanguage }: MobileTopBarProps) => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] px-5 py-5 flex justify-between items-center pointer-events-none">
      <Link href="/" className="pointer-events-auto">
         <motion.div 
           whileTap={{ scale: 0.9 }}
           className="bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl"
         >
            <Image src="/logo.jpg" alt="Logo" width={38} height={38} className="rounded-full ring-2 ring-amber-500" priority />
         </motion.div>
      </Link>

      <div className="flex items-center gap-3 pointer-events-auto">
          <button onClick={toggleLanguage} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-lg border border-white/10 text-white flex items-center justify-center font-black text-[11px]">
              {lang.toUpperCase()}
          </button>
          <SignedIn>
              <div className="ring-4 ring-amber-500/30 rounded-full shadow-2xl scale-110"><UserButton /></div>
          </SignedIn>
          <SignedOut>
              <Link href="/sign-in">
                  <button className="h-11 px-5 rounded-full bg-amber-600 text-white text-[11px] font-black uppercase shadow-lg border border-amber-400/30">
                      {CONTENT.login[lang]}
                  </button>
              </Link>
          </SignedOut>
      </div>
    </div>
  );
});
MobileTopBar.displayName = "MobileTopBar";

// --- Mobile Bottom Dock ---
const MOBILE_DOCK_ITEMS: MobileDockItem[] = [
  { id: "home", icon: Home, href: "/", label: { mn: "Нүүр", en: "Home" } },
  { id: "clubs", icon: School, href: "/clubs", label: { mn: "Клуб", en: "Clubs" } },
  { id: "join", icon: HandHeart, href: "/join", label: { mn: "Нэгдэх", en: "Join" }, isMain: true },
  { id: "news", icon: Megaphone, href: "/news", label: { mn: "Мэдээ", en: "News" } },
  { id: "dashboard", icon: LayoutGrid, href: "/dashboard", label: { mn: "Самбар", en: "Panel" } },
];

interface MobileBottomDockProps {
  isDark: boolean;
  pathname: string;
  lang: Language; // Added lang here so we can index labels safely
}

const MobileBottomDock = memo(({ isDark, pathname, lang }: MobileBottomDockProps) => {
  return (
    <div className="lg:hidden fixed bottom-6 left-0 right-0 z-[100] px-6 flex justify-center">
      <nav className={`
        flex items-center justify-between w-full max-w-[400px] px-3 py-3 rounded-[2.5rem] border shadow-2xl backdrop-blur-3xl transition-all duration-700
        ${isDark ? "bg-[#1a0f05]/95 border-amber-900/50 shadow-black" : "bg-white/95 border-amber-100 shadow-amber-900/10"}
      `}>
         {MOBILE_DOCK_ITEMS.map((item) => {
           const isActive = pathname === item.href;
           
           if (item.isMain) {
              return (
                <Link key={item.id} href={item.href} className="relative -top-8 flex flex-col items-center">
                  <motion.div 
                    whileTap={{ scale: 0.85 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(217,119,6,0.4)] relative z-10 bg-amber-600 text-white border-4 border-amber-100 dark:border-[#1a0f05]"
                  >
                    <item.icon size={28} strokeWidth={2.5} />
                    <span className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-20" />
                  </motion.div>
                  {/* Fixed error: item.label[lang] works now because lang is strictly typed */}
                  <span className={`mt-2 text-[9px] font-black uppercase tracking-widest ${isActive ? "text-amber-500" : "opacity-40"}`}>
                    {item.label[lang]}
                  </span>
                </Link>
              )
           }
           return (
             <Link key={item.id} href={item.href} className="flex-1 flex flex-col items-center justify-center relative group py-2">
               <AnimatePresence>
                  {isActive && (
                    <motion.div 
                        layoutId="activePillMobile" 
                        className={`absolute inset-x-2 inset-y-1 rounded-full -z-10 ${isDark ? "bg-amber-900/20" : "bg-amber-100"}`} 
                    />
                  )}
               </AnimatePresence>

               <div className={`transition-all duration-300 mb-1 ${isActive ? "text-amber-600 scale-110" : "opacity-30"}`}>
                 <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
               </div>
               
               <span className={`text-[9px] font-black uppercase tracking-tight transition-all ${isActive ? "opacity-100" : "opacity-30"}`}>
                   {/* Handle Dynamic Text for Dashboard/Login if needed, currently straightforward */}
                   {item.id === 'dashboard' ? (
                       <SignedOut>{CONTENT.login[lang]}</SignedOut>
                   ) : null}
                   {item.id === 'dashboard' ? (
                       <SignedIn>{item.label[lang]}</SignedIn>
                   ) : (
                       item.label[lang]
                   )}
               </span>
             </Link>
           )
         })}
      </nav>
    </div>
  );
});
MobileBottomDock.displayName = "MobileBottomDock";


// --- Main Export ---
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  // Cast useLanguage result to ensure TS knows 'lang' is 'mn' | 'en'
  const { language, setLanguage } = useLanguage(); 
  const lang = language as Language;

  const { resolvedTheme } = useTheme();
  const { scrollY } = useScroll();

  useEffect(() => setMounted(true), []);
  
  useMotionValueEvent(scrollY, "change", (latest) => setIsScrolled(latest > 60));

  const toggleLanguage = useCallback(() => setLanguage(lang === "mn" ? "en" : "mn"), [lang, setLanguage]);

  const desktopNav: NavItem[] = useMemo(() => [
    { name: { mn: "Нүүр", en: "Home" }, href: "/" },
    { name: { mn: "Үзмэрч", en: "Monks" }, href: "/monks" },
    { name: { mn: "Үйлчилгээ", en: "Services" }, href: "/services" },
    { name: { mn: "Бидний тухай", en: "About Us" }, href: "/about" },
  ], []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <DesktopNav 
        isScrolled={isScrolled} 
        isDark={isDark} 
        lang={lang} 
        pathname={pathname} 
        toggleLanguage={toggleLanguage} 
        desktopNav={desktopNav} 
      />
      <MobileTopBar 
        lang={lang} 
        toggleLanguage={toggleLanguage} 
      />
      <MobileBottomDock 
        isDark={isDark} 
        pathname={pathname} 
        lang={lang}
      />
    </>
  );
}