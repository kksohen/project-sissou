import { useRef } from "react";
import * as THREE from "three";

export function useGridThreeRefs(){
  const containerRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  const animationIdRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const planeMeshRef = useRef<THREE.Mesh | null>(null);
  const planeGeomRef = useRef<THREE.PlaneGeometry | null>(null);
  const planeMatRef = useRef<THREE.RawShaderMaterial | null>(null);
  
  const textureRef = useRef<THREE.Texture | null>(null);

  //메모리 정리용
  const geomRef = useRef<THREE.BufferGeometry[]>([]);
  const matRef = useRef<THREE.Material[]>([]);

  return{
    containerRef,

    sceneRef,
    cameraRef,
    rendererRef,
    
    animationIdRef,
    timeRef,
    
    planeMeshRef,
    planeGeomRef,
    planeMatRef,
    
    textureRef,

    geomRef,
    matRef,
  };
}