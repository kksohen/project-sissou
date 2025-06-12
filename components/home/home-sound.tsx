"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const toggleVars = {
  initial:{
    opacity: 0.7,
    scaleX: 1.2,
    scaleY: 0.8
  },
  visible:{
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
      duration: 1.5,
    }
  },
  leaving:{
    opacity: 0,
    scale: 0.2,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
}

export default function HomeSound() {
  //handleSound
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(()=>{
    const audio = new Audio("/assets/audio/home-sound.mp3");
    audio.loop = true;
    setAudio(audio);

    return()=>{
      audio.pause();
      audio.currentTime = 0;
    }
  },[]);

  const togglePlay = ()=>{
    if(audio){
      if(isPlaying){
        audio.pause();
      }else{
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  return (
    <button onClick={togglePlay}
    className="flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-lg media-bar-w-sm
    shadow-md mode-70
    ">
      <AnimatePresence mode="wait" initial={false}>
      {isPlaying ? (<motion.svg 
        key="playing" variants={toggleVars}
        initial="initial" animate="visible" exit="leaving"
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"
      fill="currentColor" className="pointer-none w-11 h-11 mode-svg-color media-bar-w-sm"
      >
        <path d="M49.974,23.544c-.218.218-.417.449-.597.689-.291.388-.507.827-.662,1.287-.723,2.153-3.572,10.17-6.969,13.566s-11.413,6.246-13.566,6.969c-.46.155-.899.37-1.287.662-.24.18-.47.379-.689.597-2.525,2.525-2.525,6.618,0,9.142s6.618,2.525,9.142,0c.218-.218.417-.449.597-.689.291-.388.507-.827.662-1.287.723-2.153,3.572-10.17,6.969-13.566,3.397-3.397,11.413-6.246,13.566-6.969.46-.155.899-.37,1.287-.662.24-.18.47-.379.689-.597,2.525-2.525,2.525-6.618,0-9.142s-6.618-2.525-9.142,0Z"/>
        <ellipse cx="17.781" cy="51.885" rx="4.202" ry="6.465"/>
        <ellipse cx="67.798" cy="28.115" rx="4.202" ry="6.465"/>
        <ellipse cx="9.939" cy="45.42" rx="1.939" ry="6.465"/>
      </motion.svg>) : (
        <motion.svg key="paused" variants={toggleVars} initial="initial" animate="visible" exit="leaving"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" 
        fill="currentColor" className="pointer-none w-12 h-12 mode-svg-color media-bar-w-sm">
          <circle cx="31.273" cy="33.535" r="2.586"/><circle cx="31.273" cy="46.465" r="2.586"/><ellipse cx="61.333" cy="40" rx="4.202" ry="6.465"/><ellipse cx="70.061" cy="40" rx="1.939" ry="6.465"/><path d="M48.081,33.535c-.309,0-.612.022-.909.064-.48.068-.943.226-1.378.442-2.034,1.011-9.717,4.665-14.521,4.665s-12.487-3.654-14.521-4.665c-.434-.216-.897-.374-1.378-.442-.297-.042-.601-.064-.909-.064-3.57,0-6.465,2.894-6.465,6.465s2.894,6.465,6.465,6.465c.309,0,.612-.022.909-.064.48-.068.943-.226,1.378-.442,2.034-1.011,9.717-4.665,14.521-4.665s12.487,3.654,14.521,4.665c.434.216.898.374,1.378.442.297.042.601.064.909.064,3.57,0,6.465-2.894,6.465-6.465s-2.894-6.465-6.465-6.465Z"/>
        </motion.svg>
      )}
      </AnimatePresence>
    </button>
  );
}