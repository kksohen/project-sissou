"use client";
import { useCallback, useState } from "react";
import { VideoCallProvider } from "./videocall-context";
import VideoCallManager from "./videocall-manager";
import VideoCallScreen from "./videocall-screen";

interface VideoCallWrapProps{
  chatRoomId: string;
  userId: number;
  username: string;
  avatar: string | null;
  participants: {
    id: number;
    username: string;
  }[];
};

export default function VideoCallWrap({chatRoomId, userId, username, avatar, participants}: VideoCallWrapProps){

  const [callState, setCallState] = useState({
    isCall: false,
    isCurrentHost: false,
    handleHostEnd: () => {},
    handleLeave: () => {}
  });

  const updateCallState = useCallback((
    isCall: boolean, 
    isHost: boolean, 
    handleHostEnd?: () => void, 
    handleLeave?: () => void
  ) => {
    setCallState(prev => {
      //상태 변경 시 업데이트
      if(prev.isCall === isCall && prev.isCurrentHost === isHost){
        return{
          ...prev,
          handleHostEnd: handleHostEnd || (() => {}),
          handleLeave: handleLeave || (() => {})
        };
      }
      
      return {
        isCall,
        isCurrentHost: isHost,
        handleHostEnd: handleHostEnd || (() => {}),
        handleLeave: handleLeave || (() => {})
      };
    });
  }, []);

  const contextValue = {
    ...callState,
    setCallState: updateCallState
  };

  return(
    <VideoCallProvider value={contextValue}>
      <VideoCallManager 
      chatRoomId={chatRoomId}
      userId={userId} username={username}
      participants={participants}
      renderBtnOnly={true}
      avatar={avatar}/>

      <VideoCallScreen 
      chatRoomId={chatRoomId}
      userId={userId} username={username} avatar={avatar}/>
    </VideoCallProvider>
  );
}