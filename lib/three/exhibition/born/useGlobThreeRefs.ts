import { useRef } from "react";
import * as THREE from "three";
import { QuadPassPortfolio } from "../../portfolio/quadpass-portfolio";
import { OrbitControls } from "three/examples/jsm/Addons.js";


export function useGlobThreeRefs(){
  const containerRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  const animationIdRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const sphereGeomRef = useRef<THREE.SphereGeometry | null>(null);
  const sphereMatRef = useRef<THREE.RawShaderMaterial | null>(null);
  
  const envmapRef = useRef<THREE.Texture | null>(null);
  const pmremRef = useRef<THREE.PMREMGenerator | null>(null);

  //메모리 정리용
  const geomRef = useRef<THREE.BufferGeometry[]>([]);
  const matRef = useRef<THREE.Material[]>([]);

  const quadPassRef = useRef<QuadPassPortfolio | null>(null);
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);

  return{
    containerRef,

    sceneRef,
    cameraRef,
    rendererRef,
    controlsRef,
    
    animationIdRef,
    timeRef,
    
    sphereMeshRef,
    sphereGeomRef,
    sphereMatRef,
    
    envmapRef,
    pmremRef,

    geomRef,
    matRef,
    
    quadPassRef,
    mouseRef,
  };
}