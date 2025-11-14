import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import p5 from "p5";

export const sketch6 = (dimension: {width: number, height: number}) => {
  return (p: p5) => {
    let video: p5.Element | null = null;
    let isInit = false;
    //grid settings
    const cols = 40; //열
    const rows = 20; //행
    const colW: number[] = [];
    const rowH: number[] = [];
    //hand tracking data
    let handLandmark: HandLandmarker | null = null;
    let handDetect = false;
    let indexTipX = 0; //검지 끝
    let indexTipY = 0;
    //fisheye
    const max = 100;
    const min = 4;
    const falloff = 10; //효과 강도
    const easing = 0.07;

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

    //hand tracking 실행
    const runTracking =()=>{
      if(!handLandmark || !video) return;

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const videoEl = (video as any).elt as HTMLVideoElement;
      if(!videoEl || videoEl.readyState < 2) return;

      if(videoEl.paused || videoEl.currentTime === 0) return;

      try{
        const now = performance.now();
        const handResult = handLandmark.detectForVideo(videoEl, now);

        if(handResult.landmarks && handResult.landmarks.length > 0){
          handDetect = true;

          const hand = handResult.landmarks[0];
          const indexTip = hand[8]; //검지 끝

          //검지 끝 정규화 좌표 -> 캔버스 변환
          indexTipX = p.map(indexTip.x, 0, 1, dimension.width, 0); //좌우반전
          indexTipY = p.map(indexTip.y, 0, 1, 0, dimension.height);
        }else{
          handDetect = false;
        };

      }catch(error){
        console.error(error);
        handDetect = false;
      }
    };
    
    p.setup = () => {
      const canvas = p.createCanvas(dimension.width, dimension.height);
      canvas.style("filter", "contrast(1.2) brightness(0.98)");
      p.pixelDensity(1);

      //webcam
      video = p.createCapture("video");
      video.size(640, 480);
      video.hide();

      //grid cleanup
      for(let i = 0; i <= cols; i++){
        colW[i] = dimension.width / cols;
      }

      for(let i = 0; i <= rows; i++){
        rowH[i] = dimension.height / rows;
      }

      setTimeout(async()=>{
        await initHandTracking();
        isInit = true;
      }, 1000); //1s
    };
    
    p.draw = () => {
      p.background("#121214");

      if(!video) return;

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const videoEl = (video as any).elt as HTMLVideoElement;
      if(!videoEl || videoEl.readyState < 2){ //loading...
        p.fill("#f7f7f9");
        p.textSize(28);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(". . .", dimension.width / 2, dimension.height / 2);
        return;
      }

      if(isInit && p.frameCount % 5 === 0){ //트래킹 주기 조절 - 성능 최적화
        runTracking(); 
      }

      //fisheye - grid
      if(handDetect){
        //열 col 너비 계산
        const colWeights: number[] = [];
        let totalCol = 0;

        for(let c = 0; c < cols; c++){
          const center = (c + 0.5) * (dimension.width / cols); //각 열의 중심점 x
          const dist = Math.abs(indexTipX - center) / (dimension.width / 2); //검지 끝 - 열 중심 정규화 거리(0~1)
          let weight = max * Math.pow(1 - p.constrain(dist, 0, 1), falloff); //검지 근처일수록 열 확대, 멀수록 축소
          weight = p.constrain(weight, min, max);
          colWeights.push(weight);
          totalCol += weight;
        }
        //정규화
        const colScale = dimension.width / totalCol;
        for(let c = 0; c < cols; c++){
          const target = colWeights[c] * colScale; //각 열의 목표 너비
          colW[c] = p.lerp(colW[c], target, easing);
        }

        //행 row 높이 계산
        const rowWeights: number[] = [];
        let totalRow = 0;

        for(let r = 0; r < rows; r++){
          const center = (r + 0.5) * (dimension.height / rows);
          const dist = Math.abs(indexTipY - center) / (dimension.height / 2);
          let weight = max * Math.pow(1 - p.constrain(dist, 0, 1), falloff);
          weight = p.constrain(weight, min, max);
          rowWeights.push(weight);
          totalRow += weight;
        }

        const rowScale = dimension.height / totalRow;
        for(let r = 0; r < rows; r++){
          const target = rowWeights[r] * rowScale;
          rowH[r] = p.lerp(rowH[r], target, easing);
        }
      }else{ //손 감지 못할 시 기존으로 복원
        for(let c = 0; c < cols; c++){
          const target = dimension.width / cols;
          colW[c] = p.lerp(colW[c], target, easing);
        }

        for(let r = 0; r < rows; r++){
          const target = dimension.height / rows;
          rowH[r] = p.lerp(rowH[r], target, easing);
        }
      }

      //draw grid - pixelate
      let y = 0;

      for(let r = 0; r < rows; r++){
        let x = 0;

        for(let c = 0; c < cols; c++){ //웹캠 좌우반전
          const sx = (cols - 1 - c) * (videoEl.videoWidth / cols); 
          const sy = r * (videoEl.videoHeight / rows);
          const sw = videoEl.videoWidth / cols;
          const sh = videoEl.videoHeight / rows;
          //캔버스에 그릴 위치, 크기
          const dx = x;
          const dy = y;
          const dw = colW[c];
          const dh = rowH[r];
          
          p.image(video, dx, dy, dw, dh, sx, sy, sw, sh);
          
          p.stroke("#f7f7f9");
          p.strokeWeight(0.5);
          p.noFill();

          p.rect(dx, dy, dw, dh);

          x += colW[c];
        }
        y += rowH[r];
      }

      //grid 위치 계산
      y = 0;
      const yPos = [0];
      for(let r = 0; r < rows; r++){
        y += rowH[r];
        yPos.push(y);
      }

      let x = 0;
      const xPos = [0];
      for(let c = 0; c < cols; c++){
        x += colW[c];
        xPos.push(x);
      }

      //다이아몬드 모양 만들기
      p.fill("#f7f7f9");
      p.noStroke();

      for(const yp of yPos){
        for(const xp of xPos){
          const size = 6; //크기
          const thickness = 2; //두께
          
          //top
          p.beginShape();
          p.vertex(xp, yp - size);
          p.vertex(xp - thickness, yp);
          p.vertex(xp + thickness, yp);
          p.endShape(p.CLOSE);
          //bottom
          p.beginShape();
          p.vertex(xp, yp + size);
          p.vertex(xp - thickness, yp);
          p.vertex(xp + thickness, yp);
          p.endShape(p.CLOSE);
          //left
          p.beginShape();
          p.vertex(xp - size, yp);
          p.vertex(xp, yp - thickness);
          p.vertex(xp, yp + thickness);
          p.endShape(p.CLOSE);
          //right
          p.beginShape();
          p.vertex(xp + size, yp);
          p.vertex(xp, yp - thickness);
          p.vertex(xp, yp + thickness);
          p.endShape(p.CLOSE);
        }
      }
    };
    
  };
};