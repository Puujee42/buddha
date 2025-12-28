"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionTemplate
} from "framer-motion";
import {
  Flower,
  ShieldCheck, // For Privacy
  Users,       // For Teachers
  HeartHandshake, // For Mission
  Sparkles,    // For Convenience
  Sun,
  ScrollText
} from "lucide-react";
import GoldenNirvanaFooter from "../components/Footer";
import OverlayNavbar from "../components/Navbar";
import { useLanguage } from "../contexts/LanguageContext";

// --- CUSTOM SVG ICONS ---
const DharmaWheel = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor">
    <circle cx="50" cy="50" r="45" strokeWidth="2" />
    <circle cx="50" cy="50" r="10" strokeWidth="2" />
    <path d="M50 10 L50 90" strokeWidth="2" />
    <path d="M10 50 L90 50" strokeWidth="2" />
    <path d="M22 22 L78 78" strokeWidth="2" />
    <path d="M78 22 L22 78" strokeWidth="2" />
  </svg>
);

export default function AboutPage() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Parallax Animations
  const yVideo = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityVideo = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -100]);

  // Mouse "Golden Glow" Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent) {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  }

  const lightBackground = useMotionTemplate`radial-gradient(
    600px circle at ${mouseX}px ${mouseY}px, 
    rgba(251, 191, 36, 0.15),
    transparent 80%
  `;

  const content = {
    heroTitle: t({ mn: "Бидний тухай", en: "About Us" }),
    heroSubtitle: t({
      mn: "\"Цаг хугацаа, орон зайг үл хамааран оюун санааны амар амгаланг танд түгээнэ.\"",
      en: "\"Spreading spiritual peace to you, regardless of time and space.\""
    }),
    missionTag: t({ mn: "Бидний Эхлэл", en: "Our Beginning" }),
    missionTitle: t({ mn: "Оюун санааны холбоос", en: "Spiritual Connection" }),
    missionDesc1: t({
      mn: "\"Бид Монголын Бурхан шашны олон зуун жилийн түүхтэй зан үйл, сургаал номлолыг цаг хугацаа, орон зайнаас үл хамааран хүн бүрт хүртээмжтэй, ойр болгох зорилготойгоор энэхүү платформыг хөгжүүлж байна.",
      en: "We are developing this platform with the goal of making Mongolia's centuries-old Buddhist rituals and teachings accessible and close to everyone, regardless of time and space."
    }),
    missionDesc2: t({
      mn: "Очиж дугаарлах, цаг алдах шаардлагагүйгээр өөрт хэрэгцээт засал ном, зөвлөгөөг гэрээсээ, амар амгалан орчинд авах боломжийг бид бүрдүүллээ.\"",
      en: "We have created the opportunity to receive necessary rituals and advice from home in a peaceful environment, without the need to travel or wait in line.\""
    }),
    whyUsTitle: t({ mn: "Бид юугаараа ялгаатай вэ?", en: "Why Choose Us?" }),
    whyUsSubtitle: t({ mn: "(Яагаад бид гэж?)", en: "(Why Us?)" }),
    cards: [
      {
        number: "01",
        title: t({ mn: "Чадварлаг Багш нар", en: "Experienced Teachers" }),
        subtitle: t({ mn: "Trusted Masters", en: "Trusted Masters" }),
        desc: t({
          mn: "Бид зөвхөн Гандантэгчинлэн хийд болон бусад томоохон хийдүүдийн дээд боловсролтой, олон жилийн туршлагатай лам хуврагуудтай хамтран ажилладаг.",
          en: "We work exclusively with highly educated and experienced monks from Gandantegchinlen Monastery and other major temples."
        }),
        icon: <Users className="w-6 h-6" />
      },
      {
        number: "02",
        title: t({ mn: "Нууцлал & Аюулгүй байдал", en: "Privacy & Security" }),
        subtitle: t({ mn: "Privacy & Security", en: "Privacy & Security" }),
        desc: t({
          mn: "Таны багштай ярилцсан яриа, хувийн мэдээлэл бүрэн нууцлагдсан байх бөгөөд зөвхөн та болон багш хоёрын хооронд явагдана.",
          en: "Your conversations and personal information are fully confidential, shared only between you and the teacher."
        }),
        icon: <ShieldCheck className="w-6 h-6" />
      },
      {
        number: "03",
        title: t({ mn: "Бидний Эрхэм Зорилго", en: "Our Mission" }),
        subtitle: t({ mn: "Our Mission", en: "Our Mission" }),
        desc: t({
          mn: "Бидний эрхэм зорилго бол хүн бүрийн сэтгэлд амар амгалангийн үрийг тарьж, амьдралын аливаа асуултад нь Бурхны шашны гүн ухаанаар дамжуулан хариулт өгөхөд оршино.",
          en: "Our mission is to plant seeds of peace in everyone's soul and provide answers to life's questions through Buddhist philosophy."
        }),
        icon: <HeartHandshake className="w-6 h-6" />
      },
      {
        number: "04",
        title: t({ mn: "Хялбар Шийдэл", en: "Easy Solution" }),
        subtitle: t({ mn: "Accessible", en: "Accessible" }),
        desc: t({
          mn: "Цаг алдах шаардлагагүйгээр өөрт хэрэгцээт засал ном, зөвлөгөөг гэрээсээ, амар амгалан орчинд авах боломж.",
          en: "The convenience of receiving spiritual services and advice from your home environment, saving you time."
        }),
        icon: <Sparkles className="w-6 h-6" />
      }
    ]
  };

  return (
    <>
      <OverlayNavbar />
      
      <main 
        ref={containerRef} 
        onMouseMove={handleMouseMove}
        className="relative w-full min-h-screen bg-[#FFFBEB] text-[#451a03] font-serif overflow-hidden selection:bg-[#FDE68A] selection:text-[#451a03]"
      >
        
        {/* --- 0. ATMOSPHERE LAYERS --- */}
        <motion.div 
          className="fixed inset-0 pointer-events-none z-10 mix-blend-multiply"
          style={{ background: lightBackground }}
        />
        <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-50 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] mix-blend-multiply" />


        {/* --- SECTION 1: HERO --- */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          
          {/* A. Background Video */}
          <motion.div 
            style={{ y: yVideo, opacity: opacityVideo }}
            className="absolute inset-0 z-0"
          >
             <div className="absolute inset-0 bg-[#451a03]/30 z-10" /> 
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FFFBEB] z-20" /> 
             
             <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover scale-105"
             >
                {/* Ensure /try.mp4 exists in your public folder, or swap for a link */}
                <source src="/try.mp4" type="video/mp4" />
                <img src="https://images.unsplash.com/photo-1518544866330-5296839aa64b?q=80&w=2574&auto=format&fit=crop" alt="Temple" className="w-full h-full object-cover"/>
             </video>
          </motion.div>

          {/* B. Hero Text */}
          <div className="relative z-30 text-center px-6 max-w-5xl mx-auto text-white">
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.5, delay: 0.5 }}
               style={{ y: textY }}
             >
               <div className="flex justify-center mb-6">
                 <DharmaWheel className="w-16 h-16 text-[#F59E0B] animate-[spin_30s_linear_infinite]" />
               </div>

               <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white drop-shadow-xl mb-6">
                 {content.heroTitle}
               </h1>
               
               <p className="text-xl md:text-3xl text-[#FEF3C7] font-light leading-relaxed drop-shadow-md font-sans border-t border-b border-[#F59E0B]/50 py-6 inline-block">
                 {content.heroSubtitle}
               </p>

               <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 100 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="w-[1px] bg-gradient-to-b from-[#F59E0B] to-transparent mx-auto mt-12"
               />
             </motion.div>
          </div>
        </section>


        {/* --- SECTION 2: INTRODUCTION (The Mission) --- */}
        <section className="relative py-32 z-20">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    
                    {/* Left: Text */}
                    <motion.div 
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ margin: "-100px" }}
                      transition={{ duration: 1 }}
                      className="space-y-8"
                    >
                        <span className="text-[#D97706] font-bold tracking-[0.3em] uppercase text-xs font-sans flex items-center gap-2">
                           <Sun className="w-4 h-4" /> {content.missionTag}
                        </span>
                        
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#451a03]">
                          {content.missionTitle}
                        </h2>
                        
                        <div className="w-20 h-1 bg-[#F59E0B]" />
                        
                        <div className="text-[#78350F] text-lg leading-relaxed font-medium space-y-6 text-justify">
                          <p>
                            {content.missionDesc1}
                          </p>
                          <p>
                            {content.missionDesc2}
                          </p>
                        </div>
                    </motion.div>

                    {/* Right: Image Frame */}
                    <div className="relative group perspective-1000">
                         <div className="absolute inset-0 bg-[#F59E0B] rounded-t-[15rem] blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000" />
                         
                         <motion.div 
                           initial={{ rotateY: 10, opacity: 0 }}
                           whileInView={{ rotateY: 0, opacity: 1 }}
                           transition={{ duration: 1.2 }}
                           className="relative rounded-t-[20rem] rounded-b-2xl overflow-hidden border-[1px] border-[#78350F]/20 shadow-2xl bg-[#FEF3C7]"
                         >
                            <img 
                              src="https://images.unsplash.com/photo-1601633596408-f421f28b499f?q=80&w=2574&auto=format&fit=crop" 
                              alt="Buddha Statue" 
                              className="w-full h-[600px] object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s] sepia-[0.3]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#451a03]/40 via-transparent to-transparent opacity-60" />
                         </motion.div>
                    </div>
                </div>
            </div>
        </section>


        {/* --- SECTION 3: WHY US (The Cards) --- */}
        <section className="relative py-40 bg-[#FEF3C7] overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D97706]/20 to-transparent" />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <motion.div 
                       initial={{ opacity: 0, scale: 0.9 }}
                       whileInView={{ opacity: 1, scale: 1 }}
                       viewport={{ once: true }}
                    >
                       <Flower className="w-10 h-10 text-[#D97706] mx-auto mb-6 animate-pulse" />
                       <h2 className="text-4xl md:text-5xl font-bold text-[#451a03] mb-4">
                          {content.whyUsTitle}
                       </h2>
                       <p className="text-[#92400E] font-medium font-sans uppercase tracking-widest text-sm">
                          {content.whyUsSubtitle}
                       </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {content.cards.map((card, idx) => (
                      <NobleCard 
                        key={idx}
                        number={card.number} 
                        title={card.title} 
                        subtitle={card.subtitle} 
                        desc={card.desc}
                        icon={card.icon}
                        delay={idx * 0.2}
                      />
                    ))}
                </div>
            </div>
        </section>

      </main>
      <GoldenNirvanaFooter />
    </>
  );
}

// --- CARD COMPONENT ---
function NobleCard({ number, title, subtitle, desc, icon, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      viewport={{ margin: "-50px" }}
      className="group relative p-8 h-[420px] flex flex-col justify-between bg-[#FFFBEB] border border-[#FDE68A] hover:border-[#F59E0B] rounded-[2rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#F59E0B]/10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#FEF3C7]/0 via-transparent to-[#F59E0B]/0 group-hover:from-[#FEF3C7]/30 group-hover:to-[#FDE68A]/20 transition-all duration-500 rounded-[2rem]" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
           <span className="text-5xl font-bold text-[#FDE68A] font-sans group-hover:text-[#FCD34D] transition-colors">{number}</span>
           <div className="p-3 bg-[#FEF3C7] rounded-full text-[#B45309] border border-[#FDE68A] group-hover:text-[#78350F] group-hover:bg-[#FDE68A] transition-all">
             {icon}
           </div>
        </div>
        
        <h3 className="text-2xl font-bold text-[#451a03] mb-2 font-serif leading-tight">{title}</h3>
        <p className="text-xs uppercase tracking-widest text-[#D97706] mb-4 font-sans font-bold">{subtitle}</p>
      </div>

      <p className="text-[#78350F]/90 text-sm leading-relaxed border-t border-[#78350F]/10 pt-6 group-hover:border-[#F59E0B]/30 transition-colors font-medium">
        {desc}
      </p>
    </motion.div>
  )
}
