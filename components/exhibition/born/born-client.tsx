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
import BornBg2 from "@/public/assets/images/born-bg2";
import JultagiP5Canvas from "./jultagi-p5-canvas";

//이미지 매칭
const getImgs = (path: string)=>{
  if(path.includes("caesars-id-1") || path.includes("caesars-id-2")) return "/assets/images/caesars-bg.jpg";
  
  if(path.includes("kingoyster-id")) return "/assets/images/eryngii-bg.jpg";

  return path.replace("-id", "-bg");
};

export default function BornClient(){
  const [selected, setSelected] = useState<string | null>(null); //selected imgPaths
  const [currentBG, setCurrentBG] = useState("#fff");
  const [activeTab, setActiveTab] = useState<"globe" | "sphere" | null>(null); //tabs
  const [appear, setAppear] = useState(false); //scroll ani
  const containerRef = useRef<HTMLDivElement>(null);
  const aniRef = useRef<HTMLDivElement>(null);

  const handleTabsChange = (tab: typeof activeTab)=>{
    if (tab === activeTab) return; //더블클릭해서 멈춤 방지
    setAppear(false);
    setActiveTab(tab);
    setSelected(null); //다른 탭 클릭 시 초기화ㅇ
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
            <h2 className="pl-5 pr-5 sm:pl-4 font-agahnsangsoo text-4xl sm:text-5xl">질주하는 13인의 아해</h2>
            <h4 className="pt-5 pl-6 pr-5 font-weight-form lg:text-[1.0625rem] opacity-80">각기 다른 시공간에서 저마다의 몸을 빌려 태어난 그들은 무엇이든 될 수 있었다. 모든 것은 마음에서 비롯되기 때문에. 그러나 태초부터 이 땅에 그들의 것은 아무것도 없었다. 그래서 어떤 이들은 그것에 집착하기도 했다. 그렇게 언제나 같은 이유로 반복되었다.</h4>
            <h4 className="pt-12 pl-6 font-weight-form lg:text-[1.0625rem] opacity-50">** 각각의 사진을 관찰하며 클릭해 보세요.</h4>

            <GradAlbum onClick={handleImgClick}/>
          </div>
          
          <Particle containerRef={containerRef}
          selected={selected}
          currentBG={currentBG}/>
        </div>
      );
    case "sphere" : return(
      <div className="h-200">
        <BornBg2/>

        <JultagiP5Canvas/>
      </div>
      
    );
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
        <h1>처음으로 닿은 것은 무엇이었을까?</h1>
      </div>
      
      <h4 className="mt-12 font-weight-form lg:text-[1.0625rem] opacity-50">각각의 구를 회전 혹은 클릭해 보세요.</h4>
    </div>
    
    {/* navigation toggle */}
    <div className="grid grid-cols-1 sm:grid-cols-3 items-center sm:pb-15">
      <div onClick={()=>handleTabsChange("globe")}>
        <ThreeCanvas1Client/>
      </div>

      <Clock/>

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