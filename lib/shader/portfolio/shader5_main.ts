export interface Shader{
  vertexShader: string;
  fragmentShader: string;
}

export const shader5_main : Shader = {
  vertexShader: `
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    
    attribute vec3 position;
    attribute vec4 color;
    
    void main(){
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;

    #define bigness 0.1
    #define EPSILON pow(10., -4.)
    #define num_balls 30.
    #define TIME_OFFSET 600.
    #define PI 3.1415

    float sdSphere(vec3 p, float s){
      return length(p)-s;
    }

    float smin(float a, float b, float k){
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }

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

    float SDF(vec3 p){
      float dP = 100.0;
      float t = 0.0;
      
      float radius = 0.18;
      float helixLength = 0.7;
      float turns = 4.;
      
      for(float i = num_balls; i < num_balls * 2.0; i++){
        float progress = (i - num_balls) / num_balls;
        float angle = progress * turns * 2.0 * PI + t;
        float xPos = (progress - 0.5) * helixLength;
        
        vec3 pos = vec3(
          xPos,
          cos(angle) * radius,
          sin(angle) * radius
        );
                
        float smallSphere = sdSphere(p - pos, 0.04);
        dP = smin(dP, smallSphere, 0.05);
      }
      
      return dP;
    }
    
    vec4 trace(vec3 o, vec3 r){
      float t = 0.0;
      vec3 p = o;
      
      for(int i = 0; i < 20; i++){
        p = o + r * t;
        float d = SDF(p);
        t += d * 1.0;
      }
      
      return vec4(p, t);
    }
    
    vec3 estimateNormal(vec3 p){
      return normalize(vec3(
        SDF(vec3(p.x + EPSILON, p.y, p.z)) - SDF(vec3(p.x - EPSILON, p.y, p.z)),
        SDF(vec3(p.x, p.y + EPSILON, p.z)) - SDF(vec3(p.x, p.y - EPSILON, p.z)),
        SDF(vec3(p.x, p.y, p.z + EPSILON)) - SDF(vec3(p.x, p.y, p.z - EPSILON))
      ));
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec2 rs = resolution;
      uv = (uv - 0.5) * rs / rs.y;
            
      vec3 camera = vec3(0.35, 0.3, .35);
      vec3 target = vec3(0.0, 0.0, 0.0);
      vec3 forward = normalize(target - camera);
      vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
      vec3 up = cross(forward, right);

      vec3 ray = normalize(forward + uv.x * right + uv.y * up);
      
      vec4 v = trace(camera, ray);
      
      vec3 background = vec3(1.0, 1.0, 0.2);
      vec3 col = background;
      
      if(v.w < 10.0){
        vec3 normal = estimateNormal(v.xyz);
        vec3 newRay = reflect(ray, normal);
        
        // 반사 강도 계산
        float reflectStrength = dot(normal, -ray) * 0.5 + 0.5;
        
        vec3 lightCol1 = vec3(0.4, 1.0, 0.1); 
        vec3 lightCol2 = vec3(1.0, 0.7, 0.1);  
        vec3 accentCol = vec3(0.1, 0.5, 1.0);
        
        float colorVar = abs(sin(newRay.x * 3.0)); // abs로 항상 양수
        vec3 surfaceCol = mix(lightCol1, lightCol2, colorVar);
        
        // accentCol 혼합 강도 줄임
        float accentMix = abs(sin(newRay.y * 4.0)) * 0.2; // 0.3 -> 0.2로 감소
        surfaceCol = mix(surfaceCol, accentCol, accentMix);
        
        surfaceCol = mix(surfaceCol, vec3(1.0, 0.9, 0.3), reflectStrength * 0.2);
        
        surfaceCol = max(surfaceCol, vec3(0.3, 0.5, 0.1));
        
        float fog = 1.0 / (1.0 + pow(v.w, 10.0) * 0.1);
        col = surfaceCol * fog + (1.0 - fog) * background;
        
        // 밝기 부스트
        col *= 1.2;
      }
      
      gl_FragColor = vec4(col, 1.0);
    }
  `
}