import * as THREE from "three";
import { QuadPassPortfolio } from "./quadpass-portfolio";
import { useThree4Refs } from "./useThree4Refs";
import { shader4_main } from "@/lib/shader/portfolio/shader4_main";
import { shader4_bck } from "@/lib/shader/portfolio/shader4_back";
import { CONSTANTS } from "@/lib/constants";

export class SceneManager4{
  private refs: ReturnType<typeof useThree4Refs>;
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

  constructor(refs: ReturnType<typeof useThree4Refs>){
    this.refs = refs;
  };

  async init(){
    if (this.isDisposed) return;
    
    try{
      this.initRenderer();
      this.initPasses();
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
    renderer.autoClear = false;

    container.style.opacity = "0";
    container.style.transition = `opacity ${this.FADE_IN_DURATION}`;
    setTimeout(() => {
      container.style.opacity = "1";
    }, this.FADE_IN_DELAY);

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
  };

  private initPasses(){
    const {rendererRef, mainPassRef, backPassRef, timeRef} = this.refs;
    if (!rendererRef.current || this.isDisposed) return;

    try{
      const pixelRatio = this.getPixelRatio();
      const {width, height} = this.getScreen();

      const backPass = new QuadPassPortfolio({
        renderer: rendererRef.current,
        pixel_density: pixelRatio,
        width: width,
        height: height,
        shader: shader4_bck,
        uniforms: {
          time: {value: timeRef.current},
          copy_buffer: {value: null},
        }
      });

      const mainPass = new QuadPassPortfolio({
        renderer: rendererRef.current,
        pixel_density: pixelRatio,
        width: width,
        height: height,
        shader: shader4_main,
        uniforms: {
          time: {value: timeRef.current},
          main_buffer: {value: backPass.buffer.texture}
        }
      });

      backPass.uniforms.copy_buffer.value = mainPass.buffer.texture;

      mainPassRef.current = mainPass;
      backPassRef.current = backPass;

      //backPass 초기화
      rendererRef.current.setRenderTarget(backPass.buffer);
      rendererRef.current.clear(true, true, false);
      rendererRef.current.setRenderTarget(null);

    }catch(error){
      console.error(error);
    }
  };

  resize(){
    if(this.isDisposed) return;

    const {rendererRef, mainPassRef, backPassRef} = this.refs;
    if(!rendererRef.current) return;

    const {width, height} = this.getScreen();
    rendererRef.current.setSize(width, height);
    
    mainPassRef.current?.resize(width, height);
    backPassRef.current?.resize(width, height);
  };

  private update(){
    if(this.isDisposed) return;

    const {timeRef, mainPassRef, backPassRef} = this.refs;
    
    if(mainPassRef.current){
      mainPassRef.current.uniforms.time.value = timeRef.current;
    }

    if(backPassRef.current){
      backPassRef.current.uniforms.time.value = timeRef.current;
      backPassRef.current.uniforms.copy_buffer.value = mainPassRef.current?.buffer.texture;
    }
    
    timeRef.current += 0.016;
  };

  private render(){
    if(this.isDisposed) return;

    const {mainPassRef, backPassRef} = this.refs;

    mainPassRef.current?.render(false);
    backPassRef.current?.render(false);
    
    backPassRef.current?.render(true); //최종 출력
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
        if(container && rendererRef.current.domElement.parentNode === container){
          container.removeChild(rendererRef.current.domElement);
        };

        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
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

    const {animationIdRef, mainPassRef, backPassRef} = this.refs;

    if(animationIdRef.current){
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    };

    try{
      mainPassRef.current?.dispose();
      backPassRef.current?.dispose();
      mainPassRef.current = null;
      backPassRef.current = null;

    }catch(error){
      console.error(error);
    };

    this.disposeRenderer();
    this.resetAllRefs();
  };

  private resetAllRefs(){
    const refs = this.refs;

    refs.rendererRef.current = null;
    refs.mainPassRef.current = null;
    refs.backPassRef.current = null;

    refs.animationIdRef.current = null;
    refs.timeRef.current = 0;
  };
}