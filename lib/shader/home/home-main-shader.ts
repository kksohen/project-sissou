export interface Shader{
  vertexShader: string;
  fragmentShader: string;
}

export const home_main_shader : Shader = {
vertexShader: `
  attribute vec3 position;
  
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`,
fragmentShader: `
  uniform vec2 resolution;
  uniform sampler2D scene_buffer;
  uniform sampler2D bck_buffer;
  uniform float time;
  
  #define PI 3.1415
  
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
  
  void main(){
      vec2 uv = gl_FragCoord.xy/resolution.xy;
      vec2 rs = resolution;
      vec4 col = texture2D(scene_buffer, uv); //main logo
      // vec4 bck_col = texture2D(bck_buffer, uv); //background
      //------사방으로 퍼지는 느낌(noise)------
      vec2 nuv = (uv - .5) * rs / rs.y;
      float angle = noise(vec3(nuv * 25., time * .3)) * PI * 2.;
      vec2 tc = (uv - 0.5) * 0.998 + 0.5 + 0.2 * vec2(cos(angle), sin(angle)) / max(rs.x, rs.y);

      vec4 bck_col = texture2D(bck_buffer, tc);
      //------------------------------------
      float logoIntensity = dot(col.rgb, vec3(0.299, 0.587, 0.114));
      float bckIntensity = dot(col.rgb, vec3(0.299, 0.587, 0.114));

      if(logoIntensity > 0.05){ //밝은 부분에 적용, main logo 강조
        vec3 glow =
          texture2D(scene_buffer, uv + vec2(0.002, 0.0)).rgb +
          texture2D(scene_buffer, uv - vec2(0.002, 0.0)).rgb +
          texture2D(scene_buffer, uv + vec2(0.0, 0.002)).rgb +
          texture2D(scene_buffer, uv - vec2(0.0, 0.002)).rgb;
        glow *= 0.25;

        if(bckIntensity < 0.5){ //dark mode 
          col.rgb = col.rgb * 1.3 + glow * 0.3 + bck_col.rgb * 0.05;
          col.rgb = pow(col.rgb, vec3(0.9));
        }else{ //light mode
          col.rgb = max(col.rgb, bck_col.rgb * 0.9995);
        }
      }else{ //bg 잔상
        col.rgb = max(col.rgb, bck_col.rgb * 0.97); 
      };

    gl_FragColor = vec4(col.rgb, 1.0);
  }
`
}