"use client";
import ClientUserProfile from "../community/profile/user-profile";
import { userProfile } from '../../app/(tabs)/community/@modal/(..)profile/[id]/page';
import { initUserPosts } from "@/app/(tabs)/profile/[id]/page";
import { useState } from "react";
import TakeUserPosts from "../community/profile/take-user-posts";
import { AnimatePresence, motion } from 'framer-motion';
import TakeUserActivity from "./take-user-activity";

interface ProfileWrapProps{
  profileInfo: userProfile;
  initUserPosts: initUserPosts;
  userId: number;
}

export default function ProfileWrap({profileInfo, initUserPosts, userId}: ProfileWrapProps){
  const [activeTab, setActiveTab] = useState("편 Pieces");
  const [direction, setDirection] = useState(0); //sliding motion

  const tabs = ["편 Pieces", "융 Chats", "연 Activity"];

  const handleTabsChange = (tab: string)=>{
    if (tab === activeTab) return; //더블클릭해서 슬라이드 멈춤 방지

    const currentIndex = tabs.indexOf(activeTab);
    const newIndex = tabs.indexOf(tab);

    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(tab);
  };

  const renderTabs = () =>{
    switch(activeTab){
      case "편 Pieces": return <TakeUserPosts initUserPosts={initUserPosts} userId={userId}/>;
      case "융 Chats": return <TakeUserPosts initUserPosts={initUserPosts} userId={userId}/>;
      case "연 Activity": return <TakeUserActivity userId={userId}/>;
      default: <TakeUserPosts initUserPosts={initUserPosts} userId={userId}/>;
    }
  };

  const slideVar = {
    init: (direction: number)=>({
      x: direction > 0 ? "40%" : "-40%",
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number)=>({
      x: direction > 0 ? "-40%" : "40%",
      opacity: 0
    })
  };

  return(
    <>
    <ClientUserProfile user={profileInfo} isOwner={true}
    activeTab={activeTab} onTabsChange={handleTabsChange} />

    <div className="relative overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div key={activeTab} custom={direction} variants={slideVar} initial="init" animate="animate" exit="exit">
          {renderTabs()}
        </motion.div>
      </AnimatePresence>
    </div>
    </>
  );
}