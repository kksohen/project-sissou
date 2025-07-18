"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from 'framer-motion';
import React, { useEffect, useState } from "react";
import { links } from "@/lib/constants";

//framer-motion
const menuBoxVars = {
  initial: { 
    opacity: 0,
    scale: 0.8,
    y: 30,
  },
  animate: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.4,
      ease: [0.25, 0.8, 0.25, 1], 
    },
  },
  exit: { 
    opacity: 0,
    scale: 0.9,
    y: 30,
    transition: {
      duration: 0.3,
      delay: 0.1,
      ease: [0.42, 0, 0.58, 1], 
    },
  }
};

export default function MenuTab({onClose} : {onClose: ()=> void}) {
  const pathname = usePathname(); //현재 path 찾아서 highlight 처리해줌
  const [angle, setAngle] = useState(0); //menu 구 모양 회전 각도
  //mouse event
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  //menu창 열린 동안 배경 스크롤 비활성화
  useEffect(()=>{
    document.body.style.overflow = "hidden";

    return()=>{
      document.body.style.overflow = "unset";
    };
  },[]);
  
  //반응형 원 반지름 조정
  const [radius, setRadius] = useState(137); 
  useEffect(()=>{
    const updateRadius = ()=>{
      const vw = window.innerWidth;
      let newRadius = 100;
      
      if(vw < 640){
        newRadius = 112;
      } else if(vw < 768){
        newRadius = 119;
      } else if(vw < 1024){
        newRadius = 132;
      } else {
        newRadius = 144;
      }
      setRadius(newRadius);
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return()=> window.removeEventListener("resize", updateRadius);
  }, []);

  //framer-motion으로 부드러운 드래깅 연출
  const rawAngle = useMotionValue(0); 
  const springAngle = useSpring(rawAngle, {
    stiffness: 50,
    damping: 20
  });
  //springAngle 값 변할 때마다 update
  useEffect(() => {
    return springAngle.on("change", (latest) => {
      setAngle(latest);
    });
  }, [springAngle]);

  //menu item 배치
  const itemCount = links.length;
  const angleStep = 360 / itemCount;

  //menu link list wheel event handler
  const handleWheel = (e:React.WheelEvent)=>{
    e.preventDefault();
    rawAngle.set(rawAngle.get() + e.deltaY * 0.2); //감도조절
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrag(true);
    setStartX(e.clientX);
  };  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrag) return;
    const deltaX = e.clientX - startX;
    setStartX(e.clientX);
    rawAngle.set(rawAngle.get() + deltaX * 1); //감도조절
  };
  const handleMouseUp = () => setIsDrag(false);
  const handleMouseLeave = () => setIsDrag(false);

  const handleTouch = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const deltaX = e.touches[0].clientX - touchStartX;
    setTouchStartX(e.touches[0].clientX);
    rawAngle.set(rawAngle.get() + deltaX * 0.2); //mobile로 확인할 것
  };

  //해당 페이지에서 해당 링크 클릭시 모달창 닫힘
  const handleClick = (e:React.MouseEvent, href: string) => {
    if(pathname === href){
      e.preventDefault(); //새고 방지
    };
    onClose(); 
  };

  const getLinkClass = (href: string) =>
    pathname === href ? "mode-secondary backdrop-blur-none" : 
    "mode-secondary-50 backdrop-blur-lg transition-all hover:mode-secondary hover:backdrop-blur-none border-custom-all";

  return createPortal(
    <motion.div variants={menuBoxVars} initial="initial" animate="animate" exit="exit"
    className="fixed z-0 left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2
    mode-svg-color w-screen h-screen flex items-center justify-center"
    style={{ perspective: 800, touchAction: "none", cursor: isDrag ? "grabbing" : "grab" }}
    onWheel={handleWheel}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    onMouseLeave={handleMouseLeave}
    onTouchStart={handleTouch}
    onTouchMove={handleTouchMove}
    >
      <div className="absolute flex justify-center items-center w-full
      transform-3d z-10">
      <nav data-cursor-target
      className="flex flex-col justify-center items-center 
      *:px-4 *:py-2 *:rounded-full">
      {links.map(({href, label, key }, index)=>{
        const itemAngle = angle + index * angleStep;
        const rad = (itemAngle * Math.PI) / 180;
        const x = 0;
        const y = radius * Math.sin(rad);
        const z = radius * Math.cos(rad);
        /* 앞~뒤 menu 분리 */
        const maxZ = radius;
        const normalizedZ = (z + maxZ) / (2 * maxZ);
        const opacity = 0.2 + 1 * normalizedZ; //가까울수록 1(불투명)
        const scale = 0.85 + 0.15 * normalizedZ;//가까울수록 크게
        const brightness = 0.7 + 0.3 * normalizedZ;
        //가까울수록 밝게
        /* 맨 앞에 있는 것만 클릭 가능ㅇ */
        const isFront = z === Math.max(...links.map((_, i) => {
          const tempAngle = angle + i * angleStep;
          return radius * Math.cos((tempAngle * Math.PI) / 180);
        }));

        return(
          <Link href={href} key={key || href} onClick={(e)=>handleClick(e, href)}
          className={`${getLinkClass(href)} absolute top-1/2 left-1/2`}
          style={{
            transform: `translate(-50%, -50%) translate(${x}px, ${y}px) translateZ(${z}px) rotateX(${itemAngle}deg) scale(${scale})`,
            zIndex: isFront ? 20 : Math.floor(normalizedZ * 10),
            pointerEvents: isFront ? "auto" : "none",
            opacity,
            filter: `brightness(${brightness})`,
            mixBlendMode: "screen",
            backgroundColor: isFront ? "mode-secondary" : "mode-secondary-50",
            transition: "background-color 0.3s ease",
          }}
          >{label}</Link>
        )
      })}
      </nav>
      </div>
      <div className="w-full h-[200%] backdrop-blur-lg"/>
    </motion.div>,
    document.body
  );
};