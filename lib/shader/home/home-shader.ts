export interface Shader{
  vertexShader: string;
  fragmentShader: string;
}

export const home_raw_shader : Shader = {
vertexShader: `
  precision mediump float;
  precision mediump int;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  //custom
  uniform float time;

  attribute vec3 position;
  attribute vec3 normal;
  attribute vec4 color;

  varying vec3 vnormal;
  varying vec3 vpos;
  varying vec3 vorpos;

  //rotate
  vec2 rotate(vec2 p, float a){
    return mat2(cos(a), -sin(a), sin(a), cos(a)) * p;
  }

  //noise
  float mod289(float x){return x - floor(x * (1. / 289.)) * 289.;}
  vec4 mod289(vec4 x){return x - floor(x * (1. / 289.)) * 289.;}
  vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.) * x);}

  float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3. - 2. * d);

    vec4 b = a.xxyy + vec4(0.0, 1., .0, 1.);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.);

    vec4 o1 = fract(k3 * (1. / 41.0));
    vec4 o2 = fract(k4 * (1. / 41.));

    vec4 o3 = o2 * d.z + o1 * (1. - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1. - d.x);

    return o4.y * d.y + o4.x * (1. - d.y);
  }

  void main(){
    vec3 pos = position;
    vorpos = pos;

    float ns = 25.;
    float rad = noise(pos * ns);
    rad = sin(rad * 17. + time * 5.);

    pos *= (1. + rad * .02);

    vec3 norm = normal;
    norm.xz = rotate(norm.xz, rad * .5);
    norm.yz = rotate(norm.yz, rad * .5);

    vnormal = normalize(normalMatrix * norm);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
    vpos = (modelViewMatrix * vec4(pos, 1.)).xyz;
  }
`,
fragmentShader: `
  precision mediump float;
  precision mediump int;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  uniform samplerCube envmap;
  uniform vec3 campos;

  varying vec3 vnormal;
  varying vec3 vpos;
  varying vec3 vorpos;
  
  //random
  float random (vec3 st){
    return fract(sin(dot(st, vec3(12.9898, 78.233, 13.9191))) * 43758.5453123);
  }

  //PI
  #define PI 3.1415 //180

  void main(){
    vec2 uv = gl_FragCoord.xy;
    vec4 col = vec4(1.);
    vec3 pos = vpos;
    vec3 norm = normalize(vnormal);

    //noise
    float lon = random(vorpos) * PI * 2.;
    float lat = random(vorpos + 1.) * PI;
    float rad = random(vorpos + 2.);

    vec3 shake = vec3(sin(lat) * cos(lon),
    sin(lat) * sin(lon),
    cos(lat)) * rad * .5;

    if(rad > .7){
      pos += shake;
    };
    
    //lighting
    vec3 light1 = vec3(1., 1., -1.);
    vec3 light2 = vec3(-1., 1., -1.);
    vec3 light3 = vec3(1., -1., -1.);

    vec3 ldir1 = normalize(light1-pos);
    vec3 ldir2 = normalize(light2-pos);
    vec3 ldir3 = normalize(light3-pos);
    
    float sh1 = max(0., dot(ldir1, norm));
    float sh2 = max(0., dot(ldir2, norm));
    float sh3 = max(0., dot(ldir3, norm));
    
    //color
    vec3 primary = vec3(0.0, 0.596, 1.0); //blue
    vec3 secondary = vec3(0.992, 0.867, 0.071); //yellow
    vec3 accent = vec3(0.0, 0.627, 0.322); //green
    
    //동적 색상 변화
    vec2 posXY = pos.xy;
    float variation = sin(posXY.x * 2.0 + posXY.y * 1.5) * 0.15 + 0.9;

    //강도 
    float intensity1 = smoothstep(0.0, 1.0, sh1);
    float intensity2 = smoothstep(0.1, 0.9, sh2);
    float intensity3 = sh3;
    
    //색조합
    vec3 lightColor1 = mix(vec3(0.07), primary * variation, intensity1);
    vec3 lightColor2 = mix(vec3(0.08), secondary, intensity2);
    vec3 lightColor3 = mix(vec3(0.06), accent, intensity3);
    
    vec3 lightingColor = lightColor1 + lightColor2 * 0.7 + lightColor3 * 0.5;
    lightingColor = pow(lightingColor, vec3(0.99)); //감마
    lightingColor = mix(vec3(dot(lightingColor, vec3(0.299, 0.587, 0.114))), lightingColor, 1.1); //채도
    
    //맵핑
    vec3 cam = campos;
    vec3 cam_dir = normalize(pos + shake - cam);
    vec3 ref = reflect(cam_dir, norm);
    vec3 env = textureCube(envmap, ref).rgb;
    
    //최종
    col.rgb = mix(lightingColor, env, 0.35);
    
    gl_FragColor = vec4(col.rgb, 1.0);
  }
  `
}