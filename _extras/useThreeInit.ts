import { useCallback, useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';
import { IUseModelsParams } from '../three-types';
import useThreeScene from '../useThreeScene';
import useRenderer from '../useRenderer';
import { useResizeHandler } from './useResizeHandler';
import { CONSTANTS } from '@/lib/constants';

export function useThreeInit({refs} : IUseModelsParams, onReady?: ()=> void){
  const {
    containerRef,
    sceneRef,
    cameraRef,
    rendererRef,
    controlsRef,
    sceneBufferRef,
  } = refs;
  
  //initialize
  const { setupScene } = useThreeScene();
  // const { setupRenderer } = useRenderer(containerRef.current);
  const { setupRenderer } = useRenderer();
  const handleResize = useResizeHandler({refs});

  const stableOnReady = useCallback(() => {
    if (onReady) onReady();
  }, [onReady]);

  useEffect(()=>{
    const container = containerRef.current;
    if (!container) return;

    //three 캐시 정리
    THREE.Cache.enabled = false;
    THREE.Cache.clear();

    //캔버스 전용 프리로더
    container.style.opacity = "0";
    container.style.transition = `opacity ${CONSTANTS.FADE_DURATION}ms`;

    const fadeTimeout = setTimeout(() => {
      if (container) {
        container.style.opacity = "1";
      }
    }, CONSTANTS.FADE_DURATION);

    //Three.js 초기화
    try{
      const { scene, camera } = setupScene();
      const rendererResult = setupRenderer(container);

      if (!rendererResult) {
        console.error('Renderer setup failed');
        return;
      };

      const { renderer, scene_buffer } = rendererResult;

      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
      sceneBufferRef.current = scene_buffer;

      if(!container.contains(renderer.domElement)){
        container.appendChild(renderer.domElement);
      };

      //컨트롤 설정
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controlsRef.current = controls;

      handleResize();
      
      stableOnReady();
      // if (onReady) onReady();
    }catch(error){
      console.error('Three.js initialization failed:', error);
    };

    return()=>{
      clearTimeout(fadeTimeout);
    }
    //ref 객체는 의존성 배열에 굳이 포함X
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleResize, onReady, setupRenderer, setupScene, stableOnReady]);
};