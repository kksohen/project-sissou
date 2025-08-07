"use client";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import { TakeUserActivityProps } from "./take-user-activity";
import { useEffect, useRef, useState } from "react";
import { getUserLikedPosts } from "@/app/(tabs)/profile/actions";
import Link from "next/link";
import Image from "next/image";

interface ITakeLiked{
  id: number;
  photo: string;
  liked_at: Date;
};

export default function TakeLiked({userId}: TakeUserActivityProps){
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState<ITakeLiked[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);

  //img 불러오기
  function getThumbnailImage(photo: string){
    const images = JSON.parse(photo);
    return Array.isArray(images) ? images[0] : images;
  };
  
  useEffect(()=>{
    if(!isOpen) return;
    
    const observer = new IntersectionObserver(
      async(
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      )=>{
        const element = entries[0];

        if(element.isIntersecting && trigger.current && !isLoading && !isLastPage){
          observer.unobserve(trigger.current);
          setIsLoading(true);

          const newPosts = await getUserLikedPosts(userId, page + 1);
          if(newPosts.length !== 0){
            setPosts(prev => [...prev, ...newPosts]);
            setPage(prev => prev + 1);
          }else{
            setIsLastPage(true);
          };

          setIsLoading(false);
        };
      }, {
        threshold: 0.1,
        rootMargin: "0px 0px 50px 0px",
      });
      if(trigger.current){
        observer.observe(trigger.current);
      };
      return () => {
        observer.disconnect();
      };
  },[page, isLoading, isLastPage, userId, isOpen]);

  //section toggle
  const handleToggle = async()=>{
    setIsOpen(!isOpen);

    if(!isOpen && posts.length === 0){
      setIsLoading(true);

      try{
        const initPosts = await getUserLikedPosts(userId, 0);
        setPosts(initPosts);
        setPage(0);
        setIsLastPage(initPosts.length === 0);
      }catch(error){
        console.error(error);
      }finally{
        setIsLoading(false);
      };
    };
  };

  return(
    <div className="flex flex-col pt-2 gap-2">
      <button onClick={handleToggle} data-cursor-target
      className="flex flex-col gap-2 form-text-color">

        <div className="pointer-none flex items-center gap-2">
          <HeartIcon className="size-4.5 sm:size-6.5"/>
          <h4 className="font-weight-basic text-base sm:text-2xl username-spacing">Liked</h4>
          <ChevronDownIcon className={`size-4 sm:size-6 stroke-3 ml-auto transition-all duration-400 ${isOpen ? "rotate-180": ""}`}/>
        </div>

        <div className="pointer-none h-[0.0625rem] w-full ring-color opacity-70"/>
      </button>

      {isOpen && (
        <div className="grid grid-cols-6 gap-0.5 lg:gap-1">
        {posts.map(post => (
          <Link data-cursor-target
          key={`${post.id}-${post.liked_at}`}
          href={`/posts/${post.id}`}>
            <Image src={`${getThumbnailImage(post.photo)}/public`} alt={`${post.id}`}
            priority 
            quality={100}
            width={210}
            height={210}
            className="object-cover aspect-square pointer-none"/>
          </Link>
        ))}
        </div>
      )}

      {isOpen && !isLastPage && (
      <div className="flex items-center justify-center">
        <span ref={trigger} className="opacity-40 form-text-color font-weight-form lg:text-lg transition-all">
          {isLoading ? "Loading . . .": "Load More +"}
        </span>
      </div>
      )}

      {isOpen && posts.length === 0 && !isLoading && (
      <p className="opacity-40 font-weight-form">아직 마음에 드는 조각을 찾지 못했습니다.</p>
      )}
    </div>
  );
}