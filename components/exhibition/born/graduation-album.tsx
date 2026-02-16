"use client";
import {useEffect, useMemo, useRef, useState} from "react";
import { gradSketch } from "@/lib/p5/exhibition/grad-sketch";

interface GradAlbumProps{
  onClick: (imgPath: string) => void;
}

export default function GradAlbum({onClick}: GradAlbumProps){
  const containerRef = useRef<HTMLDivElement>(null);
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p5InstanceRef = useRef<any>(null);
  const [dimension, setDimension] = useState({width: 0, height: 0});

  const imgPaths = useMemo(()=>[
    "/assets/images/button-id.jpg",
    "/assets/images/caesars-id-2.jpg",
    "/assets/images/shiitake-id-1.jpg",
    "/assets/images/kingoyster-id-2.jpg",
    "/assets/images/lingzh-id.jpg",
    "/assets/images/kingoyster-id-1.jpg",
    "/assets/images/caesars-id-1.jpg",
    "/assets/images/chanterelle-id.jpg",
    "/assets/images/caesars-id-3.jpg",
    "/assets/images/shiitake-id-2.jpg",
    "/assets/images/caesars-id-4.jpg",
  ], []);

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
  }, []);

  //p5js
  useEffect(()=>{
    if(dimension.width === 0) return;

    const container = containerRef.current;
    if(!container) return;
    
    import("p5").then((p5Module)=>{
      const p5 = p5Module.default;
      const sketchInstance = gradSketch(imgPaths, dimension, onClick);
      p5InstanceRef.current = new p5(sketchInstance, container);
    });

    return()=>{
      if(p5InstanceRef.current){
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [dimension, imgPaths, onClick]);
  
  return(
    <div ref={containerRef} className="w-full h-full aspect-[9/7]"/>
  );
}