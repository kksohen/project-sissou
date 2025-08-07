"use client";
import { createVideoCall, saveMessage } from "@/app/(tabs)/chats/[id]/actions";
import { useCallback, useRef } from 'react';
import { client } from "./chat-message-list";
import { useVideoCallContext } from "./videocall-context";

interface VideoCallManagerProps{
  chatRoomId: string;
  userId: number;
  username: string;
  avatar?: string | null;
  participants: {
    id: number,
    username: string
  }[];
  renderBtnOnly?: boolean; 
};

export default function VideoCallManager({chatRoomId, userId, username, avatar, participants, renderBtnOnly=false}: VideoCallManagerProps){
  const {isCall, isCurrentHost, handleHostEnd, handleLeave} = useVideoCallContext();
  const isCreateCall = useRef(false); //중복 호출 방지

  //영상통화 시작
  const handleCallStart = useCallback(async()=>{
    if(isCreateCall.current) return;
    isCreateCall.current = true;

    try{
      const call = await createVideoCall(chatRoomId, userId);
      if(!call) return;

      const startMsg = `${username}님이 서클 활동을 시작했습니다.`;
      
      const saved = await saveMessage(startMsg, chatRoomId);
      //db 저장 후
      //영상채팅 관련 채널 생성 - 초대 알림
      const channel = client.channel(`video-room-${chatRoomId}`);
      const invitationPayload = {
        callId: call.id,
        hostId: userId,
        host: username,
        chatRoomId,
        message: startMsg,
        participants: participants
      };
      
      await channel.send({
        type: "broadcast",
        event: "video-call-invitation",
        payload: invitationPayload
      });
      //기존 일반채팅 채널 재사용 - 채팅 메시지로 실시간ㅇ
      const chatChannel = client.channel(`room-${chatRoomId}`);
      await chatChannel.send({
        type: "broadcast",
        event: "message",
        payload: {
          id: saved?.id || Date.now(),
          payload: startMsg,
          is_read: false,
          created_at: new Date(),
          userId: userId,
          user: {
            username: username,
            avatar: avatar
          },
          unreadCount: participants.length - 1,
          type: "USER",
          isSystemMessage: true
        }
      });

      window.dispatchEvent(new CustomEvent("video-call-invitation", { //host 자신에게도 참여 초대ㅇ
        detail: invitationPayload
      }));

      setTimeout(()=>{
        channel.unsubscribe();
        chatChannel.unsubscribe();
      }, 1000);

    }catch(error){
      console.error(error);
    }finally{
      isCreateCall.current = false;
    };
  }, [avatar, chatRoomId, participants, userId, username]);

  //통화 시작, 종료 토글
  const handleToggle = useCallback(() => {
    if(!isCall){
      handleCallStart(); //호스트 시작
    }else{
      if(isCurrentHost){
        handleHostEnd(); //호스트 종료
      }else{
        handleLeave(); //참여자 퇴장
      };
    }
  }, [isCall, isCurrentHost, handleCallStart, handleHostEnd, handleLeave]);

  //btn만 반환ㅇ
  if(renderBtnOnly){
    return(
      <button onClick={handleToggle}
      data-cursor-target
      className="z-10 flex items-center justify-center media-bar-w-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className="transition-all fill-[var(--mode-secondary)] pointer-none size-11.5">
        {isCall ? (
          <path d="M67.682,43.836c-1.112-3.261-5.595,1.663-6.998-3.71.579-5.668,6.007-1.64,7.014-3.674-.681-7.137,3.076-15.694-4.908-12.831-.722.259-1.451,1.333-2.255,1.675-3.102,1.317-7.553,3.196-10.092,6.943v-9.185H12v33.89h38.443v-9.203s1.946,2.098,5.504,4.755c3.629,2.71,7.42,4.112,8.438,4.32,5.06,1.034,3.155-4.416,2.981-8.476-.064-1.502.873-2.874.317-4.505ZM21.107,35.882c-1.654-1.654-1.654-4.337,0-5.991s4.337-1.654,5.991,0,1.654,4.337,0,5.991-4.337,1.654-5.991,0ZM21.107,50.112c-1.654-1.654-1.654-4.337,0-5.991s4.337-1.654,5.991,0,1.654,4.337,0,5.991-4.337,1.654-5.991,0ZM28.222,42.997c-1.654-1.654-1.654-4.337,0-5.991s4.337-1.654,5.991,0c1.654,1.654,1.654,4.337,0,5.991s-4.337,1.654-5.991,0ZM35.336,35.882c-1.654-1.654-1.654-4.337,0-5.991s4.337-1.654,5.991,0,1.654,4.337,0,5.991-4.337,1.654-5.991,0ZM35.336,50.112c-1.654-1.654-1.654-4.337,0-5.991s4.337-1.654,5.991,0,1.654,4.337,0,5.991-4.337,1.654-5.991,0ZM53.404,44.856c-1.225.06-2.959-1.734-2.959-1.734v-6.257s1.316-1.477,2.01-1.666c1.907-.52,5.257,1.885,5.257,4.801s-2.651,4.774-4.307,4.856Z"/>
        ):(
          <path d="M67.682,43.836c-1.112-3.261-5.595,1.663-6.998-3.71.579-5.668,6.007-1.64,7.014-3.674-.681-7.137,3.076-15.694-4.908-12.831-.722.259-1.451,1.333-2.255,1.675-3.102,1.317-7.553,3.196-10.092,6.943v-9.185H12v33.89h38.443v-9.203s1.946,2.098,5.504,4.755c3.629,2.71,7.42,4.112,8.438,4.32,5.06,1.034,3.155-4.416,2.981-8.476-.064-1.502.873-2.874.317-4.505ZM21.155,44.238c-2.34,0-4.237-1.897-4.237-4.237s1.897-4.237,4.237-4.237,4.237,1.897,4.237,4.237-1.897,4.237-4.237,4.237ZM31.217,54.3c-2.34,0-4.237-1.897-4.237-4.237s1.897-4.237,4.237-4.237,4.237,1.897,4.237,4.237-1.897,4.237-4.237,4.237ZM31.217,44.238c-2.34,0-4.237-1.897-4.237-4.237s1.897-4.237,4.237-4.237,4.237,1.897,4.237,4.237-1.897,4.237-4.237,4.237ZM31.217,34.176c-2.34,0-4.237-1.897-4.237-4.237s1.897-4.237,4.237-4.237,4.237,1.897,4.237,4.237-1.897,4.237-4.237,4.237ZM41.279,44.238c-2.34,0-4.237-1.897-4.237-4.237s1.897-4.237,4.237-4.237,4.237,1.897,4.237,4.237-1.897,4.237-4.237,4.237ZM53.404,44.856c-1.225.06-2.959-1.734-2.959-1.734v-6.257s1.316-1.477,2.01-1.666c1.907-.52,5.257,1.885,5.257,4.801s-2.651,4.774-4.307,4.856Z"/>
        )}
        </svg>
    </button>
    );
  }

  return null;
}