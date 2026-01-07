"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  Home, School, HandHeart, Compass, Megaphone,
  Globe, LayoutGrid, LucideIcon, Sparkles, Sun, Moon
} from "lucide-react";
import { 
  motion, 
  useScroll, 
  useMotionValueEvent, 
  AnimatePresence, 
  useMotionTemplate, 
  useMotionValue 
} from "framer-motion";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useLanguage } from "../contexts/LanguageContext";

// --- 1. STRICT TYPES ---
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

// --- 2. CONTENT & CONFIG ---
const CONTENT: Record<string, LocalizedContent> = {
  logo: { mn: "Гэвабол", en: "Gevabol" },
  login: { mn: "Нэвтрэх", en: "Sign In" },
  dashboard: { mn: "Самбар", en: "Panel" },
};

// --- 3. MICRO-COMPONENTS (The Magic) ---

/**
 * MagneticWrapper: pulls the element towards the cursor
 */
const MagneticWrapper = memo(({ children, strength = 0.3 }: { children: React.ReactNode, strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * strength, y: y * strength });
  }, [strength]);

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

/**
 * Spotlight: Tracks mouse to create a glowing gradient border/background
 */
const Spotlight = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(251, 191, 36, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
};

/**
 * StaggerText: Splits text into characters and staggers them vertically on hover
 */
const StaggerText = ({ text, isActive, isDark }: { text: string; isActive: boolean; isDark: boolean }) => {
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="relative block overflow-hidden whitespace-nowrap"
    >
      <div className="flex">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: 0 },
              hover: { y: "-100%" },
            }}
            transition={{ duration: 0.25, ease: "easeInOut", delay: 0.02 * i }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
      <div className={`absolute inset-0 flex ${isActive ? (isDark ? "text-amber-950" : "text-white") : "text-amber-500"}`}>
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: "100%" },
              hover: { y: 0 },
            }}
            transition={{ duration: 0.25, ease: "easeInOut", delay: 0.02 * i }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

// --- 4. DESKTOP HEADER ---
interface DesktopNavProps {
  isScrolled: boolean;
  isDark: boolean;
  lang: Language;
  pathname: string;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  desktopNav: NavItem[];
}

const DesktopNav = memo(({ isScrolled, isDark, lang, pathname, toggleLanguage, toggleTheme, desktopNav }: DesktopNavProps) => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 24, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
      className="fixed z-[100] left-0 right-0 hidden lg:flex justify-center pointer-events-none"
    >
      <Spotlight className={`
        pointer-events-auto rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isScrolled 
          ? "w-[90%] lg:w-[1000px] shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]" 
          : "w-full max-w-[1400px] shadow-none"}
      `}>
        <nav className={`
          flex items-center justify-between px-8 py-3 rounded-full border backdrop-blur-xl transition-all duration-500
          ${isDark 
            ? "bg-[#0a0a0a]/80 border-white/10 text-zinc-100" 
            : "bg-white/80 border-black/5 text-zinc-800"}
        `}>
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 relative z-10">
            <MagneticWrapper strength={0.2}>
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                <Image src="/logo.png" alt="Logo" fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </MagneticWrapper>
            <span className="font-serif font-black text-xl tracking-tighter">
              {CONTENT.logo[lang]}
            </span>
          </Link>

          {/* Nav Items */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
            {desktopNav.map((item) => {
               const isActive = pathname === item.href;
               return (
                <Link key={item.href} href={item.href} className="relative px-6 py-2.5 group">
                  {isActive && (
                    <motion.div 
                      layoutId="desktopActivePill"
                      className={`absolute inset-0 rounded-full shadow-lg ${isDark ? "bg-amber-500" : "bg-[#2a1a12]"}`}
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    >
                        {/* Inner glow for active pill */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent" />
                    </motion.div>
                  )}
                  
                  <span className={`relative z-10 text-[13px] font-bold uppercase tracking-widest block transition-colors duration-300
                    ${isActive ? (isDark ? "text-amber-950" : "text-amber-50") : "opacity-60 group-hover:opacity-100"}`}>
                    <StaggerText text={item.name[lang]} isActive={isActive} isDark={isDark} />
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <MagneticWrapper>
               <button onClick={toggleLanguage} className="w-9 h-9 rounded-full border border-current/10 flex items-center justify-center hover:bg-current/5 active:scale-90 transition-all">
                  <span className="text-[10px] font-black">{lang === 'mn' ? 'EN' : 'MN'}</span>
               </button>
            </MagneticWrapper>
            <MagneticWrapper>
               <button onClick={toggleTheme} className="w-9 h-9 rounded-full border border-current/10 flex items-center justify-center hover:bg-current/5 active:scale-90 transition-all">
                  {isDark ? <Sun size={14} /> : <Moon size={14} />}
               </button>
            </MagneticWrapper>

            <div className="w-px h-5 bg-current/20 mx-1" />

            <SignedIn>
                <div className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full border border-current/10 bg-current/5">
                    <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">{CONTENT.dashboard[lang]}</span>
                    <UserButton />
                </div>
            </SignedIn>
            <SignedOut>
                <Link href="/sign-in">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative overflow-hidden px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-500/20"
                  >
                    <span className="relative z-10 text-[11px] font-black uppercase tracking-widest">{CONTENT.login[lang]}</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                  </motion.button>
                </Link>
            </SignedOut>
          </div>

        </nav>
      </Spotlight>
    </motion.header>
  );
});
DesktopNav.displayName = "DesktopNav";

// --- 5. MOBILE HEADER (Glassy) ---
const MobileTopBar = memo(({ lang, toggleLanguage }: { lang: Language, toggleLanguage: () => void }) => {
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="lg:hidden fixed top-0 left-0 right-0 z-[100] px-4 py-4 flex justify-between items-center pointer-events-none"
    >
      <Link href="/" className="pointer-events-auto">
         <motion.div whileTap={{ scale: 0.9 }} className="p-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <Image src="/logo.jpg" alt="Logo" width={32} height={32} className="rounded-full" priority />
         </motion.div>
      </Link>

      <div className="flex items-center gap-3 pointer-events-auto">
          <button onClick={toggleLanguage} className="h-9 px-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white font-black text-[10px] tracking-widest">
              {lang.toUpperCase()}
          </button>
          <SignedIn>
              <div className="scale-110"><UserButton /></div>
          </SignedIn>
          <SignedOut>
              <Link href="/sign-in">
                  <button className="h-9 px-4 rounded-full bg-amber-600 text-white text-[10px] font-black uppercase shadow-lg shadow-amber-900/20">
                      {CONTENT.login[lang]}
                  </button>
              </Link>
          </SignedOut>
      </div>
    </motion.div>
  );
});
MobileTopBar.displayName = "MobileTopBar";

// --- 6. MOBILE DOCK (Cyberpunk/Sci-Fi Light Beams) ---
const MOBILE_DOCK_ITEMS: MobileDockItem[] = [
  { id: "home", icon: Home, href: "/", label: { mn: "Нүүр", en: "Home" } },
  { id: "clubs", icon: School, href: "/clubs", label: { mn: "Клуб", en: "Clubs" } },
  { id: "join", icon: HandHeart, href: "/join", label: { mn: "Нэгдэх", en: "Join" }, isMain: true },
  { id: "news", icon: Megaphone, href: "/news", label: { mn: "Мэдээ", en: "News" } },
  { id: "dashboard", icon: LayoutGrid, href: "/dashboard", label: { mn: "Самбар", en: "Panel" } },
];

const MobileBottomDock = memo(({ isDark, pathname, lang }: { isDark: boolean, pathname: string, lang: Language }) => {
  return (
    <div className="lg:hidden fixed bottom-6 left-0 right-0 z-[100] px-5 flex justify-center pointer-events-none">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
        className={`
          pointer-events-auto flex items-center justify-between w-full max-w-[380px] px-2 py-2 rounded-[2rem] 
          border shadow-2xl backdrop-blur-[20px] saturate-150 relative overflow-hidden
          ${isDark 
            ? "bg-[#050505]/80 border-white/10 shadow-black/80" 
            : "bg-white/80 border-white/40 shadow-amber-900/10"}
        `}
      >
         {/* Background noise texture */}
         <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

         {MOBILE_DOCK_ITEMS.map((item) => {
           const isActive = pathname === item.href;
           
           // A. The Big Central Button
           if (item.isMain) {
              return (
                <Link key={item.id} href={item.href} className="relative -top-8 flex flex-col items-center group">
                  <motion.div 
                    whileTap={{ scale: 0.9 }}
                    animate={{ 
                        y: [0, -4, 0],
                        boxShadow: isActive 
                            ? "0 0 30px rgba(245, 158, 11, 0.6)" 
                            : "0 0 0 rgba(0,0,0,0)"
                    }}
                    transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                    className="w-16 h-16 rounded-full flex items-center justify-center relative z-10 bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-[3px] border-transparent bg-clip-padding"
                  >
                    <div className="absolute inset-0 rounded-full border-[3px] border-white/20" />
                    <item.icon size={28} strokeWidth={2.5} />
                    
                    {/* Ripple Effect */}
                    <div className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-20" />
                  </motion.div>
                  <span className={`mt-2 text-[9px] font-black uppercase tracking-widest transition-all ${isActive ? "text-amber-500 blur-0" : "opacity-40 blur-[0.5px]"}`}>
                    {item.label[lang]}
                  </span>
                </Link>
              )
           }

           // B. Standard Icons
           return (
             <Link key={item.id} href={item.href} className="flex-1 flex flex-col items-center justify-center relative py-2 h-14">
                
                {/* 1. The Light Beam (Active State) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100%" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute bottom-0 w-8 bg-gradient-to-t from-amber-500/20 to-transparent z-0"
                        style={{ clipPath: "polygon(20% 100%, 80% 100%, 100% 0, 0 0)" }}
                    />
                  )}
                </AnimatePresence>

                {/* 2. Active Indicator Dot */}
                <div className="absolute top-0 w-8 flex justify-center">
                    {isActive && (
                        <motion.div layoutId="dockDot" className={`w-1 h-1 rounded-full ${isDark ? "bg-amber-400" : "bg-amber-600"} shadow-[0_0_10px_currentColor]`} />
                    )}
                </div>

                {/* 3. The Icon */}
                <div className={`relative z-10 transition-all duration-300 ${isActive ? (isDark ? "text-amber-100" : "text-amber-900") : "opacity-40 grayscale"}`}>
                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
             </Link>
           )
         })}
      </motion.nav>
    </div>
  );
});
MobileBottomDock.displayName = "MobileBottomDock";


// --- 7. MAIN EXPORT ---
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  const { language, setLanguage } = useLanguage(); 
  const lang = language as Language;

  const { resolvedTheme, setTheme } = useTheme();
  const { scrollY } = useScroll();

  useEffect(() => setMounted(true), []);
  useMotionValueEvent(scrollY, "change", (latest) => setIsScrolled(latest > 50));

  const toggleLanguage = useCallback(() => setLanguage(lang === "mn" ? "en" : "mn"), [lang, setLanguage]);
  const toggleTheme = useCallback(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"), [resolvedTheme, setTheme]);

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
        toggleTheme={toggleTheme}
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