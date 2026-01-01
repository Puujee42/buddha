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
import { X, Loader2 } from "lucide-react";

interface Props {
  token: string;
  serverUrl: string;
  roomName: string;
  onLeave: () => void;
}

export default function LiveRitualRoom({ token, serverUrl, roomName, onLeave }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-[#05051a] flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <div>
          <h2 className="text-white font-serif text-xl tracking-widest">SPACE</h2>
          <p className="text-cyan-400 text-xs uppercase tracking-[0.2em]">{roomName}</p>
        </div>
        <button 
          onClick={onLeave}
          className="bg-red-500/20 hover:bg-red-500/40 text-red-200 px-4 py-2 rounded-full border border-red-500/30 backdrop-blur-md flex items-center gap-2 transition-all"
        >
          <X size={18} /> End Ritual
        </button>
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