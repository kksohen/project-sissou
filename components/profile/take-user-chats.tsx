"use client";
import { useEffect, useRef, useState } from "react";
import { initUserChats } from "./profile-wrap";
import { getMoreUserChats } from "@/app/(tabs)/profile/actions";
import Link from "next/link";
import Image from "next/image";
import { formatToDayTime } from "@/lib/utils";

interface TakeUserChatsProps{
  initUserChats: initUserChats;
};

export default function TakeUserChats({initUserChats}: TakeUserChatsProps){
  const [chats, setChats] = useState(initUserChats);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(()=>{
    const observer = new IntersectionObserver(
      async(
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      )=>{
        const element = entries[0];

        if(element.isIntersecting && trigger.current && !isLoading && !isLastPage){
          observer.unobserve(trigger.current);
          setIsLoading(true);

          const newChats = await getMoreUserChats(page + 1);
          if(newChats.length !== 0){
            setChats(prev => [...prev, ...newChats]);
            setPage(prev => prev + 1);
          }else{
            setIsLastPage(true);
          };

          setIsLoading(false);
        }
      }, {
        threshold: 0.1,
        rootMargin: "0px 0px 50px 0px",
      });

      if(trigger.current){
        observer.observe(trigger.current);
      };

      return()=>{
        observer.disconnect();
      };
  }, [page, isLoading, isLastPage]);

  //참여 중인 채팅방 없을 때
  if(!chats || chats.length === 0){
    return(
      <div className="pt-72 sm:pt-80 text-center flex flex-col justify-center items-center gap-4 opacity-30">
        {/* net-art */}
        <div className="*:flex *:gap-1 *:justify-center
        text-sm">
          <div>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span>*</span>
          </div>
          <div className="-mt-2">
            <span>@%@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>&&*</span>
          </div>      
          <div className="-mt-2">
            <span>@@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>▪</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@&#41;</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@@&#41;</span>
          </div>
          <div className="-mt-2">
            <span>@</span>
            <span>++++</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>++++</span>
            <span>@</span>
          </div>
          <div className="-mt-2">
            <span>@@</span>
            <span>+++++</span>
            <span>▪</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@&#60;</span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span>▪</span>
            <span>+++++</span>
            <span>@@</span>
          </div>
          <div className="-mt-2">
            <span>@&#40;</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>⁘</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@#</span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>⁘</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@#</span>
          </div>
          <div className="-mt-2">
            <span>@</span>
            <span>▪</span>
            <span></span>
            <span></span>
            <span></span>
            <span>⋱</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@@</span>
            <span>⋰</span>
            <span>⋱</span>
            <span>@@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>⋰</span>
            <span></span>
            <span></span>
            <span></span>
            <span>▪</span>
            <span>@</span>
          </div>
          <div className="-mt-2">
            <span>*</span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@%</span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span>*</span>
          </div>
          <div className="-mt-1">
            <span>+++++</span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@&#60;</span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span>+++++</span>
          </div>
          <div className="-mt-1">
            <span>%@</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>@</span>
            <span>~</span>
            <span>@</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>@%</span>
          </div>
          <div className="-mt-1">
            <span>@</span>
            <span>+++++</span>
            <span>:</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@&#60;</span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>:</span>
            <span>+++++</span>
            <span>#@</span>
          </div>
          <div className="-mt-1">
            <span>&#123;</span>
            <span>&#123;</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>+++~&#60;</span>
            <span></span>
            <span>@&</span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>&#125;</span>
            <span>&#125;</span>
          </div>
          <div className="-mt-1">
            <span>@@@</span>
            <span>:</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@#</span>
            <span></span>
            <span></span>
            <span>@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>:</span>
            <span>@@@</span>
          </div>
          <div className="-mt-1">
            <span>@</span>
            <span>+++++</span>
            <span>@%</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@</span>
            <span>&#93;@</span>
            <span>+++++</span>
            <span>@</span>
          </div>
          <div className="-mt-1">
            <span>@@</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>:</span>
            <span>@#</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@~@</span>
            <span>&#123;</span>
            <span></span>
            <span>@@</span>
          </div>
          <div className="-mt-1">
            <span></span>
            <span></span>
            <span>@~</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>@@</span>
            <span></span>
            <span></span>
            <span></span>
            <span>#</span>
          </div>
        </div>

        <h4 className="text-2xl sm:text-3xl font-weight-basic username-spacing-comm">&#40; 낙원을 찾아서 . . . &#41;</h4>
      </div>
    );
  };

  return(
    <>
    <div className="pt-40 sm:pt-45 lg:pt-48 mb-10 sm:mb-40 flex flex-col">
    {chats.map(chat => (
      <Link key={`${chat.id}-${chat.updated_at}`} 
      href={`/chats/${chat.id}`} data-cursor-target
      className="pt-2">
        <div className="flex gap-2.5 sm:gap-3.5">
          {/* chatRoom thumbnail img */}
          <div className="pointer-none rounded-2xl size-13 sm:size-18">
          {chat.isGroupChat ? ( //group chat
            chat.host?.avatar ? ( //host profile
            <Image src={chat.host.avatar}
            alt={chat.host.username}
            priority quality={100}
            width={72} height={72}
            placeholder="blur" blurDataURL={chat.avatarBlur}
            className="rounded-2xl"/>
            ):(
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor" className="rounded-2xl opacity-60 border-1">
              <path d="M30.184,67.903c-.667-.764-3.969-1.377-3.269.304.06.13.022.173-.125.136-2.483-.889-5.009.705-1.339,2.277,2.326.851,3.454.022,2.987-.954-.119-.255.033-.206.141-.195,1.87.233,2.483-.775,1.599-1.572h0l.005.005Z"/><path d="M21.548,36.713c2.114,5.638,6.809,2.938,4.017-1.491-1.697-2.423-3.941-1.843-4.131.412-1.496-3.437-4.874-2.938-2.955.613.949,1.399,2.629,1.838,3.069.466h0Z"/><path d="M29.154,52.398c-3.996-4.993-7.953,3.703-9.504,2.846-1.751-.965,4.316-8.767,7.238-10.371,2.483-1.361,3.302,1.366,5.709.293.949-.423,8.561-7.823,7.427-8.566-1.22-.802-4.744,5.481-8.452,2.196-2.158-1.914.613,4.093-.222,4.722-.96.721-3.074-2.835-3.92-2.76-.889.081-1.757,2.911-2.917,2.911s-3.887-4.261-5.047-4.034c-1.773.342-.336,9.097-9.71,6.002-1.442-.477-1.941.119-1.464.884.596.954,1.139,1.41-.862.667-2.158-.808-3.871,4.039.802,1.578,1.491-.786,2.066.824-.314,1.128-1.903.152-3.107,2.131-1.393,3.123,2.423.84,2.835-3.491,4.56-3.351,2.657.222,2.461-3.21,5.205-2.57,2.732.64,2.722,7.563-1.984,9.298-4.451,1.643-8.252,4.44-8.425,11.38-.108,4.348-3.079,3.963-3.378,5.335-.168,5.85,11.152,4.917,8.317,2.581-.276-.222-.081-.277.136-.206,3.697,1.193,5.14-1.084,2.288-2.396-1.843-.846-4.429-.206-3.952.96.146.358.081.423-.38.201-8.013-3.811,2.423-2.44,5.964-8.365,2.532-3.519,2.472-6.896,6.479-9.244,5.736-3.372,11.808,2.028,10.501,3.958-.954,1.41-3.454,1.415-5.161-.439-2.125-2.304-6.246,5.958-4.641,7.07,1.458,1.014,9.916-2.922,11.239-6.392.819-2.152-3.77-7.977-4.137-8.436Z"/><path d="M46.742,39.371c2.871-1.045,1.463-7.034-1.774-6.363-3.196.989-1.171,6.985,1.774,6.363Z"/><path d="M67.762,59.731c-1.672-.388-2.678.462-1.826,1.443,2.016,2.183,6.044.136,1.826-1.443Z"/><path d="M61.922,41.331c-1.995,10.534-8.047-3.173-10.032-3.497-1.141-.186-3.27,3.757-4.487,4.226-1.218.464-4.304-3.001-5.311-2.446-.907.504,2.751,2.763,1.823,4.236-.372.591-.779.597-1.493.813-2.314.704-5.52,2.664-6.944,6.064-.818,1.954-.212,3.658,1.496,4.998,1.632,1.28,6.484,2.828,4.044-3.842-1.978-5.419.724-6.526,2.426-5.257,3.642,2.711-.916,5.737,1.282,7.114,1.205.754,3.159-.522,3.73.195.916,1.161-1.138,2.286-5.172,7.099-4.314,5.148.592,8.926,7.092,7.332,6.501-1.59-2.421,2.635-1.878,4.898.416,1.737,6.356.858,6.289-2.639-.1-4.87-1.905-3.108-4.791-5.093-2.887-1.985-2.735-8.244,1.375-9.97,4.556-1.914,3.61,7.144,9.731,6.355,5.64-.73,5.609-8.459-1.665-8.708-3.31-.116-5.867.358-5.679-.995.14-1.001,2.667-1.477,2.806-3.087.328-3.731-10.048-1.024-7.806-6.163,1.823-4.186,7.714,5.899,14.814,3.547,1.825-.605-.989-8.253-1.649-5.182Z"/><path d="M61.827,8.804c-2.345-.595-3.702,4.057-2.051,5.06.73.458,1.865.074,2.546-.958.652,1.083,1.915.908,2.68.487,2.177-1.538-1.333-3.518-2.414-1.703.444-.946.303-2.57-.761-2.887h0Z"/><path d="M62.325,21.168l.017-.013c1.625-1.867,4.876,6.312,5.541-1.796.552-6.74,3.851,4.655,4.949,7.361,1.021,2.516,3.261-3.203,3.177-5.656-.042-1.282-.858-1.759-1.36-.754-.766,1.541-1.838.601-2.484-.226-1.534-1.965-2.289-6.438-4.612-4.186-8.494,8.752-12.528-3.867-8.165-7.671,1.394-1.031,3.333-.622,3.859-.443,5.018,1.84,3.328-3.181.271-1.488-2.553.891-2.798-.855-.894-.865,5.962-.038,2.287-3.802.583-2.741-2.237,1.393-5.813,5.947-6.664,5.932-.832-.018.3-4.048-.608-4.082-1.084-.042-3.517,8.349-4.315,8.393-.778.04.213-3.354-.674-3.353-.708-.001-2.531,6.822-2.068,7.357,1.025,1.192,8.022-10.657,7.303.114-.045.645-.879,5.656-1.184,6.541-.426,1.239-2.105,7.998,5.062,4.81,7.167-3.189,9.944,1.699,9.417,5.39-.606,4.262-2.319,2.082-1.914,3.911.594,2.683,4.255,3.672,8.088,1.323,5.116-3.133-1.951-5.591-2.487-2.941-.83,4.093-4.522-.512-.946-4.789,3.504-4.191-12.91-6.67-9.893-10.126Z"/>
            </svg>
            )
          ):( //1:1 chat
          chat.otherUser?.avatar ? ( //otherUser profile
            <Image src={chat.otherUser.avatar}
            alt={chat.otherUser.username}
            priority quality={100}
            width={72} height={72}
            placeholder="blur" blurDataURL={chat.otherAvatarBlur}
            className="rounded-2xl"/>
            ):(
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor" className="rounded-2xl opacity-60 border-1">
              <path d="M30.184,67.903c-.667-.764-3.969-1.377-3.269.304.06.13.022.173-.125.136-2.483-.889-5.009.705-1.339,2.277,2.326.851,3.454.022,2.987-.954-.119-.255.033-.206.141-.195,1.87.233,2.483-.775,1.599-1.572h0l.005.005Z"/><path d="M21.548,36.713c2.114,5.638,6.809,2.938,4.017-1.491-1.697-2.423-3.941-1.843-4.131.412-1.496-3.437-4.874-2.938-2.955.613.949,1.399,2.629,1.838,3.069.466h0Z"/><path d="M29.154,52.398c-3.996-4.993-7.953,3.703-9.504,2.846-1.751-.965,4.316-8.767,7.238-10.371,2.483-1.361,3.302,1.366,5.709.293.949-.423,8.561-7.823,7.427-8.566-1.22-.802-4.744,5.481-8.452,2.196-2.158-1.914.613,4.093-.222,4.722-.96.721-3.074-2.835-3.92-2.76-.889.081-1.757,2.911-2.917,2.911s-3.887-4.261-5.047-4.034c-1.773.342-.336,9.097-9.71,6.002-1.442-.477-1.941.119-1.464.884.596.954,1.139,1.41-.862.667-2.158-.808-3.871,4.039.802,1.578,1.491-.786,2.066.824-.314,1.128-1.903.152-3.107,2.131-1.393,3.123,2.423.84,2.835-3.491,4.56-3.351,2.657.222,2.461-3.21,5.205-2.57,2.732.64,2.722,7.563-1.984,9.298-4.451,1.643-8.252,4.44-8.425,11.38-.108,4.348-3.079,3.963-3.378,5.335-.168,5.85,11.152,4.917,8.317,2.581-.276-.222-.081-.277.136-.206,3.697,1.193,5.14-1.084,2.288-2.396-1.843-.846-4.429-.206-3.952.96.146.358.081.423-.38.201-8.013-3.811,2.423-2.44,5.964-8.365,2.532-3.519,2.472-6.896,6.479-9.244,5.736-3.372,11.808,2.028,10.501,3.958-.954,1.41-3.454,1.415-5.161-.439-2.125-2.304-6.246,5.958-4.641,7.07,1.458,1.014,9.916-2.922,11.239-6.392.819-2.152-3.77-7.977-4.137-8.436Z"/><path d="M46.742,39.371c2.871-1.045,1.463-7.034-1.774-6.363-3.196.989-1.171,6.985,1.774,6.363Z"/><path d="M67.762,59.731c-1.672-.388-2.678.462-1.826,1.443,2.016,2.183,6.044.136,1.826-1.443Z"/><path d="M61.922,41.331c-1.995,10.534-8.047-3.173-10.032-3.497-1.141-.186-3.27,3.757-4.487,4.226-1.218.464-4.304-3.001-5.311-2.446-.907.504,2.751,2.763,1.823,4.236-.372.591-.779.597-1.493.813-2.314.704-5.52,2.664-6.944,6.064-.818,1.954-.212,3.658,1.496,4.998,1.632,1.28,6.484,2.828,4.044-3.842-1.978-5.419.724-6.526,2.426-5.257,3.642,2.711-.916,5.737,1.282,7.114,1.205.754,3.159-.522,3.73.195.916,1.161-1.138,2.286-5.172,7.099-4.314,5.148.592,8.926,7.092,7.332,6.501-1.59-2.421,2.635-1.878,4.898.416,1.737,6.356.858,6.289-2.639-.1-4.87-1.905-3.108-4.791-5.093-2.887-1.985-2.735-8.244,1.375-9.97,4.556-1.914,3.61,7.144,9.731,6.355,5.64-.73,5.609-8.459-1.665-8.708-3.31-.116-5.867.358-5.679-.995.14-1.001,2.667-1.477,2.806-3.087.328-3.731-10.048-1.024-7.806-6.163,1.823-4.186,7.714,5.899,14.814,3.547,1.825-.605-.989-8.253-1.649-5.182Z"/><path d="M61.827,8.804c-2.345-.595-3.702,4.057-2.051,5.06.73.458,1.865.074,2.546-.958.652,1.083,1.915.908,2.68.487,2.177-1.538-1.333-3.518-2.414-1.703.444-.946.303-2.57-.761-2.887h0Z"/><path d="M62.325,21.168l.017-.013c1.625-1.867,4.876,6.312,5.541-1.796.552-6.74,3.851,4.655,4.949,7.361,1.021,2.516,3.261-3.203,3.177-5.656-.042-1.282-.858-1.759-1.36-.754-.766,1.541-1.838.601-2.484-.226-1.534-1.965-2.289-6.438-4.612-4.186-8.494,8.752-12.528-3.867-8.165-7.671,1.394-1.031,3.333-.622,3.859-.443,5.018,1.84,3.328-3.181.271-1.488-2.553.891-2.798-.855-.894-.865,5.962-.038,2.287-3.802.583-2.741-2.237,1.393-5.813,5.947-6.664,5.932-.832-.018.3-4.048-.608-4.082-1.084-.042-3.517,8.349-4.315,8.393-.778.04.213-3.354-.674-3.353-.708-.001-2.531,6.822-2.068,7.357,1.025,1.192,8.022-10.657,7.303.114-.045.645-.879,5.656-1.184,6.541-.426,1.239-2.105,7.998,5.062,4.81,7.167-3.189,9.944,1.699,9.417,5.39-.606,4.262-2.319,2.082-1.914,3.911.594,2.683,4.255,3.672,8.088,1.323,5.116-3.133-1.951-5.591-2.487-2.941-.83,4.093-4.522-.512-.946-4.789,3.504-4.191-12.91-6.67-9.893-10.126Z"/>
            </svg>
            )
          )}
          </div>

          {/* text */}
          <div className="pointer-none flex flex-1 justify-between gap-10">
            
            <div className="flex flex-col">
              <h4 className="text-[0.8125rem] md:text-[0.9375rem] lg:text-lg 
              font-weight-basic username-spacing-comm leading-4 md:leading-6">{chat.title}</h4>

              <p className="mt-auto
              opacity-70 text-xs md:text-sm lg:text-base
              font-weight-form username-spacing-desc leading-3 md:leading-4
              break-all line-clamp-2 max-w-full overflow-hidden">{chat.lastMsg || "대화를 시작해 보세요."}</p>
            </div>

            <div className="flex flex-col flex-shrink-0">
              {/* unread 배지 */}
              {chat.unreadCount > 0 && (
              <div className="color-primary ml-auto">
                <span className="text-xs md:text-sm lg:text-base font-weight-basic username-spacing-desc">{chat.unreadCount > 99 ? "99+" : chat.unreadCount}</span>
              </div>
              )}

              <span className="mt-auto opacity-40 text-xs md:text-sm lg:text-base font-weight-form username-spacing-desc leading-3 md:leading-4">{formatToDayTime(chat.lastMsgTime.toString())}</span>
            </div>
          </div>

        </div>

        <div className="pointer-none h-[0.0625rem] w-full ring-color opacity-70 mt-2"/>
      </Link>
    ))}
    </div>

    {!isLastPage ? (
      <div className="flex items-center justify-center mt-0 sm:-mt-20">
        <span ref={trigger} className="opacity-40 form-text-color font-weight-form lg:text-lg transition-all">
          {isLoading ? "Loading . . .": "Load More +"}
        </span>
      </div>) 
    : null}
    </>
  );
}