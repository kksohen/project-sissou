"use client";
import { IWork } from "@/app/(tabs)/portfolio/actions";
import { SceneManager2 } from "@/lib/three/portfolio/scene-manager2";
import { useThree2Refs } from "@/lib/three/portfolio/useThree2Refs";
import { useEffect, useRef, useState } from "react";

interface ThreeCanvasProps{
  work: IWork;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ThreeCanvas2({work}:ThreeCanvasProps){
  const refs = useThree2Refs();
  const {containerRef} = refs;
  const sceneManagerRef = useRef<SceneManager2 | null>(null);
  const [dimension, setDimension] = useState({width: 0, height: 0});
  const initRef = useRef(false); //초기화 중복 방지

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
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=>{
    if(dimension.width === 0 || initRef.current) return;
    const container = containerRef.current;
    if(!container) return;

    //초기화 시작ㅇ
    initRef.current = true;

    //컨테이너 초기화
    container.innerHTML = "";

    //새 인스턴스 생성
    const sceneManager = new SceneManager2(refs);
    sceneManagerRef.current = sceneManager;

    //sceneManager 초기화
    sceneManager.init().catch(error=>{
      console.error(error);
      initRef.current = false; //실패 시 재시도ㅇ
    });

    const handleResize = () => {
      sceneManagerRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);
    
    //클린업
    return()=>{ 
      window.removeEventListener("resize", handleResize);

      if(sceneManagerRef.current){
        sceneManagerRef.current.dispose();
        sceneManagerRef.current = null;
      }

      initRef.current = false;
    }

  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimension.width]);
  
  return(
    <div ref={containerRef} className="overflow-hidden w-full h-full aspect-square"></div>
  );
}