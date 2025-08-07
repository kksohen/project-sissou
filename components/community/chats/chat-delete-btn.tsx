"use client";
import { leaveChatRoom } from "@/app/(tabs)/chats/[id]/actions";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

interface ChatDeleteProps{
  chatRoomId: string;
};

export default function ChatDeleteBtn({chatRoomId}: ChatDeleteProps){
  
  async function handleDelete(){
    const confirm = window.confirm("서클을 떠나시겠습니까?");
    if(!confirm) return;

    try{
      await leaveChatRoom(chatRoomId);
    }catch(error){
      if((error as Error).message?.includes("NEXT_REDIRECT")){
        alert("서클을 떠났습니다.");
        return;
      };

      alert("서클 떠나기를 실패했습니다.");
      console.error(error);
    }
  };

  return(
    <button data-cursor-target onClick={handleDelete}>
      <EllipsisVerticalIcon className="size-5.5 pointer-none"/>
    </button>
  );
}