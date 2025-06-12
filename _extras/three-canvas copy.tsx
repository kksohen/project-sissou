/* 'use client';
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { home_main_shader } from '@/lib/shader/home-main-shader';
import { home_bck_shader } from '@/lib/shader/home-back-shader';
import { home_raw_shader } from '@/lib/shader/home-shader';
import { QuadPass } from '@/lib/three/quadpass';
import { useThreeRefs } from '@/lib/three/useThreeRefs';
import { useBgColor } from '@/lib/three/useBgColor';
import { CONSTANTS } from '@/lib/constants';


export default function ThreeCanvas() {
  const refs = useThreeRefs();
  const {
    containerRef,
    rendererRef,
    sceneRef,
    cameraRef,
    controlsRef,
    animationIdRef,
    bgColorRef,
    targetBgColorRef
  } = refs;
  
  useBgColor({refs});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene_buffer: THREE.WebGLRenderTarget;
    let mainPass: QuadPass;
    let bckPass: QuadPass;

    const loading_manager = new THREE.LoadingManager();
    const gltfLoader = new GLTFLoader(loading_manager);
    const cubeLoader = new THREE.CubeTextureLoader(loading_manager);

    let logo: THREE.Group;
    let envmap: THREE.CubeTexture;
    
    const logo_meshes: THREE.Mesh[] = [];
    let is_logo_set = false;
    
    const spheres: THREE.Mesh[] = [];
    let is_sphere_set = false;
    
    let sphere_raw_mat: THREE.RawShaderMaterial;
    let time = 0;

    const init = () => {

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(CONSTANTS.PIXEL_DENSITY);
      
      if (container) {
        container.appendChild(renderer.domElement);
      }
      rendererRef.current = renderer;

      scene_buffer = new THREE.WebGLRenderTarget(
        window.innerWidth * CONSTANTS.PIXEL_DENSITY, 
        window.innerHeight * CONSTANTS.PIXEL_DENSITY,
        {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          type: THREE.UnsignedByteType,
          stencilBuffer: false,
          depthBuffer: true
        }
      );

      // 씬 설정
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // 카메라 설정
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
      cameraRef.current = camera;

      // 컨트롤 설정
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controlsRef.current = controls;

      // 머티리얼 설정
      sphere_raw_mat = new THREE.RawShaderMaterial({
        uniforms: {
          envmap: { value: envmap },
          time: { value: time },
          campos: { value: [camera.position.x, camera.position.y, camera.position.z] }
        },
        vertexShader: home_raw_shader.vertexShader,
        fragmentShader: home_raw_shader.fragmentShader,
        transparent: true,
        blending: THREE.NormalBlending
      });

      // 모델 로드
      gltfLoader.load("/assets/models/logo-symbol.glb", (gltf) => {
        gltf.scene.rotateY(Math.PI);
        gltf.scene.rotateX(Math.PI * 0.5);
        logo = gltf.scene;
      });

      // 큐브맵 로드
      cubeLoader.setPath("/assets/models/").load([
        'px3.png', 'nx3.png', 'py3.png', 'ny3.png', 'pz3.png', 'nz3.png'
      ], (cube) => {
        envmap = cube;
        sphere_raw_mat.uniforms.envmap.value = envmap;
      });

      // 로딩 완료 후 처리
      loading_manager.onLoad = () => {
        let mesh_count = 0;
        logo.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.material = sphere_raw_mat;
            mesh_count++;
            logo_meshes.push(mesh);
            
            if (mesh_count === 3) {
              setLogoInitPos();
              setSpheres();
            }
          }
        });
        scene.add(logo);
      };

      // 패스 설정
      mainPass = new QuadPass({
        renderer: renderer,
        pixel_density: CONSTANTS.PIXEL_DENSITY,
        shader: home_main_shader,
        uniforms: {
          scene_buffer: { value: scene_buffer.texture },
          bck_buffer: { value: null }
        }
      });

      bckPass = new QuadPass({
        renderer: renderer,
        pixel_density: CONSTANTS.PIXEL_DENSITY,
        shader: home_bck_shader,
        uniforms: {
          copy_buffer: { value: mainPass.buffer.texture }
        }
      });

      mainPass.uniforms.bck_buffer.value = bckPass.buffer.texture;

      animate();
    };

    const setSpheres = () => {
      const snum = 30;
      const s_mat = sphere_raw_mat;
      
      for (let i = 0; i < snum; i++) {
        const rad = Math.random() * 0.002 + 0.001;
        const s_geo = new THREE.SphereGeometry(rad, 24, 24);
        const s_mesh = new THREE.Mesh(s_geo, s_mat);

        const latitude = Math.random() * Math.PI;
        const longitude = Math.random() * Math.PI * 2;
        const sr = Math.random() * 0.2;

        (s_mesh as any).target_pos = new THREE.Vector3(latitude, longitude, sr);

        s_mesh.position.x = 2 * Math.cos(longitude);
        s_mesh.position.z = 2 * Math.sin(longitude);

        logo.add(s_mesh);
        spheres.push(s_mesh);
      }
      is_sphere_set = true;
    };

    const setLogoInitPos = () => {
      (logo as any).original_rot = logo.rotation.clone();
      logo.rotation.y = Math.PI * 5.0;

      const rad = 2;
      for (let i = 0; i < logo_meshes.length; i++) {
        const cx = logo_meshes[i].position.x;
        const cy = logo_meshes[i].position.y;
        const cz = logo_meshes[i].position.z;

        (logo_meshes[i] as any).original_pos = new THREE.Vector3(cx, cy, cz);
        (logo_meshes[i] as any).original_rot = logo_meshes[i].rotation.clone();

        const dir = new THREE.Vector2(cx, cz);
        dir.normalize();
        
        logo_meshes[i].position.set(
          cx + rad * dir.x,
          cy,
          cz + rad * dir.y
        );
        
        logo_meshes[i].rotation.set(
          Math.PI * 2.0 * Math.random(),
          0,
          Math.PI * 2.0 * Math.random()
        );
      }
      is_logo_set = true;
    };

    const resize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      scene_buffer.setSize(
        window.innerWidth * CONSTANTS.PIXEL_DENSITY, 
        window.innerHeight * CONSTANTS.PIXEL_DENSITY
      );
      mainPass.resize();
      bckPass.resize();
    };

    const update = () => {
      if (!controlsRef.current || !cameraRef.current) return;
      
      controlsRef.current.update();

      if (is_logo_set && logo && (logo as any).original_rot) {
        const ta_x = (logo as any).original_rot.x;
        const ta_y = (logo as any).original_rot.y;
        const ta_z = (logo as any).original_rot.z;

        let ca_x = logo.rotation.x;
        let ca_y = logo.rotation.y;
        let ca_z = logo.rotation.z;

        ca_x += (ta_x - ca_x) * 0.05;
        ca_y += (ta_y - ca_y) * 0.05;
        ca_z += (ta_z - ca_z) * 0.05;

        logo.rotation.set(ca_x, ca_y, ca_z);

        for (let i = 0; i < logo_meshes.length; i++) {
          const mesh = logo_meshes[i];
          const original_pos = (mesh as any).original_pos;
          const original_rot = (mesh as any).original_rot;
          
          if (!original_pos || !original_rot) continue;

          const tx = original_pos.x;
          const ty = original_pos.y;
          const tz = original_pos.z;

          let cx = mesh.position.x;
          let cy = mesh.position.y;
          let cz = mesh.position.z;

          cx += (tx - cx) * 0.1;
          cy += (ty - cy) * 0.1;
          cz += (tz - cz) * 0.1;

          mesh.position.set(cx, cy, cz);

          let cax = mesh.rotation.x;
          let cay = mesh.rotation.y;
          let caz = mesh.rotation.z;

          cax += (original_rot.x - cax) * 0.03;
          cay += (original_rot.y - cay) * 0.03;
          caz += (original_rot.z - caz) * 0.03;

          mesh.rotation.set(cax, cay, caz);
        }
      }

      if (is_sphere_set) {
        for (let i = 0; i < spheres.length; i++) {
          const sphere = spheres[i];
          const target_pos = (sphere as any).target_pos;
          
          if (!target_pos) continue;

          const lat = target_pos.x;
          const lon = target_pos.y;
          const sr = target_pos.z;

          const tx = sr * Math.sin(lat) * Math.cos(lon);
          const ty = sr * Math.sin(lat) * Math.sin(lon);
          const tz = sr * Math.cos(lat);

          let cx = sphere.position.x;
          let cy = sphere.position.y;
          let cz = sphere.position.z;

          cx += (tx - cx) * 0.1;
          cy += (ty - cy) * 0.1;
          cz += (tz - cz) * 0.1;

          sphere.position.set(cx, cy, cz);
        }
      }

      if (sphere_raw_mat && cameraRef.current) {
        sphere_raw_mat.uniforms.campos.value = [
          cameraRef.current.position.x,
          cameraRef.current.position.y,
          cameraRef.current.position.z
        ];
        sphere_raw_mat.uniforms.time.value = time;
        time += 0.01;
      }
    };

    const render = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      rendererRef.current.setRenderTarget(scene_buffer);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      mainPass.render(false);
      bckPass.render(false);
      mainPass.render(true);
    };

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      update();
      render();

      //sceneBGColor fadeIn/Out 효과
      if (sceneRef.current) {
        sceneRef.current.background = bgColorRef.current;
        bgColorRef.current.lerp(targetBgColorRef.current, 0.08);
      };
    };

    init();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); */

'use client';
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { home_main_shader } from '@/lib/shader/home/home-main-shader';
import { home_bck_shader } from '@/lib/shader/home/home-back-shader';
import { home_raw_shader } from '@/lib/shader/home/home-shader';
import { QuadPass } from '@/lib/three/quadpass';
import { useThreeRefs } from '@/lib/three/useThreeRefs';
import { useBgColor } from '@/lib/three/useBgColor';
import { CONSTANTS } from '@/lib/constants';


export default function ThreeCanvas() {
  const refs = useThreeRefs();
  const {
    containerRef,
    rendererRef,
    sceneRef,
    cameraRef,
    controlsRef,
    animationIdRef,
    bgColorRef,
    targetBgColorRef
  } = refs;
  
  useBgColor({refs});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene_buffer: THREE.WebGLRenderTarget;
    let mainPass: QuadPass;
    let bckPass: QuadPass;

    const loading_manager = new THREE.LoadingManager();
    const gltfLoader = new GLTFLoader(loading_manager);
    const cubeLoader = new THREE.CubeTextureLoader(loading_manager);

    let logo: THREE.Group;
    let envmap: THREE.CubeTexture;
    
    const logo_meshes: THREE.Mesh[] = [];
    let is_logo_set = false;
    
    const spheres: THREE.Mesh[] = [];
    let is_sphere_set = false;
    
    let sphere_raw_mat: THREE.RawShaderMaterial;
    let time = 0;

    const init = () => {

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(CONSTANTS.PIXEL_DENSITY);
      
      if (container) {
        container.appendChild(renderer.domElement);
      }
      rendererRef.current = renderer;

      scene_buffer = new THREE.WebGLRenderTarget(
        window.innerWidth * CONSTANTS.PIXEL_DENSITY, 
        window.innerHeight * CONSTANTS.PIXEL_DENSITY,
        {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          type: THREE.UnsignedByteType,
          stencilBuffer: false,
          depthBuffer: true
        }
      );

      // 씬 설정
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // 카메라 설정
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
      cameraRef.current = camera;

      // 컨트롤 설정
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controlsRef.current = controls;

      // 머티리얼 설정
      sphere_raw_mat = new THREE.RawShaderMaterial({
        uniforms: {
          envmap: { value: envmap },
          time: { value: time },
          campos: { value: [camera.position.x, camera.position.y, camera.position.z] }
        },
        vertexShader: home_raw_shader.vertexShader,
        fragmentShader: home_raw_shader.fragmentShader,
        transparent: true,
        blending: THREE.NormalBlending
      });

      // 모델 로드
      gltfLoader.load("/assets/models/logo-symbol.glb", (gltf) => {
        gltf.scene.rotateY(Math.PI);
        gltf.scene.rotateX(Math.PI * 0.5);
        logo = gltf.scene;
      });

      // 큐브맵 로드
      cubeLoader.setPath("/assets/models/").load([
        'px3.png', 'nx3.png', 'py3.png', 'ny3.png', 'pz3.png', 'nz3.png'
      ], (cube) => {
        envmap = cube;
        sphere_raw_mat.uniforms.envmap.value = envmap;
      });

      // 로딩 완료 후 처리
      loading_manager.onLoad = () => {
        let mesh_count = 0;
        logo.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.material = sphere_raw_mat;
            mesh_count++;
            logo_meshes.push(mesh);
            
            if (mesh_count === 3) {
              setLogoInitPos();
              setSpheres();
            }
          }
        });
        scene.add(logo);
      };

      // 패스 설정
      mainPass = new QuadPass({
        renderer: renderer,
        pixel_density: CONSTANTS.PIXEL_DENSITY,
        shader: home_main_shader,
        uniforms: {
          scene_buffer: { value: scene_buffer.texture },
          bck_buffer: { value: null }
        }
      });

      bckPass = new QuadPass({
        renderer: renderer,
        pixel_density: CONSTANTS.PIXEL_DENSITY,
        shader: home_bck_shader,
        uniforms: {
          copy_buffer: { value: mainPass.buffer.texture }
        }
      });

      mainPass.uniforms.bck_buffer.value = bckPass.buffer.texture;

      animate();
    };

    const setSpheres = () => {
      const snum = 30;
      const s_mat = sphere_raw_mat;
      
      for (let i = 0; i < snum; i++) {
        const rad = Math.random() * 0.002 + 0.001;
        const s_geo = new THREE.SphereGeometry(rad, 24, 24);
        const s_mesh = new THREE.Mesh(s_geo, s_mat);

        const latitude = Math.random() * Math.PI;
        const longitude = Math.random() * Math.PI * 2;
        const sr = Math.random() * 0.2;

        (s_mesh as any).target_pos = new THREE.Vector3(latitude, longitude, sr);

        s_mesh.position.x = 2 * Math.cos(longitude);
        s_mesh.position.z = 2 * Math.sin(longitude);

        logo.add(s_mesh);
        spheres.push(s_mesh);
      }
      is_sphere_set = true;
    };

    const setLogoInitPos = () => {
      (logo as any).original_rot = logo.rotation.clone();
      logo.rotation.y = Math.PI * 5.0;

      const rad = 2;
      for (let i = 0; i < logo_meshes.length; i++) {
        const cx = logo_meshes[i].position.x;
        const cy = logo_meshes[i].position.y;
        const cz = logo_meshes[i].position.z;

        (logo_meshes[i] as any).original_pos = new THREE.Vector3(cx, cy, cz);
        (logo_meshes[i] as any).original_rot = logo_meshes[i].rotation.clone();

        const dir = new THREE.Vector2(cx, cz);
        dir.normalize();
        
        logo_meshes[i].position.set(
          cx + rad * dir.x,
          cy,
          cz + rad * dir.y
        );
        
        logo_meshes[i].rotation.set(
          Math.PI * 2.0 * Math.random(),
          0,
          Math.PI * 2.0 * Math.random()
        );
      }
      is_logo_set = true;
    };

    const resize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      scene_buffer.setSize(
        window.innerWidth * CONSTANTS.PIXEL_DENSITY, 
        window.innerHeight * CONSTANTS.PIXEL_DENSITY
      );
      mainPass.resize();
      bckPass.resize();
    };

    const update = () => {
      if (!controlsRef.current || !cameraRef.current) return;
      
      controlsRef.current.update();

      if (is_logo_set && logo && (logo as any).original_rot) {
        const ta_x = (logo as any).original_rot.x;
        const ta_y = (logo as any).original_rot.y;
        const ta_z = (logo as any).original_rot.z;

        let ca_x = logo.rotation.x;
        let ca_y = logo.rotation.y;
        let ca_z = logo.rotation.z;

        ca_x += (ta_x - ca_x) * 0.05;
        ca_y += (ta_y - ca_y) * 0.05;
        ca_z += (ta_z - ca_z) * 0.05;

        logo.rotation.set(ca_x, ca_y, ca_z);

        for (let i = 0; i < logo_meshes.length; i++) {
          const mesh = logo_meshes[i];
          const original_pos = (mesh as any).original_pos;
          const original_rot = (mesh as any).original_rot;
          
          if (!original_pos || !original_rot) continue;

          const tx = original_pos.x;
          const ty = original_pos.y;
          const tz = original_pos.z;

          let cx = mesh.position.x;
          let cy = mesh.position.y;
          let cz = mesh.position.z;

          cx += (tx - cx) * 0.1;
          cy += (ty - cy) * 0.1;
          cz += (tz - cz) * 0.1;

          mesh.position.set(cx, cy, cz);

          let cax = mesh.rotation.x;
          let cay = mesh.rotation.y;
          let caz = mesh.rotation.z;

          cax += (original_rot.x - cax) * 0.03;
          cay += (original_rot.y - cay) * 0.03;
          caz += (original_rot.z - caz) * 0.03;

          mesh.rotation.set(cax, cay, caz);
        }
      }

      if (is_sphere_set) {
        for (let i = 0; i < spheres.length; i++) {
          const sphere = spheres[i];
          const target_pos = (sphere as any).target_pos;
          
          if (!target_pos) continue;

          const lat = target_pos.x;
          const lon = target_pos.y;
          const sr = target_pos.z;

          const tx = sr * Math.sin(lat) * Math.cos(lon);
          const ty = sr * Math.sin(lat) * Math.sin(lon);
          const tz = sr * Math.cos(lat);

          let cx = sphere.position.x;
          let cy = sphere.position.y;
          let cz = sphere.position.z;

          cx += (tx - cx) * 0.1;
          cy += (ty - cy) * 0.1;
          cz += (tz - cz) * 0.1;

          sphere.position.set(cx, cy, cz);
        }
      }

      if (sphere_raw_mat && cameraRef.current) {
        sphere_raw_mat.uniforms.campos.value = [
          cameraRef.current.position.x,
          cameraRef.current.position.y,
          cameraRef.current.position.z
        ];
        sphere_raw_mat.uniforms.time.value = time;
        time += 0.01;
      }
    };

    const render = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      rendererRef.current.setRenderTarget(scene_buffer);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      mainPass.render(false);
      bckPass.render(false);
      mainPass.render(true);
    };

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      update();
      render();

      //sceneBGColor fadeIn/Out 효과
      if (sceneRef.current) {
        sceneRef.current.background = bgColorRef.current;
        bgColorRef.current.lerp(targetBgColorRef.current, 0.08);
      };
    };

    init();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed left-0 top-0 w-screen h-screen m-0 p-0 overflow-hidden" 
    />
  );
};