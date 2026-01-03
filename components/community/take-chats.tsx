"use client";
import { initChats } from "@/app/(tabs)/chats/page";
import { getMoreChats } from "@/app/(tabs)/community/actions";
import { useEffect, useRef, useState } from "react";
import ChatList from "./chat-list";

interface TakeChatProps{
  initChats: initChats;
};

export default function TakeChats({initChats}: TakeChatProps){
  const [chats, setChats] = useState(initChats);
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

          const newChats = await getMoreChats(page + 1);
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

  return(
    <>
    <div className="mb-10 sm:mb-24 items-start grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
    {chats.map(chat => <ChatList key={chat.id} {...chat}/>)}
    </div>

    {!isLastPage ? (<div className="flex items-center justify-center sm:-mt-24">
      <span ref={trigger}
      className="opacity-40 form-text-color font-weight-form lg:text-lg transition-all">{isLoading ? "Loading . . .": "Load More +"}</span>
    </div>) 
    : null}
    </>
  );
}