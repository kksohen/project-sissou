"use client";
import { jultagiSketch } from "@/lib/p5/exhibition/jultagi-sketch";
import { useEffect, useRef, useState } from "react";

export default function JultagiP5Canvas(){
  const containerRef = useRef<HTMLDivElement>(null);
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p5InstanceRef = useRef<any>(null);
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
  }, []);

  //p5js
  useEffect(()=>{
    if(dimension.width === 0) return;

    const container = containerRef.current;
    if(!container) return;
    
    import("p5").then((p5Module)=>{
      const p5 = p5Module.default;
      const sketchInstance = jultagiSketch(dimension);
      p5InstanceRef.current = new p5(sketchInstance, container);
    });

    return()=>{
      if(p5InstanceRef.current){
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [dimension]);

  return(
    <div ref={containerRef} className="w-full h-full aspect-[9/7]"/>
  );
}