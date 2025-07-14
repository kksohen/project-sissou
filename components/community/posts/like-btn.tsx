"use client";

import { dislikePost, likePost } from "@/app/(tabs)/community/posts/[id]/actions";
import { startTransition, useOptimistic } from "react";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";

interface LikeBtnProps{
  isLiked: boolean;
  likeCount: number;
  postId: number;
};

export default function LikeBtn({isLiked, likeCount, postId}: LikeBtnProps){
  const [state, reduceFn] = useOptimistic({isLiked, likeCount}, (prevState, payload)=>{//eslint-disable-line @typescript-eslint/no-unused-vars
    return{
      isLiked: !prevState.isLiked,
      likeCount: prevState.isLiked ? prevState.likeCount - 1 :
      prevState.likeCount + 1
    }
  });
  //useOptimistic(params: initData, reducer modifyData) - user에게 결과를 미리 확정지어서 보여줌(좋아요 버튼 같은 것만 사용가능, 회원가입 폼 제출버튼은 유효성 확인해야 해서 불가능)

  const onClick = async()=>{
    startTransition(()=>{
      reduceFn(undefined);
    });

    if(isLiked){
      await dislikePost(postId);
    }else{
      await likePost(postId);
    };
  };

  return(
    <button 
    onClick={onClick} data-cursor-target
    className={`color-accent color-accent-50 backdrop-blur-lg
    border-[0.0625rem] py-2 px-3 rounded-full 
    ${state.isLiked ? "animate-appear" : ""}`}>
      {state.isLiked ? <SolidHeartIcon className="size-4 pointer-none"/> : 
      <OutlineHeartIcon className="size-4 pointer-none stroke-2"/>}
      {state.isLiked ? <span className="pointer-none">{state.likeCount}</span> : <span className="pointer-none">Like {state.likeCount}</span>}
    </button>
  );
}