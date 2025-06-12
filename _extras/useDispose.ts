import { useCallback } from "react";
import * as THREE from 'three';
import { IUseModelsParams } from "./three-types";

export function useDispose({refs}: IUseModelsParams){
  const {
    rendererRef,
    sceneRef,
    timeRef,
    loadersRef,
    texturesRef,
    geometriesRef,
    materialsRef,
    envMapRef,
    logoRef,
    logoMeshesRef,
    sphereMaterialRef,
    spheresRef,
    isSphereRef,
    isLogoRef,
    animationIdRef,
    controlsRef,
    cameraRef
  } = refs;

  const disposeResources = useCallback(() => {
  //anime
  if (animationIdRef.current) {
    cancelAnimationFrame(animationIdRef.current);
    animationIdRef.current = null;
  };
  //geometry
  geometriesRef.current.forEach(geo => {
    geo.dispose();
  });
  geometriesRef.current = [];
  //material
  materialsRef.current.forEach(mat => {
    mat.dispose();
  });
  materialsRef.current = [];
  //texture
  texturesRef.current.forEach(texture => {
    texture.dispose();
  });
  texturesRef.current = [];
  //scene
  if(sceneRef.current){
    sceneRef.current.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        try{ obj.geometry?.dispose();}catch{};

        if(Array.isArray(obj.material)){
        obj.material.forEach(m => { try { m.dispose(); } catch {} });
        } else {
        try { obj.material?.dispose(); } catch {}
        };
      };
    });
    sceneRef.current.clear();
  };
  //loader
  if(loadersRef.current.pmrem){
    loadersRef.current.pmrem.dispose();
    loadersRef.current.pmrem = undefined;
  };
  //controls
  if(controlsRef.current){
    controlsRef.current.dispose();
    controlsRef.current = null;
  };
  //renderer
  if(rendererRef.current){
    const canvas = rendererRef.current.domElement;
    //remove event
    canvas.removeEventListener("webglcontextlost", ()=>{});
    canvas.removeEventListener("webglcontextrestored", ()=>{});
    //DOM에서 제거
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    
    rendererRef.current.dispose();
    rendererRef.current = null;
  };
  //Ref 초기화
  logoMeshesRef.current = [];
  spheresRef.current = [];

  sceneRef.current = null;
  cameraRef.current = null;
  controlsRef.current = null;
  sphereMaterialRef.current = null;
  logoRef.current = null;
  envMapRef.current = null;
  
  isLogoRef.current = false;
  isSphereRef.current = false;
  timeRef.current = 0;
  //eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

return {disposeResources};
};