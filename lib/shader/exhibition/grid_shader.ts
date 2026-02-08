export interface Shader{
  vertexShader: string;
  fragmentShader: string;
}

export const grid_shader : Shader = {
  vertexShader: `
    precision mediump float;
    precision mediump int;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    attribute vec3 position;
    attribute vec2 uv;

    varying vec2 vUv;
    
    void main(){
      vUv = uv;
      vec3 pos = position;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
    }
  `,
  fragmentShader: `
    precision mediump float;
    precision mediump int;

    varying vec2 vUv;

    uniform vec2 resolution;
    uniform vec2 planeSize;
    uniform float time;
    uniform sampler2D source;
    uniform float gridCount;

    #define PI 3.1415

    void main(){
      //grid count
      float horizon = gridCount; //w = 6
      float vertical = gridCount + 1.; //h = 7
      
      float grid_y = vUv.y * vertical;
      float grid_id_y = floor(grid_y);
      if(grid_id_y == 0. || grid_id_y == vertical - 1.){
        horizon = gridCount * 3.;
      }else if(grid_id_y == 3.){
        horizon = gridCount / 2.;
      }else if(grid_id_y == 1. || grid_id_y == 5.){
        horizon = gridCount * 2.;
      }

      vec2 grid_uv = vec2(vUv.x * horizon, grid_y);
      vec2 grid_id = floor(grid_uv);
      vec2 cell_uv = fract(grid_uv);

      //그리드 중앙
      vec2 center = vec2(horizon * 0.5, vertical * 0.5);
      vec2 dir = vec2(grid_id.x, grid_id_y) - center;//grid_id - center; //방향
      float dist = length(dir); //거리
      vec2 normal_dir = dist > 0.0 ? dir / dist : vec2(0.0); //정규화
      
      //animation 타이밍
      float speed = 4.;
      float half_cycle = PI / speed;
      float freeze = 0.7; //freeze frame
      float single_cycle = half_cycle + freeze;
      float full_cycle = single_cycle * 3.0;
      float end_freeze = 2.2;

      float total_cycle = full_cycle + end_freeze;
      float cycle = mod(time, total_cycle);//min(time, full_cycle); //ani 동작 끝
      //float cycle = mod(time, full_cycle); //loop
      
      //animation - tile
      float ani = 0.0;
      vec2 offset = vec2(0.0);
      if(cycle < half_cycle){ //1st 동작 - h축
        ani = -abs(sin(cycle * speed)) * 5.;
        offset = vec2(0.0, normal_dir.y * ani);
      }else if(cycle < single_cycle){ //1st freezing
        offset = vec2(0.0);

      }else if(cycle < single_cycle + half_cycle){ //2nd 동작 - w축
        float ani_time = cycle - single_cycle;
        ani = -abs(sin(ani_time * speed)) * 3.5;
        offset = vec2(normal_dir.x * ani, 0.0);
      }else if(cycle < single_cycle * 2.0){ //2nd freezing
        offset = vec2(0.0);

      }else if (cycle < single_cycle * 2.0 + half_cycle){ //3rd 동작 - 대각선(w+h)
        float ani_time = cycle - single_cycle * 2.0;
        ani = -abs(sin(ani_time * speed)) * 3.5;
        offset = normal_dir * ani;
      }else{ //3rd freezing
        offset = vec2(0.0);
      }

      //최종
      vec2 sample_uv = vec2(
        (grid_id.x + cell_uv.x + offset.x) / horizon,
        (grid_id_y + cell_uv.y + offset.y) / vertical
      );

      sample_uv = clamp(sample_uv, 0.0, 1.0);
      
      vec4 color = texture2D(source, sample_uv);
      
      //경계선
      float border = 0.01;
      float bx = border * (horizon / gridCount);
      float by = border * (vertical / gridCount + 1.);
      if(cell_uv.x < bx || cell_uv.x > 1.0 - bx ||
      cell_uv.y < by || cell_uv.y > 1.0 - by){
        color.rgb = vec3(0.102);
      }
      
      gl_FragColor = color;
    }
  `
}