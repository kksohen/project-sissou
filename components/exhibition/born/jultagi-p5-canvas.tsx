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
  }, []);

  //p5js
  useEffect(()=>{
    if(dimension.width === 0) return;
    const container = containerRef.current;
    if(!container) return;

    //이전 인스턴스 정리
    if(p5InstanceRef.current){
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }

    container.innerHTML = "";
    
    import("p5").then((p5Module)=>{
      const p5 = p5Module.default;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p5 as any).disableFriendlyErrors = true;

      p5InstanceRef.current = new p5(jultagiSketch(dimension), container);
    });

    return()=>{
      if(p5InstanceRef.current){
        //video stream 정리
        const videoEl = container?.querySelectorAll("video");
        videoEl?.forEach((video)=>{
          const stream = video.srcObject as MediaStream;

          if(stream){
            stream.getTracks().forEach((track)=>track.stop());
          }
        });

        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [dimension]);

  return(
    <div ref={containerRef} className="w-full h-full aspect-[9/7]"/>
  );
}