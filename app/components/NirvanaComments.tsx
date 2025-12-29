"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Send, 
  Sparkles, 
  Flower, 
  Sun,
  Wind
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
// Ensure this path matches your project structure
import { Comment } from "@/database/types"; 

// --- VISUAL EFFECTS (Ported & Brightened from Hero) ---

// 1. Heavenly Rays (Adapted for Light Theme)
const HeavenlyRays = () => (
  <motion.div 
    animate={{ rotate: 360 }}
    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
    className="absolute -top-[50%] left-1/2 -translate-x-1/2 w-[150vmax] h-[150vmax] opacity-30 pointer-events-none z-0"
    style={{
      background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(251, 191, 36, 0.2) 20deg, transparent 40deg, transparent 60deg, rgba(251, 191, 36, 0.2) 80deg, transparent 100deg, transparent 180deg, rgba(245, 158, 11, 0.1) 220deg, transparent 260deg)"
    }}
  />
);

// 2. Golden Dust (Similar to Spirit Orbs but Golden)
const GoldenDust = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ y: "110vh", opacity: 0, scale: 0 }}
    animate={{ 
      y: "-20vh", 
      opacity: [0, 0.8, 0],
      scale: [0, 1.2, 0],
      x: (Math.random() - 0.5) * 100
    }}
    transition={{
      duration: Math.random() * 15 + 10,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    }}
    className="absolute w-1 h-1 bg-amber-400 rounded-full blur-[1px] shadow-[0_0_8px_#fbbf24] pointer-events-none"
    style={{ left: `${Math.random() * 100}%` }}
  />
);

export default function CelestialRiverComments() {
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Parallax Logic
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const yFog = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  
  // Mouse Interaction for the "Offering" glow
  const mouseX = useSpring(0, { stiffness: 40, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 40, damping: 20 });

  function handleMouseMove({ clientX, clientY, currentTarget }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // --- DATA FETCHING ---
  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch('/api/comments');
        if (response.ok) {
          const data = await response.json();
          // Fix Date objects from JSON string
          const formattedData = data.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt)
          }));
          setComments(formattedData);
        } else {
            // Mock Data if API fails (for visuals)
            const mockData: Comment[] = [
                { 
                    _id: '1' as any, 
                    authorName: 'Saruul', authorRole: 'Pilgrim', text: 'May peace be upon all beings.', 
                    avatar: 'https://i.pravatar.cc/150?u=1', karma: 12, element: 'gold', createdAt: new Date()
                },
                { 
                    _id: '2' as any, 
                    authorName: 'Tenzin', authorRole: 'Monk', text: 'The mind is like the sky, endless and clear.', 
                    avatar: 'https://i.pravatar.cc/150?u=2', karma: 108, element: 'ochre', createdAt: new Date()
                },
            ];
            setComments(mockData);
        }
      } catch (error) { console.error("Fetch Error", error); }
    }
    fetchComments();
  }, []);

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));
    
    // Create new optimistic comment based on Interface
    const newEntry: Comment = {
       _id: Date.now().toString() as any, // Cast for optimistic UI update
       authorName: "Seeker", // Could come from auth context
       authorRole: "Pilgrim",
       avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
       text: newComment,
       karma: 0,
       element: "light", // Default theme for new comments
       createdAt: new Date()
    };
    
    setComments([newEntry, ...comments]);
    setNewComment("");
    setIsSubmitting(false);
    
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const ui = {
     header: t({ mn: "Ариун Мөрөн", en: "River of Offering" }),
     sub: t({ mn: "Бодлын Урсгал", en: "Stream of Consciousness" }),
     placeholder: t({ mn: "Эерэг бодлоо илгээгээрэй...", en: "Inscribe your prayers..." }),
     btn: t({ mn: "Өргөх", en: "Offer Prayer" })
  };

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen py-32 overflow-hidden bg-[#FDFBF7]"
    >
      
      {/* ================= BACKGROUND: THE CELESTIAL REALM ================= */}
      
      {/* 1. Base Gradient (Cream to Divine Light) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/30 z-0" />
      
      {/* 2. Heavenly Rays (The 'Buddha' light from top) */}
      <HeavenlyRays />

      {/* 3. Fog Layer (Parallax Clouds) */}
      <motion.div 
         style={{ y: yFog }}
         className="absolute inset-0 z-0 opacity-40 mix-blend-soft-light bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" 
      />

      {/* 4. Rising Golden Dust */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
         {[...Array(25)].map((_, i) => <GoldenDust key={i} delay={i * 0.2} />)}
      </div>

      
      <div className="relative z-10 container mx-auto px-4 lg:px-12 flex flex-col h-full">
        
        {/* ================= HEADER ================= */}
        <div className="text-center mb-16 relative">
            
            {/* Spinning Sun Icon */}
            <motion.div
               initial={{ scale: 0, rotate: -90 }}
               whileInView={{ scale: 1, rotate: 0 }}
               transition={{ duration: 1, type: "spring" }}
               className="inline-block mb-4"
            >
               <Sun size={40} className="text-amber-500 animate-[spin_12s_linear_infinite]" />
            </motion.div>
            
            <motion.h2 
               initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
               whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
               className="text-6xl md:text-8xl font-serif text-[#78350F] drop-shadow-sm mb-2 tracking-tight"
            >
               {ui.header}
            </motion.h2>
            
            <div className="flex items-center justify-center gap-4">
               <div className="h-[1px] w-12 bg-amber-500/30" />
               <p className="text-amber-600/70 font-medium tracking-[0.3em] uppercase text-xs">{ui.sub}</p>
               <div className="h-[1px] w-12 bg-amber-500/30" />
            </div>
        </div>


        {/* ================= INPUT 'ALTAR' ================= */}
        <div className="relative max-w-2xl mx-auto mb-24 z-20 perspective-1000" onMouseMove={handleMouseMove}>
             
             {/* Dynamic Aura following mouse behind input */}
             <motion.div 
               className="absolute -inset-10 opacity-30 blur-2xl z-0"
               style={{
                 background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(251, 191, 36, 0.4), transparent 70%)`
               }}
             />

             <motion.form 
                onSubmit={handleSubmit}
                initial={{ rotateX: 20, opacity: 0, y: 50 }}
                whileInView={{ rotateX: 0, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative bg-white/80 backdrop-blur-xl border border-amber-200/50 rounded-2xl p-2 shadow-[0_10px_40px_-10px_rgba(251,191,36,0.2)] flex items-center gap-4 pr-3 overflow-hidden group hover:border-amber-400/50 transition-colors"
             >
                <div className="pl-4">
                   <Flower className="text-amber-400 group-hover:rotate-45 transition-transform duration-700" />
                </div>
                
                <input 
                   type="text"
                   value={newComment}
                   onChange={(e) => setNewComment(e.target.value)}
                   placeholder={ui.placeholder}
                   className="flex-1 bg-transparent border-none outline-none text-[#78350f] placeholder-amber-900/30 font-serif text-lg h-14"
                />
                
                <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   disabled={isSubmitting}
                   className="bg-gradient-to-br from-amber-400 to-orange-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-70"
                >
                   {isSubmitting ? <Wind className="animate-spin" /> : <Send size={18} />}
                   <span className="hidden md:inline">{ui.btn}</span>
                </motion.button>
             </motion.form>
        </div>


        {/* ================= HORIZONTAL SCROLL STREAM ================= */}
        <div className="relative w-full -mx-4 md:-mx-0">
             
             {/* Left & Right Fade (Fog edges) */}
             <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
             <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />

             {/* The Stream Channel */}
             <div 
               ref={scrollRef}
               className="flex overflow-x-auto gap-8 px-12 md:px-[20vw] py-12 pb-24 snap-x snap-mandatory hide-scrollbar scroll-smooth"
               style={{ scrollbarWidth: 'none' }}
             >
                {/* Connecting Golden Thread */}
                <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent -z-10" />

                <AnimatePresence mode="popLayout">
                   {comments.map((comment, index) => (
                      <LanternCard key={comment._id?.toString() || index} comment={comment} index={index} />
                   ))}
                </AnimatePresence>

                {/* Empty Space for smooth end scrolling */}
                <div className="shrink-0 w-[20vw]" />
             </div>
        </div>

      </div>
    </section>
  );
}

// =================================================================
// LANTERN CARD: The "Floating Thought" on the river
// =================================================================
function LanternCard({ comment, index }: { comment: Comment, index: number }) {
  
  // Independent Bobbing Physics
  const randomDuration = 4 + Math.random() * 2;
  const randomDelay = Math.random() * 2;
  
  // Theme styling based on element
  const elementStyles = {
    gold: "border-amber-400/50 bg-amber-50 shadow-[0_20px_40px_-10px_rgba(251,191,36,0.3)]",
    saffron: "border-orange-400/50 bg-orange-50 shadow-[0_20px_40px_-10px_rgba(249,115,22,0.3)]",
    ochre: "border-[#A16207]/30 bg-[#FEF3C7] shadow-[0_20px_40px_-10px_rgba(161,98,7,0.2)]",
    light: "border-white/80 bg-white/80 backdrop-blur-md shadow-[0_20px_40px_-10px_rgba(251,191,36,0.2)]",
  };
  const activeStyle = elementStyles[comment.element] || elementStyles.light;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 50, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
      transition={{ type: "spring", damping: 20, stiffness: 100, delay: index * 0.1 }}
      className="relative shrink-0 snap-center group perspective-1000"
    >
        {/* Bobbing Motion Wrapper */}
        <motion.div
           animate={{ y: [-8, 8, -8] }}
           transition={{ duration: randomDuration, delay: randomDelay, repeat: Infinity, ease: "easeInOut" }}
           className="relative"
        >
             {/* Thread Connection Nodes */}
             <div className="absolute top-1/2 left-[-15px] right-[-15px] h-[1px] bg-amber-300 z-0 opacity-50" />
             <div className="absolute top-1/2 left-[-6px] w-3 h-3 rounded-full bg-white border border-amber-400 z-10 -translate-y-1/2 shadow-sm" />
             <div className="absolute top-1/2 right-[-6px] w-3 h-3 rounded-full bg-white border border-amber-400 z-10 -translate-y-1/2 shadow-sm" />

             {/* CARD VISUALS */}
             <div className={`w-[320px] md:w-[380px] rounded-2xl p-6 ${activeStyle} border group-hover:-translate-y-2 transition-transform duration-500 ease-out`}>
                
                {/* Header info */}
                <div className="flex items-center gap-4 mb-4 border-b border-amber-900/5 pb-3">
                   <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                         <img src={comment.avatar} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      {/* Karma Badge */}
                      <div className="absolute -bottom-1 -right-1 bg-amber-100 text-[#92400e] text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-sm flex items-center gap-1">
                         <Sparkles size={8} /> {comment.karma}
                      </div>
                   </div>
                   
                   <div>
                      <h4 className="font-serif font-bold text-[#78350F] text-lg leading-none">{comment.authorName}</h4>
                      <p className="text-[10px] text-amber-900/50 uppercase tracking-widest mt-1">{comment.authorRole}</p>
                   </div>
                   
                   <div className="ml-auto opacity-20 group-hover:opacity-100 transition-opacity text-amber-500">
                      <Flower size={20} />
                   </div>
                </div>

                {/* Message Text */}
                <p className="text-[#451a03] font-light italic leading-relaxed text-base min-h-[60px]">
                   "{comment.text}"
                </p>

                {/* Footer Shine Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/40 to-transparent rounded-b-2xl pointer-events-none" />
             </div>

             {/* Water Reflection / Shadow */}
             <div className="absolute -bottom-10 left-8 right-8 h-4 bg-amber-500/20 blur-xl rounded-[100%] opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500" />
             
        </motion.div>
    </motion.div>
  );
}