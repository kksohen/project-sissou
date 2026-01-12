"use client";

import GlobeThreeCanvas from "./globe-three-canvas";
import { globe_shader } from "@/lib/shader/exhibition/globe_shader";

export default function ThreeCanvasWrap(){
  return(
    <div className="grid grid-cols-3 gap-1">
      <GlobeThreeCanvas shader={globe_shader}/>
    </div>
  );
}