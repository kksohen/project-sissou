import { QuadPass } from "../quadpass";
import * as THREE from 'three';
import { useThreeRefs } from "../useThreeRefs";
import { CONSTANTS } from "@/lib/constants";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { home_main_shader } from "@/lib/shader/home/home-main-shader";
import { home_bck_shader } from "@/lib/shader/home/home-back-shader";
import { LogoManager } from './logo-manager';

export class SceneManager{
  private refs: ReturnType<typeof useThreeRefs>;
  private logoManager = new LogoManager();

  constructor(refs: ReturnType<typeof useThreeRefs>){
    this.refs = refs;
  };

  init(){
    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initControls();
    this.initRenderTargets();
    this.initLoaders();
    this.initPasses();
    this.animate();
  };

  private initRenderer(){
    const {containerRef, rendererRef} = this.refs;
    const container = containerRef.current;
    if(!container) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
      premultipliedAlpha: false,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(CONSTANTS.PIXEL_DENSITY);

    renderer.autoClear = false;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
  };

  private initScene(){
    const {sceneRef} = this.refs;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
  };

  private initCamera(){
    const {cameraRef} = this.refs;
    const camera = new THREE.PerspectiveCamera(
      CONSTANTS.CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
    camera.position.set(
      CONSTANTS.CAMERA_POSITION.x,
      CONSTANTS.CAMERA_POSITION.y,
      CONSTANTS.CAMERA_POSITION.z,
    );
    camera.lookAt(0,0,0);
    cameraRef.current = camera;
  };

  private initControls(){
    const {rendererRef, cameraRef, controlsRef} = this.refs;
    if(!rendererRef.current || !cameraRef.current) return;

    const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;
  };

  private initRenderTargets(){
    const {sceneBufferRef} = this.refs;

    const sceneBuffer = new THREE.WebGLRenderTarget(
      window.innerWidth * CONSTANTS.PIXEL_DENSITY,
      window.innerHeight * CONSTANTS.PIXEL_DENSITY,
      {
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        stencilBuffer: false,
        depthBuffer: true,
        generateMipmaps: false,      
        minFilter: THREE.LinearFilter, 
        magFilter: THREE.LinearFilter, 
      }
    );

    sceneBufferRef.current = sceneBuffer;
  };

  private initLoaders(){
    const{
      sceneRef, 
      envMapRef, 
      sphereMaterialRef,
      loadersRef,
      texturesRef,
      cameraRef,
      materialsRef,
      geometriesRef
    } =this.refs;

    const loadingManager = new THREE.LoadingManager();
    const gltfLoader = new GLTFLoader(loadingManager);
    const cubeLoader = new THREE.CubeTextureLoader(loadingManager);

    loadersRef.current.gltf = gltfLoader;
    loadersRef.current.cube = cubeLoader;

    //cubeMap load
    cubeLoader.setPath("/assets/models/").load([
      'px3.png', 'nx3.png', 'py3.png', 'ny3.png', 'pz3.png', 'nz3.png'
    ], (envmap)=>{
      envMapRef.current = envmap;
      texturesRef.current.push(envmap);

      this.logoManager.setEnvMap(envmap);
    });

    //logo models load
    gltfLoader.load("/assets/models/logo-symbol-final.glb", (gltf)=>{
      gltf.scene.rotateY(Math.PI);
      gltf.scene.rotateX(Math.PI * 0.5);

      this.logoManager.setLogo(gltf.scene);
    });

    //loading success
    loadingManager.onLoad = ()=>{
      if (!cameraRef.current) return;

      const material = this.logoManager.initializeLogo(cameraRef.current);
      if(material){
        sphereMaterialRef.current = material;
        materialsRef.current.push(material);
      };
      const sphereGeometries = this.logoManager.createSpheres();
      geometriesRef.current.push(...sphereGeometries);

      const logo = this.logoManager.getLogo();
      if(sceneRef.current && logo){
        sceneRef.current.add(logo);
      };
    };
  };

  private initPasses(){
    const { rendererRef, sceneBufferRef, mainPassRef, backPassRef } = this.refs;
    if (!rendererRef.current || !sceneBufferRef.current) return;

    const backPass = new QuadPass({
      renderer: rendererRef.current,
      pixel_density: CONSTANTS.PIXEL_DENSITY,
      shader: home_bck_shader,
      uniforms: {
        copy_buffer: { value: null }
      }
    });

    const mainPass = new QuadPass({
      renderer: rendererRef.current,
      pixel_density: CONSTANTS.PIXEL_DENSITY,
      shader: home_main_shader,
      uniforms: {
        scene_buffer: { value: sceneBufferRef.current.texture },
        bck_buffer: { value: backPass.buffer.texture }
      }
    });
    
    backPass.uniforms.copy_buffer.value = mainPass.buffer.texture;

    mainPassRef.current = mainPass;
    backPassRef.current = backPass;

    rendererRef.current.setRenderTarget(backPass.buffer);
    rendererRef.current.clear(true, true, false);
    rendererRef.current.setRenderTarget(null);
  };

  resize(){
    const { 
      cameraRef, 
      rendererRef, 
      sceneBufferRef, 
      mainPassRef, 
      backPassRef 
    } = this.refs;

    if (!cameraRef.current || !rendererRef.current) return;

    cameraRef.current.aspect = window.innerWidth / window.innerHeight;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);

    if(sceneBufferRef.current){
      sceneBufferRef.current.setSize(
        window.innerWidth * CONSTANTS.PIXEL_DENSITY, 
        window.innerHeight * CONSTANTS.PIXEL_DENSITY
      );
    };

    mainPassRef.current?.resize();
    backPassRef.current?.resize();
  };

  private update(){
    const { 
      controlsRef, 
      cameraRef,
      timeRef 
    } = this.refs;

    if (!controlsRef.current || !cameraRef.current) return;
    controlsRef.current.update();

    if (this.logoManager.isInitialized){
      this.logoManager.update();
      this.logoManager.updateUniforms(cameraRef.current, timeRef.current);
      timeRef.current += 0.01;
    };
  };

  private render(){
    const { 
      rendererRef, 
      sceneRef, 
      cameraRef, 
      sceneBufferRef, 
      mainPassRef, 
      backPassRef,
      bgColorRef, 
      targetBgColorRef 
    } = this.refs;

    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    //scene - buffer rendering
    if (sceneBufferRef.current) {
      rendererRef.current.setRenderTarget(sceneBufferRef.current);
      rendererRef.current.clear();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    //post processing 순서
    mainPassRef.current?.render(false);
    rendererRef.current.setRenderTarget(null);
    mainPassRef.current?.render(true);
    backPassRef.current?.render(false);

    //bgColor fadeIn/Out
    if (sceneRef.current) {
      sceneRef.current.background = bgColorRef.current;
      bgColorRef.current.lerp(targetBgColorRef.current, 0.08);
    };
  };

  private animate=()=>{
    const {animationIdRef} = this.refs;
    animationIdRef.current = requestAnimationFrame(this.animate);
    this.update();
    this.render();
  };

  dispose(){
    const {
      animationIdRef, 
      rendererRef, 
      controlsRef, 
      containerRef,
      geometriesRef,
      materialsRef,
      texturesRef,
      mainPassRef,
      backPassRef,
      sceneBufferRef
    } = this.refs;

    const container = containerRef.current;

    //cleanup
    //animation 
    if(animationIdRef.current){
      cancelAnimationFrame(animationIdRef.current);
    };
    this.logoManager.dispose();
    //renderer
    if(rendererRef.current && container){
      container.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    };
    //controls
    controlsRef.current?.dispose();
    //geometry
    geometriesRef.current.forEach(geom => geom.dispose());
    //material
    materialsRef.current.forEach(mat => mat.dispose());
    //texture
    texturesRef.current.forEach(text => text.dispose());
    //passes
    if(mainPassRef.current){
      mainPassRef.current.buffer.dispose();
      mainPassRef.current.material.dispose();
      mainPassRef.current.quad_geometry.dispose();
    };
    if(backPassRef.current){
      backPassRef.current.buffer.dispose();
      backPassRef.current.material.dispose();
      backPassRef.current.quad_geometry.dispose();
    };
    //renderTarget
    sceneBufferRef.current?.dispose();
  };

}