"use client";
import { WorkCategory } from "@/app/(tabs)/portfolio/actions";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from 'framer-motion';
import Link from "next/link";
import { useState } from "react";

interface OtherWorksProps{
  otherWorks: {
    year: string;
    works: {
      id: number;
      title: string;
    }[];
  }[];

  category: WorkCategory;
};

export default function OtherWorks({otherWorks, category}: OtherWorksProps){
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = ()=>{
    setIsOpen(!isOpen);
  };

  return(
    <div className="py-2 px-3 md:py-2.5 md:px-3.5
      loading-bg rounded-3xl 
      text-xs md:text-sm lg:text-base xl:text-lg">

        <div className="flex items-center form-text-color">
          <p className="font-weight-basic username-spacing
          text-xs md:text-sm lg:text-base xl:text-lg">Other Works</p>

          <button onClick={handleToggle} data-cursor-target
          className="ml-auto xl:p-1">
            <ChevronDownIcon className={`cursor-none size-4 md:size-5 stroke-3 transition-all duration-400 ${isOpen ? "rotate-180": ""}`}/>
          </button>
        </div>

        <AnimatePresence>
        {isOpen && (
        <motion.div
        initial={{height: 0, opacity: 0}}
        animate={{height: "auto", opacity: 1}}
        exit={{height: 0, opacity: 0}}
        transition={{
          duration: 0.25, 
          ease: "easeInOut"
        }}
        className="overflow-hidden">

          {otherWorks.map((year, yearIndex) => (
          <motion.div key={year.year}
          initial={{y: -5, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{
            duration: 0.2,
            delay: yearIndex * 0.05
          }}>
            <h3 className="opacity-60 italic form-text-color font-weight-basic username-spacing leading-5 md:leading-6 lg:leading-7">{year.year}</h3>
            
            <div className="flex gap-1.5 flex-wrap">
            {year.works.map((other, workIndex) => (
              <motion.div key={other.id} 
              initial={{scale: 0.4, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              transition={{
                duration: 0.15,
                delay: (yearIndex * 0.05) + (workIndex * 0.02)
              }}
              className="-my-0.5">
                <Link href={`/portfolio/${category}/${other.id}`} data-cursor-target
                className="px-1 bg-[var(--desc-text-color)] text-[var(--loading-bg)] opacity-60 hover:opacity-100 transition-all font-weight-custom">
                  {other.title}
                </Link>
              </motion.div>
            ))}
            </div>
          </motion.div>
          ))}
        </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
}