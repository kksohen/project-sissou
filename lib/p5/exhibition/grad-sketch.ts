import { gradShaderFrag, gradShaderVert } from "@/lib/shader/exhibition/grad_shader";
import p5 from "p5";

export const gradSketch = (imgPaths: string[], dimension: {width: number; height: number})=>{
  return(p: p5)=>{
    let shader: p5.Shader;
    const imgs: p5.Image[] = [];
    let pg: p5.Graphics;
    let isReady = false;

    const cols = 5;
    const gap = 8;
    const padding = 24;

    let imgW = 0;
    let imgH = 0;
    const imgPos: {x: number, y: number}[] = [];

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

      const availableW = dimension.width - (padding * 2);
      const total_gap = gap * (cols - 1);
      imgW = (availableW - total_gap) / cols;
      imgH = imgW * (9 / 7);

      imgs.forEach((_, index)=>{
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = padding + col * (imgW + gap);
        const y = padding + row * (imgH + gap);
        imgPos.push({x, y});
      });

      isReady = true;
    };

    p.draw=()=>{
      if (!isReady) return;

      pg.background(currentBG);

      imgs.forEach((img, index)=>{
        const pos = imgPos[index];
        pg.image(img, pos.x, pos.y, imgW, imgH);
      });

      p.shader(shader);
      shader.setUniform("pixel_density", p.pixelDensity());
      shader.setUniform("image", pg);
      shader.setUniform("mouse", [p.mouseX / dimension.width, 1 - p.mouseY / dimension.height]);
      shader.setUniform("resolution", [dimension.width, dimension.height]);

      p.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    };
  };
};