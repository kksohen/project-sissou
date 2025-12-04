export interface Shader{
  vertexShader: string;
  fragmentShader: string;
}

export const shader4_bck : Shader = {
  vertexShader: `
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    
    attribute vec3 position;
    
    void main(){
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
  `,
  fragmentShader: `
    uniform vec2 resolution;
    uniform float time;
    uniform sampler2D copy_buffer;

    //S자 쌍곡 탄젠트(Hyperbolic Tangent)
    //tanh(x) = (e^(2x) - 1) / (e^(2x) + 1)
    float tanh(float x){ 
      float ex = exp(2.0 * x);
      return (ex - 1.0) / (ex + 1.0);
    }

    //터널 경로 position
    vec3 pathPos(float z){
      return vec3(
        tanh(cos(z * 0.15) * 1.0) * 8.0, //x
        tanh(cos(z * 0.12) * 1.0) * 8.0, //y
        z //z(깊이)
      );
    }
    //터널 단면
    float mapTunnel(vec3 p){
      vec3 offset = p - pathPos(p.z);
      float angle = atan(offset.y, offset.x);
      float distortion = sin(p.z * 3.0 + time) * 0.1;
      float hex = 1.5 + cos(angle * 3.0) * 0.2 + distortion;
      return hex - length(offset.xy);
    }

    //rotate
    mat2 rot(float a){
      return mat2(cos(a), -sin(a), sin(a), cos(a));
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      
      vec4 o = texture2D(copy_buffer, uv);
      
      //tunnel = displayMode2
      if(o.a < 1.0){
        o.a = 1.0;
        
        vec2 u = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;
        
        float travelDist = sin(time * 0.3) * 12.0; //터널 왕복
        vec3 cameraPos = pathPos(travelDist);
        
        vec3 forwardDir = normalize(pathPos(travelDist + 1.0) - cameraPos); //전방
        vec3 rightDir = normalize(vec3(forwardDir.z, 0.0, -forwardDir.x));
        
        vec2 rotUV = rot(tanh(sin(cameraPos.z * 0.01) * 3.0) * 0.3) * u; //터널 속에서 둥글게 회전ㅇ
        vec3 rayDir = normalize(rightDir * rotUV.x + cross(rightDir, forwardDir) * rotUV.y + forwardDir * 1.0);
        
        //ray marching
        float totalDist = 0.0;
        float stepSize = 0.002;
        
        for(int i = 0; i < 20; i++){
          vec3 pos = cameraPos + rayDir * totalDist;
          stepSize = mapTunnel(pos) * 0.8;
          totalDist += stepSize;

          if(stepSize < 0.001 || totalDist > 15.0) break;
        }
        
        vec3 hitPos = cameraPos + rayDir * totalDist; //충돌 지점 = 시작점 + 방향 * 거리
        
        //3d -> 2d 좌표 변환ㅇ
        vec2 textUV = hitPos.xy / (4.0 + sin(time + hitPos.z * 0.1) * 2.0);
        
        vec3 col = texture2D(copy_buffer, textUV).rgb;
        col /= (totalDist / 2.0); //fog 원근감(perspective)
        
        o.rgb = col;
      }
      
      //CRT 모니터 효과
      float scanline = step(0.5, fract(gl_FragCoord.y * 0.5));
      o.rgb *= mix(0.97, 1.0, scanline);
      
      gl_FragColor = vec4(o.rgb, 1.0);
    }
  `
}