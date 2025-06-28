// "use client";

import { links } from '@/lib/constants';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export default function SearchList({onClose} : {onClose: ()=> void}){
const pathname = usePathname();
  //해당 페이지에서 해당 링크 클릭시 모달창 닫힘
const handleClick = (e:React.MouseEvent, href: string) => {
  if(pathname === href){
    e.preventDefault(); //새고 방지
  };
  onClose();
};

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
      {links.map(({href, label, key})=>{
      return(
        <Link href={href} key={key} onClick={e=>handleClick(e, href)}
        className="mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none
      border-custom-all"
        >{label}</Link>
      )
      })}
    </motion.div>
  );
}