"use client";
import { IWork } from "@/app/(tabs)/portfolio/actions";
import { sketch3 } from "@/lib/p5/sketch-3";
import { useEffect, useRef, useState } from "react";

interface P5CanvasProps{
  work: IWork;
  model?: string;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const P5Canvas3 = ({work, model}: P5CanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
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
  useEffect(() => {
    if(dimension.width === 0) return;

    const container = containerRef.current;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let p5instance: any;

    import("p5").then((p5Module)=>{
      const p5 = p5Module.default;

      const sketchInstance = sketch3(dimension, model);

      p5instance = new p5(sketchInstance, container!);
    });

    return()=>{
      if(p5instance){
        //video stream 정리
        const videoEl = container?.querySelectorAll("video");
        videoEl?.forEach((video)=>{
          const stream = video.srcObject as MediaStream;

          if(stream){
            stream.getTracks().forEach((track)=>track.stop());
          }
        });

        p5instance.remove();
      }
    };
  }, [dimension, model]);

  return (
    <div ref={containerRef} className="overflow-hidden w-full h-full aspect-[1.4/1]"/>
  );
};

P5Canvas3.displayName = "P5Canvas3";
export default P5Canvas3;