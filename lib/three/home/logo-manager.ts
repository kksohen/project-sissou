import * as THREE from 'three';
import { home_raw_shader } from '@/lib/shader/home/home-shader';
import { CONSTANTS } from '@/lib/constants';
import { LogoGroup, LogoMesh, Sphere } from '../three-types';

export class LogoManager{
  private logo: LogoGroup | null = null;
  private logoMeshes: LogoMesh[] = [];
  private spheres: Sphere[] = [];
  private sphereRawMat: THREE.RawShaderMaterial | null = null;
  private envMap: THREE.CubeTexture | null = null;
  private isLogoSet = false;
  private isSphereSet = false;

  setResponsiveScale(width: number, _height: number){
    if(!this.logo) return;

    //화면 크기에 따른 로고 크기 조정
    let scale = 1;

    if(width < 409){
      scale = 0.4;
    }else if(width < 566){
      scale = 0.5;
    }else if(width < 769){
      scale = 0.6;
    }else if(width < 961){
      scale = 0.7;
    }else if(width < 1025){
      scale = 0.8;
    }else{
      scale = 1;
    };

    this.logo.scale.setScalar(scale);
  };

  setEnvMap(envMap: THREE.CubeTexture){
    this.envMap = envMap;
    if(this.sphereRawMat){
      this.sphereRawMat.uniforms.envmap.value = envMap;
    };
  };

  setLogo(logo: THREE.Group){
    this.logo = logo as LogoGroup;
  };

  getLogo(): LogoGroup | null {
    return this.logo;
  };

  initializeLogo(camera: THREE.Camera): THREE.RawShaderMaterial|null{
    if (!this.logo) return null;

    //create shader material
    this.sphereRawMat = new THREE.RawShaderMaterial({
      uniforms: {
        envmap: { value: this.envMap },
        time: { value: 0 },
        campos: { value: [
          camera.position.x,
          camera.position.y,
          camera.position.z
        ]}
      },
      vertexShader: home_raw_shader.vertexShader,
      fragmentShader: home_raw_shader.fragmentShader,
      transparent: true,
    });

    if (!this.sphereRawMat) return null;

    this.processLogoMeshes();
    
    return this.sphereRawMat;
  };

  private processLogoMeshes(){
    if (!this.logo || !this.sphereRawMat) return;

    //mesh animation random.ver
    const meshes: LogoMesh[] = [];

    this.logo.traverse((obj)=>{
      if((obj as THREE.Mesh).isMesh){
        const mesh = obj as LogoMesh;
        mesh.material = this.sphereRawMat!;
        meshes.push(mesh);
      };
    });

    const randomMeshes = [...meshes];
    for (let i = randomMeshes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomMeshes[i], randomMeshes[j]] = [randomMeshes[j], randomMeshes[i]];
    };

    randomMeshes.forEach((mesh, i) => {
      this.logoMeshes.push(mesh);
      if(i === 2) this.setLogoInitialPositions();
    });

    //mesh animation [0,1,2]
    /* let meshCount = 0;
    this.logo.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as LogoMesh;
        mesh.material = this.sphereRawMat!;
        meshCount++;
        this.logoMeshes.push(mesh);
        
        if (meshCount === 2) { //1st 먼저 등장
          this.setLogoInitialPositions();
        };
      };
    }); */
  };

  private setLogoInitialPositions(){
    if (!this.logo) return;

    const logoGroup = this.logo as LogoGroup;
    logoGroup.original_rot = this.logo.rotation.clone();
    this.logo.rotation.y = Math.PI * 5.0;
    //modeling 조금만 위로 올림
    this.logo.position.y += 0.0135;

    this.logoMeshes.forEach(mesh => {
      this.setMeshInitialPosition(mesh);
    });

    this.isLogoSet = true;
  };

  private setMeshInitialPosition(mesh: LogoMesh){
    const { x: cx, y: cy, z: cz } = mesh.position;

    mesh.original_pos = new THREE.Vector3(cx, cy, cz);
    mesh.original_rot = mesh.rotation.clone();

    const dir = new THREE.Vector2(cx, cz).normalize();

    mesh.position.set(
      cx + CONSTANTS.LOGO_RADIUS * dir.x,
      cy,
      cz + CONSTANTS.LOGO_RADIUS * dir.y
    );

    mesh.rotation.set(
      Math.PI * 2.0 * Math.random(),
      0,
      Math.PI * 2.0 * Math.random()
    );
  };

  createSpheres(): THREE.BufferGeometry[]{
    if (!this.logo || !this.sphereRawMat) return [];

    const geometries: THREE.BufferGeometry[] = [];
    const sphereCount = CONSTANTS.SPHERE_COUNT;

    for (let i = 0; i < sphereCount; i++) {
      const sphere = this.createSingleSphere();
      geometries.push(sphere.geometry);
      
      this.logo.add(sphere);
      this.spheres.push(sphere);
    };

    this.isSphereSet = true;
    return geometries;
  };

  private createSingleSphere(): Sphere{
    const rad = Math.random() * 0.002 + 0.001;
    const geom = new THREE.SphereGeometry(rad, 24, 24);
    const mesh = new THREE.Mesh(geom, this.sphereRawMat!);

    const lat = Math.random() * Math.PI;
    const long = Math.random() * Math.PI * 2;
    const sphereRad = Math.random() * 0.2;

    const sphereWithProps = mesh as Sphere;
    sphereWithProps.target_pos = new THREE.Vector3(lat, long, sphereRad);

    mesh.position.set(
      2 * Math.cos(long),
      0,
      2 * Math.sin(long)
    );

    return sphereWithProps;
  };

  update(){
    this.updateLogoAnimation();
    this.updateSphereAnimation();
  };

  private updateLogoAnimation(){
    if (!this.isLogoSet || !this.logo) return;

    const logoGroup = this.logo as LogoGroup;
    if (!logoGroup.original_rot) return;

    this.animateLogoRotation(logoGroup);

    this.logoMeshes.forEach(mesh => {
      this.animateLogoMesh(mesh);
    });
  };

  private animateLogoRotation(logoGroup: LogoGroup){
    const originalRot = logoGroup.original_rot!;
    const currentRot = this.logo!.rotation;

    currentRot.x += (originalRot.x - currentRot.x) * CONSTANTS.EASING_FACTORS.LOGO_ROTATION;
    currentRot.y += (originalRot.y - currentRot.y) * CONSTANTS.EASING_FACTORS.LOGO_ROTATION;
    currentRot.z += (originalRot.z - currentRot.z) * CONSTANTS.EASING_FACTORS.LOGO_ROTATION;
  };

  private animateLogoMesh(mesh: LogoMesh){
    const originalPos = mesh.original_pos;
    const originalRot = mesh.original_rot;
    
    if (!originalPos || !originalRot) return;

    //pos
    const currentPos = mesh.position;
    currentPos.x += (originalPos.x - currentPos.x) * CONSTANTS.EASING_FACTORS.MESH_POSITION;
    currentPos.y += (originalPos.y - currentPos.y) * CONSTANTS.EASING_FACTORS.MESH_POSITION;
    currentPos.z += (originalPos.z - currentPos.z) * CONSTANTS.EASING_FACTORS.MESH_POSITION;
    //rot
    const currentMeshRot = mesh.rotation;
    currentMeshRot.x += (originalRot.x - currentMeshRot.x) * CONSTANTS.EASING_FACTORS.MESH_ROTATION;
    currentMeshRot.y += (originalRot.y - currentMeshRot.y) * CONSTANTS.EASING_FACTORS.MESH_ROTATION;
    currentMeshRot.z += (originalRot.z - currentMeshRot.z) * CONSTANTS.EASING_FACTORS.MESH_ROTATION;
  };

  private updateSphereAnimation(){
    if (!this.isSphereSet) return;

    this.spheres.forEach(sphere => {
      const targetPos = sphere.target_pos;
      if (!targetPos) return;

      const { x: lat, y: lon, z: sr } = targetPos;

      const targetX = sr * Math.sin(lat) * Math.cos(lon);
      const targetY = sr * Math.sin(lat) * Math.sin(lon);
      const targetZ = sr * Math.cos(lat);

      const currentPos = sphere.position;
      const factor = CONSTANTS.EASING_FACTORS.SPHERE_POSITION;

      currentPos.x += (targetX - currentPos.x) * factor;
      currentPos.y += (targetY - currentPos.y) * factor;
      currentPos.z += (targetZ - currentPos.z) * factor;
    });
  };

  updateUniforms(camera: THREE.Camera, time: number){
    if (!this.sphereRawMat) return;

    this.sphereRawMat.uniforms.campos.value = [
      camera.position.x,
      camera.position.y,
      camera.position.z
    ];
    this.sphereRawMat.uniforms.time.value = time;
  };

  getMaterial(): THREE.RawShaderMaterial | null {
    return this.sphereRawMat;
  };

  get isInitialized(): boolean {
    return this.isLogoSet;
  };

  get isSpheresInitialized(): boolean {
    return this.isSphereSet;
  };

  getLogoMeshes(): LogoMesh[] {
    return this.logoMeshes;
  };

  getSpheres(): Sphere[] {
    return this.spheres;
  };

  dispose() {
    this.sphereRawMat?.dispose();
    this.logoMeshes = [];
    this.spheres = [];
    this.logo = null;
    this.sphereRawMat = null;
    this.envMap = null;
    this.isLogoSet = false;
    this.isSphereSet = false;
  };
}