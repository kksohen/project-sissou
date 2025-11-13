"use client";
import { IWork } from "@/app/(tabs)/portfolio/actions";
import { useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import P5Canvas1 from "./p5-canvas1";

interface P5CanvasProps{
  work: IWork;
}

export default function P5CanvasWrap3({work}: P5CanvasProps){
  const canvas1Ref = useRef<{clear: () => void}>(null);

  const handleClear = () => {
    canvas1Ref.current?.clear();
  };

  return(
    <div className="aspect-[1.4/1] flex flex-col gap-1 items-center">
      <P5Canvas1 ref={canvas1Ref} work={work}/>

      <button data-cursor-target onClick={handleClear}
      className="rounded-full
      text-[var(--loading-bg)]
      transition-all
      bg-[var(--color-error)] hover:bg-red-800
      p-1 size-6 md:size-8">
        <XMarkIcon className="pointer-none stroke-3"/>
      </button>
    </div>
  );
}