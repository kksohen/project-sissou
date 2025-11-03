export interface Shader{
  vertexShader: string;
  fragmentShader: string;
}

export const shader3_2 : Shader = {
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

    float random(vec2 p){
      float s = dot(p, vec2(31.1717, 23.7171));
      return fract(sin(s * 13.7887) * 45781.9731);
    }

    #define PI 3.1415

    void main(){
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec2 rs = resolution;
      uv = (uv-.5)*rs/rs.y;

      vec4 col = vec4(0.0);

      float total = .0;
      const int num = 8;

      for(int i=0; i<num; i++){
        float seed = float(i); //무작위
        float angle = 5. * PI * seed / float(num) + time * 2.;
        float rad = random(vec2(seed, 1.)) * .4; //반지름
        float timer = random(vec2(seed, 2.)) * 10. + time * 6.;
        rad *= (sin(timer) * .5 + .5); //0~1 

        vec2 off = vec2(cos(angle), sin(angle)) * rad; //극좌표계

        //거리 기반 - 가까울수록 밝아짐
        float metaball = 1. / max(length(uv-off), 0.0001); // 1.0 /거리 = 가까울수록 큰 값
        total += metaball;
      }
      total /= (float(num) * float(num));
      col.rgb = vec3(total);

      gl_FragColor = vec4(col.rgb, 1.0);
    }
  `
}