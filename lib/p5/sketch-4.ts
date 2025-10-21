import p5 from "p5";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

interface Bullet{
  x: number;
  y: number;
  z: number;
}

export const sketch4 = (dimension: {width: number; height: number }, model?: string)=>{
  return(p: p5)=>{
    let gun: p5.Geometry | null = null;
    let loaded = false;
    let camera: p5.Camera;
    let video: p5.Element | null = null;
    let handLandmark: HandLandmarker | null = null;

    //hand tracking data
    let handDetect = false;
    let handX = 0;
    let handY = 0;
    let handZ = 0;
    let handRotX = 0;
    let handRotY = 0;
    let handRotZ = 0;

    //shooting 
    const bullets: Bullet[] = [];
    let lastShootTime = 0;
    const shootInterval = 300; //발사 간격
    const maxBullets = 30; //최대 총알 수

    //HandLandmarker 초기화
    const initHandTracking = async()=>{
      try{
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        handLandmark = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1,
          //감지 신뢰도
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
      }catch(error){
        console.error("Failed to initialize Hand Landmarker.", error);
      }
    };

    //손가락 접혔는지 확인(접히면 true / 펴지면 false)
    const isFingerCurled = (tip: {x: number, y:number, z:number}, mcp: {x: number, y:number, z:number}, wrist: {x: number, y: number, z: number})=>{
      //손 끝에서 손목까지 3d 직선 거리
      //유클리드 : √((x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²)
      const tipToWrist = Math.sqrt(
        Math.pow(tip.x - wrist.x, 2) +
        Math.pow(tip.y - wrist.y, 2) +
        Math.pow(tip.z - wrist.z, 2)
      );
      //손 마디에서 손목까지 3d 직선 거리
      const mcpToWrist = Math.sqrt(
        Math.pow(mcp.x - wrist.x, 2) +
        Math.pow(mcp.y - wrist.y, 2) +
        Math.pow(mcp.z - wrist.z, 2)
      );

      return tipToWrist < mcpToWrist * 0.9;
    };
    //손가락 펴져있는지 확인
    const isFingerExtended = (tip: {x: number, y:number, z:number}, mcp: {x: number, y:number, z:number}, wrist: {x: number, y: number, z: number})=>{
      
      const tipToWrist = Math.sqrt(
        Math.pow(tip.x - wrist.x, 2) +
        Math.pow(tip.y - wrist.y, 2) +
        Math.pow(tip.z - wrist.z, 2)
      );
      
      const mcpToWrist = Math.sqrt(
        Math.pow(mcp.x - wrist.x, 2) +
        Math.pow(mcp.y - wrist.y, 2) +
        Math.pow(mcp.z - wrist.z, 2)
      );

      return tipToWrist > mcpToWrist * 1.1;
    };

    //총알 발사
    const shoot = ()=>{
      const now = Date.now();
      if(now - lastShootTime < shootInterval) return;
      lastShootTime = now;

      bullets.push({
        x: p.random(-300, 300),
        y: p.random(-200, 200),
        z: p.random(-600, 200)
      });

      if(bullets.length > maxBullets){
        bullets.shift(); //가장 오래된 총알 제거
      }
    };

    //hand tracking 실행
    const runHandTracking =()=>{
      if(!handLandmark || !video) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const videoEl = (video as any).elt as HTMLVideoElement;
      if(!videoEl || videoEl.readyState < 2) return;

      try{
        const now = Date.now();
        const result = handLandmark.detectForVideo(videoEl, now);

        if(result.landmarks && result.landmarks.length > 0 && result.worldLandmarks && result.worldLandmarks.length > 0){
          handDetect = true;

          const wrist = result.landmarks[0][0]; //손목
          const wrist3d = result.worldLandmarks[0][0];

          const indexMcp3d = result.worldLandmarks[0][5];//검지
          const indexTip3d = result.worldLandmarks[0][8];//검지끝

          const middleMcp3d = result.worldLandmarks[0][9];//중지
          const middleTip3d = result.worldLandmarks[0][12];//중지끝

          const thumbCmc3d = result.worldLandmarks[0][1];//엄지
          const thumbTip3d = result.worldLandmarks[0][4];//엄지끝

          const tingMcp3d = result.worldLandmarks[0][13];//약지
          const ringTip3d = result.worldLandmarks[0][16];//약지끝
          const pinkyMcp3d = result.worldLandmarks[0][17];
          const pinkyTip3d = result.worldLandmarks[0][20];//새끼끝

          //화면 좌표계 -> WebGL 좌표계
          handX = p.map(wrist.x, 0, 1, 200, -200);
          handY = p.map(wrist.y, 0, 1, -150, 150);
          handZ = p.map(wrist.z, -0.1, 0.1, -100, 100);

          //손가락 방향
          //검지
          const fingerDirX = indexTip3d.x - wrist3d.x;
          const fingerDirY = indexTip3d.y - wrist3d.y;
          const fingerDirZ = indexTip3d.z - wrist3d.z;
          //엄지
          const thumbDirX = thumbTip3d.x - wrist3d.x;
          const thumbDirY = thumbTip3d.y - wrist3d.y;
          const thumbDirZ = thumbTip3d.z - wrist3d.z;
          //손등(외적)
          const upX = thumbDirY * fingerDirZ - thumbDirZ * fingerDirY;
          const upY = thumbDirZ * fingerDirX - thumbDirX * fingerDirZ;
          const upZ = thumbDirX * fingerDirY - thumbDirY * fingerDirX;

          //정규화
          const upLen = Math.sqrt(upX * upX + upY * upY + upZ * upZ);
          const upXn = upX / upLen;
          const upYn = upY / upLen;
          const upZn = upZ / upLen;
          //webGL 좌표계로 변환
          const fDirX = -fingerDirX;
          const fDirY = -fingerDirY;
          const fDirZ = fingerDirZ;

          const uDirX = -upXn;
          const uDirY = -upYn;
          const uDirZ = upZn;

          //회전각
          handRotY = Math.atan2(fDirX, fDirZ); //y축(좌우)

          handRotX = Math.atan2(fDirY, Math.sqrt(fDirX * fDirX + fDirZ * fDirZ)); //x축(상하)
          
          const upLenXY = Math.sqrt(uDirX * uDirX + uDirY * uDirY);
          handRotZ = Math.atan2(uDirX, uDirY) + Math.atan2(uDirZ, upLenXY) * 0.1; //z축(비틀림)

          //중지, 약지, 새끼 접힘 상태 확인
          const middleCurled = isFingerCurled(middleTip3d, middleMcp3d, wrist3d);
          const ringCurled = isFingerCurled(ringTip3d, tingMcp3d, wrist3d);
          const pinkyCurled = isFingerCurled(pinkyTip3d, pinkyMcp3d, wrist3d);

          const thumbExtended = isFingerExtended(thumbTip3d, thumbCmc3d, wrist3d);
          const indexExtended = isFingerExtended(indexTip3d, indexMcp3d, wrist3d);

          //엄지, 검지 펴지고 나머지들은 접히면 총 쏘기
          if(thumbExtended && indexExtended && middleCurled && ringCurled && pinkyCurled){
            shoot();
          }
          
        }else{
          handDetect = false;
        }
      }catch(error){
        console.error(error);
        handDetect = false;
      }
    };

    p.setup = () => {
      p.createCanvas(dimension.width, dimension.height, p.WEBGL);
      p.pixelDensity(1);
      
      //camera
      camera = p.createCamera();
      camera.setPosition(0, 0, 500);
      camera.lookAt(0, 0, 0);

      //webcam
      video = p.createCapture("video");
      video.size(640, 480);
      video.hide();

      //load model
      if(model){
        p.loadModel(model, true, //normalize
          (model: p5.Geometry) => {
            gun = model;
            loaded = true;
          },
          (error: Event) => {
            console.error("Failed to load model.", error);
          }
        );
      }

      initHandTracking();
    };

    p.draw = () => {
      p.background("#D80016");

      //손 감지
      if(p.frameCount % 2 === 0){
        runHandTracking();
      }

      //lights
      p.ambientLight(100);
      p.directionalLight(255, 255, 255, 0, 0, -1);
      p.pointLight(200, 200, 200, 200, -200, 200);

      //bullets
      p.push();
      p.fill("#000");
      p.noStroke();

      for(const bullet of bullets){
        p.push();
        p.translate(bullet.x, bullet.y, bullet.z);
        p.sphere(28); //bullet size
        p.pop();
      }
      p.pop();
      
      //model
      if(gun && loaded){
        p.push();

        if(handDetect){
          p.translate(handX, handY, handZ);
          p.rotateX(- p.PI / 2);
          p.rotateZ(p.PI / 2);
          
          p.rotateY(handRotX);
          p.rotateZ(handRotY);
          p.rotateX(handRotZ);
        }else{
          p.rotateX(- p.PI / 2);
        }
        //render set
        p.noStroke();
        p.model(gun);

        p.pop();
      }else if(model && !loaded){ //loading...
        p.push();
        p.fill("#121214");
        p.textAlign(p.CENTER, p.CENTER);
        p.text("Loading . . .", 0, 0);
        p.pop();
      }
    };

  };
};