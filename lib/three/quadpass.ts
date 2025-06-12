import * as THREE from "three";

interface QuadPassParams {
  renderer: THREE.WebGLRenderer;
  pixel_density?: number;
  buffer_param?: THREE.RenderTargetOptions;
  shader: {
    vertexShader: string;
    fragmentShader: string;
  };
  uniforms: { [uniform: string]: THREE.IUniform };
};

export class QuadPass {
  renderer: THREE.WebGLRenderer;
  pixel_density: number;
  buffer_param: THREE.RenderTargetOptions;
  shader: {
    vertexShader: string;
    fragmentShader: string;
  };
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  buffer: THREE.WebGLRenderTarget;
  material: THREE.RawShaderMaterial;
  quad_geometry: THREE.PlaneGeometry;
  quad: THREE.Mesh;
  uniforms: { [uniform: string]: THREE.IUniform };

  constructor(params: QuadPassParams) {
    this.renderer = params.renderer;
    this.shader = params.shader;

    this.pixel_density = params.pixel_density ?? this.renderer.getPixelRatio();

    this.buffer_param = params.buffer_param ?? {
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    };

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.buffer = new THREE.WebGLRenderTarget(
      window.innerWidth * this.pixel_density,
      window.innerHeight * this.pixel_density,
      this.buffer_param
    );
    this.buffer.texture.wrapS = THREE.RepeatWrapping;
    this.buffer.texture.wrapT = THREE.RepeatWrapping;

    params.uniforms.resolution = {
      value: [
        window.innerWidth * this.pixel_density,
        window.innerHeight * this.pixel_density
      ]
    };

    params.shader.vertexShader =
      "precision mediump float;\nprecision mediump int;\nuniform vec2 resolution;\n" +
      params.shader.vertexShader;

    params.shader.fragmentShader =
      "precision mediump float;\nprecision mediump int;\nuniform vec2 resolution;\n" +
      params.shader.fragmentShader;

    this.material = new THREE.RawShaderMaterial({
      vertexShader: params.shader.vertexShader,
      fragmentShader: params.shader.fragmentShader,
      uniforms: params.uniforms
    });

    this.uniforms = this.material.uniforms;

    this.quad_geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    this.quad = new THREE.Mesh(this.quad_geometry, this.material);

    this.scene.add(this.quad);
  };

  resize() {
    this.buffer.setSize(
      window.innerWidth * this.pixel_density,
      window.innerHeight * this.pixel_density
    );
    this.material.uniforms.resolution.value = [
      window.innerWidth * this.pixel_density,
      window.innerHeight * this.pixel_density
    ];
  };

  render(renderToScreen: boolean = false) {
    this.renderer.setRenderTarget(renderToScreen ? null : this.buffer);
    this.renderer.render(this.scene, this.camera);
  };
  dispose() {
    this.buffer.dispose();
    this.material.dispose();
    this.quad_geometry.dispose();
    
    this.scene.remove(this.quad);
  };
};