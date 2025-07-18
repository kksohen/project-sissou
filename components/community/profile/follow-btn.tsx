"use client";
import { followUser, unfollowUser } from "@/app/(tabs)/community/@modal/(..)profile/[id]/actions";
import { startTransition, useOptimistic } from "react";

interface FollowBtnProps{
  isFollowing: boolean;
  followerCount: number;
  userId: number;
  onFollowChange?: (newFollowerCount: number) => void;
};

export default function FollowBtn({isFollowing, followerCount, userId, onFollowChange}: FollowBtnProps) {
  const [state, reduceFn] = useOptimistic({isFollowing, followerCount}, (prevState, payload)=>{//eslint-disable-line @typescript-eslint/no-unused-vars
    const newFollowerCount = prevState.isFollowing ? prevState.followerCount - 1 :
      prevState.followerCount + 1;

    return {
      isFollowing: !prevState.isFollowing,
      followerCount: newFollowerCount
    };
  });
  
  const onClick = async()=>{
    const newFollowerCount = isFollowing ? followerCount - 1 : followerCount + 1;

    startTransition(()=>{
      reduceFn(undefined);
    });

    onFollowChange?.(newFollowerCount);

    if(isFollowing){
      await unfollowUser(userId);
    }else{
      await followUser(userId);
    };
  };

  return (
    <button onClick={onClick} data-cursor-target
    className={`py-2 border-custom-all mode-svg-color
    transition-all font-weight-custom text-xl tracking-wide form-btn-text
    ${state.isFollowing ? "bg-primary" : "mode-secondary"}`}>
      {state.isFollowing ? "Following" : "Follow"}
    </button>
  );
};