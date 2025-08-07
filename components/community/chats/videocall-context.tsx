"use client";
import { createContext, ReactNode, useContext } from "react";

interface VideoCallProviderProps{
  children: ReactNode;
  value: VideoCallContextType;
};

interface VideoCallContextType{
  isCall: boolean;
  isCurrentHost: boolean;
  handleHostEnd: () => void;
  handleLeave: () => void;
  setCallState: (
    isCall: boolean, 
    isHost: boolean, 
    handleHostEnd?: () => void, 
    handleLeave?: () => void
  ) => void;
};

const VideoCallContext = createContext<VideoCallContextType | null>(null);

export const useVideoCallContext = ()=>{
  const context = useContext(VideoCallContext);
  if(!context){
    throw new Error("VideoCallProvider 내에서만 사용할 수 있습니다.");
  };
  return context;
};

export const VideoCallProvider = ({children, value}: VideoCallProviderProps)=>{
  return(
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  );
};