import { CONSTANTS } from "@/lib/constants";
import * as THREE from "three";
import { QuadPassPortfolio } from "../../portfolio/quadpass-portfolio";
import { useGlobThreeRefs } from "./useGlobThreeRefs";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Shader } from "@/lib/shader/exhibition/sphere_shader";

export class SphereSceneManager{
  private refs: ReturnType<typeof useGlobThreeRefs>;
  private shader: Shader;
  private isDisposed = false;

  private FADE_IN_DELAY = 300;
  private FADE_IN_DURATION = "0.3s";

  private getPixelRatio(){//성능 최적화
    return Math.min(CONSTANTS.PIXEL_DENSITY, window.devicePixelRatio); 
  };

  private getScreen(){
    const container = this.refs.containerRef.current;
    
    if(container){
      return{
        width: container.clientWidth,
        height: container.clientHeight,
        aspect: container.clientWidth / container.clientHeight
      };
    }

    return{
      width: window.innerWidth,
      height: window.innerHeight,
      aspect: window.innerWidth / window.innerHeight
    };
  };

  constructor(refs: ReturnType<typeof useGlobThreeRefs>, shader: Shader){
    this.refs = refs;
    this.shader = shader;
  };

  init(){
    if (this.isDisposed) return;
    
    try{
      this.initRenderer();
      this.initScene();
      this.initCamera();
      this.initControls();
      this.loadCubeMap();
      this.initSphere();
      this.initQuadPass();
      this.animate();
    }catch(error){
      console.error(error);
      this.dispose();
    }
  };

  private initRenderer(){
    const {containerRef, rendererRef} = this.refs;
    const container = containerRef.current;
    if(!container || this.isDisposed) return;

    //기존 renderer 제거
    if(rendererRef.current){
      this.disposeRenderer();
    }

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
    });

    const {width, height} = this.getScreen();
    renderer.setSize(width, height);

    const pixelRatio = this.getPixelRatio();
    renderer.setPixelRatio(pixelRatio);

    //페이드인
    container.style.opacity = "0";
    container.style.transition = `opacity ${this.FADE_IN_DURATION}`;
    setTimeout(() => {
      container.style.opacity = "1";
    }, this.FADE_IN_DELAY);

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
  };

  private initScene(){
    const {sceneRef} = this.refs;
    if(this.isDisposed) return;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;
  };

  private initCamera(){
    const {cameraRef} = this.refs;
    if(this.isDisposed) return;

    const {aspect} = this.getScreen();
    
    const camera = new THREE.PerspectiveCamera(
      CONSTANTS.CAMERA_FOV,
      aspect,
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
    controls.enableDamping = true; //부드럽게 움직임
    controls.enableRotate = true; //회전o

    controls.enableZoom = false; //줌x
    controls.enablePan = false; //우클릭 드래그시 이동X

    controlsRef.current = controls;
  };

  private loadCubeMap(){
    const {rendererRef, sphereMatRef, envmapRef, pmremRef} = this.refs;
    if (!rendererRef.current || this.isDisposed) return;

    try{
      pmremRef.current = new THREE.PMREMGenerator(rendererRef.current);

      const cubeLoader = new THREE.CubeTextureLoader();
      
      cubeLoader.setPath("/assets/models/").load([
        "px3.png",
        "nx3.png",
        "py3.png",
        "ny3.png",
        "pz3.png",
        "nz3.png"
      ], (cube) => {
        if(pmremRef.current){
          envmapRef.current = pmremRef.current.fromCubemap(cube).texture;
          
          if(sphereMatRef.current){
            sphereMatRef.current.uniforms.envmap.value = envmapRef.current;
          }
        }
      }, undefined, (error) => {
        console.error(error);
      });

    }catch(error){
      console.error(error);
    }
  };

  private initSphere(){
    const {
      sceneRef,
      sphereMeshRef,
      sphereGeomRef,
      sphereMatRef,
      timeRef,
      cameraRef,
      envmapRef,
      geomRef,
      matRef
    } = this.refs;
    
    if (!sceneRef.current || !cameraRef.current || this.isDisposed) return;

    try{
      const geom = new THREE.SphereGeometry(0.1, 256, 128); //반지름, 가로, 세로
      sphereGeomRef.current = geom;
      geomRef.current.push(geom);

      const {width, height} = this.getScreen();

      const mat = new THREE.RawShaderMaterial({
        uniforms: {
          resolution: { 
            value: new THREE.Vector2(width, height)
          },
          time: { 
            value: timeRef.current 
          },
          envmap: { 
            value: envmapRef.current
          },
          campos: {
            value: new THREE.Vector3(
              cameraRef.current.position.x,
              cameraRef.current.position.y,
              cameraRef.current.position.z
            )
          }
        },
        vertexShader: this.shader.vertexShader,
        fragmentShader: this.shader.fragmentShader
      });
      sphereMatRef.current = mat;
      matRef.current.push(mat);

      const mesh = new THREE.Mesh(geom, mat);
      sphereMeshRef.current = mesh;
      sceneRef.current.add(mesh);

    }catch(error){
      console.error(error);
    }
  };

  private initQuadPass(){
    const {rendererRef, quadPassRef, timeRef} = this.refs;
    if (!rendererRef.current || this.isDisposed) return;

    try{
      const pixelRatio = this.getPixelRatio();
      const {width, height} = this.getScreen();

      const quadPass = new QuadPassPortfolio({
        renderer: rendererRef.current,
        pixel_density: pixelRatio,
        width: width,
        height: height,
        shader: this.shader,
        uniforms: {
          time: {value: timeRef.current},
        }
      });

      quadPassRef.current = quadPass;

    }catch(error){
      console.error(error);
    }
  };

  resize(){
    if(this.isDisposed) return;

    const {rendererRef, cameraRef, quadPassRef, sphereMatRef} = this.refs;
    if(!rendererRef.current || !cameraRef.current) return;

    const {width, height, aspect} = this.getScreen();
    const pixelRatio = this.getPixelRatio();
    
    cameraRef.current.aspect = aspect;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(pixelRatio);

    if(sphereMatRef.current){
      sphereMatRef.current.uniforms.resolution.value.set(width, height);
    }

    if(quadPassRef.current){
    quadPassRef.current.pixel_density = pixelRatio;
    quadPassRef.current.resize(width, height);
    }
  };

  private update(){
    if(this.isDisposed) return;

    const {controlsRef, sphereMatRef, cameraRef, timeRef} = this.refs;
    
    controlsRef.current?.update();

    if(sphereMatRef.current && cameraRef.current){

      sphereMatRef.current.uniforms.time.value = timeRef.current;

      sphereMatRef.current.uniforms.campos.value.set(
        cameraRef.current.position.x,
        cameraRef.current.position.y,
        cameraRef.current.position.z
      );

      timeRef.current += 0.01;
    }
  };

  private render(){
    if(this.isDisposed) return;

    const {rendererRef, sceneRef, cameraRef} = this.refs;
    if(!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  private animate=()=>{
    if(this.isDisposed) return;

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
      }
    }
  };

  dispose(){
    if (this.isDisposed) return;
    this.isDisposed = true;

    const {
      animationIdRef,
      controlsRef,
      sceneRef,
      sphereMeshRef,
      geomRef,
      matRef,
      envmapRef,
      pmremRef
    } = this.refs;

    //animation 중지
    if(animationIdRef.current){
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    };
    //orbit controls 정리
    try{
      controlsRef.current?.dispose();
      controlsRef.current = null;
    }catch(error){
      console.error(error);
    };
    //mesh를 scene에서 제거
    try{
      if(sphereMeshRef.current && sceneRef.current){
        sceneRef.current.remove(sphereMeshRef.current);
        sphereMeshRef.current = null;
      }
    }catch(error){
      console.error(error);
    };
    //geometry 정리
    try{
      geomRef.current.forEach(geom => {
        try{ 
          geom.dispose(); 
        }catch(e){ 
          console.error(e); 
        }
      });

      geomRef.current.length = 0;
      
    }catch(error){
      console.error(error);
    };
    //material 정리
    try{
      matRef.current.forEach(mat => {
        try{ 
          mat.dispose(); 
        }catch(e){ 
          console.error(e); 
        }
      });

      matRef.current.length = 0;

    }catch(error){
      console.error(error);
    };
    //pmrem 정리
    try{
      if(pmremRef.current){
        pmremRef.current.dispose();
        pmremRef.current = null;
      }
    }catch(error){
      console.error(error);
    };
    //envmap 정리
    try{
      if(envmapRef.current){
        envmapRef.current.dispose();
        envmapRef.current = null;
      }
    }catch(error){
      console.error(error);
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

    refs.sphereMeshRef.current = null;
    refs.sphereGeomRef.current = null;
    refs.sphereMatRef.current = null;

    refs.envmapRef.current = null;
    refs.pmremRef.current = null;

    refs.geomRef.current = [];
    refs.matRef.current = [];

    refs.quadPassRef.current = null;
  };
}