"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Sparkles, 
  Flower, 
  Sun,
  CloudSun,
  ChevronLeft,
  ChevronRight,
  MoveRight
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Comment } from "@/database/types";

export default function CelestialRiverComments() {
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch('/api/comments');
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    }
    fetchComments();
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Ritual Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: "Guest Pilgrim", // Replace with actual user info if available
          authorRole: "Seeker",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop",
          text: newComment,
          element: "light"
        })
      });

      if (response.ok) {
        const newEntry = await response.json();
        setComments([newEntry, ...comments]);
        setNewComment("");
        
        // Auto scroll to start
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Wheel Navigation Logic
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const uiText = {
    tag: t({ mn: "Ариун Нийгэмлэг", en: "Sacred Community" }),
    titleMain: t({ mn: "Алтан Бодлын", en: "River of" }),
    titleAccent: t({ mn: "Мөрөн", en: "Golden Thoughts" }),
    placeholder: t({ mn: "Мэргэн ухаанаа урсгалд сийлнэ үү...", en: "Inscribe your wisdom upon the stream..." }),
    hint: t({ mn: "Үгс хүч чадалтай", en: "Words carry energy" }),
    btnOffer: t({ mn: "Өргөх", en: "Offer" }),
    merits: t({ mn: "Буян", en: "Merits" }),
    reply: t({ mn: "Хариулах", en: "Reply" })
  };

  return (
    <section className="relative w-full min-h-screen py-32 overflow-hidden bg-[#FFFBEB] font-sans selection:bg-[#F59E0B] selection:text-white">
      
      {/* 1. THE HEAVENLY ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/30" />
         <div className="absolute top-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-white via-white/50 to-transparent mix-blend-soft-light" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-multiply animate-pulse" />
         
         {/* Giant Rotating Wheel Background */}
         <div className="absolute bottom-[-40%] left-[-10%] w-[1200px] h-[1200px] opacity-[0.06] animate-[spin_200s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#F59E0B]">
               <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" fill="none" />
               <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.2" fill="none" />
               <path d="M50 0 L50 100 M0 50 L100 50" stroke="currentColor" strokeWidth="0.2" />
            </svg>
         </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        
        {/* 2. HEADER */}
        <div className="text-center mb-16 relative">
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-3 mb-4"
           >
              <CloudSun size={16} className="text-[#F59E0B]" />
              <span className="text-[#92400E] font-bold tracking-[0.3em] uppercase text-xs">
                {uiText.tag}
              </span>
           </motion.div>
           <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#78350F] drop-shadow-sm">
             {uiText.titleMain} <span className="text-[#D97706] italic">{uiText.titleAccent}</span>
           </h2>
        </div>

        {/* 3. INPUT ALTAR (Centered & Elevated) */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="mb-24 max-w-3xl mx-auto relative group"
        >
           <div className="absolute -inset-2 bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#FDE68A] rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000" />
           
           <form onSubmit={handleSubmit} className="relative bg-white/90 border border-[#F59E0B]/20 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex gap-6 items-start">
              
               <div className="hidden md:flex flex-col items-center gap-2 pt-1">
                  <div className="w-12 h-12 rounded-full border border-[#FDE68A] bg-[#FEF3C7] flex items-center justify-center text-xl shadow-inner">
                     🪷
                  </div>
               </div>

               <div className="flex-1">
                  <div className="relative">
                      <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={uiText.placeholder}
                        className="w-full bg-transparent text-[#451a03] placeholder-[#B45309]/50 text-xl font-serif leading-relaxed border-b-2 border-[#FDE68A] focus:border-[#F59E0B] p-2 min-h-[80px] focus:outline-none transition-all resize-none"
                      />
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                     <p className="text-[#B45309]/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={12} /> {uiText.hint}
                     </p>
                     <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold px-6 py-2 rounded-full flex items-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                        {isSubmitting ? <Sun size={18} className="animate-spin" /> : <span>{uiText.btnOffer}</span>}
                        {!isSubmitting && <Send size={14} />}
                     </motion.button>
                  </div>
               </div>
           </form>
        </motion.div>


        {/* 4. THE SCROLLING RIVER */}
        <div className="relative">
           
           {/* Navigation Wheels (Left/Right) */}
           <div className="absolute top-1/2 -translate-y-1/2 left-0 z-30 -ml-4 md:-ml-12">
              <button 
                 onClick={() => scroll('left')}
                 className="w-12 h-12 rounded-full bg-white border border-[#F59E0B] text-[#D97706] shadow-xl flex items-center justify-center hover:bg-[#FEF3C7] transition-all hover:scale-110 active:scale-95 group"
              >
                 <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </button>
           </div>
           
           <div className="absolute top-1/2 -translate-y-1/2 right-0 z-30 -mr-4 md:-mr-12">
              <button 
                 onClick={() => scroll('right')}
                 className="w-12 h-12 rounded-full bg-white border border-[#F59E0B] text-[#D97706] shadow-xl flex items-center justify-center hover:bg-[#FEF3C7] transition-all hover:scale-110 active:scale-95 group"
              >
                 <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>


           {/* THE SCROLL CONTAINER */}
           <div 
             ref={scrollContainerRef}
             className="flex overflow-x-auto gap-8 pb-12 px-4 hide-scrollbar snap-x snap-mandatory scroll-smooth"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
           >
             
             {/* The "Mala Thread" Line passing through all cards */}
             <div className="absolute top-12 left-0 w-[200%] h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B]/40 to-transparent pointer-events-none" />

             <AnimatePresence mode='popLayout'>
               {comments.map((comment, index) => (
                  <RiverCard key={comment._id?.toString() || index} comment={comment} index={index} meritsLabel={uiText.merits} replyLabel={uiText.reply} />
               ))}
             </AnimatePresence>

             {/* End of Stream Spacer */}
             <div className="shrink-0 w-12 flex items-center justify-center opacity-30">
                <Sun size={24} className="text-[#F59E0B] animate-spin-slow" />
             </div>
           </div>
        </div>

      </div>
    </section>
  );
}

// --- MICRO-COMPONENT: The Horizontal Scroll Card ---
function RiverCard({ comment, index, meritsLabel, replyLabel }: { comment: Comment, index: number, meritsLabel: string, replyLabel: string }) {
   
   // Different background tints for visual rhythm
   const bgTint = index % 2 === 0 ? "bg-white" : "bg-[#FFFCF5]";
   const displayTime = comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now";
   
   return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="relative shrink-0 w-[85vw] md:w-[400px] snap-center group"
      >
         
         {/* Bead on the thread */}
         <div className="absolute top-[38px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F59E0B] border-2 border-[#FEF3C7] shadow-md z-20 group-hover:scale-125 transition-transform duration-500" />

         <div className={`
            mt-12 relative ${bgTint} p-8 rounded-3xl
            border-t-4 border-t-[#F59E0B]
            border-l border-r border-b border-[#FDE68A]/50
            shadow-[0_10px_30px_-10px_rgba(245,158,11,0.1)]
            hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.2)] 
            hover:-translate-y-2
            transition-all duration-500 ease-out
         `}>
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
               <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white ring-2 ring-[#FDE68A] shadow-sm">
                     <img src={comment.avatar} alt={comment.authorName} className="w-full h-full object-cover" />
                  </div>
               </div>
               <div>
                  <h4 className="text-[#78350F] font-bold text-lg font-serif leading-none">
                     {comment.authorName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                        {comment.authorRole}
                     </span>
                     <span className="text-[10px] text-[#B45309]/50 font-medium">
                        • {displayTime}
                     </span>
                  </div>
               </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
               <p className="text-[#451a03] font-light leading-relaxed text-lg min-h-[80px]">
                  &quot;{comment.text}&quot;
               </p>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 pt-4 border-t border-[#FDE68A]/30 flex items-center justify-between">
               <button className="flex items-center gap-2 group/btn">
                   <div className="p-2 rounded-full bg-[#FFFBEB] text-[#D97706] group-hover/btn:bg-[#F59E0B] group-hover/btn:text-white transition-colors">
                      <Flower size={16} />
                   </div>
                   <div className="flex flex-col items-start">
                      <span className="text-sm font-bold text-[#78350F]">{comment.karma}</span>
                      <span className="text-[9px] uppercase tracking-wider text-[#B45309]/60">{meritsLabel}</span>
                   </div>
               </button>
               
               <button className="flex items-center gap-1 text-xs font-bold text-[#D97706] hover:text-[#B45309] uppercase tracking-wide">
                  {replyLabel} <MoveRight size={14} />
               </button>
            </div>
            
            {/* Decorative BG Watermark */}
            <div className="absolute right-[-10px] bottom-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
                <Sun size={100} />
            </div>

         </div>
      </motion.div>
   )
}
