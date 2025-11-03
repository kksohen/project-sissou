import { CONSTANTS } from "@/lib/constants";
import * as THREE from "three";
import { QuadPassPortfolio } from "./quadpass-portfolio";
import { useThree2Refs } from "./useThree2Refs";
import { shader2 } from "@/lib/shader/portfolio/shader2";

//만화경 - 웹캠
export class SceneManager2{
  private refs: ReturnType<typeof useThree2Refs>;
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
      };
    }

    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  constructor(refs: ReturnType<typeof useThree2Refs>){
    this.refs = refs;
  };

  async init(){
    if (this.isDisposed) return;
    
    try{
      await this.initWebcam();
      this.initRenderer();
      this.initQuadPass();
      this.animate();
    }catch(error){
      console.error(error);
      this.dispose();
    }
  };

  private async initWebcam(){
    const {videoRef, videoTextureRef} = this.refs;

    const video = document.createElement("video");
    video.setAttribute("playsinline", "");
    video.muted = true;
    video.autoplay = true;
    videoRef.current = video;

    try{
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        const constraints = {
          video: {
            width:{ideal: 640},
            height: {ideal: 480},
            facingMode: "user" //전면 카메라
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.refs.streamRef.current = stream;

        video.srcObject = stream;
        await new Promise<void>((resolve)=>{
          video.onloadedmetadata = ()=>{
            video.play().then(()=>{
              resolve();
            })
          }
        });

        //videoTexture 생성
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.wrapS = THREE.RepeatWrapping;
        videoTexture.wrapT = THREE.RepeatWrapping;
        videoTexture.minFilter = THREE.LinearFilter;  
        videoTexture.magFilter = THREE.LinearFilter; 
        videoTexture.format = THREE.RGBFormat;      

        videoTextureRef.current = videoTexture;

      }else{
        throw new Error("MediaDevices interface not available.");
      }
    }catch(error){
      console.error(error);
      throw error;
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

  private initQuadPass(){
    const {rendererRef, quadPassRef, videoRef, videoTextureRef, timeRef} = this.refs;
    if (!rendererRef.current || this.isDisposed || !videoTextureRef.current) return;

    try{
      const pixelRatio = this.getPixelRatio();
      const {width, height} = this.getScreen();
      const video = videoRef.current;

      const quadPass = new QuadPassPortfolio({
        renderer: rendererRef.current,
        pixel_density: pixelRatio,
        width: width,
        height: height,
        shader: shader2,
        uniforms: {
          vid: {value: videoTextureRef.current},
          vid_res: { 
            value: video && video.videoWidth > 0 
            ? [video.videoWidth, video.videoHeight] 
            : [640, 480]
          },
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

    const {rendererRef, quadPassRef} = this.refs;
    if(!rendererRef.current) return;

    const {width, height} = this.getScreen();
    rendererRef.current.setSize(width, height);

    quadPassRef.current?.resize(width, height);
  };

  private update(){
    if(this.isDisposed) return;

    const {timeRef, quadPassRef} = this.refs;
    if(quadPassRef.current){
      quadPassRef.current.uniforms.time.value = timeRef.current;
      timeRef.current += 0.01; //0.01(기본)
    }
  };

  private render(){
    if(this.isDisposed) return;

    const {quadPassRef} = this.refs;
    quadPassRef.current?.render(true);
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

  private disposeWebcam(){
    const {videoRef, videoTextureRef, streamRef} = this.refs;

    if(streamRef.current){
      streamRef.current.getTracks().forEach(track=> track.stop());
      streamRef.current = null;
    }

    if(videoTextureRef.current){
      videoTextureRef.current.dispose();
      videoTextureRef.current = null;
    }

    if(videoRef.current){
      videoRef.current.srcObject = null;
      videoRef.current = null;
    }
  };

  dispose(){
    if (this.isDisposed) return;
    this.isDisposed = true;

    const {animationIdRef, quadPassRef} = this.refs;

    //1.animation 정지
    if(animationIdRef.current){
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    };
    //2.quadpass 정리
    try{
      quadPassRef.current?.dispose();
      quadPassRef.current = null;

    }catch(error){
      console.error(error);
    };
    //webcam
    this.disposeWebcam();
    //renderer
    this.disposeRenderer();
    //refs 초기화
    this.resetAllRefs();
  };

  private resetAllRefs(){
    const refs = this.refs;

    refs.rendererRef.current = null;
    refs.quadPassRef.current = null;

    refs.animationIdRef.current = null;
    refs.timeRef.current = 0;

    refs.videoRef.current = null;
    refs.videoTextureRef.current = null;
    refs.streamRef.current = null;
  }
}