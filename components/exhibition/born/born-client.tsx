"use client";
import BornBg from "@/public/assets/images/born-bg";
import ThreeCanvas1Client from "./three-canvas1-client";
import ThreeCanvas2Client from "./three-canvas2-client";
import ThreeCanvas3Client from "./three-canvas3-client";
import GradAlbum from "./graduation-album";
import Clock from "./clock";
import { useEffect, useRef, useState } from "react";
import Particle from "./particle";

//이미지 매칭
const getImgs = (path: string)=>{
  if(path.includes("caesars-id")){
    return "/assets/images/caesars-bg.jpg";
  }

  if(path.includes("kingoyster-id")){
    return "/assets/images/eryngii-bg.jpg";
  }

  return path.replace("-id", "-bg");
};

export default function BornClient(){
  const [selected, setSelected] = useState<string | null>(null); //selected imgPaths
  const [currentBG, setCurrentBG] = useState("#fff");
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleImgClick = (path: string)=>{
    const img = getImgs(path);
    setSelected(img);
  };

  //bg color mode 감지
  const updateBG = ()=>{
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue("--mode-bg").trim();

    setCurrentBG(bgColor || "#fff");
  };

  useEffect(()=>{
    updateBG();

    const observer = new MutationObserver(updateBG);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return()=> observer.disconnect();
  }, []);

  return(
    <>
    <div className="mt-10">
      <h1 className="font-agahnsangsoo text-4xl sm:text-5xl text-center">어느 날, 그들은 태어났다...</h1>
    </div>
    
    {/* navigation toggle */}
    <div className="grid grid-cols-3 items-center">
      <ThreeCanvas1Client/>

      <Clock/>

      <ThreeCanvas2Client/>
    </div>

    <div ref={containerRef} className="relative">
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="relative">
          <BornBg/>
          
          {selected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full">
              <ThreeCanvas3Client selected={selected}/>
            </div>
          </div>
          )}
        </div>
      </div>

      <GradAlbum onClick={handleImgClick}/>
      
      <Particle containerRef={containerRef}
      selected={selected}
      currentBG={currentBG}/>
    </div>
    </>
  )
}