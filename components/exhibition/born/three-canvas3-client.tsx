"use client";

import { grid_shader } from "@/lib/shader/exhibition/grid_shader";
import GridThreeCanvas from "./grid-three-canvas";

export default function ThreeCanvas3Client(){
  return(
    <GridThreeCanvas shader={grid_shader}/>
  );
}