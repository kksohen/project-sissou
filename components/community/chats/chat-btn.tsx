"use client";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

interface ChatBtnProps{
  targetUserId: number;
};

export default function ChatBtn({targetUserId}:ChatBtnProps){
  const router = useRouter();

  const handleChatClick = async()=>{
    try{
      const res = await fetch("/api/chats/direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({targetUserId})
      });
      
    if(res.ok){
      const {chatRoomId} = await res.json();
      router.push(`/chats/${chatRoomId}`);
    }else{
      console.error("서클 생성 실패");
    }
    }catch(error){
      console.error(error);
    }
  };

  return(
    <button data-cursor-target onClick={handleChatClick}
    className="rounded-full size-8 sm:size-11 flex justify-center items-center form-text-color border-[0.0625rem] border-[var(--ring-color)] transition-all form-bg-color">
      <ChatBubbleLeftRightIcon className="size-4 sm:size-6 pointer-none stroke-2"/>
    </button>
  );
}