"use client";
import { followStatus, userProfile } from "@/app/(tabs)/community/@modal/(..)profile/[id]/page";
import Image from "next/image";
import { useState } from "react";
import HandleBackBtn from "../posts/handle-back-btn";
import Link from "next/link";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import FollowBtnIcon from "./follow-btn-icon";
import Logout from "@/components/auth/logout";
import ChatBtn from "../chats/chat-btn";

interface UserProfileProps{
  user: userProfile;
  initFollowStatus?: followStatus | null;
  isOwner?: boolean;
  activeTab?: string;
  onTabsChange?: (tab: string) => void;
};

export default function ClientUserProfile({user, initFollowStatus = null, isOwner = false, activeTab, onTabsChange}:UserProfileProps){
  const avatarUrl = user?.avatar ? user.avatar : null;
  const [followerCount, setFollowerCount] = useState(isOwner ? 
    user._count.followers : (initFollowStatus?.followerCount || user._count.followers)
  );

  const handleFollowChange = (newFollowerCount: number)=>{
    setFollowerCount(newFollowerCount);
  };

  //tabs change
  const handleTabClick = (tab: string)=>{
    onTabsChange?.(tab);
  };

  const tabs = ["편 Pieces", "원 Circles", "연 Activity"];

  return(
  <div className="fixed top-0 left-0 right-0 z-[1] pt-10
  mode-svg-color-50 backdrop-blur-sm
  shadow-[0_8px_32px_rgba(0,0,0,0.02)]">

    <div className="mx-auto max-w-screen-xs 
    sm:max-w-lg md:max-w-screen-sm 
    lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">

      <div className="flex items-start">
        {!isOwner && (
        <div className="[&>button]:size-8.5 [&>button]:sm:size-11.5">
          <HandleBackBtn/>
        </div>
        )}
        
        {/* avatar */}
        <div className="flex-shrink-0 size-16 sm:size-20">
        {avatarUrl !== null ? 
          <Image src={avatarUrl} alt={user.username} width={80} height={80} priority quality={100} 
          className="rounded-full" /> : 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor">
            <path d="M27.233,43.855c1.706-.07,2.609.225,3.782-1.181,2.924-3.502-3.826-12.769-1.522-13.515,2.554-.816,7.326,11.462,10.293,11.068,2.967-.408,10.614-10.055,13.027-8.649,4.195,2.447,9.456,46.296,20.108,17.692,4.043-10.21,3.989,11.63,5.869,1.87,5.869-30.869-14.499-.084-16.325-4.064-.826-1.786,5.956-20.645,7.543-20.279,1.989.45-1.576,9.788.185,10.069.979.153,4.01-6.575,6.962-12.653C70.932,10.05,56.735.15,40.206.15,19.77.15,2.896,15.282.258,34.896c.347-.473.691-.788,1.037-.829,1.696-.197,5.33,9.029,7.254,7.158,1.674-1.631-3.88-17.213.446-12.249,7.434,8.522,14.499-7.777,16.945-5.696,2.272,1.927-12.349,20.562-14.891,22.22-4.666,3.045-5.863-4.289-10.841-.759-.019.013-.039.03-.058.045.697,6.181,2.807,11.934,6,16.938.476-1.482.685-3.414,2.139-5.845,5.163-8.635,13.412-11.785,18.945-12.024ZM39.765,12.466c7.554.563,7.119,18.774.152,19.562-6.88-.478-7.804-19.182-.152-19.562Z"/><path d="M35.081,75.006c-1.288-2.264-5.812-.338-8.029-3.417-4.043-5.625,7.725-10.787,1.279-21.334-3.011-4.936-9.641-3.839-8.478,13.177.432,6.272.273,9.443-1.023,10.84,4.446,2.773,9.473,4.707,14.86,5.578,1.893-1.786,2.294-3.257,1.391-4.844Z"/><path d="M42.847,43.855c-8,12.98,16.543,13.191,13.608,23.612-1.261,4.5-7.13,3.924-8.032,6.68-.703,2.153.99,3.265,3.936,4.373,7.648-2.403,14.305-7.015,19.227-13.081-15.672-.528-22.478-31.755-28.739-21.584Z"/>
          </svg>
        }</div>

        <div className="ml-3 sm:ml-6 flex flex-col gap-4 flex-1">
          <div className="flex items-center">
            <h1 className="font-weight-basic text-base sm:text-2xl username-spacing">{user.username}</h1>
            {/* !isOwner - icons */}
            {!isOwner && initFollowStatus && (
            <div className="ml-auto flex gap-2 sm:gap-2.5">
              <ChatBtn targetUserId={user.id}/>

              <FollowBtnIcon isFollowing={initFollowStatus.isFollowing} followerCount={initFollowStatus.followerCount} userId={user.id} onFollowChange={handleFollowChange}/>
            </div>
            )}
            {/* isOwner - icons */}
            {isOwner && (
            <div className="ml-auto flex gap-2 sm:gap-2.5">
              <Link href={`/profile/${user.id}/edit`} data-cursor-target
              className="rounded-full size-8 sm:size-11 flex justify-center items-center form-text-color form-bg-color
              border-[0.0625rem] border-[var(--ring-color)] 
              hover:bg-primary transition-all">
                <WrenchScrewdriverIcon className="size-3.5 sm:size-5 pointer-none stroke-2"/>
              </Link>

              <Logout/>
            </div>
            )}
            
          </div>
          {/* counts */}
          <ul className="flex gap-4 sm:gap-6 font-weight-form username-spacing opacity-70 text-xs md:text-sm lg:text-base">
            <li>
              <span>Posts</span>
              <span className="ml-1 sm:ml-2">{user._count.posts}</span>
            </li>
            <li>
              <span>Followers</span>
              <span className="ml-1 sm:ml-2">{followerCount}</span>
            </li>
            <li>
              <span>Following</span>
              <span className="ml-1 sm:ml-2">{user._count.following}</span>
            </li>
          </ul>
        </div>
      </div>

    </div>

    <div className="h-[0.0625rem] w-full ring-color opacity-70 mt-3"/>
    
    {isOwner ? (
      <div className="flex justify-center gap-4 sm:gap-6 py-3 font-weight-basic username-spacing">
        {tabs.map((tab)=>(
          <button data-cursor-target
          key={tab} onClick={()=>handleTabClick(tab)}
          className={`${activeTab === tab ? "opacity-100" : "opacity-40"}`}>
            {tab}
          </button>
        ))}
      </div>
    ):(
      <div className="flex justify-center py-3 font-weight-basic username-spacing">편 Pieces</div>
    )}
  </div>
);
}