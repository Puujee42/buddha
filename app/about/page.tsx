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
  Orbit
} from "lucide-react";
import GoldenNirvanaFooter from "../components/Footer";
import OverlayNavbar from "../components/Navbar";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";

// --- CUSTOM SVG ICONS ---
const DharmaWheel = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor">
    <circle cx="50" cy="50" r="45" strokeWidth="1" />
    <circle cx="50" cy="50" r="10" strokeWidth="1" />
    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M78 22 L22 78" strokeWidth="1" />
    <circle cx="50" cy="50" r="30" strokeWidth="0.5" strokeDasharray="2 2" />
  </svg>
);

// --- ZODIAC ATMOSPHERE ---
const CelestialStardust = ({ isNight }: { isNight: boolean }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {isNight && (
      <>
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#C72075]/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#2E1B49]/20 blur-[130px]" />
      </>
    )}
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "110vh", opacity: 0 }}
        animate={{ 
          y: "-10vh", 
          opacity: [0, 0.8, 0],
          x: Math.sin(i) * 120 
        }}
        transition={{
          duration: 12 + (i % 12),
          repeat: Infinity,
          delay: i * 0.3,
        }}
        className={`absolute rounded-full blur-[1px] ${
          isNight 
            ? (i % 2 === 0 ? "bg-cyan-300 shadow-[0_0_10px_#50F2CE] w-[2px] h-[2px]" : "bg-[#C72075] w-[1px] h-[1px]") 
            : "bg-amber-400 w-[1.5px] h-[1.5px] shadow-[0_0_8px_orange]"
        }`}
        style={{ left: `${(i * 3.3) % 100}%` }}
      />
    ))}
  </div>
);

export default function AboutPage() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const yVideo = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  const mouseX = useSpring(0, { stiffness: 40, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 40, damping: 20 });

  useEffect(() => { setMounted(true); }, []);

  // Correctly handle Theme State
  const isNight = false;
  
  // Zodiac Mouse Glow (Magenta/Cyan leak)
  const glowColor = isNight ? 'rgba(199, 32, 117, 0.25)' : 'rgba(251, 191, 36, 0.15)';
  const lightBackground = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`;

  const theme = isNight ? {
    bgMain: "bg-[#05051a]",
    bgSec: "bg-[#0C164F]/40",
    textMain: "text-cyan-50",
    textSub: "text-cyan-400",
    textDesc: "text-cyan-100/60",
    accent: "text-[#C72075]",
    cardBorder: "border-cyan-400/20",
    cardBg: "bg-[#0C164F]/60",
    icon: <Orbit size={32} className="text-cyan-400 animate-pulse" />
  } : {
    bgMain: "bg-[#FFFBEB]",
    bgSec: "bg-[#FEF3C7]",
    textMain: "text-[#451a03]",
    textSub: "text-amber-600",
    textDesc: "text-[#78350F]/80",
    accent: "text-[#F59E0B]",
    cardBorder: "border-amber-200",
    cardBg: "bg-white/60",
    icon: <Sun size={32} className="animate-spin-slow" />
  };

  const content = {
    heroTitle: t({ mn: "Уламжлалт соёл ба Орчин үеийн шийдэл", en: "Traditional Culture and Modern Solutions" }),
    heroSubtitle: t({
      mn: "\"Бид Монголчуудын олон зуун жилийн оюун санааны өв соёлыг технологийн дэвшилтэй холбож, хүн бүрт амар амгаланг түгээх зорилготой шинэ үеийн дижитал платформ юм.\"",
      en: "\"We are a new generation digital platform aimed at combining the centuries-old intellectual and cultural heritage of Mongolians with technological advancements, spreading peace and well-being to everyone.\""
    }),
    missionTag: t({ mn: "Бидний Эхлэл", en: "First Inception" }),
    missionTitle: t({ mn: "Уламжлалт соёлыг технологиор дамжуулан таны гарт", en: "Traditional culture in your hands through technology" }),
    missionDesc1: t({
      mn: "Бид Монголын Бурхан шашны олон зуун жилийн түүхтэй зан үйл, сургаал номлолыг цаг хугацаа, орон зайнаас үл хамааран хүн бүрт хүртээмжтэй болгох зорилготой.",
      en: "We breathe life into centuries of Buddhist lineage, making ancient rites accessible through the cosmic ether, transcending physical bounds."
    }),
    missionDesc2: t({
      mn: "Цаг алдах шаардлагагүйгээр өөрт хэрэгцээт засал ном, зөвлөгөөг гэрээсээ, амар амгалан орчинд авах боломжийг бид бүрдүүллээ.",
      en: "By bridging the physical and astral, we allow you to welcome the Dharma into your home, finding stillness beneath the stars."
    }),
    whyUsTitle: t({ mn: "Манай давуу тал?", en: "What is our advantage?" }),
    cards: [
      {
        number: "IX",
        title: t({ mn: "Мэргэжлийн баг хамт олон", en: "Professional team" }),
        desc: t({ mn: "Мэргэжлийн зурхайч, зөвлөхүүд танд үйлчилнэ.", en: "Professional astrologers and consultants are at your service." }),
        icon: <Users />
      },
      {
        number: "XVII",
        title: t({ mn: "Орон зай, цаг хугацаа", en: "Space, time" }),
        desc: t({ mn: "Та дэлхийн хаанаас ч, өөрт боломжтой цагтаа видео дуудлагаар холбогдож, зөвлөгөөгөө авах боломжтой.", en: "You can connect via video call from anywhere in the world at a time that is convenient for you." }),
        icon: <ShieldCheck />
      },
      {
        number: "XXI",
        title: t({ mn: "Бүрэн нууцлал ба Аюулгүй байдал", en: "Full Privacy and Security" }),
        desc: t({ mn: "Таны хувийн мэдээлэл болон зөвлөхтэй ярилцсан яриа бүрэн нууцлагдсан орчинд явагдана.", en: "Your personal information and every conversation with the advisor will take place in a fully confidential environment." }),
        icon: <Compass />
      },
      {
        number: "I",
        title: t({ mn: "Технологийн хялбар шийдэл", en: "Simple technology solution" }),
        desc: t({ mn: "Ойлгомжтой вэб систем, цахим төлбөрийн хэрэгслээр төлбөрөө хормын дотор шийдэж, үйлчилгээгээ түргэн шуурхай авах боломжтой.", en: "A user-friendly web system allows you to make payments instantly and receive services quickly." }),
        icon: <Sparkles />
      }
    ]
  };

  if (!mounted) return <div className="h-screen bg-[#05051a]" />;

  return (
    <>
      <OverlayNavbar />
      
      <main 
        ref={containerRef} 
        onMouseMove={(e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); }}
        className={`relative w-full min-h-screen transition-colors duration-1000 font-serif overflow-hidden ${theme.bgMain} ${theme.textMain}`}
      >
        {/* --- 0. ATMOSPHERE --- */}
        <motion.div className="fixed inset-0 pointer-events-none z-10 opacity-30 mix-blend-screen blur-3xl" style={{ background: lightBackground }} />
        <CelestialStardust isNight={isNight} />


        {/* --- SECTION 1: HERO PORTAL --- */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div style={{ y: yVideo }} className="absolute inset-0 z-0">
             <div className={`absolute inset-0 z-10 transition-colors duration-1000 ${isNight ? "bg-gradient-to-b from-[#05051a]/80 via-[#2E1B49]/40 to-[#05051a]" : "bg-[#451a03]/20"}`} /> 
             
             {/* Using poster fallback for smoother loading on some platforms */}
             <video 
               autoPlay 
               loop 
               muted 
               playsInline 
               poster="/video-poster.jpg"
               className={`w-full h-full object-cover transition-all duration-1000 ${isNight ? "opacity-30 brightness-75 contrast-125" : "opacity-60"}`}
             >
                <source src="/try.mp4" type="video/mp4" />
             </video>
          </motion.div>

          <div className="relative z-30 text-center px-4 md:px-6 max-w-6xl mx-auto flex flex-col items-center">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }} style={{ y: textY }}>
               <div className="flex justify-center mb-8">
                 <DharmaWheel className={`w-16 h-16 md:w-20 md:h-20 animate-[spin_60s_linear_infinite] transition-colors duration-1000 ${isNight ? "text-cyan-400 drop-shadow-[0_0_20px_#50F2CE60]" : "text-amber-500"}`} />
               </div>

               {/* Responsive Font Sizes */}
               <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] leading-[1.1]">
                 {content.heroTitle}
               </h1>
               
               <p className={`text-sm sm:text-lg md:text-2xl font-serif italic font-light py-6 md:py-8 px-4 md:px-12 border-y transition-colors duration-1000 max-w-4xl mx-auto ${isNight ? 'border-cyan-400/20 text-cyan-200' : 'border-amber-500/30 text-amber-900/80'}`}>
                 {content.heroSubtitle}
               </p>
             </motion.div>
          </div>
        </section>


        {/* --- SECTION 2: THE REVELATION --- */}
        <section className="relative py-24 md:py-48 z-20">
            <div className="container mx-auto px-6 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                    
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ margin: "-100px" }} className="space-y-8 md:space-y-12">
                        <span className={`font-black tracking-[0.3em] md:tracking-[0.5em] uppercase text-[10px] md:text-xs flex items-center gap-3 ${theme.textSub}`}>
                           {theme.icon} {content.missionTag}
                        </span>
                        
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tight">
                          {content.missionTitle}
                        </h2>
                        
                        <div className={`w-24 md:w-32 h-[1px] bg-gradient-to-r from-current to-transparent ${isNight ? "text-[#C72075]" : theme.accent}`} />
                        
                        <div className={`text-base md:text-xl leading-relaxed space-y-6 md:space-y-8 font-medium transition-colors ${theme.textDesc}`}>
                          <p>"{content.missionDesc1}"</p>
                          <p>{content.missionDesc2}</p>
                        </div>
                    </motion.div>

                    {/* RIGHT: CRYSTAL IMAGE PORTAL */}
                    <div className="relative group perspective-2000 mt-12 lg:mt-0">
                         <div className={`absolute inset-0 blur-[80px] md:blur-[120px] opacity-20 group-hover:opacity-40 transition-all duration-1000 ${isNight ? "bg-[#C72075]" : "bg-amber-500"}`} />
                         
                         <motion.div initial={{ rotateY: 15, opacity: 0 }} whileInView={{ rotateY: 0, opacity: 1 }} className={`relative rounded-t-[10rem] md:rounded-t-[25rem] rounded-b-[2rem] overflow-hidden border-[1px] backdrop-blur-md shadow-2xl transition-all duration-1000 aspect-[3/4] lg:h-[750px] ${isNight ? 'border-cyan-400/20' : theme.cardBorder}`}>
                            <img 
                              src="https://images.unsplash.com/photo-1601633596408-f421f28b499f?q=80&w=2574&auto=format&fit=crop" 
                              alt="Temple" 
                              className={`w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[4s] ${isNight ? "grayscale-[0.5] brightness-75 contrast-125 saturate-50" : "sepia-[0.2]"}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                            
                            {/* Vertical Floating Script */}
                            <div className="absolute top-10 md:top-20 right-4 md:right-8 z-30 opacity-60 hover:opacity-100 transition-opacity">
                               <span style={{ writingMode: 'vertical-rl' }} className="text-2xl md:text-4xl font-serif font-black tracking-widest text-white drop-shadow-lg">ᠡᠨᠡᠷᠡᠯ ᠦᠨ ᠰᠡᠳᠭᠢᠯ</span>
                            </div>
                         </motion.div>
                    </div>
                </div>
            </div>
        </section>


        {/* --- SECTION 3: THE ARCANA OF REASONS --- */}
        <section className={`relative py-24 md:py-48 transition-colors duration-1000 ${theme.bgSec} backdrop-blur-xl`}>
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16 md:mb-32 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
                       <Flower className={`w-8 h-8 md:w-12 md:h-12 mx-auto mb-6 md:mb-8 animate-pulse ${isNight ? 'text-cyan-400' : theme.accent}`} />
                       <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6">
                          {content.whyUsTitle}
                       </h2>
                       <p className={`font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-[10px] opacity-40 ${theme.textMain}`}>
                          {language === 'mn' ? "Зурхайн дөрвөн үндэс" : "Four Foundations of the Zodiac"}
                       </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    {content.cards.map((card, idx) => (
                      <ArcanaCard 
                        key={idx}
                        {...card}
                        isNight={isNight}
                        theme={theme}
                        delay={idx * 0.15}
                      />
                    ))}
                </div>
            </div>
        </section>

      </main>
    </>
  );
}

// --- ARCANA CARD SUB-COMPONENT ---
function ArcanaCard({ number, title, desc, icon, delay, isNight, theme }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 60, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 60, damping: 20 });
  
  // Mobile check (simplified)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      onMouseMove={(e) => {
        if(isMobile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="perspective-1000 w-full"
    >
      <motion.div 
        style={isMobile ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative p-8 md:p-10 min-h-[400px] md:h-[500px] flex flex-col transition-all duration-1000 shadow-xl rounded-sm border-2 group backdrop-blur-md ${theme.cardBg} ${theme.cardBorder}`}
      >
        {/* Zodiac Glow Interaction (Desktop only) */}
        {!isMobile && isNight && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C72075]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        )}

        {/* Card Frame Decoration */}
        <div className={`absolute inset-2 border transition-colors opacity-10 ${isNight ? "border-cyan-400" : "border-amber-500"}`} />

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-8 md:mb-12">
              <span className={`text-3xl md:text-4xl font-serif font-black transition-colors ${isNight ? "text-cyan-900 drop-shadow-[0_0_8px_rgba(80,242,206,0.3)]" : "text-amber-100"}`}>{number}</span>
              <div className={`p-3 md:p-4 rounded-full border transition-all duration-500 group-hover:-translate-y-2 ${isNight ? "bg-cyan-950 border-cyan-500 text-cyan-400 shadow-[0_0_15px_#50F2CE40]" : "bg-white border-amber-200 text-amber-600"}`}>
                {React.cloneElement(icon as React.ReactElement, { size: 24 } as any)}
              </div>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 leading-tight uppercase tracking-tight">{title}</h3>
            <div className={`w-12 h-1 mb-6 md:mb-8 bg-gradient-to-r from-current to-transparent ${isNight ? "text-[#C72075]" : theme.accent}`} />
            
            <p className={`text-sm leading-relaxed font-medium transition-colors opacity-80 italic`}>
              "{desc}"
            </p>
          </div>

          <div className="mt-8 flex justify-center opacity-10 group-hover:opacity-60 transition-opacity">
            <Star size={20} className={isNight ? "text-cyan-400" : "text-amber-500"} />
          </div>
        </div>

        {/* Cosmic Shimmer Reflection */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-transparent ${isNight ? 'via-cyan-400/10' : 'via-white/20'} to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] pointer-events-none`} />
      </motion.div>
    </motion.div>
  );
}