"use client";
import { Shader } from "@/lib/shader/exhibition/grid_shader";
import { GridSceneManager } from "@/lib/three/exhibition/born/grid-scene-manager";
import { useGridThreeRefs } from "@/lib/three/exhibition/born/useGridThreeRefs";
import { useEffect, useRef, useState } from "react";

interface GridThreeCanvasProps{
  shader: Shader;
  selected: string;
}

export default function GridThreeCanvas({shader, selected}: GridThreeCanvasProps){
  const refs = useGridThreeRefs();
  const {containerRef} = refs;
  const sceneManagerRef = useRef<GridSceneManager | null>(null);
  const [dimension, setDimension] = useState({width: 0, height: 0});

  //resize
  useEffect(()=>{
    if(!containerRef.current) return;

    let timeOutId: ReturnType<typeof setTimeout>; //디바운스 - resize 연속 발생 시 성능 최적화

    const observer = new ResizeObserver((entries)=>{
      clearTimeout(timeOutId);
      timeOutId = setTimeout(()=>{
        for(const entry of entries){
          const {width, height} = entry.contentRect;
          setDimension({width, height});
        }
      }, 100);
    });

    observer.observe(containerRef.current);

    return()=>{
      clearTimeout(timeOutId);
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
    const sceneManager = new GridSceneManager(refs, shader, selected);
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

  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, dimension, refs, shader]);

  //selected 변경 시 scene에 전달
  useEffect(()=>{
    if(sceneManagerRef.current && selected){
      sceneManagerRef.current.updateTexture(selected);
    }
  }, [selected]);


  return(
    <div ref={containerRef} className="w-full h-full"/>
  );
}