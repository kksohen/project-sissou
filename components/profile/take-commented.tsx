import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";
import { TakeUserActivityProps } from "./take-user-activity";
import { useEffect, useRef, useState } from "react";
import { getUserCommentedPosts } from "@/app/(tabs)/profile/actions";
import Link from "next/link";
import Image from 'next/image';
import { formatToTimeAgo } from "@/lib/utils";

interface ITakeCommented{
  id: number;
  title: string;
  photo: string;
  payload: string;
  commentedAt: Date;
};

export default function TakeCommented({userId}: TakeUserActivityProps){
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState<ITakeCommented[]>([]);
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

          const newPosts = await getUserCommentedPosts(userId, page + 1);
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
        const initPosts = await getUserCommentedPosts(userId, 0);
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
    <div className="flex flex-col">
      <button onClick={handleToggle} data-cursor-target
      className="flex flex-col gap-2 form-text-color">
        <div className="pointer-none flex items-center gap-2">
          <ChatBubbleBottomCenterIcon className="size-4 sm:size-6"/>
          <h4 className="font-weight-basic text-base sm:text-2xl username-spacing">Commented</h4>
          <ChevronDownIcon className={`size-4 sm:size-6 stroke-3 ml-auto transition-all duration-400 ${isOpen ? "rotate-180": ""}`}/>
        </div>

        <div className="pointer-none h-[0.0625rem] w-full ring-color opacity-70"/>
      </button>

      {isOpen && (
      <div>
        {posts.map(post => (
          <Link data-cursor-target
          key={`${post.id}-${post.commentedAt}`}
          href={`/posts/${post.id}`}>
            <div className="flex pointer-none mt-2 gap-10">
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div className="flex gap-1 items-center">
                  <h4 className="font-weight-basic username-spacing-comm">{post.title}</h4>
                  <span className="opacity-40 text-xs md:text-sm lg:text-base">|</span>
                  <span className="opacity-40 text-xs md:text-sm lg:text-base font-weight-form username-spacing-desc">{formatToTimeAgo(post.commentedAt.toString())}</span>
                </div>

                <p className="opacity-70 text-xs md:text-sm lg:text-base font-weight-form username-spacing-desc
                break-all line-clamp-2 max-w-full overflow-hidden">Me : {post.payload}</p>
              </div>

              <Image src={`${getThumbnailImage(post.photo)}/public`}
              alt={`${post.id}`} priority quality={100}
              width={80} height={80} 
              className="ml-auto object-cover aspect-square rounded-2xl size-14 sm:size-20"/>
            </div>

            <div className="pointer-none h-[0.0625rem] w-full ring-color opacity-70 mt-2"/>
          </Link>
        ))}
      </div>
      )}

      {isOpen && !isLastPage && (
      <div className="mt-4 flex items-center justify-center">
        <span ref={trigger} className="opacity-40 form-text-color font-weight-form lg:text-lg transition-all">
          {isLoading ? "Loading . . .": "Load More +"}
        </span>
      </div>
      )}

      {isOpen && posts.length === 0 && !isLoading && (
      <p className="mt-4 opacity-40 font-weight-form">아직 연결된 이야기가 없습니다.</p>
      )}
    </div>
  );
}