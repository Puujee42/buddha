"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SignUpButton, SignInButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import {
  Flower,
  UserPlus,
  Loader2,
  ShieldCheck,
  User,
  ScrollText
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

// --- CUSTOM SVG: The Endless Knot ---
const EndlessKnot = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor">
     <path d="M30 30 L70 30 L70 70 L30 70 Z" strokeWidth="0.5" className="opacity-50" />
     <path d="M30 30 Q50 10 70 30 T70 70 Q50 90 30 70 T30 30" strokeWidth="1" />
     <path d="M20 50 L80 50" strokeWidth="0.5" strokeDasharray="2 2" />
     <path d="M50 20 L50 80" strokeWidth="0.5" strokeDasharray="2 2" />
     <circle cx="50" cy="50" r="45" strokeWidth="0.5" className="opacity-30" />
  </svg>
);

export default function SignUpPage() {
  const { t } = useLanguage();
  // State to track user role selection
  const [role, setRole] = useState<"client" | "monk">("client");

  const content = {
    leftTitle: t({ mn: "Xамт олонд <br/> нэгдээрэй", en: "Join the <br/>us" }),
    leftDesc: t({
      mn: "\"Мянган бээрийн аялал нэг алхмаас эхэлдэг. Бидэнтэй нэгдэж, амар амгалан, гэгээрлийн төлөөх замаа өнөөдөр эхлүүлээрэй.\"",
      en: "\"A journey of a thousand miles begins with a single step. Join us and begin your path towards peace and enlightenment today.\""
    }),
    beginJourney: t({ mn: "Аяллаа эхлүүлэх", en: "Begin Your Journey" }),
    identifyDesc: t({ mn: "Таны зорилго юу вэ?", en: "How do you wish to join us?" }),
    roleClient: t({ mn: "Би бол эрэлчин (Үйлчлүүлэгч)", en: "I am a Seeker (Client)" }),
    roleMonk: t({ mn: "Би бол багш (Лам)", en: "I am a Guide (Monk)" }),
    registerBtn: role === "monk" 
      ? t({ mn: "Багшаар бүртгүүлэх", en: "Register as Monk" })
      : t({ mn: "Сангхад нэгдэх", en: "Join the Sangha" }),
    loginBtn: t({ mn: "Нэвтрэх", en: "Enter Sanctuary" }),
    or: t({ mn: "- ЭСВЭЛ -", en: "- OR -" }),
    agreeText: t({ mn: "Бүртгүүлснээр та ", en: "By registering, you agree to follow the " }),
    eightfoldPath: t({ mn: "Найман зөв зам-ын дагуу байхыг зөвшөөрч байна.", en: "Eightfold Path of Conduct" }),
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FFFBEB] font-serif selection:bg-[#F59E0B] selection:text-white overflow-hidden">
      
      {/* --- LEFT SIDE (Unchanged) --- */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#451a03]">
        <motion.div 
           initial={{ scale: 1.1 }}
           animate={{ scale: 1 }}
           transition={{ duration: 10, ease: "easeOut" }}
           className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1518544866330-5296839aa64b?q=80&w=2574&auto=format&fit=crop" 
            alt="Buddhist Temple" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#451a03] via-[#78350F]/50 to-transparent" />
        </motion.div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse" />
        <div className="relative z-10 m-auto max-w-lg px-12 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5, duration: 1 }}
           >
             <Flower className="w-16 h-16 text-[#FDE68A] mx-auto mb-8 animate-[spin_60s_linear_infinite]" />
             <h1 
               className="text-5xl font-bold text-[#FDE68A] mb-6 drop-shadow-lg"
               dangerouslySetInnerHTML={{ __html: content.leftTitle }}
             />
             <p className="text-[#FDE68A]/70 text-lg leading-relaxed font-sans font-light">
               {content.leftDesc}
             </p>
           </motion.div>
        </div>
      </div>

      {/* --- RIGHT SIDE --- */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 sm:p-12">
        {/* Background FX (Unchanged) */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#F59E0B]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#D97706]/5 rounded-full blur-[80px] pointer-events-none" />
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
           className="absolute -left-24 -top-24 w-[600px] h-[600px] text-[#451a03]/5 pointer-events-none"
        >
            <EndlessKnot className="w-full h-full" />
        </motion.div>

        {/* --- AUTH CARD --- */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-md bg-white/50 backdrop-blur-md p-8 sm:p-12 rounded-[2.5rem] border border-white/60 shadow-[0_20px_50px_-10px_rgba(69,26,3,0.1)]"
        >
          {/* Header */}
          <div className="text-center mb-8">
             <Link href="/" className="inline-flex items-center gap-2 text-[#D97706] hover:text-[#B45309] transition-colors mb-6 group">
                <Flower size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                <span className="font-bold font-sans uppercase tracking-widest text-xs">Гэвабол</span>
             </Link>
             <h2 className="text-3xl font-bold text-[#451a03] mb-3">{content.beginJourney}</h2>
             <p className="text-[#78350F]/70 text-sm font-sans">{content.identifyDesc}</p>
          </div>

          {/* ROLE SELECTOR */}
          <div className="grid grid-cols-2 gap-3 mb-8 p-1 bg-[#451a03]/5 rounded-2xl">
            <button
              onClick={() => setRole("client")}
              className={`flex flex-col items-center justify-center py-4 rounded-xl transition-all duration-300 gap-2 ${
                role === "client" 
                ? "bg-white shadow-md text-[#D97706]" 
                : "text-[#78350F]/60 hover:bg-white/50"
              }`}
            >
              <User size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">{content.roleClient}</span>
            </button>
            <button
              onClick={() => setRole("monk")}
              className={`flex flex-col items-center justify-center py-4 rounded-xl transition-all duration-300 gap-2 ${
                role === "monk" 
                ? "bg-white shadow-md text-[#D97706]" 
                : "text-[#78350F]/60 hover:bg-white/50"
              }`}
            >
              <ScrollText size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">{content.roleMonk}</span>
            </button>
          </div>

          {/* CLERK ACTIONS */}
          <ClerkLoading>
            <div className="flex flex-col items-center justify-center py-8 gap-4 text-[#D97706]">
                <Loader2 size={32} className="animate-spin" />
            </div>
          </ClerkLoading>

          <ClerkLoaded>
            <div className="space-y-6">
              
              {/* 1. SIGN UP */}
              {/* 
                 IMPORTANT: 
                 1. We pass 'role' in unsafeMetadata so we know who they are in the database.
                 2. fallbackRedirectUrl: If monk, go to /onboarding/monk. If client, go home.
              */}
              <SignUpButton 
                mode="modal"
                unsafeMetadata={{ role: role }}
                forceRedirectUrl={role === 'monk' ? "/onboarding/monk" : "/dashboard"}
              >
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full overflow-hidden rounded-2xl bg-[#D97706] p-5 text-[#FFFBEB] font-bold shadow-xl transition-all hover:bg-[#B45309] group cursor-pointer"
                >
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="flex items-center justify-center gap-3">
                        <UserPlus size={18} />
                        <span>{content.registerBtn}</span>
                    </div>
                </motion.button>
              </SignUpButton>

              <div className="text-center">
                <span className="text-xs font-sans text-[#D97706]/60 font-bold uppercase tracking-widest block mb-1">
                    {content.or}
                </span>
              </div>

              {/* 2. SIGN IN */}
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-2xl border-2 border-[#451a03]/20 bg-transparent hover:border-[#451a03] hover:bg-[#451a03]/5 transition-all flex items-center justify-center gap-2 text-[#451a03] font-bold group cursor-pointer"
                  >
                    <ShieldCheck size={18} className="text-[#451a03] group-hover:scale-110 transition-transform" />
                    <span>{content.loginBtn}</span>
                  </motion.button>
              </SignInButton>

            </div>
          </ClerkLoaded>

          <div className="mt-10 text-center border-t border-[#D97706]/10 pt-6">
             <p className="text-[#78350F]/60 text-xs font-sans">
                {content.agreeText}
                <Link href="/" className="font-bold text-[#D97706] hover:underline ml-1">
                   {content.eightfoldPath}
                </Link>
             </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}