import { gradShaderFrag, gradShaderVert } from "@/lib/shader/exhibition/grad_shader";
import p5 from "p5";

export const gradSketch = (imgPaths: string[], dimension: {width: number; height: number}, onClick: (imgPath: string) => void)=>{
  return(p: p5)=>{
    let shader: p5.Shader;
    const imgs: p5.Image[] = [];
    let pg: p5.Graphics;
    let isReady = false;

    //grid layout
    const cols = 5;
    const gap = 8;
    const padding = 24;
    
    let imgW = 0;
    let imgH = 0;
    const imgPos: {x: number, y: number}[] = [];

    //canvas bg color - dark, light mode
    let currentBG = "#fff";

    const updateBG = ()=>{
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue("--mode-bg").trim();

      currentBG = bgColor || "#ffffff";
    };

    p.setup = async()=>{
      p.createCanvas(dimension.width, dimension.height, p.WEBGL);
      shader = p.createShader(gradShaderVert, gradShaderFrag);
      pg = p.createGraphics(dimension.width, dimension.height);
      
      p.noStroke();

      updateBG();

      const observer = new MutationObserver(updateBG);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      //load images
      const load = imgPaths.map(async(path)=>{
        try{
          return p.loadImage(path);
        }catch(error){
          console.error(`Failed to load image ${path}:`, error);
          return null;
        }
      });

      const loaded = await Promise.all(load);
      imgs.push(...loaded.filter((img): img is p5.Image => img !== null));

      //images position
      const availableW = dimension.width - (padding * 2);
      const total_gap = gap * (cols - 1);
      imgW = (availableW - total_gap) / cols;
      imgH = imgW * (9 / 7); //7:9 비율

      imgs.forEach((_, index)=>{
        const col = index % cols; //열
        const row = Math.floor(index / cols); //행
        const x = padding + col * (imgW + gap);
        const y = padding + row * (imgH + gap);
        imgPos.push({x, y});
      });

      isReady = true;
    };

    //gradAlbum imgs 마우스 클릭 시 해당 매칭 img 출력 이벤트
    p.mousePressed =()=>{ 
      if (!isReady) return;

      const msX = p.mouseX;
      const msY = p.mouseY;

      for(let i=0; i<imgs.length; i++){
        const pos = imgPos[i];
        if(msX >= pos.x && msX <= pos.x + imgW && 
        msY >= pos.y && msY <= pos.y + imgH){
          onClick(imgPaths[i]);
          return;
        }
      };
    };

    p.draw=()=>{
      if (!isReady) return;

      pg.background(currentBG);

      imgs.forEach((img, index)=>{
        const pos = imgPos[index];
        pg.image(img, pos.x, pos.y, imgW, imgH);
      });

      //shader
      p.shader(shader);
      shader.setUniform("pixel_density", p.pixelDensity());
      shader.setUniform("image", pg);
      shader.setUniform("mouse", [p.mouseX / dimension.width, 1 - p.mouseY / dimension.height]); //마우스 좌표 0~1 범위로 정규화, y축 반전
      shader.setUniform("resolution", [dimension.width, dimension.height]);

      //사각형 그리기 - webgl 정규화 좌표
      p.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    };
  };
};