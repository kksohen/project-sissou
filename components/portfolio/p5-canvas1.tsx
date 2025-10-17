"use client";
import { IWork } from "@/app/(tabs)/portfolio/actions";
import { sketch1 } from "@/lib/p5/sketch-1";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

interface P5CanvasProps{
  work: IWork;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const P5Canvas1 = forwardRef<{clear: ()=>void}, P5CanvasProps>(({work}, ref)=>{
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({width: 0, height: 0});
  const clearRef = useRef<(()=>void) | null>(null);

  //clear
  useImperativeHandle(ref, ()=>({
    clear: ()=>{
      if(clearRef.current){
        clearRef.current();
      }
    }
  }));

  //resize observe
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

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let p5instance: any;

    import("p5").then((p5Module)=>{
      const p5 = p5Module.default;

      const sketchClear = sketch1(dimension, (cl)=>{
        clearRef.current = cl;
      });

      p5instance = new p5(sketchClear, containerRef.current!);
    });

    return()=>{
      if(p5instance){
        p5instance.remove();
      }

      clearRef.current = null;
    };
  }, [dimension]);
  
  return(
    <div ref={containerRef} className="overflow-hidden w-full h-full"/>
  );
});

P5Canvas1.displayName = "P5Canvas1";
export default P5Canvas1;