"use client";
import { followUser, unfollowUser } from "@/app/(tabs)/community/@modal/(..)profile/[id]/actions";
import { UserPlusIcon, UsersIcon } from "@heroicons/react/24/solid";
import { startTransition, useOptimistic } from "react";

interface FollowBtnProps{
  isFollowing: boolean;
  followerCount: number;
  userId: number;
  onFollowChange?: (newFollowerCount: number) => void;
};

export default function FollowBtnIcon({isFollowing, followerCount, userId, onFollowChange}: FollowBtnProps) {
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
    className={`rounded-full size-8 sm:size-11 flex justify-center items-center form-text-color
    border-[0.0625rem] border-[var(--ring-color)] transition-all
    ${state.isFollowing ? "bg-primary" : "form-bg-color"}`}>
      {state.isFollowing ? <UsersIcon className="size-4 sm:size-6 pointer-none stroke-2"/> : <UserPlusIcon className="size-4 sm:size-6 pointer-none stroke-2"/>}
    </button>
  );
};