"use client";
import { useVideoCall } from "@/lib/socket/useVideoCall";
import { useEffect, useRef, useCallback, useState } from 'react';
import { endVideoCall, joinVideoCall, saveMessage } from "@/app/(tabs)/chats/[id]/actions";
import VideoCallInvitation from "./videocall-invitation";
import { client } from "./chat-message-list";
import { SpeakerWaveIcon, SpeakerXMarkIcon, VideoCameraIcon as VideoCameraOn } from "@heroicons/react/24/solid";
import { VideoCameraSlashIcon as VideoCameraOff } from "@heroicons/react/24/solid";
import { useVideoCallContext } from "./videocall-context";
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from 'framer-motion';
import { formatTimeDuration } from "@/lib/utils";
import { RealtimeChannel } from "@supabase/supabase-js";

interface VideoCallScreenProps{
  chatRoomId: string;
  userId: number;
  username: string;
  avatar?: string | null;
};

//framer-motion
const containerVars = {
  expanded: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      staggerChildren: 0.1
    }
  },
  minimized: {
    scale: 0.2,
    opacity: 0.8,
    transition: {
      duration: 0.27,
      ease: "easeInOut"
    }
  }
};

const videoVars = {
  expanded: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut"
    }
  },
  minimized: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.17,
      ease: "easeIn"
    }
  }
};

const btnVars = {
  expanded: {
    scale: 1,
    opacity: 1,
    y: 0
  },
  minimized: {
    scale: 0,
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.17
    }
  }
};

export default function VideoCallScreen({chatRoomId, userId, username, avatar}: VideoCallScreenProps){
  const {setCallState} = useVideoCallContext(); //통화 상태 업데이트
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [invitation, setInvitation] = useState<any>(null);
  const [localHostId, setLocalHostId] = useState<number | null>(null);
  const [currentCallHost, setCurrentCallHost] = useState<number | null>(null);
  const [active, setActive] = useState(null);
  const [isMinimize, setIsMinimize] = useState(false);

  const isCallStartRef = useRef(false); 
  const isCallEndRef = useRef(false); 
  const videoRef = useRef<HTMLVideoElement>(null); //my video
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map()); //other users video
  const videoChannelRef = useRef<RealtimeChannel | null>(null);
  
  const {isCall,
    stream,
    remoteUsers,
    isMuted,
    isCameraOff,
    startCall,
    joinCall,
    endCall,
    toggleCamera,
    toggleMute,
    startTime} = useVideoCall(chatRoomId, userId, username);

  //호스트 찾기
  const isCurrentHost = (currentCallHost === userId) || (localHostId === userId);

  //호스트 - 종료
  const handleHostEnd = useCallback(async()=>{
    try{
      let endMsg = `${username}님이 서클 활동을 종료했습니다.`;
      if(startTime){
        const duration = formatTimeDuration(startTime, new Date());
        endMsg += ` (${duration})`;
      };

      //채팅 메시지로 보냄
      window.dispatchEvent(new CustomEvent("send-system-message", {
        detail: {
          payload: endMsg,
          userId: userId,
          username: username,
          avatar: avatar,
          type: "USER",
          isSystemMessage: true
        }
      }));

      //종료 - 브로드캐스트
      if(videoChannelRef.current){
        await videoChannelRef.current.send({
          type: "broadcast",
          event: "video-call-ended",
          payload: {
            callId: active,
            hostId: userId,
            host: username,
            chatRoomId,
            forceEndAll: true
          }
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      endCall();

      if(active){
        await endVideoCall(active);
        setActive(null);
        setCurrentCallHost(null);
      };

      await saveMessage(endMsg, chatRoomId);

    }catch(error){
      console.error(error);
      endCall();
    };
  }, [active, avatar, chatRoomId, endCall, startTime, userId, username]);

  //참여자 - 퇴장(chatMessageList 채널 재사용)
  const handleLeave = useCallback(async()=>{
    try{
      const leaveMsg = `${username}님이 서클 활동을 그만두었습니다.`;

      window.dispatchEvent(new CustomEvent("send-system-message", {
        detail: {
          payload: leaveMsg,
          userId: userId, 
          username: username,
          avatar: avatar,
          type: "USER",
          isSystemMessage: true
        }
      }));
      
      if(videoChannelRef.current){
        await videoChannelRef.current.send({
          type: "broadcast",
          event: "user-left-call",
          payload: {
            userId,
            username,
            chatRoomId,
            forceEndAll: false
          }
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      endCall();

      setActive(null);
      await saveMessage(leaveMsg, chatRoomId);

    }catch(error){
      console.error(error);
      endCall();
    };
  }, [avatar, chatRoomId, endCall, userId, username]);

  //통화 상태 context에 업데이트
  useEffect(() => {
    setCallState(isCall, isCurrentHost, handleHostEnd, handleLeave);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCall, isCurrentHost]);

  //초대 알림
  useEffect(()=>{
    videoChannelRef.current = client.channel(`video-room-${chatRoomId}`);

    if(videoChannelRef.current){
      videoChannelRef.current.on("broadcast", {
        event: "video-call-invitation"
      }, (payload)=>{
        const invite = payload.payload;

        if(invite.hostId === userId){ //호스트
          setLocalHostId(userId);
          setCurrentCallHost(userId);
          setActive(invite.callId);

          setTimeout(() => {
          startCall();
        }, 100);

        }else if(!isCall){ //참여자
          setInvitation(invite); //초대 ui 출력ㅇ
          setLocalHostId(invite.hostId);
          setCurrentCallHost(invite.hostId);
        };
      })
    .on("broadcast", {
      event:"video-call-ended"}, 
    (payload)=>{
      setInvitation(null);
      setLocalHostId(null);
      setCurrentCallHost(null);
      setActive(null);

      if(payload.payload.forceEndAll && payload.payload.hostId !== userId && isCall){ //호스트가 종료 시 모든 참가자 퇴장ㅇ
        endCall();
      }
    }).on("broadcast", {
      event: "user-left-call"}
      ,(payload)=>{
        if(payload.payload.userId !== userId){
          // console.log(`${payload.payload.username}님이 서클 활동을 그만두었습니다.`);
        };
      }).on("broadcast", {
        event: "user-join-call"
      }, (payload)=>{
          if(payload.payload.hostId){
            setLocalHostId(payload.payload.hostId);
            setCurrentCallHost(payload.payload.hostId);
          };

          if(payload.payload.hostId === userId){
            setInvitation(null);
          };
      }).subscribe();
    };

    //호스트에게도 알림ㅇ
    const handleHostInvitation = (e: CustomEvent) => {
      const invite = e.detail;

      if(invite.hostId === userId){
        setLocalHostId(userId);
        setCurrentCallHost(userId);
        setActive(invite.callId);

        setTimeout(() => {
          startCall();
        }, 100);
      };
    };

    window.addEventListener("video-call-invitation", handleHostInvitation as EventListener);

    return()=>{
      if(videoChannelRef.current){
        videoChannelRef.current.unsubscribe();
        videoChannelRef.current = null;
      };

      window.removeEventListener("video-call-invitation", handleHostInvitation as EventListener);
    };

  }, [chatRoomId, endCall, isCall, startCall, userId]);

  //초대 - 수락
  const handleAccept = useCallback(async()=>{
    if(!invitation) return;

    try{
      await joinVideoCall(invitation.callId, userId);
      setInvitation(null);
      setActive(invitation.callId);

      await joinCall();

      if(videoChannelRef.current){
        await videoChannelRef.current.send({
        type: "broadcast",
        event: "user-join-call",
        payload: {
          callId: invitation.callId,
          joinUserId: userId,
          username: username,
          hostId: currentCallHost
        }
      });
      };
    }catch(error){
      console.error(error);
    }
  },[currentCallHost, invitation, joinCall, userId, username]);

  //초대 - 거절
  const handleDecline = useCallback(()=>{
    setInvitation(null);
    setLocalHostId(null);
  }, []);

  //video stream 연결
  useEffect(()=>{
    if(videoRef.current && stream){
      videoRef.current.srcObject = stream;
    };
  }, [stream, isMinimize]);

  //상태 변경
  useEffect(()=>{
    if(isCall && !isCallStartRef.current){ //영상통화 시작
      isCallStartRef.current = true;
      isCallEndRef.current = false;

    }else if(!isCall && isCallStartRef.current && !isCallEndRef.current){ //영상통화 종료
      isCallStartRef.current = false;
      isCallEndRef.current = true;
      setLocalHostId(null);
      setCurrentCallHost(null);
      setActive(null);
    };
  }, [isCall]); 

  //퇴장, 종료 정리
  useEffect(() => {
    const currentVideoRefs = videoRefs.current;
    const currentSocketIds = new Set(remoteUsers.map(user => user.socketId));
  
    //remoteUsers에 없는 socketId의 비디오 요소들 정리(퇴장 시)
    currentVideoRefs.forEach((video, socketId) => {
      if(!currentSocketIds.has(socketId)){
        if(video.srcObject){
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          video.srcObject = null;
        };

        currentVideoRefs.delete(socketId);
      };
    });

    if(isMinimize){ //minimize일 때 리렌더링ㅇ
      const videoElement = document.querySelectorAll("video");
      videoElement.forEach(video=>{

        if(video.srcObject){
          const stream = video.srcObject as MediaStream;

          if(stream.getTracks().length === 0){
            video.srcObject = null;
          };
        };
      });
    }
  }, [isMinimize, remoteUsers]);

  //언마운트 정리
  useEffect(() => {
    const currentVideoRefs = videoRefs.current;

    return() =>{ //clean up
      currentVideoRefs.forEach((video) => {
        if(video.srcObject){
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          video.srcObject = null;
        };
      });
      currentVideoRefs.clear();
    };
  }, []);

  if(invitation && !isCall){
    return(
      <VideoCallInvitation 
      onAccept={handleAccept} 
      onDecline={handleDecline} />
    );
  };

  if(!isCall) return null;
    
  return(
    <div className="fixed top-0 left-0 right-0
    pt-26 md:pt-30 lg:pt-32 mx-auto
    max-w-screen-xs sm:max-w-lg md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">
      
      <div className={`max-w-full lg:max-w-4/5 xl:max-w-3/5 mx-auto ${isMinimize ? "" : "mode-svg-color-70 backdrop-blur-sm drop-shadow-2xl shadow-xl"}
      p-1 rounded-md`}>

        <motion.div variants={containerVars}
        animate={isMinimize ? "minimized" : "expanded"}
        style={{transformOrigin: "top right"}}>
          <AnimatePresence mode="wait">
          {!isMinimize && (
            <motion.div variants={videoVars}
            initial="minimized"
            animate="expanded"
            exit="minimized"
            className="grid grid-cols-2 gap-1 items-center">
              {/* my - videoCall */}
              <motion.div variants={btnVars}
              className="overflow-hidden form-text-color font-weight-basic">
                <video ref={videoRef}
                autoPlay muted playsInline
                className="transform scale-x-[-1] w-full h-auto aspect-video object-cover rounded-md"/>

                <p className="pt-0.75 text-[0.625rem] md:text-xs lg:text-sm
                username-spacing-comm text-center leading-4 sm:leading-6">Me : {username}</p>
              </motion.div>

              {/* other users - videoCall */}
              {remoteUsers.slice(0, 3).map((user, index)=>(
              <motion.div variants={btnVars}
              transition={{delay: index * 0.1}}
              key={user.socketId}
              className="overflow-hidden form-text-color  font-weight-basic">
                {user.stream ? (
                <div>
                  <video 
                  ref={(video)=>{
                    if(video && user.stream){
                      video.srcObject = user.stream;
                      videoRefs.current.set(user.socketId, video);
                    };
                  }}
                  autoPlay playsInline muted={false}
                  className="transform scale-x-[-1] w-full h-auto aspect-video object-cover rounded-md"/>

                  <p className="pt-0.75 text-[0.625rem] md:text-xs lg:text-sm username-spacing-comm text-center leading-4 sm:leading-6">{user.username}</p>
                </div>
                ):(
                <p className="text-[0.625rem] md:text-xs lg:text-sm username-spacing-comm text-center">Connecting . . .</p>
                )}
              </motion.div>
              ))}

              {/* 아직 참여하지 않은 사용자들 */}
              {Array.from({length: Math.max(0, 3 - remoteUsers.length)}).map((_, index)=>(
              <motion.div variants={btnVars}
              transition={{delay: (remoteUsers.length + index) * 0.1}}
              key={`empty-${index}`} className="w-full h-auto aspect-video object-cover flex items-center justify-center rounded-md overflow-hidden form-text-color form-bg-color font-weight-basic">

                <p className="text-[0.625rem] md:text-xs lg:text-sm username-spacing-comm text-center">Waiting for . . .</p>
              </motion.div>
              ))}
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>

        {/* handler */}
        <div className={`flex flex-row gap-1  
        ${isMinimize ? "mt-1.5 md:mt-0.5 lg:mt-2" : "mt-1"}`}>
          {/* sound & camera */}
          {!isMinimize && (
            <div className="flex flex-row gap-1">
            <button 
            onClick={toggleMute} data-cursor-target
            className="size-6 sm:size-8 flex justify-center items-center
            form-text-color form-bg-color rounded-full
            border-[0.0625rem] border-[var(--ring-color)] 
            hover:bg-primary transition-all">
            {isMuted ? (
              <SpeakerWaveIcon className="size-3 sm:size-4.5 pointer-none"/>
            ):(
              <SpeakerXMarkIcon className="size-3 sm:size-4.5 pointer-none"/>
            )}
            </button>

            <button
            onClick={toggleCamera} data-cursor-target
            className="size-6 sm:size-8 flex justify-center items-center
            form-text-color form-bg-color rounded-full
            border-[0.0625rem] border-[var(--ring-color)] 
            hover:bg-primary transition-all">
            {isCameraOff ? (
              <VideoCameraOn className="size-3 sm:size-4 pointer-none"/>
            ):(
              <VideoCameraOff className="size-3 sm:size-4 pointer-none"/>
            )}</button>
            </div>
          )}
          
          {/* minimize */}
          <button
          data-cursor-target
          onClick={()=> setIsMinimize(!isMinimize)} className="size-6 sm:size-8 flex justify-center items-center ml-auto
          form-text-color form-bg-color rounded-full
          border-[0.0625rem] border-[var(--ring-color)] 
          hover:bg-primary transition-all">
            {isMinimize ? 
            <ArrowsPointingOutIcon className="size-3 sm:size-4 pointer-none stroke-2"/>
            :
            <ArrowsPointingInIcon className="size-3 sm:size-4 pointer-none stroke-2"/>}
          </button>
        </div>
      </div>
    </div>
  );
}