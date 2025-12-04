"use client";
import { IWork } from "@/app/(tabs)/portfolio/actions";
import { SceneManager5 } from "@/lib/three/portfolio/scene-manager5";
import { useThree4Refs } from "@/lib/three/portfolio/useThree4Refs";
import { useEffect, useRef, useState } from "react";

interface ThreeCanvasProps{
  work: IWork;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ThreeCanvas5({work}:ThreeCanvasProps){
  const refs = useThree4Refs();
  const {containerRef} = refs;
  const sceneManagerRef = useRef<SceneManager5 | null>(null);
  const [dimension, setDimension] = useState({width: 0, height: 0});

  //resize
  useEffect(()=>{
    if(!containerRef.current) return;

    const observer = new ResizeObserver((entries)=>{
      for(const entry of entries){
        const {width, height} = entry.contentRect;
        setDimension({width, height});
      }
    });

    observer.observe(containerRef.current);

    return()=>{
      observer.disconnect();
    };
  }, [containerRef]);

  useEffect(()=>{
    if(dimension.width === 0) return;
    const container = containerRef.current;
    if(!container) return;

    //1.이전 인스턴스 정리
    if(sceneManagerRef.current){
      sceneManagerRef.current.dispose();
      sceneManagerRef.current = null;
    };

    //2.컨테이너 초기화
    container.innerHTML = "";

    //3.새 인스턴스 생성
    const sceneManager = new SceneManager5(refs);
    sceneManagerRef.current = sceneManager;

    //4.초기화 지연시킴(dom 안정화)
    const initTimeout = setTimeout(() => {
      try{
        sceneManager.init();
      }catch(error){
        console.error(error);
      };
    }, 50);

    const handleResize = () => {
      if(sceneManagerRef.current){
        sceneManagerRef.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return()=>{
      clearTimeout(initTimeout);
      window.removeEventListener("resize", handleResize);

      if(sceneManagerRef.current){
        sceneManagerRef.current.dispose();
        sceneManagerRef.current = null;
      }
    }

  }, [containerRef, dimension, refs]);
  
  return(
    <div ref={containerRef} className="overflow-hidden w-full h-full aspect-[1.4/1]"></div>
  );
}