import { useCallback } from "react";
import { CONSTANTS } from "@/lib/constants";
import * as THREE from 'three';
import { IUseModelsParams } from "../three-types";

export function useAnimations({refs}: IUseModelsParams){
  const {
    rendererRef,
    sceneRef,
    timeRef,
    logoRef,
    logoMeshesRef,
    sphereMaterialRef,
    spheresRef,
    isSphereRef,
    isLogoRef,
    animationIdRef,
    controlsRef,
    cameraRef,
    bgColorRef,
    targetBgColorRef,
    mainPassRef,
    backPassRef,
    sceneBufferRef,
  } = refs;

  //animation update
  const updateAnimation = useCallback(() => {
    controlsRef.current?.update();
    timeRef.current += 0.01;

    if (sphereMaterialRef.current && cameraRef.current) {
      sphereMaterialRef.current.uniforms.time.value = timeRef.current;
      sphereMaterialRef.current.uniforms.campos.value.copy(cameraRef.current.position);
    };

    //logo rotate anime
    if (isLogoRef.current && logoRef.current?.original_rot) {
      const logo = logoRef.current;
      const targetRotation = logo.original_rot;
      const currentRotation = logo.rotation;

      currentRotation.x += (targetRotation!.x - currentRotation.x) * CONSTANTS.EASING_FACTORS.LOGO_ROTATION;
      currentRotation.y += (targetRotation!.y - currentRotation.y) * CONSTANTS.EASING_FACTORS.LOGO_ROTATION;
      currentRotation.z += (targetRotation!.z - currentRotation.z) * CONSTANTS.EASING_FACTORS.LOGO_ROTATION;

      //logo mesh anime
      logoMeshesRef.current.forEach((mesh) => {
        const target = mesh.original_pos;
        const current = mesh.position;
        
        const direction = new THREE.Vector2(target.x, target.z);
        const radius = direction.length() * 0.5;
        direction.normalize();

        const targetX = target.x + radius * direction.x;
        const targetZ = target.z + radius * direction.y;

        //position anime
        current.x += (targetX - current.x) * CONSTANTS.EASING_FACTORS.MESH_POSITION;
        current.y += (target.y - current.y) * CONSTANTS.EASING_FACTORS.MESH_POSITION;
        current.z += (targetZ - current.z) * CONSTANTS.EASING_FACTORS.MESH_POSITION;

        //rotation anime
        mesh.rotation.x += (mesh.original_rot.x - mesh.rotation.x) * CONSTANTS.EASING_FACTORS.MESH_ROTATION;
        mesh.rotation.y += (mesh.original_rot.y - mesh.rotation.y) * CONSTANTS.EASING_FACTORS.MESH_ROTATION;
        mesh.rotation.z += (mesh.original_rot.z - mesh.rotation.z) * CONSTANTS.EASING_FACTORS.MESH_ROTATION;
      });
    };

    //particle anime
    if (isSphereRef.current) {
      spheresRef.current.forEach((sphere) => {
        //sphere의 목표지점 계산
        const lat = sphere.target_pos.x;
        const lon = sphere.target_pos.y;
        const sr = sphere.target_pos.z;

        const tx = sr * Math.sin(lat) * Math.cos(lon);
        const ty = sr * Math.sin(lat) * Math.sin(lon);
        const tz = sr * Math.cos(lat);

        sphere.position.x += (tx - sphere.position.x) * CONSTANTS.EASING_FACTORS.SPHERE_POSITION;
        sphere.position.y += (ty - sphere.position.y) * CONSTANTS.EASING_FACTORS.SPHERE_POSITION;
        sphere.position.z += (tz - sphere.position.z) * CONSTANTS.EASING_FACTORS.SPHERE_POSITION;
      });
    };
  }, [cameraRef, controlsRef, isLogoRef, isSphereRef, logoMeshesRef, logoRef, sphereMaterialRef, spheresRef, timeRef]);

  //rendering
  const render = useCallback(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const mainPass = mainPassRef.current;
    const backPass = backPassRef.current;
    const sceneBuffer = sceneBufferRef.current;

    if(!renderer || !scene || !camera) return;

    const mat = sphereMaterialRef.current;

    if(mat?.uniforms.campos){
      mat.uniforms.campos.value.copy(camera.position);
    };

  if(mainPass && backPass && sceneBuffer ){
    //1. 씬을 sceneBuffer에 렌더링
    renderer.setRenderTarget(sceneBuffer);
    renderer.render(scene, camera);
    //2. mainPass 첫 번째 렌더(false)
    mainPass.render(false);
    //3. mainPass 두 번째 렌더(true) - 최종
    renderer.setRenderTarget(null);
    mainPass.render(true);
    //4. backPass 렌더(false)
    backPass.render(false);
  
  }else{
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  };
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //animation loop
  const animate = useCallback(() => {
    animationIdRef.current = requestAnimationFrame(animate);
    updateAnimation();
    render();

    //sceneBGColor fadeIn/Out 효과
    if (sceneRef.current) {
      sceneRef.current.background = bgColorRef.current;
      bgColorRef.current.lerp(targetBgColorRef.current, 0.08);
    };
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render,updateAnimation]);

  return { animate };
};