"use client";
import React, { useEffect, useRef } from 'react';
import { useThreeRefs } from '@/lib/three/useThreeRefs';
import { useBgColor } from '@/lib/three/useBgColor';
import { SceneManager } from '@/lib/three/home/scene-manager';

interface IThreeCanvas{
  onSceneManager?: (manager: SceneManager)=> void;
  onSceneManagerDispose?: ()=> void;
};

export default function ThreeCanvas({
  onSceneManager, onSceneManagerDispose
}: IThreeCanvas) {
  const refs = useThreeRefs();
  const { containerRef } = refs;
  const sceneManagerRef = useRef<SceneManager | null>(null);
  
  useBgColor({ refs });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    //1.이전 인스턴스 정리
    if(sceneManagerRef.current){
      sceneManagerRef.current.dispose();
      sceneManagerRef.current = null;
      onSceneManagerDispose?.();
    };

    //2.컨테이너 초기화
    container.innerHTML = "";

    //3.새 인스턴스 생성
    const sceneManager = new SceneManager(refs);
    sceneManagerRef.current = sceneManager;

    //4.초기화 지연시킴(dom 안정화)
    const initTimeout = setTimeout(() => {
      try{
        sceneManager.init();
        onSceneManager?.(sceneManager);
      }catch(error){
        console.error(error);
        onSceneManagerDispose?.();
      };
    }, 50);

    const handleResize = () => {
      if(sceneManagerRef.current){
        sceneManagerRef.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener("resize", handleResize);
      
      if(sceneManagerRef.current){
        sceneManagerRef.current.dispose();
        sceneManagerRef.current = null;
        onSceneManagerDispose?.();
      }
    };

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refs]);

  return (
    <div
      ref={containerRef}
      className="fixed left-0 top-0 w-screen h-screen m-0 p-0 overflow-hidden" 
    />
  );
}