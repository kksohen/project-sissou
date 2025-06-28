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

  setResponsive(width: number, _height: number){
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
    this.logo = logo;
  };

  getLogo(){
    return this.logo;
  };

  initLogo(camera: THREE.Camera){
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

    const randomMeshes = [...meshes]; //원본 복사
    for(let i = randomMeshes.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [randomMeshes[i], randomMeshes[j]] = [randomMeshes[j], randomMeshes[i]];
    };

    randomMeshes.forEach((mesh, i) => {
      this.logoMeshes.push(mesh);
      if(i === 2) this.setLogoInitPos();
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
          this.setLogoInitPos();
        };
      };
    }); */
  };

  private setLogoInitPos(){
    if (!this.logo) return;

    const logoGroup = this.logo as LogoGroup;
    logoGroup.original_rot = this.logo.rotation.clone();
    this.logo.rotation.y = Math.PI * 5.0;
    //modeling 조금만 위로 올림
    this.logo.position.y += 0.0135;

    this.logoMeshes.forEach(mesh => {
      this.setMeshInitPos(mesh);
    });

    this.isLogoSet = true;
  };

  private setMeshInitPos(mesh: LogoMesh){
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

    for(let i = 0; i < sphereCount; i++){
      const sphere = this.createSingleSphere();
      geometries.push(sphere.geometry);
      
      this.logo.add(sphere);
      this.spheres.push(sphere);
    };

    this.isSphereSet = true;
    return geometries;
  };

  private createSingleSphere(){
    const rad = Math.random() * 0.002 + 0.001; //반지름 - radius
    const geom = new THREE.SphereGeometry(rad, 24, 24);
    const mesh = new THREE.Mesh(geom, this.sphereRawMat!);

    const lat = Math.random() * Math.PI; //위도 - 가
    const long = Math.random() * Math.PI * 2; //경도 - 세
    const sphereRad = Math.random() * 0.2;

    const sphere = mesh as Sphere;
    sphere.target_pos = new THREE.Vector3(lat, long, sphereRad);

    mesh.position.set(
      2 * Math.cos(long),
      0,
      2 * Math.sin(long)
    );

    return sphere;
  };

  update(){
    this.updateLogoAni();
    this.updateSphereAni();
  };

  private updateLogoAni(){
    if (!this.isLogoSet || !this.logo) return;

    const logoGroup = this.logo as LogoGroup;
    if (!logoGroup.original_rot) return;

    this.animateLogoRot(logoGroup);

    this.logoMeshes.forEach(mesh => {
      this.animateLogoMesh(mesh);
    });
  };

  private animateLogoRot(logoGroup: LogoGroup){
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

  private updateSphereAni(){
    if (!this.isSphereSet) return;

    this.spheres.forEach(sphere => {
      const targetPos = sphere.target_pos;
      if (!targetPos) return;

      const { x: lat, y: lon, z: sr } = targetPos; //z - sphereRad

      //구 -> 직좌표계 변환
      const targetX = sr * Math.sin(lat) * Math.cos(lon);
      const targetY = sr * Math.sin(lat) * Math.sin(lon);
      const targetZ = sr * Math.cos(lat);

      const currentPos = sphere.position;
      const factor = CONSTANTS.EASING_FACTORS.SPHERE_POSITION; //anime easing

      currentPos.x += (targetX - currentPos.x) * factor;
      currentPos.y += (targetY - currentPos.y) * factor;
      currentPos.z += (targetZ - currentPos.z) * factor;
    });
  };

  updateUniform(camera: THREE.Camera, time: number){
    if (!this.sphereRawMat) return;

    this.sphereRawMat.uniforms.campos.value = [
      camera.position.x,
      camera.position.y,
      camera.position.z
    ];
    this.sphereRawMat.uniforms.time.value = time;
  };

  get isInitialized(){
    return this.isLogoSet;
  };

  dispose(){
    try{
      this.sphereRawMat?.dispose();
      this.spheres.forEach(sphere=>{
        try{
          sphere.geometry.dispose();
        }catch(error){
          console.error(error);
        };
      });

      this.logoMeshes = [];
      this.spheres = [];
      this.logo = null;
      this.sphereRawMat = null;
      this.envMap = null;
      this.isLogoSet = false;
      this.isSphereSet = false;

    }catch(error){
      console.error(error);
    };
  };

  reset(){
    if(!this.isInitialized) return;

    try{
      this.resetShaderUniform();
      this.resetLogoGroup();
      this.resetLogoMeshes();
      this.resetSpheres();
    }catch(error){
      console.error(error);
    };
  };

  private resetShaderUniform(){
    if(!this.sphereRawMat) return;
    this.sphereRawMat.uniforms.time.value = 0;
  };

  private resetLogoGroup(){
    if(!this.logo) return;

    const logoGroup = this.logo as LogoGroup;

    if(logoGroup.original_rot){
      this.logo.rotation.y= Math.PI * 5;
      this.logo.rotation.x = logoGroup.original_rot.x;
      this.logo.rotation.z = logoGroup.original_rot.z;
    };

    this.logo.position.y = 0.0135;
  };

  private resetLogoMeshes(){
    this.logoMeshes.forEach((mesh)=>{
      this.resetSingleLogoMesh(mesh);
    });
  };

  private resetSingleLogoMesh(mesh: LogoMesh){
    if(!mesh.original_pos || !mesh.original_rot) return;

    const { x: cx, y: cy, z: cz } = mesh.original_pos;

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

  private resetSpheres(){
    this.spheres.forEach((sphere)=>{
      this.resetSingleSphere(sphere);
    });
  };

  private resetSingleSphere(sphere: Sphere){
    if(!sphere.target_pos) return;

    const {y: long} = sphere.target_pos;

    sphere.position.set(
      2 * Math.cos(long),
      0,
      2 * Math.sin(long)
    );
  };
}