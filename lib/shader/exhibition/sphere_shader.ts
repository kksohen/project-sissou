export interface Shader{
  vertexShader: string;
  fragmentShader: string;
}

export const sphere_shader : Shader = {
  vertexShader: `
    precision mediump float;
    precision mediump int;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    varying vec3 vnormal;
    varying vec3 vpos; 
    varying vec2 vUv;
    varying vec3 viewPosition;
    
    void main(){
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

      vnormal = normalize((modelViewMatrix * vec4(normal, 0.0)).xyz);
      vpos = position;
      vUv = uv;

      viewPosition = -mvPosition.xyz;

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    precision mediump float;
    precision mediump int;

    varying vec3 vnormal;
    varying vec3 vpos; 
    varying vec2 vUv;
    varying vec3 viewPosition;

    uniform samplerCube envmap;
    uniform vec3 campos;

    uniform vec2 resolution;
    uniform float time;

    void main(){
      vec2 uv = vUv;
      vec4 col = vec4(0.0);
      
      //체커보드 패턴
      //위아래 대칭
      float top = 0.94;
      float mid = 0.87;
      float bot = 0.13;
      float botop = 0.06;

      if(uv.y > top){ //맨 위
        float num = 4.0;
        vec2 iuv = floor(uv * num);

        if(mod(iuv.x, 2.) != mod(iuv.y, 2.)){
          col.rgb = vec3(0.980); //#fafafa
        }else{
          col.rgb = vec3(0.102); //#1a1a1a
        }

      }else if(uv.y > mid){ //위-중간
        float num = 4.0;
        vec2 iuv = floor(uv * num);

        if(mod(iuv.x, 2.) == mod(iuv.y, 2.)){
          col.rgb = vec3(0.980); 
        }else{
          col.rgb = vec3(0.102);
        }

      }else if(uv.y > bot){ //중심
        float center_top = 0.3;
        // float center_mid = 0.7;

        if(uv.y > center_top){
          vec2 num = vec2(16.0, 10.0); //그리드
          vec2 iuv = uv;
          // float normal_y = (iuv.y - center_top) / (mid - center_top);
          iuv.x = floor(iuv.y * num.y) * iuv.x * num.x;
          iuv.y = iuv.y * num.y;
          iuv = floor(iuv);

          if(mod(iuv.x, 2.0) != mod(iuv.y, 2.0)){
            col.rgb = vec3(0.980); 
          }else{
            col.rgb = vec3(0.102);
          }

        }/* else if(uv.y > center_mid){
          float num = 7.0;
          vec2 iuv = floor(uv * num);

          if(mod(iuv.x, 2.) == mod(iuv.y, 2.)){
            col.rgb = vec3(0.980); 
          }else{
            col.rgb = vec3(0.102); 
          }
          
        } */else{
          vec2 num = vec2(16.0, 10.0); //그리드
          vec2 iuv = uv;
          // float normal_y = (iuv.y - bot) / (center_mid - bot);
          iuv.x = floor((1.0 - iuv.y) * num.y) * iuv.x * num.x;
          iuv.y = iuv.y * num.y;
          iuv = floor(iuv);

          if(mod(iuv.x, 2.0) != mod(iuv.y, 2.0)){
            col.rgb = vec3(0.980); 
          }else{
            col.rgb = vec3(0.102);
          }
        }

      }else if(uv.y > botop){ //아래-중간
        float num = 4.0;
        vec2 iuv = floor(uv * num);

        if(mod(iuv.x, 2.) == mod(iuv.y, 2.)){
          col.rgb = vec3(0.980); 
        }else{
          col.rgb = vec3(0.102); 
        }

      }else{ //맨 아래
        float num = 4.0;
        vec2 iuv = floor(uv * num);

        if(mod(iuv.x, 2.) != mod(iuv.y, 2.)){
          col.rgb = vec3(0.980); 
        }else{
          col.rgb = vec3(0.102); 
        }
      }

      //윤곽선
      vec3 vdir = normalize(viewPosition);
      float fresnel = 1.0 - abs(dot(vnormal, vdir));
      
      float border = 0.8;
      
      if(fresnel > border){
        col.rgb = vec3(0.980); //#fafafa
      }

      gl_FragColor = vec4(col.rgb, 1.0);
    }
  `
}