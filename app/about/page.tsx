"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  Flower,
  ShieldCheck,
  Users,
  Sparkles,
  Sun,
  Star,
  Compass,
  Orbit,
  ArrowRight,
  Gem,
  Zap,
  Lock
} from "lucide-react";
import GoldenNirvanaFooter from "../components/Footer";
import OverlayNavbar from "../components/Navbar";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";

// --- ATMOSPHERE ---
const CelestialStardust = ({ isDark }: { isDark: boolean }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ 
          y: ["0vh", "100vh"], 
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 10 + i,
          repeat: Infinity,
          ease: "linear",
          delay: i * 0.5,
        }}
        className={`absolute rounded-full blur-[2px] ${isDark ? "bg-amber-500/20" : "bg-amber-600/10"}`}
        style={{ 
            left: `${(i * 5) % 100}%`, 
            top: "-5%",
            width: `${Math.random() * 3}px`,
            height: `${Math.random() * 3}px`
        }}
      />
    ))}
  </div>
);

export default function AboutPage() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isDark =false;

  useEffect(() => { setMounted(true); }, []);

  // Theme-specific colors for high legibility
  const theme = isDark ? {
    bgMain: "bg-[#0a0505]", // Deep chocolate-black
    bgSec: "bg-[#1a0a0a]", 
    textTitle: "text-amber-50",
    textBody: "text-stone-300",
    textAccent: "text-amber-500",
    cardBg: "bg-white/[0.03]",
    cardBorder: "border-white/10",
  } : {
    bgMain: "bg-[#FDFBF7]", // Clean paper white
    bgSec: "bg-[#F5F2EA]",
    textTitle: "text-[#451a03]", // Dark coffee
    textBody: "text-[#5c4033]", // Muted brown
    textAccent: "text-amber-700",
    cardBg: "bg-white",
    cardBorder: "border-amber-200",
  };

  const cards = [
    {
      title: t({ mn: "Мэргэжлийн Баг", en: "Professional Team" }),
      desc: t({ mn: "Олон жилийн туршлагатай мэргэжлийн зурхайч, зөвлөхүүд танд үйлчилнэ.", en: "Experienced professional astrologers and consultants are at your service." }),
      icon: <Users className="text-orange-500" />,
      color: "border-orange-500/50",
      num: "I"
    },
    {
      title: t({ mn: "Орон зай, Цаг хугацаа", en: "Space & Time" }),
      desc: t({ mn: "Дэлхийн хаанаас ч өөрт тохиромжтой цагтаа видео дуудлагаар холбогдож зөвлөгөө авна.", en: "Connect via video call from anywhere in the world at your convenience." }),
      icon: <Zap className="text-blue-500" />,
      color: "border-blue-500/50",
      num: "II"
    },
    {
      title: t({ mn: "Бүрэн Нууцлал", en: "Full Privacy" }),
      desc: t({ mn: "Таны хувийн мэдээлэл болон яриа бүрэн нууцлагдсан аюулгүй орчинд явагдана.", en: "Your personal information and conversations stay in a fully confidential environment." }),
      icon: <Lock className="text-emerald-500" />,
      color: "border-emerald-500/50",
      num: "III"
    },
    {
      title: t({ mn: "Хялбар Шийдэл", en: "Simple Solution" }),
      desc: t({ mn: "Ойлгомжтой систем, цахим төлбөрийн хэрэгслээр үйлчилгээгээ түргэн авна.", en: "Easy-to-use web system allows for instant payments and quick service." }),
      icon: <Sparkles className="text-amber-500" />,
      color: "border-amber-500/50",
      num: "IV"
    }
  ];

  if (!mounted) return <div className="h-screen bg-[#FDFBF7]" />;

  return (
    <>
      <OverlayNavbar />
      
      <main className={`relative w-full min-h-screen transition-colors duration-700 ${theme.bgMain} ${theme.textTitle}`}>
        <CelestialStardust isDark={isDark} />

        {/* --- SECTION 1: HERO (Improved Contrast) --- */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <video autoPlay loop muted playsInline className={`w-full h-full object-cover ${isDark ? "opacity-30" : "opacity-40"}`}>
                <source src="/try.mp4" type="video/mp4" />
             </video>
             <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-black/60 via-transparent to-[#0a0505]' : 'from-white/60 via-transparent to-[#FDFBF7]'}`} />
          </div>

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className={`inline-block px-4 py-1 rounded-full border mb-6 text-[10px] font-black uppercase tracking-[0.3em] ${theme.textAccent} ${theme.cardBorder}`}>
                    {t({ mn: "Бидний тухай", en: "Our Story" })}
                </span>
                <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1] mb-8">
                  {t({ mn: "Уламжлал ба", en: "Heritage &" })} <br/>
                  <span className={theme.textAccent}>{t({ mn: "Технологи", en: "Technology" })}</span>
                </h1>
                <p className={`text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed ${theme.textBody}`}>
                   {t({ 
                      mn: "Монголчуудын олон зуун жилийн оюун санааны өв соёлыг технологиор дамжуулан хүн бүрт амар амгалан түгээнэ.",
                      en: "Bringing centuries of Mongolian spiritual heritage to everyone through modern technology."
                   })}
                </p>
             </motion.div>
          </div>
        </section>

        {/* --- SECTION 2: MISSION (Clean Split) --- */}
        <section className="relative py-24 md:py-40">
           <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-black leading-tight">
                        {t({ mn: "Уламжлалт соёлыг таны гарт", en: "Traditional Culture In Your Hands" })}
                    </h2>
                    <div className="space-y-6 text-lg md:text-xl leading-relaxed">
                        <p className={theme.textBody}>
                            {t({ 
                                mn: "Бид Монголын Бурхан шашны олон зуун жилийн түүхтэй зан үйл, сургаал номлолыг цаг хугацаа, орон зайнаас үл хамааран хүн бүрт хүртээмжтэй болгох зорилготой.",
                                en: "Our mission is to make the centuries-old Mongolian Buddhist rites and teachings accessible to everyone, regardless of time or space."
                            })}
                        </p>
                        <p className={`font-semibold ${theme.textAccent}`}>
                            {t({ mn: "Амар амгалан таны дэргэд.", en: "Peace is right beside you." })}
                        </p>
                    </div>
                 </div>
                 
                 <div className="relative group">
                    <div className={`absolute -inset-4 rounded-[2rem] blur-xl opacity-20 bg-amber-500`} />
                    <div className={`relative aspect-video lg:aspect-square rounded-[2rem] overflow-hidden border-2 ${theme.cardBorder}`}>
                        <img 
                          src="https://images.unsplash.com/photo-1601633596408-f421f28b499f?q=80&w=2574&auto=format&fit=crop" 
                          className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                          alt="Heritage"
                        />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* --- SECTION 3: ADVANTAGES (High Contrast Cards) --- */}
        <section className={`py-24 md:py-40 transition-colors ${theme.bgSec}`}>
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black mb-4">
                        {t({ mn: "Манай давуу тал", en: "Our Advantages" })}
                    </h2>
                    <div className={`w-24 h-1.5 mx-auto bg-amber-500 rounded-full`} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cards.map((card, i) => (
                        <motion.div 
                            key={i}
                            whileHover={{ y: -10 }}
                            className={`p-8 rounded-3xl border-2 transition-all duration-300 ${theme.cardBg} ${theme.cardBorder} hover:${card.color} shadow-lg shadow-black/5`}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-8 border border-stone-200">
                                {React.cloneElement(card.icon as React.ReactElement, { size: 28 } as any)}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">{card.title}</h3>
                            <p className={`text-base leading-relaxed font-medium ${theme.textBody}`}>
                                {card.desc}
                            </p>
                            <div className="mt-8 flex justify-between items-center opacity-40">
                                <span className="text-xs font-black uppercase tracking-widest">{card.num}</span>
                                <Star size={14} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
      </main>
    </>
  );
}