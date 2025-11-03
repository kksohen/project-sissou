"use client";
import { IWork } from "@/app/(tabs)/portfolio/actions";
import { Shader } from "@/lib/shader/portfolio/shader3_1";
import { SceneManager3 } from "@/lib/three/portfolio/scene-manager3";
import { useThree3Refs } from "@/lib/three/portfolio/useThree3Refs";
import { useEffect, useRef, useState } from "react";

interface ThreeCanvasProps{
  work: IWork;
  shader: Shader;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ThreeCanvas3({work, shader}:ThreeCanvasProps){
  const refs = useThree3Refs();
  const {containerRef} = refs;
  const sceneManagerRef = useRef<SceneManager3 | null>(null);
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
    const sceneManager = new SceneManager3(refs, shader);
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

  }, [containerRef, dimension, refs, shader]);
  
  return(
    <div ref={containerRef} className="overflow-hidden w-full h-full aspect-square"/>
  );
}