import { useCallback } from "react";
import * as THREE from 'three';
import { CONSTANTS } from "../constants";

export default function useRenderer() {
  const setupRenderer = useCallback((container: HTMLDivElement) => {
    if (!container) return null;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false, //메모리 절약
      alpha: false, //투명도 X
      /* stencil: false, //스텐실 버퍼 비활성화 */
      depth: true
    });

    const scene_buffer = new THREE.WebGLRenderTarget(window.innerWidth * CONSTANTS.PIXEL_DENSITY, window.innerHeight * CONSTANTS.PIXEL_DENSITY, {});

    /* renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; */
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(CONSTANTS.PIXEL_DENSITY);

    return {renderer, scene_buffer};
  }, []);

  return { setupRenderer };
};