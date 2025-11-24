export interface Shader{
  vertexShader: string;
  fragmentShader: string;
}

export const shader4_main : Shader = {
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
    uniform sampler2D main_buffer;

    #define PI 3.1415
    
    float displayTime = 1.3;

    //noise
    float hash1(vec2 p){
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    vec2 hash2(vec2 p){
      float k = 6.283185307 * hash1(p);
      return vec2(cos(k), sin(k));
    }
    float noise2(in vec2 p){
      const float K1 = 0.366025404;
      const float K2 = 0.211324865;
      vec2 i = floor(p + (p.x + p.y) * K1);
      vec2 a = p - i + (i.x + i.y) * K2;
      float m = step(a.y, a.x); 
      vec2 o = vec2(m, 1.0 - m);
      vec2 b = a - o + K2;
      vec2 c = a - 1.0 + 2.0 * K2;
      vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
      vec3 n = h * h * h * vec3(dot(a, hash2(i + 0.0)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
      return dot(n, vec3(32.99));
    }
    float pnoise(vec2 uv){
      float f = 0.0;
      mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
      f  = 0.5000 * noise2(uv); uv = m * uv;
      f += 0.2500 * noise2(uv); uv = m * uv;
      f += 0.1250 * noise2(uv); uv = m * uv;
      f += 0.0625 * noise2(uv);
      f = 0.5 + 0.5 * f;
      return f;
    }

    //random
    float rand(float n){
      return fract(cos(n * 89.42) * 343.42);
    }
    float rMix(float a, float b, float s){
      s = rand(s);
      return s > 0.9 ? sin(a): //사인
            s > 0.8 ? sqrt(abs(a)): //제곱
            s > 0.7 ? pow(abs(a), 0.7): //거듭제곱
            s > 0.5 ? a + b: //덧셈
            s > 0.6 ? a - b: //뺄셈
            s > 0.4 ? b - a: //역뺄셈
            s > 0.3 ? b / (a == 0.0 ? 0.01 : a): //나눗셈
            s > 0.2 ? a / (b == 0.0 ? 0.01 : b): //역나눗셈
            s > 0.1 ? a * b: //곱셈
            s > 0.1 ? tan(a * 0.5): //탄젠트
            cos(a); //코사인
    }

    //colors
    vec3 hsl2rgb(in vec3 c){
      vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
      return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
    }
    vec3 fhexRGB(float fh){
      fh = abs(fh * 10000000.0);
      float r = fract(fh / 65536.0);
      float g = fract(fh / 256.0);
      float b = fract(fh / 16777216.0);
      return hsl2rgb(vec3(r, g, b));
    }
    vec3 addColor(float num, float seed, float alt, int palette){
      if(palette == 7){
        return fhexRGB(num);
      }
      
      if(palette > 2 || (palette == 1 && rand(seed + 19.0) > 0.3)){
        float sat = 1.0;
        if(num < 0.0){ 
          sat = 1.0 - (1.0 / (abs(num) + 1.0)); 
        }
        
        float light = 1.0 - (1.0 / (abs(num) + 1.0));
        light = max(light, 0.2);
        
        vec3 col = hsl2rgb(vec3(fract(abs(num)), sat, light));
        if(palette == 1){ 
          col *= 2.0; 
        }
        
        return col;
      }
      vec3 col = vec3(fract(abs(num)), 1.0 / num, 1.0 - fract(abs(num)));
      if(rand(seed * 2.0) > 0.5){ 
        col = col.gbr; 
      }
      if(rand(seed * 3.0) > 0.5){ 
        col = col.gbr; 
      }
      if(palette == 1){ 
        col += (1.0 + cos(rand(num) + vec3(4.0, 2.0, 1.0))) / 2.0; 
      }

      return col;
    }
    vec3 sanitize(vec3 dc){
      return clamp(abs(dc), 0.0, 1.0);
    }

    //math library
    float getValue(float idx, float x, float y){
      int i = int(idx);
      if(i == 0) return 1.0;
      if(i == 1) return 15.0;
      if(i == 2) return x;
      if(i == 3) return y;
      if(i == 4) return x * x; //포물선 - 좌우
      if(i == 5) return y * y; //포물선 - 상하
      if(i == 6) return x * x * x;
      if(i == 7) return y * y * y;
      if(i == 8) return x * x * x * x;
      if(i == 9) return y * y * y * y;
      if(i == 10) return x * y * x;
      if(i == 11) return y * y * x;
      if(i == 12) return sin(y); //파동 - 수평
      if(i == 13) return cos(y);
      if(i == 14) return sin(x); //파동 - 수직
      if(i == 15) return cos(x);
      if(i == 16) return sin(x) * cos(y);
      if(i == 17) return length(vec2(x, y));
      if(i == 18) return 2.0;
      if(i == 19) return distance(vec2(x, y), vec2(0.0)); //원형 그라디언트
      if(i == 20) return PI;
      if(i == 21) return atan(x, y) * 4.0; //방사형
      if(i == 22) return pnoise(vec2(x, y) / 2.0);
      if(i == 23) return pnoise(vec2(y, x) * 15.0);
      return 0.0;
    }

    void main(){
      //좌표 중앙
      vec2 uv = gl_FragCoord.xy / resolution.y;
      uv.x -= 0.5 * resolution.x / resolution.y;
      uv.y -= 0.5;
      
      float seed = floor(time / displayTime);
      
      int displayMode = int(floor(3.0 * rand(seed + 77.0)));
      int palette = int(floor(8.0 * rand(seed + 66.0)));
      
      float zoom = 4.0;

      if(displayMode == 1){
        zoom += (1.5 * (sin(time) + 1.0));
      } else {
        zoom += (3.0 * (sin(time) + 1.0));
      }
      
      vec2 guv = uv * zoom;
      float x = guv.x;
      float y = guv.y;
      
      vec3 col = vec3(0.0);
      float cn = 1.0; //색상 개수
      
      float total = 0.0;
      float sub = 0.0;
      
      int iterations = 15 + int(floor(rand(seed * 6.6) * 15.0)); //반복 횟수 15 ~ 29
      
      for(int i = 0; i < 30; i++){
        if(i >= iterations) break;

        //getValue 중 하나씩 실행ㅇ
        float index1 = floor(24.0 * rand(seed + float(i)));
        float index2 = floor(24.0 * rand(seed + float(i + 5)));
        //수학함수 * 시간진동(-1 ~ 1) * 랜덤스케일(0 ~ 1)
        float val1 = getValue(index1, x, y) * (sin(time * rand(seed + float(i))) * rand(seed + float(i)));
        float val2 = getValue(index2, x, y) * (sin(time * rand(seed + float(i))) * rand(seed + float(i + 5)));
        
        if(rand(seed + float(i + 3)) > rand(seed)){
          sub = sub == 0.0 ? 
          rMix(val1, val2, seed + float(i + 4)) : 
          rMix(sub, rMix(val1, val2, seed + float(i + 4)), seed + float(i));
        }else{
          sub = sub == 0.0 ? val1 : rMix(sub, val1, seed + float(i));
        }
        
        if(rand(seed + float(i)) > rand(seed) / 2.0){
          total = total == 0.0 ? sub : rMix(total, sub, seed + float(i * 2)); //total에 값 있을 시 total + sub
          sub = 0.0; //초기화 후 새로운 계산ㅇ
          
          if(rand(seed + float(i + 30)) > rand(seed)){
            // col += addColor(total, seed + float(i), getValue(21.0, x, y), palette);
            col += addColor(total, seed + float(i), 0.0, palette);
            cn += 1.0;
          }
        }
      }
      
      total = sub == 0.0 ? total : rMix(total, sub, seed); //sub에 값 있을 시 sub + total
      // col += addColor(total, seed, getValue(21.0, x, y), palette);
      col += addColor(total, seed, 0.0, palette);
      col /= cn;
      
      if(palette < 3){
        col /= (3.0 * (0.5 + rand(seed + 13.0)));
      }
      if(palette == 4){
        col = pow(col, 1.0 / max(col, 0.01)) * 1.5;
      }
      if(palette == 2 || palette == 5){
        col = hsl2rgb(col);
      }
      if(palette == 6){
        col = hsl2rgb(hsl2rgb(col));
        if(rand(seed + 17.0) > 0.5){ 
          col = col.gbr; 
        }
        if(rand(seed + 19.0) > 0.5){ 
          col = col.gbr; 
        }
      }
      
      col = sanitize(col);
      float threshold = 0.15;
      if(col.r < threshold && col.g < threshold && col.b < threshold){
        col = vec3(0.0);
      }
      col = vec3(col.g, col.b, col.r);
      col = (col * (0.8 * col + 0.08)) / (col * (0.8 * col + 0.4) + 0.008);
      //채도
      float gray = (col.r + col.g + col.b) / 3.0;
      vec3 diff = col - vec3(gray);
      col = vec3(gray) + diff * 1.6;
      //밝기
      col *= 1.3;
      //대비
      col = (col - 0.5) * 0.8 + 0.5;
      col = clamp(col, 0.0, 1.0);
      
      //displayMode 3가지 출력
      if(displayMode == 1){ //마스크 + 잔상
        vec2 checkUV = uv + vec2(0.18, 0.2);
        
        //이전 프레임
        vec2 offset = vec2(-1.0, -1.0) / resolution.xy;
        vec3 old = texture2D(main_buffer, gl_FragCoord.xy / resolution.xy + offset).rgb * 0.98;

        //잔상 마스크 영역
        if(abs(checkUV.x) > 0.30 || abs(checkUV.y) > 0.5){
          col = vec3(0.0);
        }
        
        //alpha
        float alpha = (col.r + col.g + col.b) / 3.0;
        alpha = alpha < 0.5 ? 0.0 : //투명 
                alpha < 0.7 ? (alpha - 0.5) * 5.0 : //0 ~ 1 
                1.0; //불투명
        
        //잔상 블렌딩
        col = mix(old, col, alpha);
        
        gl_FragColor = vec4(col, 1.0);
      }else{//반투명
        float alpha = displayMode == 2 ? 0.5 : 1.0; //mode2 = 반투명 / mode0 = 불투명
        gl_FragColor = vec4(col, alpha);
      }
    }
  `
}