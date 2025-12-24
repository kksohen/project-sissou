"use client";
import { followStatus, userProfile } from "@/app/(tabs)/community/@modal/(..)profile/[id]/page";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FollowBtn from "./follow-btn";
import ModalChatBtn from "../chats/modal-chat-btn";
import { getThumbnailImage } from "@/lib/utils";

interface ProfileModalProps{
  user: userProfile;
  initFollowStatus: followStatus;
  isOwner: boolean;
  photoBlur?: string[];
};

export default function ClientProfileModal({user, initFollowStatus, isOwner, photoBlur}:ProfileModalProps){
  const router = useRouter();
  const avatarUrl = user?.avatar ? user.avatar : null;

  const [followerCount, setFollowerCount] = useState(initFollowStatus.followerCount);

  //modal창 열린 동안 배경 스크롤 비활성화
  useEffect(()=>{
    document.body.style.overflow = "hidden";

    return()=>{
      document.body.style.overflow = "unset";
    }
  },[]);

  const handleClose = ()=>{
    router.back();
  };

  //follower count
  const handleFollowChange = (newFollowerCount: number)=>{
    setFollowerCount(newFollowerCount);
  };

  return(
    <div onClick={handleClose}
    className="fixed z-10 w-full h-full top-0 left-0
    flex justify-center items-center backdrop-blur-lg">
      <div onClick={(e)=>e.stopPropagation()}
      className="mode-secondary-50 border-custom-all mode-svg-color
      font-weight-modal dark:tracking-normal
      rounded-3xl p-3 sm:p-4">
      
      <div className="flex gap-2.5 sm:gap-3.5 items-start mb-2">
        <div className="size-8 sm:size-10 md:size-12 lg:size-14 flex-shrink-0 self-center">
        {avatarUrl ? (
          <Image className="rounded-full"
          src={avatarUrl} alt={user.username} width={64} height={64} priority quality={100}/>) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor">
            <path d="M27.233,43.855c1.706-.07,2.609.225,3.782-1.181,2.924-3.502-3.826-12.769-1.522-13.515,2.554-.816,7.326,11.462,10.293,11.068,2.967-.408,10.614-10.055,13.027-8.649,4.195,2.447,9.456,46.296,20.108,17.692,4.043-10.21,3.989,11.63,5.869,1.87,5.869-30.869-14.499-.084-16.325-4.064-.826-1.786,5.956-20.645,7.543-20.279,1.989.45-1.576,9.788.185,10.069.979.153,4.01-6.575,6.962-12.653C70.932,10.05,56.735.15,40.206.15,19.77.15,2.896,15.282.258,34.896c.347-.473.691-.788,1.037-.829,1.696-.197,5.33,9.029,7.254,7.158,1.674-1.631-3.88-17.213.446-12.249,7.434,8.522,14.499-7.777,16.945-5.696,2.272,1.927-12.349,20.562-14.891,22.22-4.666,3.045-5.863-4.289-10.841-.759-.019.013-.039.03-.058.045.697,6.181,2.807,11.934,6,16.938.476-1.482.685-3.414,2.139-5.845,5.163-8.635,13.412-11.785,18.945-12.024ZM39.765,12.466c7.554.563,7.119,18.774.152,19.562-6.88-.478-7.804-19.182-.152-19.562Z"/>
            <path d="M35.081,75.006c-1.288-2.264-5.812-.338-8.029-3.417-4.043-5.625,7.725-10.787,1.279-21.334-3.011-4.936-9.641-3.839-8.478,13.177.432,6.272.273,9.443-1.023,10.84,4.446,2.773,9.473,4.707,14.86,5.578,1.893-1.786,2.294-3.257,1.391-4.844Z"/>
            <path d="M42.847,43.855c-8,12.98,16.543,13.191,13.608,23.612-1.261,4.5-7.13,3.924-8.032,6.68-.703,2.153.99,3.265,3.936,4.373,7.648-2.403,14.305-7.015,19.227-13.081-15.672-.528-22.478-31.755-28.739-21.584Z"/>
          </svg>
        )}
        </div>

        <h4 className="flex-1 self-center">{user.username}</h4>

        <button onClick={()=> handleClose()}
        data-cursor-target 
        className="flex-shrink-0 
        p-1 rounded-full mode-secondary mode-svg-color">
          <XMarkIcon className="pointer-none size-3 sm:size-4 stroke-3" />
        </button>
      </div>
      
      <ul className="text-center flex mb-2 *:flex-1">
        <li>
          <p>Posts</p>
          <p>{user._count.posts}</p>
        </li>
        <li>
          <p>Followers</p>
          <p>{followerCount}</p>
        </li>
        <li>
          <p>Following</p>
          <p>{user._count.following}</p>
        </li>
      </ul>

      <div className="flex mb-0.5">
      {user.posts.map((post, index)=>{
        const thumbnail = getThumbnailImage(post.photo);
        const photoBlurs = photoBlur?.[index];

        return (
          <Image className="size-24 sm:size-32 object-cover aspect-square"
          key={post.id} 
          src={`${thumbnail}/public`} 
          alt={`${user.username}'s posts ${index+1}`} 
          width={128} height={128} priority
          quality={100}
          placeholder="blur" blurDataURL={photoBlurs}
          />
        );
      })}
      {/* 게시글 1 or 2개일 때 */}
      {Array.from({length: 3 - user.posts.length}, (_, index)=>(
        <div key={`empty ${index}`} 
        className="size-24 sm:size-32 mode-secondary-50"></div>
      ))}
      </div>

      {isOwner ? (
        null
      ) : (
        <div className="mt-3.25 sm:mt-4.25 flex gap-3 *:flex-1
            [&>button]:py-0.5 [&>button]:px-2
            [&>button]:sm:py-1 [&>button]:sm:px-3
            [&>button]:rounded-full
            [&>button]:text-sm [&>button]:sm:text-base 
            [&>button]:md:text-lg [&>button]:lg:text-xl">
        <ModalChatBtn targetUserId={user.id} text="Message" />

        <FollowBtn isFollowing={initFollowStatus.isFollowing} followerCount={initFollowStatus.followerCount} userId={user.id} onFollowChange={handleFollowChange}/>
        </div>
      )}
      </div>
    </div>
  );
}