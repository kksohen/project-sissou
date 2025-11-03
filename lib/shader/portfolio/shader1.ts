export interface Shader{
  vertexShader: string;
  fragmentShader: string;
}

export const shader1 : Shader = {
  vertexShader: `
    precision mediump float;
    precision mediump int;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    attribute vec3 position;
    attribute vec4 color;
    
    void main(){
      vec3 pos = position;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
    }
  `,
  fragmentShader: `
    precision mediump float;
    precision mediump int;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;

    float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

    float noise(vec3 p){
      vec3 a = floor(p);
      vec3 d = p - a;
      d = d * d * (3.0 - 2.0 * d);

      vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
      vec4 k1 = perm(b.xyxy);
      vec4 k2 = perm(k1.xyxy + b.zzww);

      vec4 c = k2 + a.zzzz;
      vec4 k3 = perm(c);
      vec4 k4 = perm(c + 1.0);

      vec4 o1 = fract(k3 * (1.0 / 41.0));
      vec4 o2 = fract(k4 * (1.0 / 41.0));

      vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
      vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

      return o4.y * d.y + o4.x * (1.0 - d.y);
    }

    vec2 rotate(vec2 p, float a){
      return mat2(cos(a), -sin(a), sin(a), cos(a)) * p;
    }

    #define PI 3.1415

    void main(){
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec2 rs = resolution;
      uv = (uv - 0.5) * rs / rs.y;
      vec2 ms = (mouse - 0.5) * rs / rs.y;
      vec4 col = vec4(0.0);

      float m_angle = atan(ms.y, ms.x);
      uv = rotate(uv, m_angle + time);

      //만화경
      float angle = PI * 2.0 / 3.0; //120도

      for(int i = 0; i < 6; i++){
        uv.x = abs(uv.x);
        uv = rotate(uv, angle);
        uv.x += 0.1;

        ms.x = abs(ms.x);
        ms = rotate(ms, angle);
        ms.x += 0.1;
      }

      //절대값으로 대칭 효과
      /* uv.x = abs(uv.x);
      uv.y = abs(uv.y);
      ms = abs(ms); */

      //마우스와의 거리
      float mdst = length(uv - ms);

      //라인 효과
      /* float linex = abs(uv.x - 0.2);
      linex = smoothstep(0.0, 0.005, linex);
      float liney = abs(uv.y - 0.2);
      liney = smoothstep(0.0, 0.005, liney); */

      //색상(그라데이션)
      float nval = noise(vec3(uv, time));
      col.r = uv.x;
      col.g = uv.y;
      col.b = 1.0;

      col.rgb = vec3(
        sin(nval * 2.0) * 0.5 + 0.5,
        sin(nval * 3.0) * 0.5 + 0.5,
        sin(nval * 4.0) * 0.5 + 0.5
      );

      //마우스 주변 파동 효과
      vec3 mcol = vec3(
        sin(mdst * 9.0 + time) * 0.5 + 0.5,
        sin(mdst * 4.0 + time) * 0.5 + 0.5,
        sin(mdst * 3.0 + time) * 0.5 + 0.5
      );

      col.rgb *= mcol;
      // col.rgb = max(col.rgb, mcol);

      //라인 마스크 적용
      /* col.rgb *= linex;
      col.rgb *= liney; */

      gl_FragColor = vec4(col.rgb, 1.0);
    }
  `
}