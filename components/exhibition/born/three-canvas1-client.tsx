"use client";

import GlobeThreeCanvas from "./globe-three-canvas";
import { globe_shader } from "@/lib/shader/exhibition/globe_shader";

export default function ThreeCanvas1Client(){
  return(
    <GlobeThreeCanvas shader={globe_shader}/>
  );
}