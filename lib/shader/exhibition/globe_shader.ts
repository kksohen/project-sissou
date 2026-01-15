export interface Shader{
  vertexShader: string;
  fragmentShader: string;
}

export const globe_shader : Shader = {
  vertexShader: `
    precision mediump float;
    precision mediump int;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    attribute vec3 position;
    attribute vec3 normal;

    varying vec3 vnormal;
    varying vec3 vpos; 
    varying vec3 vorpos;

    uniform float time;

    //noise
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
    
    void main(){
      vec3 pos = position;
      vorpos = pos;

      vec3 norm = normal;

      //noise
      float ns = 30.; //노이즈 스케일
      float rad = noise(pos * ns);
      rad = sin(rad * 20. + time * 5.); //시간에 따라 진동ㅇ

      pos *= (1. + rad * .02); //2% 부풀림 변형
      
      norm.xz = rotate(norm.xz, rad * .25);
      norm.yz = rotate(norm.yz, rad * .25);

      vec4 outPosition = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      vpos = outPosition.xyz;

      vec4 outNormal = projectionMatrix * modelViewMatrix * vec4(norm, 1.0);
      vnormal = outNormal.xyz;

      gl_Position = outPosition;
    }
  `,
  fragmentShader: `
    precision mediump float;
    precision mediump int;

    varying vec3 vnormal;
    varying vec3 vpos;
    varying vec3 vorpos;

    uniform samplerCube envmap;
    uniform vec3 campos;

    #define PI 3.1415

    //random
    float random(vec3 st){
      return fract(sin(dot(st.xyz,
        vec3(12.9898,78.233,13.9191))) * 43758.5453123);
    }

    void main(){
      vec2 uv = gl_FragCoord.xy;
      vec4 col = vec4(0.0);

      vec3 pos = vpos;
      vec3 norm = normalize(vnormal);

      //픽셀 단위 노이즈로 표면 디테일 추가
      float sc = 4500.; //노이즈 스케일
      vec3 ffpos = fract(vorpos * sc);

      //빛 위치 무작위로 흔들어주기 - 물체 표면에 노이즈 생기게 하기 위함
      float lon = random(floor(vorpos * sc)) * PI * 2.;
      float lat = random(floor(vorpos * sc) + 1.) * PI;
      float pck = random(floor(vorpos * sc) + 2.);
      
      vec3 shake = vec3(
        cos(lat) * cos(lon),
        cos(lat) * sin(lon),
        sin(lat)
      ) * .01 * pck;

      if(pck < .7) pos += shake; //70% 픽셀만 흔들림

      vec3 normShake = vec3(
      random(floor(vorpos * sc) + 3.),
      random(floor(vorpos * sc) + 4.),
      random(floor(vorpos * sc) + 5.)
      ) * 2. - 1.;
      
      norm += normShake * 0.05;
      norm = normalize(norm);

      //조명
      vec3 light1 = vec3(1.,1.,-1.) + shake;
      vec3 light2 = vec3(-1.,1.,-1.)+ shake;
      vec3 light3 = vec3(1.,-1.,-1.)+ shake;
      
      //조명 방향
      vec3 ldir1 = light1;
      vec3 ldir2 = light2;
      vec3 ldir3 = light3;

      //조명 강도
      float sh1 = dot(ldir1, norm);
      float sh2 = dot(ldir2, norm);
      float sh3 = dot(ldir3, norm);
      //음의 값 나오지 않도록(0보다 크게)
      sh1 = max(0., sh1);
      sh2 = max(0., sh2);
      sh3 = max(0., sh3);

      //조명 색상
      vec3 col1 = vec3(
        sin(sh1 * 2.5) * .6 + .4, //r
        sin(sh1 * 1.25) * .6 + .4, //g
        sin(sh1 * .7) * .6 + .4 //b
      );
      vec3 col2 = vec3(
        sin(sh2 * .5) * .6 + .4, //r
        sin(sh2 * 1.) * .6 + .4, //g
        sin(sh2 * 2.) * .6 + .4 //b
      );
      vec3 col3 = vec3(
        sin(sh3 * .5) * .6 + .4, //r
        sin(sh3 * 1.55) * .6 + .4, //g
        sin(sh3 * 2.5) * .6 + .4 //b
      );

      //환경맵 반사
      vec3 cam = campos;
      vec3 cam_dir = normalize(pos-cam);
      vec3 ref = reflect(cam_dir, norm);
      vec3 env = textureCube(envmap, ref).rgb;

      col.rgb = max(max(col1, col2), col3);
      col.rgb = (env * .8 + .2) * (.3 + .7 * max(max(col1, col2), col3));

      col.rgb *= 2.7; //밝기
      col.rgb = pow(col.rgb, vec3(1.2)); //감마

      //채도
      vec3 lumi = vec3(dot(col.rgb, vec3(0.299, 0.587, 0.114)));
      col.rgb = mix(lumi, col.rgb, 1.3);

      gl_FragColor = vec4(col.rgb, 1.0);
    }
  `
}