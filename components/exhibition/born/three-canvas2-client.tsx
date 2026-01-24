"use client";

import SphereThreeCanvas from "./sphere-three-canvas";
import { sphere_shader } from "@/lib/shader/exhibition/sphere_shader";

export default function ThreeCanvas2Client(){
  return(
    <SphereThreeCanvas shader={sphere_shader}/>
  );
}