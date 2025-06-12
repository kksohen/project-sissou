import { useCallback } from "react";
import * as THREE from 'three';
import { CONSTANTS } from "../constants";

export default function useThreeScene() {
  const setupScene = useCallback(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      CONSTANTS.CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
    camera.position.set(
      CONSTANTS.CAMERA_POSITION.x,
      CONSTANTS.CAMERA_POSITION.y,
      CONSTANTS.CAMERA_POSITION.z
    );
    camera.lookAt(0, 0, 0);

    return { scene, camera };
  }, []);

  return { setupScene };
};