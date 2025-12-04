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
    #define EPSILON 0.0001 //pow(10., -4.)
    #define num_balls 30.
    #define num_wire_points 60.
    #define TIME_OFFSET 600.
    #define PI 3.1415

    //노이즈
    float mod289(float x){
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    vec4 mod289(vec4 x){
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    vec4 perm(vec4 x){
      return mod289(((x * 34.0) + 1.0) * x);
    }
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
    //random
    float random(vec2 p){
      float s = dot(p, vec2(31.1717, 23.7171));
      return fract(sin(s * 13.7887) * 45781.9731);
    }
    float filmGrain(vec2 uv, float time){
      vec2 coord = uv * 10.0;
      return random(coord + fract(time * 0.5)) * 2.0 - 1.0;
    }
    //구
    float sdSphere(vec3 p, float s){
      return length(p) - s;
    }    
    //메타볼
    float smin(float a, float b, float k){
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }
    vec3 rotateX(vec3 p, float angle){
      float c = cos(angle);
      float s = sin(angle);
      return vec3(
        p.x,
        p.y * c - p.z * s,
        p.y * s + p.z * c
      );
    }
    //구 배치, 모션
    float SDF(vec3 p){
      float dP = 100.0;
      float t = time * 0.05; //rot
      
      float majorRadius = 0.25;  
      float minorRadius = 0.15; 

      for(float i = .0; i < num_balls; i++){
        float angle = (i / num_balls) * 2.0 * PI + t;

        vec3 pos = vec3(
          cos(angle) * majorRadius,
          sin(angle) * majorRadius,
          0.0
        );

        float wavePulse = sin(time * 2.0 + angle) * 0.5 + 0.5;

        float individualWave = sin(time * 3.0 + i * 0.5) * 0.001;
        float sphereSize = 0.03 + wavePulse * 0.005 + individualWave;
        
        float blendStrength = 0.005 + wavePulse * 0.03;
                
        float smallSphere = sdSphere(p - pos, sphereSize);
        dP = smin(dP, smallSphere, blendStrength);
      }

      float smallMajorRadius = 0.15;
      
      for(float i = 0.0; i < num_balls; i++){
        float angle = (i / num_balls) * 2.0 * PI + t;

        vec3 pos = vec3(
          cos(angle) * smallMajorRadius,
          sin(angle) * smallMajorRadius,
          0.0
        );
        
        // 45도 회전 적용
        pos = rotateX(pos, PI * 0.15);
        
        // 우측으로 이동
        pos.z += 0.1;
        pos.y += -0.1;

        float wavePulse = sin(time * 2.0 + angle) * 0.5 + 0.5;
        float individualWave = sin(time * 3.0 + i * 0.5) * 0.001;
        float sphereSize = 0.022 + wavePulse * 0.003 + individualWave;
        float blendStrength = 0.004 + wavePulse * 0.02;
                
        float smallSphere = sdSphere(p - pos, sphereSize);
        dP = smin(dP, smallSphere, blendStrength);
      }
      
      for(float i = 0.0; i < num_balls; i++){
        float angle = (i / num_balls) * 2.0 * PI + t;

        vec3 pos = vec3(
          cos(angle) * smallMajorRadius,
          sin(angle) * smallMajorRadius,
          0.0
        );
        
        // -45도 회전 적용
        pos = rotateX(pos, -PI * 0.15);
        
        // 우측으로 이동
        pos.z += -0.1;
        pos.y += -0.1;

        float wavePulse = sin(time * 2.0 + angle) * 0.5 + 0.5;
        float individualWave = sin(time * 3.0 + i * 0.5) * 0.001;
        float sphereSize = 0.022 + wavePulse * 0.003 + individualWave;
        float blendStrength = 0.004 + wavePulse * 0.02;
                
        float smallSphere = sdSphere(p - pos, sphereSize);
        dP = smin(dP, smallSphere, blendStrength);
      }

      for(float i = 0.0; i < num_balls; i++){
        float angle = (i / num_balls) * 2.0 * PI + t;

        vec3 pos = vec3(
          cos(angle) * smallMajorRadius,
          sin(angle) * smallMajorRadius,
          0.0
        );
        
        pos = rotateX(pos, PI * 0.35);
        
        pos.z += 0.15;
        pos.y += -0.2;

        float wavePulse = sin(time * 2.0 + angle) * 0.5 + 0.5;
        float individualWave = sin(time * 3.0 + i * 0.5) * 0.001;
        float sphereSize = 0.022 + wavePulse * 0.003 + individualWave;
        float blendStrength = 0.004 + wavePulse * 0.02;
                
        float smallSphere = sdSphere(p - pos, sphereSize);
        dP = smin(dP, smallSphere, blendStrength);
      }

      for(float i = 0.0; i < num_balls; i++){
        float angle = (i / num_balls) * 2.0 * PI + t;

        vec3 pos = vec3(
          cos(angle) * smallMajorRadius,
          sin(angle) * smallMajorRadius,
          0.0
        );
        
        pos = rotateX(pos, -PI * 0.35);
        
        // 우측으로 이동
        pos.z += -0.2;
        pos.y += -0.2;

        float wavePulse = sin(time * 2.0 + angle) * 0.5 + 0.5;
        float individualWave = sin(time * 3.0 + i * 0.5) * 0.001;
        float sphereSize = 0.022 + wavePulse * 0.003 + individualWave;
        float blendStrength = 0.004 + wavePulse * 0.02;
                
        float smallSphere = sdSphere(p - pos, sphereSize);
        dP = smin(dP, smallSphere, blendStrength);
      }
      
      return dP;
    }
    //ray marching
    vec4 trace(vec3 o, vec3 r){
      float t = 0.0;
      vec3 p = o;
      
      for(int i = 0; i < 14; i++){
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
      
      uv *= 0.7;

      vec3 camera = vec3(0.9, 0.0, 0.3);
      vec3 target = vec3(0.0, 0.0, 0.0);
      vec3 forward = normalize(target - camera);
      vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
      vec3 up = cross(forward, right);

      vec3 ray = normalize(forward + uv.x * right + uv.y * up);
      
      vec4 v = trace(camera, ray);
      
      vec3 bg = vec3(1.0, 1.0, 0.2);
      vec3 col = bg;
      
      if(v.w < 10.0){
        vec3 normal = estimateNormal(v.xyz);
        vec3 newRay = reflect(ray, normal);
        
        float reflectStrength = dot(normal, -ray) * 0.5 + 0.5;
        
        vec3 accentCol = vec3(0.36, 1.0, 0.1);
        vec3 mainCol = vec3(1.0, 0.44, 0.1);
        vec3 botCol = vec3(0.1, 0.86, 1.0);
        
        float colorVar = abs(newRay.x * 3.0);
        vec3 surfaceCol = mix(botCol, accentCol, colorVar);
        
        float accentMix = abs(newRay.y * 4.0) * 0.2;
        surfaceCol = mix(surfaceCol, mainCol, accentMix);

        float specular = pow(reflectStrength, 12.0);
        vec3 whiteHighlight = vec3(1.0, 1.0, 0.7);
        surfaceCol += whiteHighlight * specular * 0.5;
        
        float grain = filmGrain(gl_FragCoord.xy / resolution.xy, time);
        
        float grainStrength = 0.05; 
        surfaceCol += grain * grainStrength;
        
        float fog = 1.0 / (1.0 + pow(v.w, 10.0) * 0.1);
        col = surfaceCol * fog + (1.0 - fog) * bg;
        
        col *= 1.2;
      }
      
      gl_FragColor = vec4(col, 1.0);
    }
  `
}