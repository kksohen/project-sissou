"use client";
import React, { useState } from "react";
import { motion } from 'framer-motion';

const toggleVars = {
  initial:{
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    transition: {
      type: "tween",
      duration: 0.2,
      ease: "easeOut"
    }
  },
  visible:{
    opacity: 0.7,
    scaleX: 1.2,
    scaleY: 0.8,
    transition: {
      type: "tween",
      duration: 0.15,
      ease: "easeInOut"
    }
  },
};

interface IThreeHomeBtn {
  onClick: () => void;
};

export default function ThreeHomeBtn({onClick}: IThreeHomeBtn){
  const [animate, setAnimate] = useState(false);

  const handleClick = (e:React.MouseEvent)=>{
    e.stopPropagation();
    e.preventDefault();

    setAnimate(true);

    onClick();
  };

  return(
    <button onClick={handleClick}
    className="flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-lg media-bar-w-sm
        shadow-md mode-70
        ">
      <motion.svg variants={toggleVars}
      initial="initial" animate={animate ? "visible" : "initial"}
      onAnimationComplete={()=>{
        if(animate) setAnimate(false);
      }}
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"
      fill="currentColor" className="pointer-none w-11 h-11 mode-svg-color media-bar-w-sm"
      >
        <circle cx="55.315" cy="55.314" r="4.243" />
        <circle cx="40" cy="14.243" r="4.243" />
        <circle cx="30.135" cy="16.207" r="4.243" />
        <circle cx="40" cy="27.853" r="4.243" />
        <circle cx="31.419" cy="31.419" r="4.243" />
        <circle cx="48.581" cy="31.419" r="4.243" />
        <circle cx="27.853" cy="40" r="4.243" />
        <circle cx="31.419" cy="48.601" r="4.243" />
        <circle cx="40" cy="52.122" r="4.243" />
        <circle cx="48.592" cy="48.601" r="4.243" />
        <circle cx="21.787" cy="21.787" r="4.243" />
        <circle cx="16.198" cy="30.141" r="4.243" />
        <circle cx="14.243" cy="40" r="4.243" />
        <circle cx="16.198" cy="49.859" r="4.243" />
        <circle cx="21.787" cy="58.207" r="4.243" />
        <circle cx="30.135" cy="63.802" r="4.243" />
        <circle cx="40" cy="65.757" r="4.243" />
        <circle cx="49.866" cy="63.802" r="4.243" />
        <circle cx="49.86" cy="16.207" r="4.243" />
        <circle cx="58.208" cy="21.787" r="4.243" />
        <circle cx="63.801" cy="30.141" r="4.243" />
        <circle cx="65.757" cy="40" r="4.243" />
      </motion.svg>
    </button>
  );
};