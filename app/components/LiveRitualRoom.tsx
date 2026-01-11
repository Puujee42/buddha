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
}

export default function LiveRitualRoom({ token, serverUrl, roomName, onLeave, isMonk = false }: Props) {
  const [isBookOpen, setIsBookOpen] = React.useState(false);

  // --- TIMER LOGIC (30 MIN LIMIT) ---
  const [timeLeft, setTimeLeft] = React.useState(30 * 60); // 30 minutes in seconds

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onLeave(); // Auto-end
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onLeave]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const timerColor = timeLeft < 60 ? "text-red-500 animate-pulse" : timeLeft < 300 ? "text-amber-500" : "text-white";


  return (
    <div className="fixed inset-0 z-50 bg-[#05051a] flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <h2 className="text-white font-serif text-xl tracking-widest">SPACE</h2>
          <div className="flex items-center gap-3">
            <p className="text-cyan-400 text-xs uppercase tracking-[0.2em]">{roomName}</p>
            <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded border border-white/10 bg-black/40 ${timerColor}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          {isMonk && (
            <button
              onClick={() => setIsBookOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
            >
              <BookOpen size={16} /> Nom (Book)
            </button>
          )}

          <button
            onClick={onLeave}
            className="bg-red-500/20 hover:bg-red-500/40 text-red-200 px-4 py-2 rounded-full border border-red-500/30 backdrop-blur-md flex items-center gap-2 transition-all"
          >
            <X size={18} /> End Ritual
          </button>
        </div>
      </div>

      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        // Use the default LiveKit theme, or remove 'data-lk-theme' for custom CSS
        data-lk-theme="default"
        style={{ height: '100vh' }}
        onDisconnected={onLeave}
      >
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar variation="minimal" />
      </LiveKitRoom>

      {/* Digital Book Overlay */}
      <BookViewer isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} />
    </div>
  );
}

function MyVideoConference() {
  // Custom layout logic to make it look nicer
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - 80px)' }}>
      <ParticipantTile />
    </GridLayout>
  );
}