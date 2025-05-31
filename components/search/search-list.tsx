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
    *:px-4 *:py-2 *:rounded-full">
      <Link href="/" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">제로</Link>
      <Link href="/" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">Prologue</Link>
      
      <Link href="/exhibition-born" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">기</Link>
      <Link href="/exhibition-born" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">Born</Link>

      <Link href="/exhibition-growth" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">승</Link>
      <Link href="/exhibition-growth" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">Growth</Link>

      <Link href="/portfolio" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">간</Link>
      <Link href="/portfolio" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">Intermission</Link>

      <Link href="/exhibition-climax" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">전</Link>
      <Link href="/exhibition-climax" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">Climax</Link>
      
      <Link href="/exhibition-end" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">결</Link>
      <Link href="/exhibition-end" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">End : Da Capo</Link>
      
      <Link href="/brand" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">후일담</Link>
      <Link href="/brand" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">Epilogue : Behind</Link>
      
      <Link href="/community" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">커뮤니티</Link>
      <Link href="/community" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">Community</Link>

      <Link href="/goods" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">굿즈</Link>
      <Link href="/goods" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">Goods</Link>
      
      <Link href="/contact" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">컨택</Link>
      <Link href="/contact" className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      ">Contact</Link>
    </motion.div>
  )
}