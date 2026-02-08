import { CONSTANTS } from "@/lib/constants";
import * as THREE from "three";
import { Shader } from "@/lib/shader/exhibition/grid_shader";
import { useGridThreeRefs } from "./useGridThreeRefs";

export class GridSceneManager{
  private readonly PLANE_SCALE = 0.9;

  private refs: ReturnType<typeof useGridThreeRefs>;
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

  constructor(refs: ReturnType<typeof useGridThreeRefs>, shader: Shader){
    this.refs = refs;
    this.shader = shader;
  };

  init(){
    if (this.isDisposed) return;
    
    try{
      this.initRenderer();
      this.initScene();
      this.initCamera();
      this.initPlane();
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
    scene.background = null;
    sceneRef.current = scene;
  };

  private initCamera(){
    const {cameraRef} = this.refs;
    if(this.isDisposed) return;

    const {width, height} = this.getScreen();
    
    const camera = new THREE.OrthographicCamera( //원근감X
      width / -2, //left
      width / 2, //right
      height / 2, //top
      height / -2, //bottom
      0.1, //near
      1000 //far
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
  };

  private initPlane(){
    const {
      sceneRef,
      planeMeshRef,
      planeGeomRef,
      planeMatRef,
      timeRef,
      cameraRef,
      textureRef,
      geomRef,
      matRef
    } = this.refs;
    
    if (!sceneRef.current || !cameraRef.current || this.isDisposed) return;

    try{
      const {width, height} = this.getScreen();
      
      //plane size - 정사각형
      const size = Math.min(width, height) * this.PLANE_SCALE;
      const planeW = size;
      const planeH = size;

      const geom = new THREE.PlaneGeometry(planeW, planeH, 1, 1); //가로, 세로, 가로 세그먼트, 세로 세그먼트
      planeGeomRef.current = geom;
      geomRef.current.push(geom);

      const textLoader = new THREE.TextureLoader();
      const texture = textLoader.load("/assets/images/button-bg.jpg");
      texture.wrapS = THREE.RepeatWrapping; //반복
      texture.wrapT = THREE.RepeatWrapping;
      textureRef.current = texture;

      const mat = new THREE.RawShaderMaterial({
        uniforms: {
          resolution: { 
            value: new THREE.Vector2(width, height)
          },
          planeSize: {
            value: new THREE.Vector2(planeW, planeH)
          },
          time: { 
            value: timeRef.current 
          },
          source: { 
            value: texture
          },
          gridCount: {
            value: 6
          },
        },
        vertexShader: this.shader.vertexShader,
        fragmentShader: this.shader.fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
      });
      planeMatRef.current = mat;
      matRef.current.push(mat);

      const mesh = new THREE.Mesh(geom, mat);
      planeMeshRef.current = mesh;
      sceneRef.current.add(mesh);

    }catch(error){
      console.error(error);
    }
  };

  resize(){
    if(this.isDisposed) return;

    const {rendererRef, cameraRef, planeMatRef, planeMeshRef, planeGeomRef} = this.refs;
    if(!rendererRef.current || !cameraRef.current) return;

    const {width, height} = this.getScreen();
    const pixelRatio = this.getPixelRatio();
    
    if(cameraRef.current instanceof THREE.OrthographicCamera){
      cameraRef.current.left = width / -2;
      cameraRef.current.right = width / 2;
      cameraRef.current.top = height / 2;
      cameraRef.current.bottom = height / -2;
      cameraRef.current.updateProjectionMatrix();
    }
    
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(pixelRatio);

    if(planeMatRef.current){
      planeMatRef.current.uniforms.resolution.value.set(width, height);
    }
    
    if(planeMeshRef.current && planeGeomRef.current){
      planeGeomRef.current.dispose();
      
      const size = Math.min(width, height) * this.PLANE_SCALE;

      const newGeom = new THREE.PlaneGeometry(size, size, 1, 1);
      planeMeshRef.current.geometry = newGeom;
      planeGeomRef.current = newGeom;

      if(planeMatRef.current){
        planeMatRef.current.uniforms.planeSize.value.set(size, size);
      };
    }
  };

  private update(){
    if(this.isDisposed) return;

    const {planeMatRef, timeRef} = this.refs;
    
    if(planeMatRef.current){
      planeMatRef.current.uniforms.time.value = timeRef.current;
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
      sceneRef,
      planeMeshRef,
      geomRef,
      matRef,
      textureRef
    } = this.refs;

    //animation 중지
    if(animationIdRef.current){
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    };
    //mesh를 scene에서 제거
    try{
      if(planeMeshRef.current && sceneRef.current){
        sceneRef.current.remove(planeMeshRef.current);
        planeMeshRef.current = null;
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
    //texture 정리
    try{
      if(textureRef.current){
        textureRef.current.dispose();
        textureRef.current = null;
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

    refs.animationIdRef.current = null;
    refs.timeRef.current = 0;

    refs.planeMeshRef.current = null;
    refs.planeGeomRef.current = null;
    refs.planeMatRef.current = null;

    refs.textureRef.current = null;

    refs.geomRef.current = [];
    refs.matRef.current = [];
  };
}