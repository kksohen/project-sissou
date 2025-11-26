"use client";
import { IWork } from "@/app/(tabs)/portfolio/actions";
import ThreeCanvas4 from "./three-canvas4";
import Image from "next/image";

interface ThreeCanvasProps{
  work: IWork;
}

export default function ThreeCanvasWrap2({work}: ThreeCanvasProps){

  return(
    <div className="gap-1 grid grid-cols-1">
      <ThreeCanvas4 work={work}/>

      <div className="grid grid-cols-3 gap-1">
        {work.detailImages.map((img, index)=>(
          <Image key={index} src={img} alt={`${work.title} ${index+1}`}
          width={1240} height={886} priority quality={100}
          placeholder="blur"
          blurDataURL={work.photoBlur?.[index] || ""}/>
        ))}
      </div>
    </div>
  );
}