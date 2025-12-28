"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
// 1. Import Clerk Components
import { SignInButton, SignUpButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import {
  Flower,
  ArrowRight,
  Sparkles,
  LogIn,
  Loader2, // Spinner icon
  UserPlus
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

// --- CUSTOM SVG: The Endless Knot (Background Geometry) ---
const EndlessKnot = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor">
     <path d="M30 30 L70 30 L70 70 L30 70 Z" strokeWidth="0.5" className="opacity-50" />
     <path d="M30 30 Q50 10 70 30 T70 70 Q50 90 30 70 T30 30" strokeWidth="1" />
     <path d="M20 50 L80 50" strokeWidth="0.5" strokeDasharray="2 2" />
     <path d="M50 20 L50 80" strokeWidth="0.5" strokeDasharray="2 2" />
     <circle cx="50" cy="50" r="45" strokeWidth="0.5" className="opacity-30" />
  </svg>
);

export default function SignInPage() {
  const { t } = useLanguage();

  const content = {
    leftTitle: t({ mn: "Дотоод сүмдээ <br/> эргэн ирээрэй", en: "Return to the <br/> Inner Temple" }),
    leftDesc: t({
      mn: "\"Амар амгалан дотроос тань ирдэг. Үүнийг гаднаас бүү хай. Гэгээрлийн зүг аяллаа үргэлжлүүлэхийн тулд нэвтэрнэ үү.\"",
      en: "\"Peace comes from within. Do not seek it without. Sign in to continue your journey towards enlightenment.\""
    }),
    welcomeBack: t({ mn: "Тавтай морилно уу", en: "Welcome Back" }),
    identifyDesc: t({ mn: "Ариун судар болон сангхад нэвтрэхийн тулд өөрийгөө таниулна уу.", en: "Identify yourself to access the sacred texts and sangha." }),
    loadingText: t({ mn: "Сүнс сэргэж байна...", en: "Awakening Spirits..." }),
    loginBtn: t({ mn: "Ариун газарт нэвтрэх", en: "Enter Sanctuary" }),
    registerBtn: t({ mn: "Сангхад нэгдэх", en: "Join the Sangha" }),
    or: t({ mn: "- ЭСВЭЛ -", en: "- OR -" }),
    agreeText: t({ mn: "Нэвтэрснээр та ", en: "By entering, you agree to follow the " }),
    eightfoldPath: t({ mn: "Найман зөв зам-ын дагуу байхыг зөвшөөрч байна.", en: "Eightfold Path of Conduct" }),
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FFFBEB] font-serif selection:bg-[#F59E0B] selection:text-white overflow-hidden">
      
      {/* --- LEFT SIDE: THE VISUAL SANCTUARY (Hidden on Mobile) --- */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#1a0a05]">
        
        {/* Background Image with Zoom Effect */}
        <motion.div 
           initial={{ scale: 1.1 }}
           animate={{ scale: 1 }}
           transition={{ duration: 10, ease: "easeOut" }}
           className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1548544149-48bc5e582888?q=80&w=2574&auto=format&fit=crop" 
            alt="Monk in Meditation" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a05] via-[#451a03]/50 to-transparent" />
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse" />

        {/* Content */}
        <div className="relative z-10 m-auto max-w-lg px-12 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5, duration: 1 }}
           >
             <Flower className="w-16 h-16 text-[#F59E0B] mx-auto mb-8 animate-[spin_60s_linear_infinite]" />
             <h1 
               className="text-5xl font-bold text-[#FDE68A] mb-6 drop-shadow-lg"
               dangerouslySetInnerHTML={{ __html: content.leftTitle }}
             />
             <p className="text-[#FDE68A]/70 text-lg leading-relaxed font-sans font-light">
               {content.leftDesc}
             </p>
           </motion.div>
        </div>

        {/* Bottom Quote */}
        <div className="absolute bottom-12 left-0 w-full text-center">
            <p className="text-[#FDE68A]/40 text-xs uppercase tracking-[0.3em]">
               Om Mani Padme Hum
            </p>
        </div>
      </div>


      {/* --- RIGHT SIDE: THE AUTH GATEWAY --- */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 sm:p-12">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F59E0B]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D97706]/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-60 mix-blend-multiply pointer-events-none" />
        
        {/* Giant Rotating Knot Watermark */}
        <motion.div 
           animate={{ rotate: -360 }}
           transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
           className="absolute -right-24 -bottom-24 w-[600px] h-[600px] text-[#451a03]/5 pointer-events-none"
        >
            <EndlessKnot className="w-full h-full" />
        </motion.div>


        {/* --- AUTH CARD --- */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-md bg-white/50 backdrop-blur-md p-8 sm:p-12 rounded-[2.5rem] border border-white/60 shadow-[0_20px_50px_-10px_rgba(69,26,3,0.1)]"
        >
          {/* Header */}
          <div className="text-center mb-10">
             <Link href="/" className="inline-flex items-center gap-2 text-[#D97706] hover:text-[#B45309] transition-colors mb-6 group">
                <Flower size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                <span className="font-bold font-sans uppercase tracking-widest text-xs">Nirvana</span>
             </Link>
             <h2 className="text-3xl font-bold text-[#451a03] mb-3">{content.welcomeBack}</h2>
             <p className="text-[#78350F]/70 text-sm font-sans leading-relaxed">
               {content.identifyDesc}
             </p>
          </div>

          {/* CLERK LOADING STATE */}
          <ClerkLoading>
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-[#D97706]">
                <Loader2 size={32} className="animate-spin" />
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">{content.loadingText}</p>
            </div>
          </ClerkLoading>

          {/* MAIN ACTIONS */}
          <ClerkLoaded>
            <div className="space-y-6">
              
              {/* 1. SIGN IN (Golden Button) */}
              <SignInButton mode="modal">
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full overflow-hidden rounded-2xl bg-[#451a03] p-5 text-[#FFFBEB] font-bold shadow-xl transition-all hover:bg-[#5f2405] group cursor-pointer"
                >
                    {/* Golden Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    
                    <div className="flex items-center justify-center gap-3">
                        <LogIn size={18} />
                        <span>{content.loginBtn}</span>
                        <ArrowRight size={18} />
                    </div>
                </motion.button>
              </SignInButton>

              <div className="text-center">
                <span className="text-xs font-sans text-[#D97706]/60 font-bold uppercase tracking-widest block mb-1">
                    {content.or}
                </span>
              </div>

              {/* 2. SIGN UP (Outline Button) */}
              <SignUpButton mode="modal">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-2xl border-2 border-[#D97706]/20 bg-[#FFFBEB]/50 hover:border-[#D97706] hover:bg-[#FDE68A]/20 transition-all flex items-center justify-center gap-2 text-[#78350F] font-bold group cursor-pointer"
                  >
                    <UserPlus size={18} className="text-[#D97706] group-hover:scale-110 transition-transform" />
                    <span>{content.registerBtn}</span>
                  </motion.button>
              </SignUpButton>

            </div>
          </ClerkLoaded>

          {/* Footer Note */}
          <div className="mt-12 text-center border-t border-[#D97706]/10 pt-6">
             <p className="text-[#78350F]/60 text-xs font-sans">
                {content.agreeText}
                <Link href="#" className="font-bold text-[#D97706] hover:underline ml-1">
                   {content.eightfoldPath}
                </Link>
             </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
