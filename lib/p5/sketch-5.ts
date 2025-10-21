import p5 from "p5";
import { FaceLandmarker, FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

interface Tear{
  x: number;
  y: number;
  speed: number;
  text: string;
  stretchProgress: number; //늘어나는 정도(0~1)
  stretchDirection: number; //늘어나는 방향(1: 늘어남, -1: 원래대로)
}

export const sketch5 = (dimension: {width: number; height: number })=>{
  return(p: p5)=>{
    let video: p5.Element | null = null;
    let handLandmark: HandLandmarker | null = null;
    let faceLandmark: FaceLandmarker | null = null;
    let customFont: p5.Font | null = null;
    let isInit = false;
    //hand tracking data
    let handDetect = false;
    //face tracking data
    let faceDetect = false;
    let leftEyeX = 0;
    let leftEyeY = 0;
    let rightEyeX = 0;
    let rightEyeY = 0;
    let indexTipX = 0; //검지 끝
    let indexTipY = 0;
    let prevIndexY = 0; //이전 프레임의 검지Y 위치
    //tears
    const tears: Tear[] = [];
    const texts = ["T", "E", "A", "R", "S"];
    let lastTearTime = 0;
    let textIndex = 0;
    const tearInterval = 200;
    const maxTears = 20;

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

    //FaceLandmarker 초기화
    const initFaceTracking = async()=>{
      try{
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        faceLandmark = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numFaces: 1,
          //감지 신뢰도
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
      }catch(error){
        console.error("Failed to initialize Face Landmarker.", error);
      }
    };

    //2d 직선 거리
    //유클리드 : √((x₂-x₁)² + (y₂-y₁)²)
    const calcDist = (
      p1: {x: number, y:number}, 
      p2: {x: number, y:number}
    )=>{
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    //얼굴 크기 따라 threshold 보정
    const calcFaceSize=()=>{
      if(!faceDetect) return 70; //70px

      const faceW = Math.abs(leftEyeX - rightEyeX);
      return faceW * 0.6; //눈 사이 거리 60%
    };

    //얼굴, 손 인식해서 눈물 제스처 감지
    const tearGesture =()=>{
      if(!faceDetect || !handDetect) return false;

      const distToLeftEye = calcDist(
        {x: indexTipX, y: indexTipY},
        {x: leftEyeX, y: leftEyeY}
      );
      const distToRightEye = calcDist(
        {x: indexTipX, y: indexTipY},
        {x: rightEyeX, y: rightEyeY}
      );

      const threshold = calcFaceSize();

      //검지가 눈 밑 70px 이내 위치하는지
      const isUnderEye = distToLeftEye < threshold || distToRightEye < threshold;
      //검지가 눈보다 아래에 있는지
      const isBelowEyes = indexTipY > Math.min(leftEyeY, rightEyeY);
      //검지가 아래로 움직이는지
      const isMovingDown = indexTipY - prevIndexY > 0.5;

      return isUnderEye && isBelowEyes && isMovingDown;
    };

    //눈물 생성
    const createTear = ()=>{
      const now = Date.now();
      if(now - lastTearTime < tearInterval) return;
      lastTearTime = now;

      const distToLeft = calcDist(
        {x: indexTipX, y: indexTipY},
        {x: leftEyeX, y: leftEyeY}
      );
      const distToRight = calcDist(
        {x: indexTipX, y: indexTipY},
        {x: rightEyeX, y: rightEyeY}
      );

      //오,왼 눈 中 눈밑-검지가 더 가까운 편에 눈물 생성
      const eyeX = distToLeft < distToRight ? leftEyeX : rightEyeX;
      const eyeY = distToLeft < distToRight ? leftEyeY : rightEyeY;

      tears.push({
        x: eyeX + p.random(-10, 10),
        y: eyeY,
        speed: p.random(2, 4),
        text: texts[textIndex],
        stretchProgress: 0,
        stretchDirection: 1
      });

      textIndex = (textIndex + 1) % texts.length; //텍스트 순서대로 순환ㅇ

      if(tears.length > maxTears){
        tears.shift(); //가장 오래된 눈물 제거
      }
    };

    //face, hand tracking 실행
    const runTracking =()=>{
      if(!handLandmark || !video || !faceLandmark) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const videoEl = (video as any).elt as HTMLVideoElement;
      if(!videoEl || videoEl.readyState < 2) return;

      if(videoEl.paused || videoEl.currentTime === 0) return;

      try{
        const now = performance.now();
        //face
        const faceResult = faceLandmark.detectForVideo(videoEl, now);

        if(faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0){
          faceDetect = true;

          const face = faceResult.faceLandmarks[0];
          const leftEye = face[159]; //왼쪽 눈
          const rightEye = face[386]; //오른쪽 눈

          //정규화 좌표 -> 캔버스 변환
          leftEyeX = p.map(leftEye.x, 0, 1, dimension.width, 0); //좌우반전
          leftEyeY = p.map(leftEye.y, 0, 1, 0, dimension.height);
          rightEyeX = p.map(rightEye.x, 0, 1, dimension.width, 0); //좌우반전
          rightEyeY = p.map(rightEye.y, 0, 1, 0, dimension.height);
        }else{
          faceDetect = false;
        }
        //hand
        const handResult = handLandmark.detectForVideo(videoEl, now);

        if(handResult.landmarks && handResult.landmarks.length > 0){
          handDetect = true;

          const hand = handResult.landmarks[0];
          const indexTip = hand[8]; //검지 끝

          prevIndexY = indexTipY;

          //검지 끝 정규화 좌표 -> 캔버스 변환
          indexTipX = p.map(indexTip.x, 0, 1, dimension.width, 0); //좌우반전
          indexTipY = p.map(indexTip.y, 0, 1, 0, dimension.height);
        }else{
          handDetect = false;
        }

        if(tearGesture()){
          createTear();
        }
      }catch(error){
        console.error(error);
        handDetect = false;
        faceDetect = false;
      }
    };

    p.setup = async() => {
      const canvas = p.createCanvas(dimension.width, dimension.height);
      canvas.style("border-radius", "50%");
      canvas.style("overflow", "hidden");
      canvas.style("filter", "contrast(1.2) brightness(0.98)");
      p.pixelDensity(1);

      try{
        customFont = await p.loadFont("/assets/fonts/Fungal-Grow700Thickness500.ttf");
        p.textFont(customFont);
      }catch(error){
        console.error("Failed to load font.", error);
      }

      //webcam
      video = p.createCapture("video");
      video.size(640, 480);
      video.hide();

      setTimeout(async()=>{
        await initFaceTracking();
        await initHandTracking();
        isInit = true;
      }, 1000); //1s
    };

    p.draw = () => {
      p.background("#121214");
      
      if(video){ //웹캠 좌우반전
        p.push();
        p.translate(dimension.width, 0);
        p.scale(-1, 1);
        p.image(video, 0, 0, dimension.width, dimension.height);
        p.pop();
      }

      if(!isInit){
        p.fill("#f7f7f9");
        p.textSize(28);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(". . .", dimension.width / 2, dimension.height / 2);
        return;
      };

      if(p.frameCount % 5 === 0){ //트래킹 주기 조절 - 성능 최적화
        runTracking(); 
      }

      //눈물 그리기
      p.textSize(28);
      p.textAlign(p.CENTER, p.CENTER);

      for(let i = tears.length - 1; i >= 0; i--){ //뒤에서부터 눈물 제거ㅇ
        const tear = tears[i];
        tear.y += tear.speed;

        //글자 늘어나는 애니
        const speed = tear.stretchDirection === 1 ? 0.02 : 0.017;
        tear.stretchProgress += speed * tear.stretchDirection;

        //늘어남 방향 제어
        if(tear.stretchProgress >= 1){ //최대로 늘어났다가 줄어들게ㅇ
          tear.stretchProgress = 1;
          tear.stretchDirection = -1;
        }
        if(tear.stretchProgress <= 0){ //원래대로
          tear.stretchProgress = 0;
          tear.stretchDirection = 0;
        }

        const easing = tear.stretchProgress < 0.5 ? 
        2 * tear.stretchProgress * tear.stretchProgress : 
        1 - Math.pow(-2 * tear.stretchProgress + 2, 2) / 2;

        const maxStretch = 4; //최대 늘어나는 정도
        const stretchScale = 1 + (maxStretch - 1) * easing;

        p.push();
        p.translate(tear.x, tear.y);
        p.scale(1, stretchScale);

        p.fill("#0098FF");
        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.text(tear.text, 0, 0);
        p.pop();

        if(tear.y > dimension.height){ //화면 밖으로 나가면 제거
          tears.splice(i, 1);
        }
      }
    };

  };
};