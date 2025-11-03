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
  private isDisposed = false;
  private loadingManager: THREE.LoadingManager | null = null;
  
  private getPixelRatio(){//성능 최적화
    return Math.min(CONSTANTS.PIXEL_DENSITY, window.devicePixelRatio); 
  };

  private getScreen(){
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      aspect: window.innerWidth / window.innerHeight
    };
  };

  constructor(refs: ReturnType<typeof useThreeRefs>){
    this.refs = refs;
  };

  init(){
    if (this.isDisposed) return;
    
    try{
      this.initRenderer();
      this.initScene();
      this.initCamera();
      this.initControls();
      this.initRenderTargets();
      this.initLoaders();
      this.initPasses();
      this.animate();
    }catch(error){
      console.error(error);
      this.dispose();
    };
  };

  private initRenderer(){
    const {containerRef, rendererRef} = this.refs;
    const container = containerRef.current;
    if(!container || this.isDisposed) return;

    //기존 renderer 제거
    if(rendererRef.current){
      this.disposeRenderer();
    };

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
      premultipliedAlpha: false,
    });

    const {width, height} = this.getScreen();
    renderer.setSize(width, height);

    const pixelRatio = this.getPixelRatio();
    renderer.setPixelRatio(pixelRatio);
    renderer.autoClear = false;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
  };

  private initScene(){
    const {sceneRef} = this.refs;
    if (this.isDisposed) return;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;
  };

  private initCamera(){
    const {cameraRef} = this.refs;
    if (this.isDisposed) return;
    
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
    if(!rendererRef.current || !cameraRef.current || this.isDisposed) return;

    const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;
  };

  private initRenderTargets(){
    const {sceneBufferRef} = this.refs;
    if (this.isDisposed) return;

    const {width, height} = this.getScreen();
    const pixelRatio = this.getPixelRatio();
    const sceneBuffer = new THREE.WebGLRenderTarget(
      width * pixelRatio,
      height * pixelRatio,
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
    } = this.refs;

    if (this.isDisposed) return;

    this.loadingManager = new THREE.LoadingManager();
    const gltfLoader = new GLTFLoader(this.loadingManager);
    const cubeLoader = new THREE.CubeTextureLoader(this.loadingManager);

    loadersRef.current.gltf = gltfLoader;
    loadersRef.current.cube = cubeLoader;

    this.loadingManager.onError = (url) => console.error(url);

    //cubeMap load
    cubeLoader.setPath("/assets/models/").load([
      'px3.png', 'nx3.png', 'py3.png', 'ny3.png', 'pz3.png', 'nz3.png'
    ], (envmap)=>{
      if (this.isDisposed) return;
      
      envMapRef.current = envmap;
      texturesRef.current.push(envmap);
      this.logoManager.setEnvMap(envmap);
    }, undefined, (error) => {
      console.error(error);
    });

    //logo models load
    gltfLoader.load("/assets/models/logo-symbol-final.glb", (gltf)=>{
      if (this.isDisposed) return;
      
      gltf.scene.rotateY(Math.PI);
      gltf.scene.rotateX(Math.PI * 0.5);
      this.logoManager.setLogo(gltf.scene);
    }, undefined, (error) => {
      console.error(error);
    });

    //loading success
    this.loadingManager.onLoad = ()=>{
      if (!cameraRef.current || this.isDisposed) return;

      try {
        const material = this.logoManager.initLogo(cameraRef.current);
        if(material){
          sphereMaterialRef.current = material;
          materialsRef.current.push(material);
        };
        
        const sphereGeom = this.logoManager.createSpheres();
        geometriesRef.current.push(...sphereGeom);

        const logo = this.logoManager.getLogo();
        if(sceneRef.current && logo){
          sceneRef.current.add(logo);
          this.logoManager.setResponsive(window.innerWidth, window.innerHeight);
        };
      } catch (error) {
        console.error(error);
      };
    };
  };

  private initPasses(){
    const {rendererRef, sceneBufferRef, mainPassRef, backPassRef} = this.refs;
    if (!rendererRef.current || !sceneBufferRef.current || this.isDisposed) return;

    try {
      const pixelRatio = this.getPixelRatio();

      const backPass = new QuadPass({
        renderer: rendererRef.current,
        pixel_density: pixelRatio,
        shader: home_bck_shader,
        uniforms: {
          copy_buffer: {value: null}
        }
      });

      const mainPass = new QuadPass({
        renderer: rendererRef.current,
        pixel_density: pixelRatio,
        shader: home_main_shader,
        uniforms: {
          scene_buffer: {value: sceneBufferRef.current.texture},
          bck_buffer: {value: backPass.buffer.texture}
        }
      });
      
      backPass.uniforms.copy_buffer.value = mainPass.buffer.texture;

      mainPassRef.current = mainPass;
      backPassRef.current = backPass;

      rendererRef.current.setRenderTarget(backPass.buffer);
      rendererRef.current.clear(true, true, false);
      rendererRef.current.setRenderTarget(null);
    } catch (error) {
      console.error(error);
    };
  };

  reset(){
    if(this.isDisposed) return;

    try{
      this.resetCamera();
      this.resetControls();
      this.resetLogo();

      //camera pos 이동 logoManager에 전달ㅇ
      if(this.logoManager.isInitialized && this.refs.cameraRef.current){
      this.logoManager.updateUniform(this.refs.cameraRef.current, 0);
      };
    }catch(error){
      console.error(error);
    };
  };

  private resetCamera(){
    const {cameraRef} = this.refs;
    if(!cameraRef.current) return;

    cameraRef.current.position.set(
      CONSTANTS.CAMERA_POSITION.x,
      CONSTANTS.CAMERA_POSITION.y,
      CONSTANTS.CAMERA_POSITION.z,
    );
    cameraRef.current.lookAt(0,0,0);
    cameraRef.current.updateProjectionMatrix();
  };

  private resetControls(){
    const {controlsRef} = this.refs;
    if(!controlsRef.current) return;

    controlsRef.current.reset();
    controlsRef.current.update();
  };

  private resetLogo(){
    if(!this.logoManager.isInitialized) return;

    this.logoManager.reset();

    const {width, height} = this.getScreen();
    this.logoManager.setResponsive(width, height);
  };

  resize(){
    if (this.isDisposed) return;
    
    const { 
      cameraRef, 
      rendererRef, 
      sceneBufferRef, 
      mainPassRef, 
      backPassRef 
    } = this.refs;

    if (!cameraRef.current || !rendererRef.current) return;

    const {width, height, aspect} = this.getScreen();

    cameraRef.current.aspect = aspect;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);

    this.logoManager.setResponsive(width, height);

    if(sceneBufferRef.current){
      const pixelRatio = this.getPixelRatio();

      sceneBufferRef.current.setSize(
        width * pixelRatio, 
        height * pixelRatio
      );
    };

    mainPassRef.current?.resize();
    backPassRef.current?.resize();
  };

  private update(){
    if (this.isDisposed) return;
    
    const { 
      controlsRef, 
      cameraRef,
      timeRef 
    } = this.refs;

    if (!controlsRef.current || !cameraRef.current) return;
    controlsRef.current.update();

    if(this.logoManager.isInitialized){
      this.logoManager.update();
      this.logoManager.updateUniform(cameraRef.current, timeRef.current);
      timeRef.current += 0.01;
    };
  };

  private render(){
    if (this.isDisposed) return;
    
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
    if(sceneBufferRef.current){
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
    if(sceneRef.current){
      sceneRef.current.background = bgColorRef.current;
      bgColorRef.current.lerp(targetBgColorRef.current, 0.08);
    };
  };

  private animate = () => {
    if (this.isDisposed) return;
    
    const {animationIdRef} = this.refs;
    animationIdRef.current = requestAnimationFrame(this.animate);
    this.update();
    this.render();
  };

  private disposeRenderer(){
    const {rendererRef, containerRef} = this.refs;
    const container = containerRef.current;
    
    if(rendererRef.current){
      try{
        //dom 요소 제거 전 존재 확인
        if(container && rendererRef.current.domElement.parentNode === container){
          container.removeChild(rendererRef.current.domElement); //dom에서 제거
        };
        
        rendererRef.current.dispose(); //three resource 정리
        rendererRef.current.forceContextLoss(); //webGL context 해제
      }catch(error){
        console.error(error);
      }finally{
        rendererRef.current = null;
      };
    };
  };

  dispose(){
    if (this.isDisposed) return;
    this.isDisposed = true;

    const {
      animationIdRef, 
      controlsRef, 
      geometriesRef,
      materialsRef,
      texturesRef,
      mainPassRef,
      backPassRef,
      sceneBufferRef
    } = this.refs;

    //1.animations 정지
    if(animationIdRef.current){
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    };
    //2.LogoManager 정리
    try{
      this.logoManager.dispose();
    }catch(error){
      console.error(error);
    };
    //3.controls 정리
    try{
      controlsRef.current?.dispose();
      controlsRef.current = null;
    }catch(error){
      console.error(error);
    };
    //4.resource 정리
    try{
      //geometries
      geometriesRef.current.forEach(geom => {
        try{ 
          geom.dispose(); 
        }catch(e){ 
          console.error(e); 
        };
      });
      geometriesRef.current.length = 0;
      //materials
      materialsRef.current.forEach(mat => {
        try{ 
          mat.dispose(); 
        }catch(e){ 
          console.error(e); 
        };
      });
      materialsRef.current.length = 0;
      //textures
      texturesRef.current.forEach(text => {
        try{
          text.dispose();
        }catch(e){ 
          console.error(e); 
        };
      });
      texturesRef.current.length = 0;
    }catch(error){
      console.error(error);
    };
    //passes
    try{
      if(mainPassRef.current){
        mainPassRef.current.buffer?.dispose();
        mainPassRef.current.material?.dispose();
        mainPassRef.current.quad_geometry?.dispose();
        mainPassRef.current = null;
      };
      
      if(backPassRef.current){
        backPassRef.current.buffer?.dispose();
        backPassRef.current.material?.dispose();
        backPassRef.current.quad_geometry?.dispose();
        backPassRef.current = null;
      };
    }catch(error){
      console.error(error);
    };
    //render target
    try{
      sceneBufferRef.current?.dispose();
      sceneBufferRef.current = null;
    }catch(error){
      console.error(error);
    };
    //loadingManager
    if(this.loadingManager){
      this.loadingManager = null;
    };
    //renderer
    this.disposeRenderer();
    //refs 초기화
    this.resetAllRefs();
  };

  private resetAllRefs(){
    const refs = this.refs;

    refs.sceneRef.current = null;
    refs.cameraRef.current = null;
    refs.rendererRef.current = null;
    refs.controlsRef.current = null;

    refs.animationIdRef.current = null;
    refs.timeRef.current = 0;
    refs.sphereMaterialRef.current = null;

    refs.bgColorRef.current = new THREE.Color();
    refs.targetBgColorRef.current = new THREE.Color();
    
    refs.logoRef.current = null;
    refs.logoMeshesRef.current = [];
    refs.spheresRef.current = [];
    refs.envMapRef.current = null;
    refs.isLogoRef.current = false;
    refs.isSphereRef.current = false;

    refs.mainPassRef.current = null;
    refs.backPassRef.current = null;
    refs.sceneBufferRef.current = null;
    
    refs.geometriesRef.current = [];
    refs.materialsRef.current = [];
    refs.texturesRef.current = [];
    refs.loadersRef.current = {};
  };
}