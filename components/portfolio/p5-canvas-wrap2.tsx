"use client";
import { IWork } from "@/app/(tabs)/portfolio/actions";
import { useState } from "react";
import P5Canvas3 from "./p5-canvas3";
import P5Canvas4 from "./p5-canvas4";

interface P5CanvasProps{
  work: IWork;
  model?: string;
}

export default function P5CanvasWrap2({work, model}: P5CanvasProps){
  const [active, setActive] = useState<"fly"|"random">("fly");

  return(
    <div className="aspect-[1.4/1] flex flex-col gap-1 items-center">
      {active === "fly" ? (
        <P5Canvas3 work={work} model={model}/>
      ):(
        <P5Canvas4 work={work} model={model}/>
      )}

      <div>
        <button data-cursor-target
        onClick={()=>setActive(active === "fly" ? "random" : "fly")}
        className="flex transition-all text-[var(--loading-bg)] text-center font-weight-custom
        text-xs md:text-base
        *:bg-[var(--color-error)] hover:*:bg-red-800
        *:grid *:place-items-center
        *:rounded-full *:size-6 md:*:size-8">
          <span>{active === "fly" ? "랜" : "슈"}</span>
            
          <span>{active === "fly" ? "덤" : "팅"}</span>
        </button>
      </div>
    </div>
  );
}