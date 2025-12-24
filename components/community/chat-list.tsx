import Link from "next/link";
import Image from 'next/image';
import { formatToTimeAgo } from "@/lib/utils";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { AtSymbolIcon } from "@heroicons/react/24/outline";

interface ChatListProps{
  id: string;
  title: string;
  participants: Array<{
    id: number;
    username: string;
    avatar: string | null;
  }>;
  participantCount: number;
  messageCount: number;
  updated_at: Date;
  avatarBlur?: string[];
}

export default function ChatList({id, title, participants, participantCount, messageCount, updated_at, avatarBlur}: ChatListProps){
  //username 글자수 제한
  const textMaxlength = (text: string | null | undefined, maxLength: number)=>{
    if(!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const avatarImg = (participant: typeof participants[0], index: number)=>{
    return(
      <div className="size-15 md:size-16">
        {participant.avatar ? (
        <Image src={participant.avatar} alt={participant.username}
        priority quality={100} width={64} height={64}
        placeholder="blur" blurDataURL={avatarBlur?.[index]}
        className="pointer-none rounded-lg"/>
        ):(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor" className="pointer-none rounded-lg ring-color opacity-80">
          <path d="M0,0v80h80V0H0ZM34.062,77.5c-4.367-.706-8.481-2.155-12.213-4.21-.894-.492-1.284-1.538-1-2.517.489-1.687.487-4.435.192-8.723-1.094-16.013,5.145-17.045,7.978-12.4,6.065,9.925-5.009,14.782-1.204,20.076,2.086,2.898,6.344,1.086,7.556,3.216.85,1.494.472,2.878-1.309,4.559ZM51.631,76.249c-2.773-1.043-4.366-2.088-3.704-4.115.849-2.594,6.372-2.051,7.559-6.286,2.762-9.806-20.333-10.005-12.806-22.22,5.425-8.812,11.284,15.396,23.688,19.681,1.464.506,1.931,2.335.84,3.436-4.286,4.327-9.611,7.629-15.577,9.504ZM70.981,48.723c-10.024,26.918-14.974-14.346-18.922-16.648-2.271-1.323-9.467,7.755-12.259,8.139-2.792.371-7.282-11.183-9.686-10.415-2.168.701,4.183,9.423,1.432,12.718-1.105,1.323-1.954,1.045-3.559,1.112-5.206.225-12.969,3.189-17.828,11.315l-.041.068c-1.165,1.962-4.091,1.783-4.968-.323-.037-.09-.074-.179-.111-.269v-10.879c2.796.019,4.225,3.916,7.718,1.636,2.392-1.561,16.15-19.097,14.013-20.91-2.301-1.959-8.95,13.38-15.946,5.36-4.071-4.672,1.156,9.992-.419,11.527-1.364,1.326-3.642-3.275-5.365-5.545V11.039c0-3.314,2.686-6,6-6h57.921c3.313,0,5.999,2.685,6,5.998l.005,14.107s-5.63,12.051-6.552,11.907c-1.657-.265,1.698-9.052-.174-9.476-1.493-.344-7.876,17.403-7.098,19.083,1.111,2.421,9.508-8.82,13.82-9.234v10.315c0,.523-.728.63-.89.133-.652-1.999-1.559-3.017-3.09.85Z"/><path d="M39.779,14.09c-7.201.357-6.331,17.958.143,18.408,6.556-.741,6.965-17.879-.143-18.408Z"/>
        </svg>
        )}
      </div>
    );
  };

  return(
    <Link href={`/chats/${id}`} data-cursor-target>

      <div className="pointer-none pt-4.5 trapezoid-posts
      text-center form-text-color form-bg-color font-weight-form">

      {participantCount === 1 ? (
        <div className="inline-grid justify-items-center align-top">
        {avatarImg(participants[0], 0)}
        </div>

      ) : participantCount === 2 ? (
          <div className="inline-grid justify-items-center grid-cols-2 gap-2 align-top">
          {avatarImg(participants[0], 0)}
          {avatarImg(participants[1], 1)}
          </div>
      ) : participantCount === 3 ? (
          <div className="inline-grid justify-items-center grid-cols-2 gap-2">
          {avatarImg(participants[0], 0)}
          {avatarImg(participants[1], 1)}
          {avatarImg(participants[2], 2)}
          </div>
      ) : (
          <div className="inline-grid justify-items-center grid-cols-2 gap-2">
          {avatarImg(participants[0], 0)}
          {avatarImg(participants[1], 1)}
          {avatarImg(participants[2], 2)}
          {avatarImg(participants[3], 3)}
          </div>
      )}
        
        <div className="pt-3.5 pb-3 username-spacing-desc">
          <h2 className="font-weight-basic username-spacing
          text-base md:text-lg lg:text-xl
          sm:leading-5 md:leading-6 xl:leading-7">{title}</h2>
          <p className="text-xs md:text-sm lg:text-base opacity-40">{formatToTimeAgo(updated_at.toString())}</p>
        </div>

      </div>
      
      <div className="pointer-none text-xs md:text-sm lg:text-base opacity-60 rounded-b-3xl loading-color font-weight-form
      flex items-start mx-7">
          <span className="py-3 justify-center items-center flex flex-1 gap-1">
            <AtSymbolIcon className="size-4 stroke-2"/>
            {participantCount}
          </span>

          <div className="w-[0.0625rem] self-stretch bg-[var(--form-text-color)] opacity-20"/>

          <div className="py-3 px-4 flex flex-col flex-1 leading-4 md:leading-4.5 lg:leading-5 items-center">
            <div className="text-left">
              {participants.map(p=>(
              <p key={p.id}>{textMaxlength(p.username, 8)}</p>
              ))}
            </div>
          </div>

          <div className="w-[0.0625rem] self-stretch bg-[var(--form-text-color)] opacity-20"/>

          <span className="py-3 justify-center items-center flex flex-1 gap-1">
            <SpeakerWaveIcon className="size-4"/>
            {messageCount}
          </span>
        </div>
    </Link>
  );
}