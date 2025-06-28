export interface Shader{
  vertexShader: string;
  fragmentShader: string;
}

export const home_bck_shader : Shader = {
vertexShader: `
  attribute vec3 position;
  
  void main(){
    gl_Position = vec4(position, 1.0);
  }
`,
fragmentShader: `
  uniform vec2 resolution;
  uniform sampler2D copy_buffer;
  
  void main(){
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    vec4 col = texture2D(copy_buffer, uv);

    gl_FragColor = col;
  }
`
}