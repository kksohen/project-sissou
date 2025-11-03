import { useRef } from "react";
import * as THREE from "three";
import { QuadPassPortfolio } from "./quadpass-portfolio";

export function useThree2Refs(){
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const animationIdRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const quadPassRef = useRef<QuadPassPortfolio | null>(null);

  //웹캠
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  return{
    containerRef,
    rendererRef,
    animationIdRef,
    timeRef,
    quadPassRef,
    videoRef,
    videoTextureRef,
    streamRef
  };
}