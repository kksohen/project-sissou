"use client";

import { grid_shader } from "@/lib/shader/exhibition/grid_shader";
import GridThreeCanvas from "./grid-three-canvas";

interface ThreeCanvas3ClientProps{
  selected: string;
}

export default function ThreeCanvas3Client({selected}: ThreeCanvas3ClientProps){
  return(
    <GridThreeCanvas shader={grid_shader} selected={selected}/>
  );
}