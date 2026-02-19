"use client";
import BornBg from "@/public/assets/images/born-bg";
import ThreeCanvas1Client from "./three-canvas1-client";
import ThreeCanvas2Client from "./three-canvas2-client";
import ThreeCanvas3Client from "./three-canvas3-client";
import GradAlbum from "./graduation-album";
import Clock from "./clock";
import { useEffect, useRef, useState } from "react";
import Particle from "./particle";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

//이미지 매칭
const getImgs = (path: string)=>{
  if(path.includes("caesars-id")) return "/assets/images/caesars-bg.jpg";
  
  if(path.includes("kingoyster-id")) return "/assets/images/eryngii-bg.jpg";

  return path.replace("-id", "-bg");
};

export default function BornClient(){
  const [selected, setSelected] = useState<string | null>(null); //selected imgPaths
  const [currentBG, setCurrentBG] = useState("#fff");
  const [activeTab, setActiveTab] = useState<"globe" | "clock" | "sphere" | null>(null); //tabs
  const [appear, setAppear] = useState(false); //scroll ani
  const containerRef = useRef<HTMLDivElement>(null);
  const aniRef = useRef<HTMLDivElement>(null);

  const handleTabsChange = (tab: typeof activeTab)=>{
    if (tab === activeTab) return; //더블클릭해서 멈춤 방지
    setAppear(false);
    setActiveTab(tab);
  };
  
  const handleImgClick = (path: string)=>{
    setSelected(getImgs(path));
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

  const renderTabs = ()=>{
    switch(activeTab){
      case "globe": return(
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
          
          <div className="pt-15 sm:pt-20 pb-15">
            <h2 className="font-agahnsangsoo text-4xl sm:text-5xl">《축 무사 졸업 기원》</h2>
            <h4 className="pt-5 pl-5 font-weight-form lg:text-[1.0625rem] opacity-80">안녕하십니까? 귀하의 평안을 기도드립니다.</h4>
            <h4 className="pt-5 pl-5 font-weight-form lg:text-[1.0625rem] opacity-60">** 각기 다른 사진들을 살펴보고 클릭해 보세요.</h4>

            <GradAlbum onClick={handleImgClick}/>
          </div>
          
          <Particle containerRef={containerRef}
          selected={selected}
          currentBG={currentBG}/>
        </div>
      );
    case "clock" : return null;
    case "sphere" : return null;
    }
  };

  //useScroll - framer motion
  const {scrollYProgress} = useScroll({
    target: aniRef,
    offset: ["start end", "start start"]
  });

  useMotionValueEvent(scrollYProgress, "change", (v)=>{
    if(v >= 1) setAppear(true); //1이 되면 고정ㅇ
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const content = renderTabs();

  return(
    <>
    <div className="mt-12 sm:mt-20 sm:pb-12 text-center username-spacing-desc">
      <div className="font-agahnsangsoo text-4xl sm:text-5xl leading-12 sm:leading-16">
        <h1>어느 날, 그들은 태어났다...</h1>
        <h1>그들이 처음으로 담은 것과 닿은 것은 무엇이었을까?</h1>
      </div>
      
      <h4 className="mt-12 font-weight-form lg:text-[1.0625rem] opacity-60">각기 다른 원형들을 드래그 혹은 클릭해 보세요.</h4>
    </div>
    
    {/* navigation toggle */}
    <div className="grid grid-cols-1 sm:grid-cols-3 items-center sm:pb-15">
      <div onClick={()=>handleTabsChange("globe")}>
        <ThreeCanvas1Client/>
      </div>

      <div onClick={()=>handleTabsChange("clock")}>
        <Clock/>
      </div>

      <div onClick={()=>handleTabsChange("sphere")}>
        <ThreeCanvas2Client/>
      </div>
      
    </div>

    <div ref={aniRef}>
      {content && (
        <motion.div style={appear ? {} : {
          scale, 
          opacity, 
          transformOrigin: "top center"
        }}>
          {content}
        </motion.div>
      )}
    </div>
    </>
  )
}