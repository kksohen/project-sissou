import { useCallback } from "react";
import { IUseModelsParams, LogoGroup, LogoMesh, Sphere } from "../three-types";
import * as THREE from 'three';
import { CONSTANTS } from "@/lib/constants";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { homeShader } from "@/lib/shader/home/home-shader";
import { QuadPass } from "../quadpass";
import { homeMainShader } from "@/lib/shader/home/home-main-shader";
import { homeBackShader } from "@/lib/shader/home/home-back-shader";

export function useModels({refs}: IUseModelsParams){
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
    mainPassRef,
    backPassRef,
    sceneBufferRef,
  } = refs;

  //create particles
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createSpheres = useCallback((logo: LogoGroup, _envMap: THREE.Texture) => {
    const sphereMaterial = sphereMaterialRef.current;

    if (!sphereMaterial) return;

    for (let i = 0; i < CONSTANTS.SPHERE_COUNT; i++) {
      const radius = Math.random() * 0.002 + 0.001;
      const geometry = new THREE.SphereGeometry(radius, 24, 24);

      geometriesRef.current.push(geometry);

      const sphere = new THREE.Mesh(geometry, sphereMaterial) as unknown as Sphere;
      const latitude = Math.random() * Math.PI; //위도(가)
      const longitude = Math.random() * Math.PI * 2; //경도(세)
      const sphereRadius = Math.random() * 0.3;

      sphere.target_pos = new THREE.Vector3(latitude, longitude, sphereRadius);
      sphere.position.x = 3 * Math.cos(longitude);
      sphere.position.z = 3 * Math.sin(longitude);

      logo.add(sphere);
      spheresRef.current.push(sphere);
    };
    isSphereRef.current = true;
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //initial logo position
  const setLogoInitPos = useCallback((logo: LogoGroup) => {
    if (!logo.original_rot) {
      logo.original_rot = logo.rotation.clone();
    };
    logo.rotation.y = Math.PI * 5.0;

    logoMeshesRef.current.forEach((mesh) => {
      const { x: cx, y: cy, z: cz } = mesh.position;
      
      mesh.original_pos = new THREE.Vector3(cx, cy, cz);
      mesh.original_rot = mesh.rotation.clone();

      //시작위치
      const direction = new THREE.Vector2(cx, cz);
      if (direction.length() === 0) {
        direction.set(Math.random() - 0.5, Math.random() - 0.5);
      };
      direction.normalize();

      mesh.position.set(
        cx + CONSTANTS.LOGO_RADIUS * direction.x,
        cy,
        cz + CONSTANTS.LOGO_RADIUS * direction.y
      );
      
      //시작 시 회전값
      mesh.rotation.set(
        Math.PI * 2.0 * Math.random(),
        Math.PI * 2.0 * Math.random(),
        Math.PI * 2.0 * Math.random()
      );
    });
    isLogoRef.current = true;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //quadpass - post processing
  const setupMainPass = useCallback((passedSceneBuffer?: THREE.WebGLRenderTarget)=>{
    const targetSceneBuffer = passedSceneBuffer || sceneBufferRef.current;
    if(!rendererRef.current || !targetSceneBuffer) return null;

    const newWidth = window.innerWidth * CONSTANTS.PIXEL_DENSITY;
    const newHeight = window.innerHeight * CONSTANTS.PIXEL_DENSITY;
    const resolution = new THREE.Vector2(newWidth, newHeight);

    //셰이더 복사본 생성(원본 수정 방지)
    const mainShaderCopy = {
      vertexShader: homeMainShader.vertexShader,
      fragmentShader: homeMainShader.fragmentShader
    };
    const backShaderCopy = {
    vertexShader: homeBackShader.vertexShader,
    fragmentShader: homeBackShader.fragmentShader
    };

    const mainPass = new QuadPass({
      renderer: rendererRef.current,
      shader: mainShaderCopy,
      uniforms: {
        scene_buffer: {value: targetSceneBuffer.texture},
        bck_buffer: {value: null},
        resolution: {value: resolution.clone()}
      }
    });
    const backPass = new QuadPass({
      renderer: rendererRef.current,
      shader: backShaderCopy,
      uniforms: {
        copy_buffer: {value: mainPass.buffer.texture},
        resolution: {value: resolution.clone()}
      }
    });

    mainPassRef.current = mainPass;
    backPassRef.current = backPass;

    mainPass.uniforms.bck_buffer.value = backPass.buffer.texture;

    return mainPass;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //load gltf
  const loadModels = useCallback(async (passedSceneBuffer?: THREE.WebGLRenderTarget) => {
    const loadingManager = new THREE.LoadingManager();
    const gltfLoader = new GLTFLoader(loadingManager);
    const cubeLoader = new THREE.CubeTextureLoader(loadingManager);

    loadersRef.current.gltf = gltfLoader;
    loadersRef.current.cube = cubeLoader;

    try {
      //envMap
      const envMapPromise = new Promise<THREE.Texture>((resolve, reject) => {
        cubeLoader.setPath("/assets/models/").load(
          ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'], (cubeMap) => {
            if (!rendererRef.current) {
              reject(new Error("Renderer not initialized"));
              return;
            };

            const envTexture = cubeMap;

            texturesRef.current.push(envTexture);  
            resolve(envTexture);
          },
          undefined,
          (error) => {
            console.log(error);
            reject(error);
          }
        );
      });

      //models
      const gltfPromise = new Promise<LogoGroup>((resolve, reject) => {
        gltfLoader.load("/assets/models/logo-symbol.glb", 
          (gltf)=>{
            if (!rendererRef.current){
              reject(new Error("Renderer not initialized"));
              return;
            };
            const logo = gltf.scene as LogoGroup;
            logo.rotateY(Math.PI);
            logo.rotateX(Math.PI * 0.5);

            // logo.position.y += 0.05;

            gltf.scene.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                if (child.geometry) geometriesRef.current.push(child.geometry);
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    materialsRef.current.push(...child.material);
                  } else {
                    materialsRef.current.push(child.material);
                  };
                };
              };
            });

            resolve(logo);
            
          },
          undefined,
          (error) => {
          console.log(error);
          reject(error);
          }
        );
      });

      const [logoEnvMap, logo] = await Promise.all([envMapPromise, gltfPromise]);

      envMapRef.current = logoEnvMap;
      logoRef.current = logo;

      const sphereMaterial = new THREE.RawShaderMaterial({
        uniforms: {
          envmap: {value: logoEnvMap},
          time: {value: timeRef.current},
          campos: {value: new THREE.Vector3()},
        },
        vertexShader: homeShader.vertexShader,
        fragmentShader: homeShader.fragmentShader,
      });
      sphereMaterialRef.current = sphereMaterial;
      materialsRef.current.push(sphereMaterial);

      const meshes: LogoMesh[] = [];
      logo.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {

          const mesh = obj as LogoMesh;

          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(mat => mat.dispose());
            } else {
              mesh.material.dispose();
            };
          };

          mesh.material = sphereMaterial;
          mesh.material.needsUpdate = true;
          meshes.push(mesh);
        };
      });
      logoMeshesRef.current = meshes;
      sceneRef.current?.add(logo);

      //로딩 후 애니 초기화
      if (logoRef.current && envMapRef.current) {
        setLogoInitPos(logoRef.current);
        createSpheres(logoRef.current, envMapRef.current);
        setupMainPass(passedSceneBuffer);
      };

    } catch (error) {
      console.error(error);
    };
    
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSpheres, setLogoInitPos, setupMainPass]);

  return { loadModels };
};