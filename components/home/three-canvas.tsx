"use client";
import React, { useEffect } from 'react';
import { useThreeRefs } from '@/lib/three/useThreeRefs';
import { useBgColor } from '@/lib/three/useBgColor';
import { SceneManager } from '@/lib/three/home/scene-manager';

export default function ThreeCanvas() {
  const refs = useThreeRefs();
  const { containerRef } = refs;
  
  useBgColor({ refs });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sceneManager = new SceneManager(refs);
    sceneManager.init();

    const handleResize = () => sceneManager.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      sceneManager.dispose();
    };

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refs]);

  return (
    <div
      ref={containerRef}
      className="fixed left-0 top-0 w-screen h-screen m-0 p-0 overflow-hidden" 
    />
  );
};