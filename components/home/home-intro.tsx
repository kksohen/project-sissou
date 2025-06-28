"use client";

import { useCallback, useRef, useState } from "react";
import ThreeCanvas from "./three-canvas";
import ConditionBar from './condition-bar';
import { SceneManager } from "@/lib/three/home/scene-manager";

export default function HomeIntro(){
  const [canvasKey, setCanvasKey] = useState(0);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  //threeHomeBtn click시 scene 재출력
  const toggleThreeCanvas = useCallback(()=>{
    if(sceneManagerRef.current){
      sceneManagerRef.current.reset();
    };
    setCanvasKey(Date.now());
  }, []);

  const handleSceneManager = useCallback((manager: SceneManager)=>{
    sceneManagerRef.current = manager;
  }, []);

  const handleSceneManagerDispose = useCallback(()=>{
    sceneManagerRef.current = null;
  }, []);

  return(
    <>
    {/* three js*/}
    <ThreeCanvas key={canvasKey}
    onSceneManager={handleSceneManager}
    onSceneManagerDispose={handleSceneManagerDispose}
    />
    {/* condition bar */}
    <ConditionBar onToggleThreeCanvas={toggleThreeCanvas}/>
    </>
  );
};