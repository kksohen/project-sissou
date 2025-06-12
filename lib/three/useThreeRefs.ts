import { useRef } from "react";
import * as THREE from 'three';
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { LogoGroup, LogoMesh, Sphere } from "./three-types";
import { QuadPass } from "./quadpass";

export function useThreeRefs(){  
  //three
  const containerRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const animationIdRef = useRef<number | null>(null);

  //time anime
  const timeRef = useRef(0);
  const sphereMaterialRef = useRef<THREE.RawShaderMaterial | null>(null);

  //sceneBGColor
  const bgColorRef = useRef(new THREE.Color());
  const targetBgColorRef = useRef(new THREE.Color());

  //3d logo
  const logoRef = useRef<LogoGroup | null>(null);
  const logoMeshesRef = useRef<LogoMesh[]>([]);
  const spheresRef = useRef<Sphere[]>([]);
  const envMapRef = useRef<THREE.Texture | null>(null);

  const isLogoRef = useRef(false);
  const isSphereRef = useRef(false);

  //quadpass
  const mainPassRef = useRef<QuadPass | null>(null);
  const backPassRef = useRef<QuadPass | null>(null);
  const sceneBufferRef = useRef<THREE.WebGLRenderTarget | null>(null);

  //메모리 정리용
  const geometriesRef = useRef<THREE.BufferGeometry[]>([]);
  const materialsRef = useRef<THREE.Material[]>([]);
  const texturesRef = useRef<THREE.Texture[]>([]);
  const loadersRef = useRef<{ 
    gltf?: GLTFLoader; 
    cube?: THREE.CubeTextureLoader; 
    pmrem?: THREE.PMREMGenerator 
  }>({});

  return {
    containerRef,
    sceneRef,
    cameraRef,
    rendererRef,
    controlsRef,
    
    animationIdRef,
    timeRef,
    sphereMaterialRef,
    
    bgColorRef,
    targetBgColorRef,

    logoRef,
    logoMeshesRef,
    spheresRef,
    envMapRef,
    isLogoRef,
    isSphereRef,

    geometriesRef,
    materialsRef,
    texturesRef,
    loadersRef,

    mainPassRef,
    backPassRef,
    sceneBufferRef,
  }
}