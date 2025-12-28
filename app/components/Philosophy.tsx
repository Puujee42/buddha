"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Scroll, Crown, Brush, History } from "lucide-react"; // Updated icons for history
import { useLanguage } from "../contexts/LanguageContext"; 

// --- REUSED PATTERNS ---
const UlziiKnot = ({ className, opacity = 0.1 }: { className?: string; opacity?: number }) => (
  <svg viewBox="0 0 100 100" className={className} style={{ opacity }}>
    <path 
      d="M30 30 L70 30 L70 70 L30 70 Z M20 40 L80 40 M40 20 L40 80 M60 20 L60 80" 
      stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" className="drop-shadow-lg"
    />
    <path 
      d="M30 30 L70 30 L70 70 L30 70 Z M20 40 L80 40 M40 20 L40 80 M60 20 L60 80" 
      stroke="#FCD34D" strokeWidth="2" fill="none"
    />
  </svg>
);

const UgalzCorner = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M10 10 C 30 10, 50 20, 60 40 C 70 60, 60 80, 40 90 L 40 80 C 50 75, 60 60, 50 45 C 40 30, 25 25, 10 25 Z" />
    <circle cx="15" cy="15" r="5" className="text-amber-400" fill="currentColor"/>
  </svg>
);

export default function ScrollHeritageSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t, language } = useLanguage();

  // --- DATA: The 3 Historical Eras ---
  const eras = [
    {
      id: "ancient",
      icon: <History />,
      // Theme: Ancient/Earth/Archeology
      image: "/tenzin.png", 
      theme: {
        bg: "bg-[#2C1A16]", // Dark Clay
        accent: "text-amber-600",
        smoke: "bg-orange-900"
      },
      bichig: "ᠡᠷᠲᠡᠨ ᠦ", // "Ancient" in Mongol Bichig
      content: t({
        mn: {
          period: "МЭӨ II - МЭ IX зуун",
          title: "Эртний Дэлгэрэлт",
          headline: "Хүннүгээс Уйгур гүрэн хүртэл",
          desc: "Бурхны шашин Монгол нутагт Хүннү гүрний үеэс анх нэвтэрч эхэлсэн түүхтэй. Төв Азийн нүүдэлчин ард түмэн Энэтхэг, Гандхарын соёлтой танилцаж, Түрэг, Уйгурын хаант улсын үед судар ном орчуулах, сүм хийд барих үйл явц эрчимтэй явагдсан юм."
        },
        en: {
          period: "2nd Century BC - 9th Century AD",
          title: "The Ancient Spread",
          headline: "From Xiongnu to Uyghur",
          desc: "Buddhism first entered the Mongolian plateau during the Xiongnu dynasty. Nomadic peoples of Central Asia encountered Indian and Gandharan cultures, leading to the translation of sutras and construction of temples during the Turkic and Uyghur Khaganates."
        }
      })
    },
    {
      id: "middle",
      icon: <Crown />,
      // Theme: Empire/Royal/Blue
      image: "/bell.png ",
      theme: {
        bg: "bg-[#0F172A]", // Royal Blue/Dark Slate
        accent: "text-blue-400",
        smoke: "bg-blue-900"
      },
      bichig: "ᠳᠤᠮᠳᠠᠳᠤ", // "Middle"
      content: t({
        mn: {
            period: "XIII - XIV зуун",
            title: "Дундад Дэлгэрэлт",
            headline: "Их Монгол Улс ба Төрийн шашин",
            desc: "Чингис хаан болон түүний залгамжлагчид дэлхийн олон шашныг хүндэтгэн үздэг байсан ч Хубилай Сэцэн хааны үед Бурхны шашныг 'Төрийн шашин' болгон тунхагласан. Пагва лам болон Хубилай хааны 'Багш-Шийтгүүлэгч'-ийн харилцаа нь төр, шашны хос ёсны бодлогыг үндэслэсэн юм."
        },
        en: {
            period: "13th - 14th Century",
            title: "The Middle Spread",
            headline: "The Great Mongol Empire",
            desc: "While Genghis Khan respected all religions, it was during the reign of Kublai Khan that Buddhism was declared the 'State Religion'. The Priest-Patron relationship established between Pagpa Lama and Kublai Khan laid the foundation for the dual policy of state and religion."
        }
      })
    },
    {
      id: "late",
      icon: <Brush />,
      // Theme: Renaissance/Gold/Red
      image: "/temple.png",
      theme: {
        bg: "bg-[#330F0F]", // Deep Crimson
        accent: "text-red-400",
        smoke: "bg-red-900"
      },
      bichig: "ᠬᠣᠵᠢᠭᠤ", // "Late"
      content: t({
        mn: {
            period: "XVI зуунаас өнөөг хүртэл",
            title: "Хожуу Дэлгэрэлт",
            headline: "Алтан хаан ба Өндөр гэгээн",
            desc: "1577 онд Түмэдийн Алтан хаан III Далай ламтай уулзсанаар Шарын шашин Монголд бүрэн дэлгэрсэн. Үүний дараа Монголын анхны Богд Өндөр гэгээн Занабазар шашин, урлаг, соёлын гайхамшигт бүтээлүүдээ туурвиж, Гандантэгчинлэн зэрэг томоохон хийдүүд байгуулагдсан билээ."
        },
        en: {
            period: "16th Century - Present",
            title: "The Late Spread",
            headline: "The Cultural Renaissance",
            desc: "In 1577, Altan Khan met the 3rd Dalai Lama, solidifying the Gelug school in Mongolia. Later, Undur Gegeen Zanabazar, the first Bogd, created masterpieces of art and founded major monasteries like Gandantegchinlen, shaping the cultural heritage we know today."
        }
      })
    },
  ];

  const current = eras[activeIndex];

  return (
    // Note: 'bg-[#FDFBF7]' on the outer wrapper matches the previous section's background
    <div className="bg-[#FDFBF7]">
        
        {/* === 1. TRANSITION DIVIDER === */}
        <div className={`relative h-24 w-full -mb-1 z-20 overflow-hidden`}>
            <svg className={`absolute bottom-0 w-full h-full transition-colors duration-1000 ${current.theme.bg}`} preserveAspectRatio="none" viewBox="0 0 1440 100" fill="currentColor">
               <path d="M0,100 L1440,100 L1440,0 C960,80 480,80 0,0 Z" fill="currentColor" />
            </svg>
        </div>

        <section className={`relative transition-colors duration-1000 ease-in-out ${current.theme.bg} pb-32`}>
        
        {/* === 2. FIXED BACKGROUND LAYERS === */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            {/* Texture */}
            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/wall-4-light.png')] mix-blend-overlay" />
            
            {/* Rotating Ulzii */}
            <div className="fixed top-1/2 right-[-10%] w-[800px] h-[800px] -translate-y-1/2 opacity-[0.03] text-white">
                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 200, repeat: Infinity, ease: "linear" }} className="w-full h-full">
                    <UlziiKnot className="w-full h-full" opacity={1} />
                 </motion.div>
            </div>

            {/* Fog Effect at Bottom */}
            <motion.div 
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 2 }}
                className={`fixed bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-black via-${current.theme.smoke} to-transparent blur-[100px]`}
            />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12">
            
            {/* === 3. HEADER === */}
            <div className="pt-24 pb-32 max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-[2px] w-8 bg-amber-500/60" />
                    <span className="text-amber-500/80 text-xs font-bold uppercase tracking-[0.3em]">
                       {t({mn: "Монголын түүх", en: "Mongolian Heritage"})}
                    </span>
                </div>
                {/* Header Text Animation on Language Switch */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={language}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-5xl md:text-7xl font-serif text-white/90 drop-shadow-xl">
                            {t({mn: "Гурван Цаг", en: "Three Great"})} <span className="italic text-amber-500 font-light">{t({mn: "Үе", en: "Eras"})}</span>
                        </h2>
                        <p className="mt-8 text-lg text-white/60 font-light leading-relaxed border-l border-amber-500/30 pl-6">
                            {t({
                                mn: "Бурхны шашин Монголд дэлгэрсэн түүхэн замналтай танилцана уу.",
                                en: "Explore the historical timeline of how Buddhism flourished across the Mongolian plateau."
                            })}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* === 4. SPLIT LAYOUT (SCROLLYTELLING) === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* LEFT: SCROLLING TEXT */}
                <div className="flex flex-col gap-[30vh]">
                    {eras.map((item, index) => (
                        <WisdomBlock 
                            key={item.id} 
                            item={item} 
                            index={index} 
                            language={language}
                            onVisible={setActiveIndex} 
                        />
                    ))}
                    {/* Extra space at bottom */}
                    <div className="h-[20vh]" />
                </div>

                {/* RIGHT: STICKY VISUAL */}
                <div className="hidden lg:block h-[80vh] sticky top-[10vh]">
                     <div className="relative w-full h-full flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative w-[400px] h-[520px]"
                            >
                                {/* THE FRAME */}
                                <div className="absolute inset-0 bg-[#151515] border border-amber-900/40 shadow-2xl rounded-sm p-3">
                                    <div className="absolute inset-0 border-[10px] border-[#3E2723] rounded-sm z-20 pointer-events-none opacity-80" />
                                    
                                    {/* Ornamental Corners */}
                                    <div className="absolute -top-3 -left-3 w-16 h-16 text-amber-500 z-30 drop-shadow-md"><UgalzCorner /></div>
                                    <div className="absolute -top-3 -right-3 w-16 h-16 text-amber-500 z-30 drop-shadow-md rotate-90"><UgalzCorner /></div>
                                    <div className="absolute -bottom-3 -left-3 w-16 h-16 text-amber-500 z-30 drop-shadow-md -rotate-90"><UgalzCorner /></div>
                                    <div className="absolute -bottom-3 -right-3 w-16 h-16 text-amber-500 z-30 drop-shadow-md rotate-180"><UgalzCorner /></div>

                                    {/* IMAGE */}
                                    <div className="relative w-full h-full overflow-hidden bg-black">
                                        <img 
                                            src={current.image} 
                                            alt={current.content.title} 
                                            className="w-full h-full object-cover opacity-90"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t from-${current.theme.bg} via-transparent to-transparent opacity-80`} />
                                    </div>
                                </div>

                                {/* SIDEBAR SCRIPT (Vertical Mongol Bichig) */}
                                <div className="absolute -right-8 top-12 bottom-12 w-16 bg-[#261810] flex flex-col items-center py-6 shadow-2xl rounded-r-md border-l border-white/5 z-0">
                                    <div className="w-[1px] h-12 bg-amber-500/50 mb-4" />
                                    <span style={{ writingMode: 'vertical-rl' }} className="text-2xl text-amber-500 font-serif tracking-widest leading-loose h-full">
                                        {/* Display Mongol Bichig Unicode */}
                                        {current.bichig}
                                    </span>
                                    <div className="mt-auto pt-4">
                                        <Scroll className="text-amber-800/80 w-6 h-6" />
                                    </div>
                                </div>

                            </motion.div>
                        </AnimatePresence>
                     </div>
                </div>

            </div>
        </div>

        </section>
    </div>
  );
}

// --- SUB-COMPONENT: SCROLL TRIGGER ---
function WisdomBlock({ item, index, language, onVisible }: { item: any, index: number, language: string, onVisible: (n: number) => void }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

    useEffect(() => {
        if (isInView) onVisible(index);
    }, [isInView, index, onVisible]);

    return (
        <div ref={ref} className="min-h-[60vh] flex items-center">
            <motion.div 
                className={`max-w-md transition-all duration-700 ${isInView ? "opacity-100 translate-x-0" : "opacity-30 -translate-x-10 blur-sm"}`}
            >
                <div className={`inline-flex items-center justify-center p-4 rounded-full mb-6 border bg-white/5 backdrop-blur-md ${isInView ? "text-amber-400 border-amber-500/50" : "text-white/20 border-white/10"}`}>
                    {item.icon}
                </div>
                
                {/* Content with Language Animation */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={language}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 5 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2">
                            {item.content.period}
                        </div>
                        <h3 className="text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
                            {item.content.title}
                        </h3>
                        <div className="text-lg text-white/90 font-medium mb-4 italic font-serif">
                             "{item.content.headline}"
                        </div>
                        <p className="text-lg text-stone-300 font-light leading-relaxed mb-6">
                            {item.content.desc}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-3 opacity-60">
                    <span className="w-12 h-[1px] bg-white/30" />
                    {/* Decorative Roman Numeral */}
                    <span className="text-xs tracking-[0.2em] uppercase text-white/50">
                        {index === 0 ? "I" : index === 1 ? "II" : "III"}
                    </span>
                </div>

                {/* Mobile Image (Visible only on small screens) */}
                <div className="lg:hidden mt-8 w-full aspect-video rounded-md overflow-hidden border border-white/10 relative">
                     <img src={item.image} alt={item.content.title} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/20" />
                </div>
            </motion.div>
        </div>
    );
}