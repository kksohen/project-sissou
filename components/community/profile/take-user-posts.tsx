"use client";
import Image from "next/image";
import Link from "next/link";
import { initUserPosts } from '../../../app/(tabs)/profile/[id]/page';
import { useEffect, useRef, useState } from "react";
import { getMoreUserPosts } from "@/app/(tabs)/profile/[id]/actions";
import { getThumbnailImage } from "@/lib/utils";

interface TakeUserPostsProps{
  initUserPosts: initUserPosts;
  userId: number;
};

export default function TakeUserPosts({initUserPosts, userId}: TakeUserPostsProps){
  const [posts, setPosts] = useState(initUserPosts);
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

          const newPosts = await getMoreUserPosts(userId, page + 1);
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
  },[page, isLoading, isLastPage, userId]);
  
  //게시글 없을 때
  if(!posts || posts.length === 0){
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
            <span>_</span>
            <span>_</span>
            <span>▪</span>
            <span>_</span>
            <span>_</span>
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
            <span>&#40;</span>
          </div>
          <div className="-mt-1">
            <span>†</span>
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
            <span>`</span>
            <span></span>
            <span></span>
          </div>
          <div className="-mt-6">
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
            <span>_</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>~</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>_</span>
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
            <span>&#41;</span>
          </div>
          <div className="-mt-2">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>_</span>
            <span>▪</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>_</span>
            <span></span>
            <span>_</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>▪</span>
            <span>_</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>&#40;</span>
          </div>
          <div className="-mt-1">
            <span></span>
            <span>†</span>
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
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>`</span>
            <span></span>
            <span></span>
          </div>
          <div className="-mt-5">
            <span></span>
            <span></span>
            <span>_</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>_</span>
            <span>~</span>
            <span>_</span>
            <span></span>
            <span></span>
            <span>⁘</span>
            <span></span>
            <span></span>
            <span>_</span>
            <span>~</span>
            <span>_</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>_</span>
            <span>‖</span>
          </div>
          <div className="-mt-2">
            <span></span>
            <span></span>
            <span></span>
            <span>_</span>
            <span>▪</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>_</span>
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
            <span>_</span>
            <span></span>
            <span></span>
            <span>_</span>
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
            <span>_</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>▪</span>
            <span>_</span>
            <span>‖</span>
          </div>
          <div className="-mt-1">
            <span>†</span>
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
            <span>`</span>
          </div>
          <div className="-mt-5">
            <span>_</span>
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
            <span>_</span>
            <span>~</span>
            <span>_</span>
            <span></span>
            <span></span>
            <span>~</span>
            <span></span>
            <span></span>
            <span>_</span>
            <span>~</span>
            <span>_</span>
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
            <span>_</span>
          </div>
          <div className="-mt-2">
            <span>_</span>
            <span>▪</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>⋱</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>_</span>
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
            <span>_</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>⋰</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>▪</span>
            <span>_</span>
          </div>
          <div className="-mt-1">
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
          </div>
          <div>
            <span>| |</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>| |</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>[ ]</span>
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
            <span>[ ]</span>
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
            <span>[ ]</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>| |</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>| |</span>
          </div>
          <div>
            <span>| |</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>| |</span>
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
            <span>&#44;</span>
            <span>&#44;</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>| |</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>| |</span>
          </div>
          <div>
            <span>| |</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>| |</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>[ ]</span>
            <span></span>
            <span></span>
            <span></span>
            <span>[ ]</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>—</span>
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
            <span>&#44;</span>
            <span>_</span>
            <span>&#44;</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>| |</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>| |</span>
          </div>
          <div>
            <span>| |</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>| |</span>
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
            <span>( )</span>
            <span>|</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>▪</span>
            <span>|</span>
            <span>( )</span>
            <span></span>
            <span>_ &#40;</span>
            <span>|</span>
            <span>&#41; _</span>
            <span></span>
            <span></span>
            <span>| |</span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>| |</span>
          </div>
          <div>
            <span>| |</span>
            <span>==</span>
            <span>| |</span>
            <span></span>
            <span></span>
            <span></span>
            <span>—</span>
            <span>—</span>
            <span>—</span>
            <span></span>
            <span></span>
            <span>|</span>
            <span></span>
            <span>==</span>
            <span></span>
            <span>|</span>
            <span></span>
            <span></span>
            <span>_ &#40; &#40;</span>
            <span>|</span>
            <span>&#41; &#41; _</span>
            <span></span>
            <span>| |</span>
            <span>==</span>
            <span>| |</span>
          </div>
          <div>
            <span>^</span>
            <span>^</span>
            <span>^</span>
            <span>—</span>
            <span>—</span>
            <span>—</span>
            <span>^</span>
            <span>^</span>
            <span>^</span>
            <span>^</span>
            <span>^</span>
            <span>^</span>
            <span>^</span>
            <span>—</span>
            <span>—</span>
            <span>—</span>
            <span>—</span>
            <span>—</span>
            <span>—</span>
            <span>—</span>
            <span>—</span>
            <span>—</span>
            <span>—</span>
            <span>^</span>
            <span>^</span>
            <span>^</span>
          </div>
        </div>

        <h4 className="text-2xl sm:text-3xl font-weight-basic username-spacing-comm">&#40; 집 정립 중 . . . &#41;</h4>
      </div>
    );
  };
  
  return(
    <>
    <div className="pt-40 sm:pt-45 lg:pt-48 mb-10 sm:mb-40
    grid grid-cols-3 gap-0.5 lg:gap-1">
      {posts.map(post => (
        <Link key={post.id} href={`/posts/${post.id}`}
        data-cursor-target>
          <Image src={`${getThumbnailImage(post.photo)}/public`} 
          alt={`${post.id}`}
          priority quality={100}
          width={430}
          height={430}
          placeholder="blur" blurDataURL={post.photoBlur}
          className="object-cover aspect-square pointer-none"/>
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