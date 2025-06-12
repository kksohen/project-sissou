// "use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

//framer-motion
const searchBoxVars = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.2,
      delay: 0.4,
      ease: "easeInOut"
    } 
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    transition: { 
      duration: 0.2,
      delay: 0.1,
      ease: "easeInOut"
    }
  }
};

export default function SearchList(){
  return(
    <motion.div variants={searchBoxVars} initial="initial" animate="animate" exit="exit"
    className="
    fixed 
    bottom-20
    2xl:-left-[1280px] left-pos-5xl
    xl:-left-[768px] lg:-left-[600px] 
    md:-left-[480px] md:w-[700px]
    sm:-left-[375px] sm:w-[600px] left-pos-xs left-w-xs
    flex items-center flex-wrap 
    gap-1 sm:gap-2 mode-svg-color
    *:px-4 *:py-2 *:rounded-full ">
      <Link href="/" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      border-custom-all 
      ">제로</Link>
      <Link href="/" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      border-custom-all 
      ">Prologue</Link>
      
      <Link href="/exhibition-born" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      
      ">기</Link>
      <Link href="/exhibition-born" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      ">Born</Link>

      <Link href="/exhibition-growth" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      ">승</Link>
      <Link href="/exhibition-growth" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      ">Growth</Link>

      <Link href="/portfolio" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      ">간</Link>
      <Link href="/portfolio" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      ">Intermission</Link>

      <Link href="/exhibition-climax" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      ">전</Link>
      <Link href="/exhibition-climax" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      ">Climax</Link>
      
      <Link href="/exhibition-end" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      ">결</Link>
      <Link href="/exhibition-end" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      ">End : Da Capo</Link>
      
      <Link href="/brand" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      border-custom-all 
      ">후일담</Link>
      <Link href="/brand" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      border-custom-all 
      ">Epilogue : Behind</Link>
      
      <Link href="/community" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      ">커뮤니티</Link>
      <Link href="/community" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      ">Community</Link>

      <Link href="/goods" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      border-custom-all 
      ">굿즈</Link>
      <Link href="/goods" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      border-custom-all 
      ">Goods</Link>
      
      <Link href="/contact" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      ">컨택</Link>
      <Link href="/contact" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all 
      ">Contact</Link>
    </motion.div>
  )
}