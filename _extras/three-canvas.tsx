"use client";

import { useEffect, useState } from "react";
import { useModels } from "@/lib/three/home/useModels";
import { useDispose } from "@/lib/three/useDispose";
import { useAnimations } from "@/lib/three/home/useAnimations";
import { useThreeRefs } from "@/lib/three/useThreeRefs";
import { useBgColor } from "@/lib/three/useBgColor";
import { useThreeInit } from "@/lib/three/home/useThreeInit";

export default function ThreeCanvas() {
  const [isInitialized, setIsInitialized] = useState(false);

  //hooks
  const refs = useThreeRefs();
  const {
    containerRef,    
    animationIdRef
  } = refs;

  const {loadModels} = useModels({refs});
  const {disposeResources} = useDispose({refs});
  const {animate} = useAnimations({refs});

  useThreeInit({refs}, ()=>{
    setIsInitialized(true);
  });

  useBgColor({refs});

  useEffect(()=>{
    if(!isInitialized) return;

    const startAnime = async()=>{
      try{
        await loadModels();
        animationIdRef.current = requestAnimationFrame(animate);
        
      }catch(error){
        console.log(error);
        disposeResources(); //에러 시에도 메모리 정리ㅇ
      }
    };

    startAnime();
    
  }, [animate, animationIdRef, disposeResources, isInitialized, loadModels]);

  useEffect(() => {
    //cleanUp
    return () => {
      if(animationIdRef.current){
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
      };

      disposeResources();
    };
  }, [animationIdRef, disposeResources]);

  return (
    <div
      ref={containerRef}
      className="fixed left-0 top-0 w-screen h-screen m-0 p-0 overflow-hidden" 
      /*opacity-0 transition-opacity duration-300 */
    />
  );
};