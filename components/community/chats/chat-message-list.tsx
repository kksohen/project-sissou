"use client";
import { InitChatMessages } from "@/app/(tabs)/chats/[id]/page";
import { formatToDate, formatToTime } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import ChatDeleteBtn from "./chat-delete-btn";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { saveMessage, updateMsgRead } from "@/app/(tabs)/chats/[id]/actions";
import Image from "next/image";
import Link from "next/link";

export const SUPABASE_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJld2tncXVncXZnbWhucWRnZWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNDEzMDMsImV4cCI6MjA2ODkxNzMwM30.etaoK85_PbIgEU2d_R63nIaTkep_J1qOofkx8WimllY";

export const SUPABASE_URL = "https://bewkgqugqvgmhnqdgejh.supabase.co";

export const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

interface ChatMessageListProps{
  initMessages:InitChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string | null;
  isGroupChat: boolean;
  participantCount: number;
};

export default function ChatMessageList({initMessages, userId, chatRoomId, username, avatar, isGroupChat, participantCount}: ChatMessageListProps){
  const [messages, setMessages] = useState(initMessages);
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set()); //현재 접속 중
  const lastSystemMsg = useRef<{payload: string, time: number} | null>(null); //영상채팅 알림 중복 메시지 방지
  const bottomRef = useRef<HTMLDivElement>(null);
  const initLoadRef = useRef(true);
  const channel = useRef<RealtimeChannel>(null);
  const {pending} = useFormStatus();

  //scroll event
  const scrollToBottom = ()=>{
    if(bottomRef.current){
      bottomRef.current.scrollIntoView({
        behavior: "smooth"
      });
    };
  };

  //unreadCount
  const calculateUnreadCount = useCallback((currentOnlineUsers: Set<number>) => {
    const onlineCount = currentOnlineUsers.size; //현재 접속 중 인원 수

    if(isGroupChat){
      return Math.max(0, participantCount - 1 - onlineCount); //그룹챗 본인 제외
    }else{
      return onlineCount > 0 ? 0 : 1; //1:1챗 접속 중 0 : 1
    };

  }, [isGroupChat, participantCount]);

  //영상채팅 시스템 메시지
  const handleSystemMsg = useCallback((e: CustomEvent) => {
    const {payload, userId: messageUserId, username: messageUsername, type, isSystemMessage} = e.detail;

    //시스템 메시지 발생에 해당하는 사용자만 브로드캐스트해서 중복 방지
    if (messageUserId !== userId) return;

    setOnlineUsers(currentOnlineUsers => {
      const currentUnreadCount = calculateUnreadCount(currentOnlineUsers);

      const msgPayload = {
        id: Date.now(),
        payload,
        is_read: currentUnreadCount === 0,
        created_at: new Date(),
        userId: messageUserId,
        user: {
          username: messageUsername,
          avatar: avatar
        },
        unreadCount: currentUnreadCount,
        type,
        isSystemMessage: isSystemMessage || false
      };

      if(channel.current){
        channel.current.send({
          type: "broadcast",
          event: "message",
          payload: msgPayload
        });
      };

      return currentOnlineUsers;
    });
  }, [userId, avatar, calculateUnreadCount]);

  useEffect(()=>{
    if(messages.length > 0){
      const latestMessage = messages[messages.length - 1];
      if(userId === latestMessage.userId){
        scrollToBottom();
      };
    }
  },[messages, userId]);

  //page 진입 시 메시지 로드
  useEffect(()=>{
    if(!initLoadRef.current){
      setMessages(initMessages);
    };

    initLoadRef.current = false;
  }, [initMessages]);

  //realtime chats
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: {value},
    } = e;
    setMessage(value);
  };

  const onSubmit = async(e:React.FormEvent)=>{
    e.preventDefault();

    const newUnreadCount = calculateUnreadCount(onlineUsers);

    const myMsg = {
      id: Date.now(),
      payload: message,
      is_read: newUnreadCount === 0,
      created_at: new Date(),
      userId,
      user: {
        username,
        avatar
      },
      unreadCount: newUnreadCount,
      type: "USER"
    };

    setMessages(prevMsgs => [...prevMsgs, myMsg]);
    setMessage("");

    try{
      const savedMessage = await saveMessage(message, chatRoomId);
      //실시간 브로드캐스트
      if(savedMessage){
        const broadcastMsg = {
          ...myMsg,
          id: savedMessage.id
        };

        setMessages(prevMsgs => 
          prevMsgs.map(msg => 
            msg.id === myMsg.id ? broadcastMsg : msg
          )
        );

        channel.current?.send({
          type: "broadcast",
          event: "message",
          payload: broadcastMsg
        });
      };
      
    }catch(error){
      console.error(error);
      setMessages(prevMsgs => prevMsgs.filter(msg => msg.id !== myMsg.id));
    }
  };

  //실시간 채팅
  useEffect(()=>{
    const lastMsgAsRead = async()=>{
      await updateMsgRead(chatRoomId, userId);
    };

    window.addEventListener("send-system-message", handleSystemMsg as EventListener);

    channel.current = client.channel(`room-${chatRoomId}`);

    if(channel.current){
      channel.current.on(
      "broadcast",
      {event: "message"},
      (payload)=>{
        const newMessage = payload.payload;

        //영상채팅 시스템 메시지
        if(newMessage.isSystemMessage){
          const now = Date.now();

          //메시지 내용 동일, 3초이내 같은 메시지 수신 시 무시ㅇ
          if(lastSystemMsg.current && lastSystemMsg.current.payload === newMessage.payload && now - lastSystemMsg.current.time < 3000) return;

          lastSystemMsg.current = {
            payload: newMessage.payload,
            time: now
          };

          setMessages(prevMsgs => [...prevMsgs, newMessage]);
          return;
        };
        //일반 채팅 메시지 
        if(newMessage.userId !== userId){
          setMessages(prevMsgs => [...prevMsgs, newMessage]);
          lastMsgAsRead();

          channel.current?.send({
            type: "broadcast",
            event: "read-message",
            payload: {
              messageId: newMessage.id, 
              readId: userId
            }
          });
        };
      }).on("broadcast", {
      event: "system-message"
      }, (payload)=>{ //들어오고 나가는 인원 시스템 메시지
        const systemMsg = payload.payload;

        setOnlineUsers(currentOnlineUsers => {
          const adjustedSystemMsg = {
            ...systemMsg,
            unreadCount: calculateUnreadCount(currentOnlineUsers),
            is_read: calculateUnreadCount(currentOnlineUsers) === 0
          };

          setMessages(prevMsgs => [...prevMsgs, adjustedSystemMsg]);

          return currentOnlineUsers;
        });
      }).on("broadcast",{
        event: "read-message"
      }, (payload)=>{
        const {messageId, readId} = payload.payload;

        setMessages(prevMsgs=>
          prevMsgs.map(msg => {
            if(msg.id === messageId && msg.userId === userId && readId !== userId){
              const newUnreadCount = Math.max(0, msg.unreadCount - 1);

              return{
                ...msg,
                unreadCount: newUnreadCount,
                is_read: newUnreadCount === 0
              };
            };
            
            return msg;
          })
        );
      }).on("broadcast", {
        event: "user-online"
      }, (payload)=>{
        const onlineUserId = payload.payload.userId;

        if(onlineUserId !== userId){
          setOnlineUsers(prev=>{
            const newOnlineUsers = new Set(prev);
            newOnlineUsers.add(onlineUserId);

            return newOnlineUsers;
          });
        }
      }).on("broadcast", {
        event: "user-offline"
      }, (payload)=>{
        const offlineUserId = payload.payload.userId;

        setOnlineUsers(prev =>{
          const newOnlineUsers = new Set(prev);
          newOnlineUsers.delete(offlineUserId);

          return newOnlineUsers;
        });
      }).on("broadcast", {
        event: "request-online-users"
      }, (payload)=>{
        const requestId = payload.payload.requestId;
        
        if(requestId !== userId){
          channel.current?.send({
            type: "broadcast",
            event: "response-online-users",
            payload: {userId, respondTo: requestId}
          });
        }
      }).on("broadcast",{
        event: "response-online-users"
      }, (payload)=>{
        const responseUserId = payload.payload.userId;
        const respondTo = payload.payload.respondTo;

        if(respondTo === userId && responseUserId !== userId){
          setOnlineUsers(prev => {
            const newOnlineUsers = new Set(prev);
            newOnlineUsers.add(responseUserId);

            return newOnlineUsers;
          });
        }
      }).subscribe();

      channel.current.send({
        type: "broadcast",
        event: "user-online",
        payload: {userId}
      });

      setTimeout(()=>{
        channel.current?.send({
          type: "broadcast",
          event: "request-online-users",
          payload: {requestId: userId}
        });
      }, 100);
    };
  
    return()=>{
      if(channel.current){
        channel.current.send({
          type: "broadcast",
          event: "user-offline",
          payload: {userId}
        });

        channel.current?.unsubscribe();
        channel.current = null;
      };
    };
  },[calculateUnreadCount, chatRoomId, handleSystemMsg, userId]);

  return(
    <>
    <div className="max-w-full lg:max-w-4/5 xl:max-w-3/5 mx-auto
    min-h-screen justify-end flex flex-col pt-27 md:pt-30 lg:pt-33 pb-18">
      {messages.length > 0 && (
      <div className="my-1.25 text-center text-[0.625rem] md:text-xs lg:text-sm font-weight-form opacity-40">
        {formatToDate(messages[0].created_at.toString())}
      </div>
      )}

      {messages.map((message, index)=>{
        const isMyMsg = message.userId === userId;

        const isSystemMsg = message.type === "JOIN" || message.type === "LEAVE";
        if(isSystemMsg){
          return(
            <div key={message.id}
            className="my-1.25 text-center text-[0.625rem] md:text-xs lg:text-sm font-weight-form opacity-40"
            >{message.payload}</div>
          )
        };

        const isLastMsg = index === messages.length - 1;

        const prevMsg = index > 0 ? messages[index - 1] : null;
        const isFirstMsg = !prevMsg || prevMsg.userId !== message.userId;

        const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;
        const isOtherGroup = !nextMsg || nextMsg.userId !== message.userId;

        return(
          <div key={message.id}
          className={`flex gap-1 items-center
          ${!isLastMsg && isOtherGroup ? "mb-2" : "mb-0.75"}
          ${isMyMsg ? "justify-end" : ""}`}>
            {/* 내 메시지 */}
            {isMyMsg ? (
            <div className="flex flex-row items-end gap-1">
            {/* 읽음 표시 */}
              <span className="pb-0.25 text-[0.625rem] md:text-xs lg:text-sm font-weight-basic opacity-80">
                {isGroupChat ? (message.unreadCount > 0 ? message.unreadCount.toString() : ""
              ):(
                message.is_read ? "" : "1"
              )}
              </span>
            

              <span className="pb-0.25 text-[0.625rem] md:text-xs lg:text-sm font-weight-form opacity-40">{formatToTime(message.created_at.toString())}</span>
              
              {/* payload */}
              <span className="py-1.5 lg:py-2 px-2 md:px-2.5 lg:px-2.75
              rounded-2xl lg:rounded-3xl
              text-xs md:text-sm lg:text-base text-[#EEEEF0]
              text-shadow-md username-spacing-desc
              bubble-right max-w-55 sm:max-w-96 2xl:max-w-137 break-words leading-3 md:leading-4">
                {message.payload}
              </span>
            </div>
            ):( //상대방 메시지
            <div className="flex flex-row items-end gap-1">
              {/* group일 때 사용자명, avatar */}
              {isGroupChat ? (
              <div className="flex flex-row gap-1.5 items-end">
                {isFirstMsg ? (
                  <Link href={`/profile/${message.userId}`} data-cursor-target>
                    <div className="pointer-none">
                    {message.user?.avatar ? (
                      <Image className="rounded-full size-6 
                      md:size-7 lg:size-8"
                      src={message.user.avatar} alt={message.user.username} width={32} height={32} priority quality={100}/>
                    ):(
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor" className="rounded-full size-6 
                      md:size-7 lg:size-8">
                        <path d="M27.233,43.855c1.706-.07,2.609.225,3.782-1.181,2.924-3.502-3.826-12.769-1.522-13.515,2.554-.816,7.326,11.462,10.293,11.068,2.967-.408,10.614-10.055,13.027-8.649,4.195,2.447,9.456,46.296,20.108,17.692,4.043-10.21,3.989,11.63,5.869,1.87,5.869-30.869-14.499-.084-16.325-4.064-.826-1.786,5.956-20.645,7.543-20.279,1.989.45-1.576,9.788.185,10.069.979.153,4.01-6.575,6.962-12.653C70.932,10.05,56.735.15,40.206.15,19.77.15,2.896,15.282.258,34.896c.347-.473.691-.788,1.037-.829,1.696-.197,5.33,9.029,7.254,7.158,1.674-1.631-3.88-17.213.446-12.249,7.434,8.522,14.499-7.777,16.945-5.696,2.272,1.927-12.349,20.562-14.891,22.22-4.666,3.045-5.863-4.289-10.841-.759-.019.013-.039.03-.058.045.697,6.181,2.807,11.934,6,16.938.476-1.482.685-3.414,2.139-5.845,5.163-8.635,13.412-11.785,18.945-12.024ZM39.765,12.466c7.554.563,7.119,18.774.152,19.562-6.88-.478-7.804-19.182-.152-19.562Z"/>
                        <path d="M35.081,75.006c-1.288-2.264-5.812-.338-8.029-3.417-4.043-5.625,7.725-10.787,1.279-21.334-3.011-4.936-9.641-3.839-8.478,13.177.432,6.272.273,9.443-1.023,10.84,4.446,2.773,9.473,4.707,14.86,5.578,1.893-1.786,2.294-3.257,1.391-4.844Z"/>
                        <path d="M42.847,43.855c-8,12.98,16.543,13.191,13.608,23.612-1.261,4.5-7.13,3.924-8.032,6.68-.703,2.153.99,3.265,3.936,4.373,7.648-2.403,14.305-7.015,19.227-13.081-15.672-.528-22.478-31.755-28.739-21.584Z"/>
                      </svg>
                    )}
                    </div>
                  </Link>
                ):(
                  <div className="size-6 md:size-7 lg:size-8"></div>
                )}

                <div className="flex flex-col gap-0.5">
                  {isFirstMsg && (
                  <span className="pointer-none
                  text-[0.625rem] md:text-xs lg:text-sm font-weight-basic form-text-color
                  username-spacing-comm
                  pl-2">{message.user?.username}</span>
                  )}
                  
                  <div className="flex flex-row gap-1 items-end">
                    <span className="py-1.5 lg:py-2 px-2 md:px-2.5 lg:px-2.75
                    rounded-2xl lg:rounded-3xl
                    text-xs md:text-sm lg:text-base text-[#EEEEF0]
                    text-shadow-md username-spacing-desc
                    bubble-left max-w-55 sm:max-w-96 2xl:max-w-137 break-words leading-3 md:leading-4">
                      {message.payload}
                    </span>

                    <span className="pb-0.25 text-[0.625rem] md:text-xs lg:text-sm font-weight-form opacity-40">{formatToTime(message.created_at.toString())}</span>

                    {/* 그룹채팅 상대방 읽음 표시 */}
                    <span className="pb-0.25 text-[0.625rem] md:text-xs lg:text-sm font-weight-basic opacity-80">{message.unreadCount > 0 ? message.unreadCount.toString() : ""}</span>
                  </div>
                </div>
              </div>
              ):(
              <>
              <span className="py-1.5 lg:py-2 px-2 md:px-2.5 lg:px-2.75
              rounded-2xl lg:rounded-3xl
              text-xs md:text-sm lg:text-base text-[#EEEEF0]
              text-shadow-md username-spacing-desc
              bubble-left max-w-55 sm:max-w-96 2xl:max-w-137 break-words leading-3 md:leading-4">
                {message.payload}
              </span>

              <span className="pb-0.25 text-[0.625rem] md:text-xs lg:text-sm font-weight-form opacity-40">{formatToTime(message.created_at.toString())}</span>
              </>
              )}
            </div>
            )}
          </div>
        )
      })}
      <div ref={bottomRef}></div>
    </div>

    {/* chat input */}
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-10 mode-bg">
      <div className="mx-auto max-w-screen-xs sm:max-w-lg md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">
        <div className="max-w-full lg:max-w-4/5 xl:max-w-3/5 mx-auto">
          <div className="mt-3 mb-4">
            <div className="flex flex-row gap-3">
              <ChatDeleteBtn chatRoomId={chatRoomId}/>

              <form className="flex relative mb-1 w-full" 
              onSubmit={onSubmit}>
                <input data-cursor-target
                required 
                onChange={onChange} value={message}
                type="text" name="message"
                placeholder="Write . . ."
                className="w-full h-10 mx-auto
                focus:outline-none border-none
                ring-[0.0625rem] ring-[var(--ring-color)]
                focus:ring-[var(--form-text-color)]
                form-text-color placeholder:text-[var(--form-text-color)]
                placeholder:opacity-40
                pl-3 font-weight-form rounded-full"/>

                <button data-cursor-target 
                disabled={pending}
                className="disabled:cursor-not-allowed transition-all absolute right-1 -translate-y-1/2 top-1/2">
                  <ArrowUpCircleIcon className={`pointer-none size-8 ${pending ? "opacity-40" : "opacity-100"}`}/>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}