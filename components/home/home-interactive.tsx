"use client";

import { useState } from "react";
import ThreeCanvas from "./three-canvas";
import ConditionBar from './condition-bar';

export default function HomeInteractive() {
  const [isThreeCanvasVisible, setIsThreeCanvasVisible] = useState(true);
  const [canvasKey, setCanvasKey] = useState(0);

  const toggleThreeCanvas = ()=>{
    if(isThreeCanvasVisible){
      setIsThreeCanvasVisible(false);
    }else{
      setCanvasKey(Date.now());
      // setCanvasKey(prev => prev + 1);
      setIsThreeCanvasVisible(true);
    };
  };

  return(
    <>
    {/* three js*/}
    {isThreeCanvasVisible && <ThreeCanvas key={canvasKey}/>}
    {/* condition bar */}
    <ConditionBar onToggleThreeCanvas={toggleThreeCanvas}/>
    </>
  );
};