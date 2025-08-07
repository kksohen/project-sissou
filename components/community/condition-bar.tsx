"use client";

import Link from "next/link";
import DarkModeBtn from "../home/dark-mode-btn";
import { motion } from 'framer-motion';

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
      duration: 8,
      ease: "easeInOut"
    }
  },
};

export default function ConditionBar() {

  return(
    <ul className="flex flex-col items-center justify-between 
    fixed right-4 top-10 z-10">
      {/* home - 1 */}
      <li data-cursor-target
      className="relative z-10 w-16 h-16 flex items-center justify-center media-bar-w-lg mode-secondary-50 backdrop-blur-lg rounded-full
      border-custom-top">
        <DarkModeBtn />
      </li>

      {/* 이음 선 */}
      <li className="-m-6 relative z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 60" 
        transform="matrix(-1.8369701987210297e-16,-1,1,-1.8369701987210297e-16,0,0)"
        className="w-16 h-16 mode-bar-color media-bar-w-lg ">
          <defs>
            <mask id="half-circle-mask">
              <rect width="100%" height="100%" fill="black"/>
              <circle cx="37.5" cy="30" r="30" fill="white"/>
            </mask>
          </defs>
          <path d="M0 60c9.26 0 17.55-4.2 23.05-10.8 3.7-4.44 8.67-8.2 14.45-8.2s10.75 3.76 14.45 8.2C57.45 55.8 65.74 60 75 60V0c-9.78 0-18.47 4.68-23.95 11.92C47.73 16.33 43.02 20 37.5 20s-10.23-3.67-13.55-8.08C18.47 4.68 9.78 0 0 0"
          mask="url(#half-circle-mask)"/>
        </svg>
      </li>

      <li data-cursor-target
      className="relative z-10 w-16 h-16 flex items-center justify-center media-bar-w-lg mode-secondary-50 backdrop-blur-lg rounded-full
      border-custom-middle">
        <Link href="/chats/add">
          <button 
          className="flex items-center justify-center w-12 h-12
          rounded-full backdrop-blur-lg media-bar-w-sm
          shadow-md mode-70">
            <motion.svg key="playing" variants={toggleVars}
            initial="initial" animate="visible" exit="leaving" fill="currentColor"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className="pointer-none size-11.5 mode-svg-color media-bar-w-sm">
              <path d="M67.682,43.836c-1.112-3.261-5.595,1.663-6.998-3.71.579-5.668,6.007-1.64,7.014-3.674-.681-7.137,3.076-15.694-4.908-12.831-.722.259-1.451,1.333-2.255,1.675-3.102,1.317-7.553,3.196-10.092,6.943v-9.185H12v33.89h38.443v-9.203s1.946,2.098,5.504,4.755c3.629,2.71,7.42,4.112,8.438,4.32,5.06,1.034,3.155-4.416,2.981-8.476-.064-1.502.873-2.874.317-4.505ZM21.155,44.238c-2.34,0-4.237-1.897-4.237-4.237s1.897-4.237,4.237-4.237,4.237,1.897,4.237,4.237-1.897,4.237-4.237,4.237ZM31.217,54.3c-2.34,0-4.237-1.897-4.237-4.237s1.897-4.237,4.237-4.237,4.237,1.897,4.237,4.237-1.897,4.237-4.237,4.237ZM31.217,44.238c-2.34,0-4.237-1.897-4.237-4.237s1.897-4.237,4.237-4.237,4.237,1.897,4.237,4.237-1.897,4.237-4.237,4.237ZM31.217,34.176c-2.34,0-4.237-1.897-4.237-4.237s1.897-4.237,4.237-4.237,4.237,1.897,4.237,4.237-1.897,4.237-4.237,4.237ZM41.279,44.238c-2.34,0-4.237-1.897-4.237-4.237s1.897-4.237,4.237-4.237,4.237,1.897,4.237,4.237-1.897,4.237-4.237,4.237ZM53.404,44.856c-1.225.06-2.959-1.734-2.959-1.734v-6.257s1.316-1.477,2.01-1.666c1.907-.52,5.257,1.885,5.257,4.801s-2.651,4.774-4.307,4.856Z"/>
            </motion.svg>
          </button>
        </Link>
      </li>

      {/* 이음 선 */}
      <li className="-m-6 relative z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 60" 
        transform="matrix(-1.8369701987210297e-16,-1,1,-1.8369701987210297e-16,0,0)"
        className="w-16 h-16 mode-bar-color media-bar-w-lg ">
          <defs>
            <mask id="half-circle-mask">
              <rect width="100%" height="100%" fill="black"/>
              <circle cx="37.5" cy="30" r="30" fill="white"/>
            </mask>
          </defs>
          <path d="M0 60c9.26 0 17.55-4.2 23.05-10.8 3.7-4.44 8.67-8.2 14.45-8.2s10.75 3.76 14.45 8.2C57.45 55.8 65.74 60 75 60V0c-9.78 0-18.47 4.68-23.95 11.92C47.73 16.33 43.02 20 37.5 20s-10.23-3.67-13.55-8.08C18.47 4.68 9.78 0 0 0"
          mask="url(#half-circle-mask)"/>
        </svg>
      </li>

      <li data-cursor-target
      className="relative z-10 w-16 h-16 flex items-center justify-center media-bar-w-lg mode-secondary-50 backdrop-blur-lg rounded-full
      border-custom-bottom">
        <Link href="/posts/add">
          <button 
          className="flex items-center justify-center w-12 h-12
          rounded-full backdrop-blur-lg media-bar-w-sm
          shadow-md mode-70">
            <motion.svg key="playing" variants={toggleVars}
            initial="initial" animate="visible" exit="leaving" fill="currentColor"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86 86" className="pointer-none w-12 h-12 mode-svg-color media-bar-w-sm">
              <path d="M64.647,49.084v16.301h-22.491c2.181-.033,3.939-1.806,3.939-3.994,0-2.209-1.791-4-4-4s-4,1.791-4,4c0,2.188,1.759,3.961,3.939,3.994h-22.491v-16.301h-2.615v18.916h50.333v-18.916h-2.615Z"/><path d="M47.442,23.11c.648-1.097,1.021-2.376,1.021-3.742,0-4.069-3.299-7.368-7.368-7.368s-7.368,3.299-7.368,7.368c0,1.847.684,3.53,1.807,4.823l-22.795,19.77,1.353,2.217,37.797-15.855s-3.779-6.113-4.445-7.213ZM43.787,20.742c-.503.982-1.513,1.661-2.692,1.661-.915,0-1.726-.414-2.283-1.055-.462-.533-.752-1.219-.752-1.98,0-1.676,1.359-3.035,3.035-3.035s3.035,1.359,3.035,3.035c0,.497-.131.96-.343,1.374Z"/><circle cx="42.095" cy="51.891" r="4"/><circle cx="51.595" cy="51.891" r="4"/><circle cx="32.595" cy="51.891" r="4"/><circle cx="42.095" cy="42.391" r="4"/>
            </motion.svg>
          </button>
        </Link>
      </li>
    </ul>
  );
}