"use client";
import { IWork } from "@/app/(tabs)/portfolio/actions";
import ThreeCanvas3 from "./three-canvas3";
import { shader3_1 } from "@/lib/shader/portfolio/shader3_1";
import { shader3_2 } from "@/lib/shader/portfolio/shader3_2";
import { shader3_3 } from "@/lib/shader/portfolio/shader3_3";

interface ThreeCanvasProps{
  work: IWork;
}

export default function ThreeCanvasWrap({work}: ThreeCanvasProps){

  return(
    <div className="gap-1 grid grid-cols-1 xl:grid-cols-3">
      <ThreeCanvas3 work={work} shader={shader3_1}></ThreeCanvas3>
      <ThreeCanvas3 work={work} shader={shader3_2}></ThreeCanvas3>
      <ThreeCanvas3 work={work} shader={shader3_3}></ThreeCanvas3>
    </div>
  );
}