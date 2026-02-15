export const gradShaderVert = `
#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;

void main(){
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = positionVec4;
}
`;

export const gradShaderFrag = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform sampler2D image;
uniform vec2 mouse;
uniform float pixel_density;

void main(){
  /* vec2 uv = gl_FragCoord.xy / (resolution.xy * pixel_density);
  vec2 tc = uv;
  tc.y = 1.0 - tc.y;
  vec2 rs = resolution;
  
  uv = (uv - 0.5) * rs / rs.y;
  vec2 ms = (mouse - 0.5) * rs / rs.y;
  
  float dst = length(uv - ms);
  // dst = smoothstep(0., 0.1, dst - .01);
  // dst = 1.0 - dst;
  float sh = smoothstep(0.0, 0.1, dst - 0.0);
  float off = (1.0 - sh) * 20.0;
  sh = max(0.1, sh);
  
  float sc = sh;
  tc = (tc - 0.5) * sh + 0.5;
  
  vec4 col = texture2D(image, tc);
  col.r = texture2D(image, tc + vec2(off/rs.x,.0)).r;
  col.b = texture2D(image, tc + vec2(0.,off/rs.y)).b;
  
  gl_FragColor = col; */
  vec2 uv = gl_FragCoord.xy/ (resolution.xy * pixel_density);
  vec2 rs = resolution;
  
  float dst = length(uv - mouse); //픽셀 - 마우스 사이의 거리
  dst = smoothstep(0., 0.1, dst - .01); //0.01 미만 0, 0.11 이상 1 부드럽게 변화
  dst = 1.0 - dst; //마우스에 가까울수록 커짐(반전)

  float off = dst * 20.0; //마우스에 가까울수록 더 큰 offset

  //돋보기 효과
  vec2 m_dir = mouse - uv; //uv 좌표를 마우스 방향으로 이동
  uv += normalize(m_dir) * dst * 0.05; //왜곡 강도(최대 5%)

  uv.y = 1.0 - uv.y; //텍스처 좌표는 y축이 반전되어 있어서 보정
  
  vec4 col = texture2D(image, uv);
  col.r = texture2D(image, uv + vec2(off/rs.x, 0.0)).r;
  col.b = texture2D(image, uv + vec2(0.0, off/rs.y)).b;
  
  gl_FragColor = col;
}
`;