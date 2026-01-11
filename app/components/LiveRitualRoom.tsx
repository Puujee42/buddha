"use client";

import React from "react";
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  TrackReferenceOrPlaceholder,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import BookViewer from "./BookViewer";
import { X, Loader2, BookOpen } from "lucide-react";

interface Props {
  token: string;
  serverUrl: string;
  roomName: string;
  onLeave: () => void;
  isMonk?: boolean;
  bookingId?: string; // New prop for auto-cleanup
}

export default function LiveRitualRoom({ token, serverUrl, roomName, onLeave, isMonk = false, bookingId }: Props) {
  const [isBookOpen, setIsBookOpen] = React.useState(false);

  // --- TIMER LOGIC (30 MIN LIMIT + AUTO CLEANUP) ---
  const [timeLeft, setTimeLeft] = React.useState(30 * 60); // 30 minutes in seconds

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-complete booking to delete chat history
          if (bookingId) {
            fetch(`/api/bookings/${bookingId}/complete`, { method: 'POST' })
              .then(() => console.log('Session auto-completed and chat deleted'))
              .catch(err => console.error('Auto-complete failed:', err));
          }
          onLeave(); // Close the room
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onLeave, bookingId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const timerColor = timeLeft < 60 ? "text-red-500 animate-pulse" : timeLeft < 300 ? "text-amber-500" : "text-white";


  return (
    <div className="fixed inset-0 z-50 bg-[#05051a] flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-2 md:p-4 flex flex-wrap justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none gap-2">
        <div className="pointer-events-auto flex flex-col">
          <h2 className="text-white font-serif text-sm md:text-xl tracking-widest leading-none">SPACE</h2>
          <div className="flex items-center gap-2">
            <p className="text-cyan-400 text-[10px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] truncate max-w-[120px] md:max-w-none">
              {roomName}
            </p>
            <div className={`text-[10px] md:text-xs font-mono font-bold px-1.5 py-0.5 rounded border border-white/10 bg-black/40 ${timerColor}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
          {isMonk && (
            <button
              onClick={() => setIsBookOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-black px-2 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-1.5 md:gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 whitespace-nowrap"
            >
              <BookOpen size={14} className="md:w-4 md:h-4" /> Nom
            </button>
          )}

          <button
            onClick={onLeave}
            className="bg-red-500/20 hover:bg-red-500/40 text-red-200 px-2 md:px-4 py-1.5 md:py-2 rounded-full border border-red-500/30 backdrop-blur-md flex items-center gap-1.5 md:gap-2 transition-all text-[10px] md:text-xs whitespace-nowrap active:scale-95"
          >
            <X size={14} className="md:w-4 md:h-4" /> End
          </button>
        </div>
      </div>

      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: '100vh' }}
        onDisconnected={onLeave}
        connect={true}
      >
        {/* Use default VideoConference for reliable two-way video */}
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>

      {/* Digital Book Overlay */}
      <BookViewer isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} />
    </div>
  );
}