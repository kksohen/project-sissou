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
  
  void main() {
      vec2 uv = gl_FragCoord.xy/resolution.xy;

      vec4 col = texture2D(scene_buffer, uv); //main logo
      vec4 bck_col = texture2D(bck_buffer, uv); //background

      float logoIntensity = dot(col.rgb, vec3(0.299, 0.587, 0.114));
      float bckIntensity = dot(col.rgb, vec3(0.299, 0.587, 0.114));

      if (logoIntensity > 0.05) { //밝은 부분에 적용, main logo 강조
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
          // col.rgb = bck_col.rgb * 0.7;
          // col.rgb = col.rgb + bck_col.rgb * 0.2;
          col.rgb = max(col.rgb, bck_col.rgb * 0.9995);
        }
      } else { //bg 잔상 
        col.rgb = max(col.rgb, bck_col.rgb * 0.99); 
      };

      gl_FragColor = vec4(col.rgb, 1.0);
  }
`
};