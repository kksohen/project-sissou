"use client";

import { useState } from "react";
import MenuTab from "./menu-tab"
import { AnimatePresence } from "framer-motion";

interface MenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Menu({isOpen,setIsOpen, setSearchOpen}: MenuProps){
  const [initAnimated, setInitAnimated] = useState(false); //햄버거바 초기 애니메이션 실행 방지
  
  const closeMenu = ()=>setIsOpen(false);
  
  return(
    <>
    <div className="relative z-30 w-16 h-16 -ml-6 media-bar-w-lg flex items-center justify-center mode-secondary-50 backdrop-blur-lg rounded-full border-custom-right">
      <div className="flex items-center justify-center w-12 h-12 mode-70 rounded-full backdrop-blur-lg media-bar-w-sm shadow-md">
        <button
        onClick={()=>{
          setIsOpen(prev=>!prev);
          setInitAnimated(true);
          setSearchOpen(false);
        }}
        className="w-full h-full absolute flex flex-col items-center justify-center media-bar-w-icon">
          <span className={`bar bar-top pointer-none ${!initAnimated ? "no-animation" : isOpen ? "animate-line-1" : "animate-line-1-rev"}`}></span>
          <span className={`bar bar-mid pointer-none ${!initAnimated ? "no-animation" : isOpen ? "animate-line-2" : "animate-line-2-rev"}`}></span>
          <span className={`bar bar-bot pointer-none ${!initAnimated ? "no-animation" : isOpen ? "animate-line-3" : "animate-line-3-rev"}`}></span>
        </button>
      </div>
    </div>
    
    <AnimatePresence>
      {isOpen && <MenuTab onClose={closeMenu}/>}
    </AnimatePresence>
    </>
  );
}