"use client";

import { initPosts } from "@/app/(tabs)/community/page";
import PostList from "./post-list";
import { useEffect, useRef, useState } from "react";
import { getMorePosts } from "@/app/(tabs)/community/actions";

interface TakePostsProps{
  initPosts: initPosts;
};

export default function TakePosts({initPosts}: TakePostsProps){
  const [posts, setPosts] = useState(initPosts);
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

        const newPosts = await getMorePosts(page + 1);
        if(newPosts.length !== 0){// !last page
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
    return()=>{
      observer.disconnect();
    };
  }, [page, isLoading, isLastPage]);

  return(
    <>
    <div className="pt-16 mb-24 sm:mb-40 items-start grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
    {posts.map(post => <PostList key={post.id} {...post} />)}
    </div>

    {!isLastPage ? (<div className="flex items-center justify-center 
    -mt-16 sm:-mt-24">
      <span ref={trigger}
      className="opacity-60 form-text-color font-weight-basic username-spacing-comm lg:text-lg hover:opacity-100 transition-all">{isLoading ? "Loading . . .": "Load More +"}</span>
    </div>) 
    : null}
    </>
  );
}