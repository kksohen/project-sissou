export interface Shader{
  vertexShader: string;
  fragmentShader: string;
}

export const shader2 : Shader = {
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
    uniform sampler2D vid;
    uniform vec2 vid_res;
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
      vec4 col = vec4(0.0);

      //화면 해상도에 따라 비율 맞추기
      vec2 rs = resolution;
      uv = (uv - 0.5) * rs / rs.y;
      uv.x *= -1.0; //웹캠 좌우반전

      //만화경 회전 - rotate/abs
      uv.xy = rotate(uv.xy, time);

      const int num = 8; //각형
      for(int i = 0; i < num; i++){
        float a = PI / float(num); // 180 / num = 각도
        uv.x = abs(uv.x);
        uv.xy = rotate(uv.xy, a);
      }

      uv.y += time;

      //비디오 비율 조정
      float vid_w = vid_res.x * (rs.y / vid_res.y);
      float vid_r = min(1.0, vid_w / rs.x); 
      uv = uv * vid_r * (vid_res.y / vid_res);

      uv += 0.5;

      //noise
      float ns = 8.; //scale
      float angle = noise(vec3(uv * ns + time, time)) * PI * 2.; //0~360도 랜덤
      vec2 off = vec2(cos(angle), sin(angle)) * 0.05;

      uv += off;

      col.rgb = texture2D(vid, uv).rgb;

      gl_FragColor = vec4(col.rgb, 1.0);
    }
  `
}