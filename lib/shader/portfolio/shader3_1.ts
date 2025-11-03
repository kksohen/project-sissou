export interface Shader{
  vertexShader: string;
  fragmentShader: string;
}

export const shader3_1 : Shader = {
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
    uniform float time;

    /* float random(float p){
      return fract(sin(p * 13.7887) * 4578.9731);
    } */

    float random(vec2 p){
      float s = dot(p, vec2(31.1717, 23.7171));
      return fract(sin(s * 13.7887) * 45781.9731);
    }

    /* float random(vec3 p){
      float s = dot(p, vec3(31.1717, 23.7171, 57.1313));
      return fract(sin(s * 13.7887) * 45781.9731);
    } */

    float smin(float a, float b, float k){ //smooth minimum - a, b 중 작은 값을 부드럽게 전환ㅇ
      float h = max(k-abs(a-b), 0.0)/k;
      return min(a, b) - h*h*k*(1.0/4.0);
    }

    float sdCircle(vec2 p, float r){
      return length(p)-r;
    }

    /* vec2 rotate(vec2 p, float a){
      return mat2(cos(a), -sin(a), sin(a), cos(a)) * p;
    } */

    #define PI 3.1415

    void main(){
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec2 rs = resolution;
      uv = (uv-.5)*rs/rs.y;

      vec4 col = vec4(0.0);

      float total = 1e8; //무한
      const int num = 8;

      for(int i=0; i<num; i++){
        float seed = float(i); //무작위
        float angle = 5. * PI * seed / float(num) + time * 2.;
        float rad = random(vec2(seed, 1.)) * .4; //반지름
        float crad = random(vec2(seed, 3.)) * .02 + .02; //반지름2 - 0.05 ~ 0.15
        float timer = random(vec2(seed, 2.)) * 10. + time * 6.;
        rad *= (sin(timer) * .5 + .5); //0~1

        vec2 off = vec2(cos(angle), sin(angle)) * rad; //극좌표계

        float circle = sdCircle(uv - off, crad);
        total = smin(total, circle, .1); //중심 메타볼
      }
      total = smin(total, sdCircle(uv, .1), .1);

      float sh = smoothstep(.0, .005, total);
      col.rgb = vec3(sh);

      gl_FragColor = vec4(col.rgb, 1.0);
    }
  `
}