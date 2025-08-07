"use client";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

interface ChatBtnProps{
  targetUserId: number;
  text: string;
};

export default function ModalChatBtn({text, targetUserId}:ChatBtnProps){
  const {pending} = useFormStatus();

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
    disabled={pending}
    className={`py-2 border-custom-all mode-svg-color transition-all 
    font-weight-custom text-xl tracking-wide form-btn-text
    ${pending ? "mode-secondary-50 backdrop-blur-lg cursor-not-allowed" : "mode-secondary"}`}>{pending ? "Loading..." : text}</button>
  );
}