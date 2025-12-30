"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring,
  useMotionTemplate,
  useMotionValue
} from "framer-motion";
import { 
  Sparkles, 
  Flower, 
  Sun,
  Moon,
  Star,
  Eye,
  Loader2,
  Orbit
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";
import { Comment } from "@/database/types"; 

// --- ZODIAC GALAXY ATMOSPHERE ---

const CelestialAtmosphere = ({ isDark }: { isDark: boolean }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Deep Space Base */}
    <div className={`absolute inset-0 transition-opacity duration-1000 ${
      isDark ? "bg-[#05051a] opacity-100" : "bg-[#FDFBF7] opacity-100"
    }`} />
    
    {/* Nebula Watercolor Clouds */}
    {isDark && (
      <>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-full h-full rounded-full blur-[140px] bg-[#C72075]"
        />
        <motion.div 
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -bottom-40 -right-20 w-full h-full rounded-full blur-[140px] bg-[#2E1B49]"
        />
      </>
    )}

    {/* Rotating Celestial Halo */}
    <motion.div 
      animate={{ rotate: isDark ? -360 : 360 }}
      transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-40%] left-[-25%] w-[150vw] h-[150vw] opacity-[0.08]"
      style={{
        background: isDark 
          ? "conic-gradient(from 0deg, transparent 0%, #50F2CE 15%, transparent 40%, #C72075 60%, transparent 80%)"
          : "conic-gradient(from 0deg, transparent 0%, #fbbf24 10%, transparent 50%)"
      }}
    />

    {/* Multi-colored Stardust */}
    <div className="absolute inset-0 z-[1]">
      {[...Array(35)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ 
            y: "-10vh", 
            opacity: [0, 0.8, 0],
            x: Math.sin(i) * 100
          }}
          transition={{
            duration: 10 + (i % 8),
            repeat: Infinity,
            delay: i * 0.3,
          }}
          className={`absolute rounded-full blur-[1px] ${
            isDark 
              ? (i % 2 === 0 ? "bg-cyan-300 shadow-[0_0_10px_#50F2CE] w-[2px] h-[2px]" : "bg-magenta-400 shadow-[0_0_8px_#C72075] w-[1px] h-[1px]") 
              : "bg-amber-400 shadow-[0_0_8px_orange] w-[2px] h-[2px]"
          }`}
          style={{ left: `${(i * 6) % 100}%` }}
        />
      ))}
    </div>
  </div>
);

export default function CelestialRiverComments() {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const mouseX = useSpring(0, { stiffness: 40, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 40, damping: 20 });

  const isDark = false;
  const glowColor = isDark ? 'rgba(199, 32, 117, 0.3)' : 'rgba(251, 191, 36, 0.3)';
  const glowTemplate = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 70%)`;

  useEffect(() => {
    setMounted(true);
    // Note: Use your actual API fetch logic here
    setComments([]); 
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#05051a]" />;

  const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    
    const newEntry: Comment = {
       _id: Date.now().toString() as any,
       authorName: "Star-born",
       authorRole: isDark ? "Celestial Voyager" : "Pilgrim of Light",
       avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
       text: newComment,
       karma: 0,
       element: isDark ? "gold" : "light",
       createdAt: new Date()
    };
    
    setComments([newEntry, ...comments]);
    setNewComment("");
    setTimeout(() => setIsSubmitting(false), 800);
  };

  const ui = {
     header: isDark ? t({ mn: "Одот Мөрөн", en: "Nebula Stream" }) : t({ mn: "Ариун Мөрөн", en: "River of Offering" }),
     sub: isDark ? t({ mn: "Зурхайн цуглуулга", en: "The Collective Zodiac" }) : t({ mn: "Бодлын Урсгал", en: "Stream of Consciousness" }),
     btn: isDark ? t({ mn: "Оддын тамга", en: "Seal Star" }) : t({ mn: "Өргөх", en: "Offer Prayer" })
  };

  return (
    <section className="relative w-full py-40 overflow-hidden font-ethereal transition-colors duration-1000">
      <CelestialAtmosphere isDark={isDark} />

      <div className="relative z-10 container mx-auto px-4 lg:px-12 flex flex-col h-full">
        
        {/* ================= HEADER ================= */}
        <div className="text-center mb-24 relative">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="inline-block mb-6">
               <div className={`p-4 rounded-full border shadow-2xl transition-all duration-700 ${
                   isDark ? "bg-[#0C164F]/60 border-cyan-400/50 text-cyan-300" : "bg-white border-amber-200 text-amber-500"
               }`}>
                  {isDark ? <Orbit size={32} className="animate-pulse" /> : <Sun size={32} className="animate-spin-slow" />}
               </div>
            </motion.div>
            
            <h2 className={`text-6xl md:text-9xl font-serif tracking-tight transition-colors drop-shadow-[0_0_30px_rgba(80,242,206,0.2)] ${isDark ? "text-white" : "text-[#78350F]"}`}>
               {ui.header}
            </h2>
            <div className="flex items-center justify-center gap-4 mt-6">
                <div className={`h-px w-20 bg-linear-to-r from-transparent via-current to-transparent ${isDark ? 'text-cyan-500' : 'text-amber-500'}`} />
                <p className={`text-[10px] font-black tracking-[0.6em] uppercase opacity-70 ${isDark ? "text-cyan-100" : "text-amber-800"}`}>{ui.sub}</p>
                <div className={`h-px w-20 bg-linear-to-r from-transparent via-current to-transparent ${isDark ? 'text-cyan-500' : 'text-amber-500'}`} />
            </div>
        </div>

        {/* ================= INPUT SEAL ================= */}
        <div className="relative max-w-2xl w-full mx-auto mb-32 z-20" onMouseMove={handleMouseMove}>
             <motion.div className="absolute -inset-20 opacity-40 blur-3xl z-0 pointer-events-none" style={{ background: glowTemplate }} />

             <form onSubmit={handleSubmit} className={`relative backdrop-blur-3xl border-2 rounded-2xl p-2 flex items-center gap-4 transition-all duration-700 shadow-2xl ${
                 isDark ? "bg-[#0C164F]/40 border-cyan-400/30" : "bg-white/80 border-amber-200/50"
             }`}>
                <div className="pl-6">
                   {isDark ? <Sparkles className="text-[#C72075]" size={24} /> : <Flower className="text-amber-400" size={24} />}
                </div>
                <input 
                   type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)}
                   placeholder="..."
                   className={`flex-1 bg-transparent border-none outline-none font-serif text-2xl h-16 ${isDark ? "text-white placeholder-cyan-400/20" : "text-[#78350f] placeholder-amber-900/20"}`}
                />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`px-10 py-5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3 transition-all ${
                    isDark ? "bg-gradient-to-r from-[#C72075] to-[#7B337D] text-white shadow-[#C72075]/30" : "bg-amber-500 text-white"
                }`}>
                   {isSubmitting ? <Loader2 className="animate-spin" /> : <Star size={16} />} <span>{ui.btn}</span>
                </motion.button>
             </form>
        </div>

        {/* ================= THE NEBULA CARDS ================= */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-16 px-12 md:px-[30vw] py-20 hide-scrollbar scroll-smooth snap-x"
          style={{ scrollbarWidth: 'none' }}
        >
          <AnimatePresence mode="popLayout">
             {comments.map((comment, index) => (
                <ArcanaCard key={comment._id?.toString() || index} comment={comment} index={index} isDark={isDark} />
             ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

// --- SUB-COMPONENT: 3D NEBULA CARD ---

function ArcanaCard({ comment, index, isDark }: { comment: Comment, index: number, isDark: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [12, -12]), { stiffness: 60, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-12, 12]), { stiffness: 60, damping: 20 });

  function handleCardMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
      onMouseMove={handleCardMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative shrink-0 snap-center perspective-1000 group"
    >
        <motion.div
           style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
           className={`w-[320px] md:w-[380px] h-[520px] rounded-sm border-2 p-10 flex flex-col transition-all duration-700 shadow-2xl relative ${
              isDark ? "bg-[#0C164F]/80 border-cyan-400/30 text-cyan-50" : "bg-white/90 border-amber-200 text-[#451a03]"
           }`}
        >
             {/* Ornate Frame Inside Card */}
             <div className={`absolute inset-4 border transition-colors opacity-10 ${isDark ? "border-cyan-400" : "border-amber-500"}`} />
             
             {/* Identity */}
             <div className="relative z-10 flex flex-col items-center text-center mb-10 pt-2">
                <span className={`text-[8px] font-black tracking-[0.8em] uppercase mb-6 opacity-50 transition-colors ${isDark ? 'text-cyan-300' : 'text-amber-800'}`}>
                   NEBULA Arcana {index + 1}
                </span>
                
                <div className="relative mb-6">
                    <div className={`w-20 h-20 rounded-full border-2 p-1 transition-all duration-1000 ${isDark ? "border-[#C72075]/50 shadow-[0_0_15px_rgba(199,32,117,0.3)]" : "border-amber-400"}`}>
                       <img src={comment.avatar} className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="avatar" />
                    </div>
                    <Sparkles className={`absolute -top-2 -right-2 ${isDark ? 'text-cyan-300' : 'text-amber-400'} animate-pulse`} size={16} />
                </div>

                <h4 className="font-serif text-2xl tracking-widest uppercase mb-1 drop-shadow-md">{comment.authorName}</h4>
                <p className={`text-[9px] font-bold tracking-[0.3em] uppercase ${isDark ? "text-cyan-400" : "text-amber-600"}`}>
                  {comment.authorRole}
                </p>
             </div>

             {/* Soul Message */}
             <div className="relative z-10 flex-1 flex flex-col justify-center px-2">
                <p className="text-base font-medium leading-relaxed italic text-center opacity-80 line-clamp-6 font-serif">
                   "{comment.text}"
                </p>
             </div>

             {/* Footer Archetype */}
             <div className="relative z-10 pt-8 flex justify-between items-center opacity-30">
                <div className="h-px flex-1 bg-current mr-4" />
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest">
                   <Star size={12} fill="currentColor" /> {comment.karma}
                </div>
                <div className="h-px flex-1 bg-current ml-4" />
             </div>

             {/* Cosmic Glare Effect */}
             <div className={`absolute inset-0 bg-linear-to-tr from-transparent ${isDark ? 'via-cyan-400/5' : 'via-white/20'} to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] pointer-events-none`} />
        </motion.div>
        
        {/* Glow Under Card */}
        <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 w-2/3 h-12 blur-3xl opacity-20 transition-colors duration-1000 ${isDark ? "bg-[#C72075]" : "bg-amber-400"}`} />
    </motion.div>
  );
}