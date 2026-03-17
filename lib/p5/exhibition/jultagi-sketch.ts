import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import p5 from "p5";

export const jultagiSketch=(dimension: {width: number; height: number;})=>{
  return(p: p5)=>{
    let img: p5.Image;
    let isReady = false;
    let angle = 0;
    let roll_angle = 0;
    let rollX = 0;

    let video: p5.Element | null = null;
    let handLandmark: HandLandmarker | null = null;
    let handDetect = false;
    let indexTipX = 0; //검지 끝
    let indexTipY = 0;

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

    //face, hand tracking 실행
    const runTracking =()=>{
      if(!handLandmark || !video) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const videoEl = (video as any).elt as HTMLVideoElement;
      if(!videoEl || videoEl.readyState < 2) return;

      try{
        const now = Date.now();
        const result = handLandmark.detectForVideo(videoEl, now);

        if(result.landmarks && result.landmarks.length > 0){
          handDetect = true;

          const indexTip = result.landmarks[0][8]; //검지 끝
          //검지 끝 정규화 좌표 -> 캔버스 변환
          indexTipX = p.map(indexTip.x, 0, 1, dimension.width, 0); //좌우반전
          indexTipY = p.map(indexTip.y, 0, 1, 0, dimension.height);

        }else{
          handDetect = false;
        }
      }catch(error){
        console.error(error);
        handDetect = false;
      }
    };

    const drawHand=()=>{
      if(!handDetect) return;

      p.push();
      p.resetMatrix(); //이미지, 선 등 다른 요소에 영향X
      p.fill("#f7f7f9");
      p.noStroke();
      p.circle(indexTipX, indexTipY, 20);
      p.pop();
    };

    p.setup = async()=>{
      p.createCanvas(dimension.width, dimension.height);
      img = await p.loadImage("/assets/images/pomegranate.png");

      video = p.createCapture("video");
      video.size(dimension.width, dimension.height);
      video.hide();

      setTimeout(async()=>{
        await initHandTracking();
        isReady = true;
      }, 500);
    };

    p.draw = ()=>{
      p.background(0);
      if(!isReady) return;

      //bg
      p.noStroke();
      p.fill("#21498e");
      p.rect(40, 40, dimension.width - 80, dimension.height - 80);

      //시소
      const speed = Math.sin(p.frameCount * 0.007); //속도
      angle = Math.pow(speed, 3) * 20; //기울기 20px
      const cx = dimension.width / 2;
      const cy = dimension.height / 2;

      const leftY = cy - (Math.tan(angle * (Math.PI / 180)) * cx);
      const rightY = cy + (Math.tan(angle * (Math.PI / 180)) * cx);

      //center horizon line
      p.stroke("#f7f7f9");
      p.strokeWeight(2.5);
      //p.line(0, dimension.height / 2, dimension.width,  dimension.height / 2);
      p.line(0, leftY, dimension.width,  rightY);
      
      const ratio = Math.min(
        dimension.width / img.width,
        dimension.height / img.height
      ) * 0.2;
      const drawW = img.width * ratio;
      const drawH = img.height * ratio;

      rollX = angle * 8;
      roll_angle = angle * 0.3;

      p.noStroke();
      p.imageMode(p.CENTER);
      //선 기울기
      p.translate(cx, cy);
      p.rotate(angle * (Math.PI / 180));
      //이미지 회전
      p.translate(rollX, -drawH / 2); //y fix
      p.rotate(roll_angle);
      //p.image(img, dimension.width / 2, dimension.height / 2 - drawH / 2, drawW, drawH);
      p.image(img, 0, 0, drawW, drawH);

      //hand tracking
      if(p.frameCount % 3 === 0) runTracking();
      drawHand();
    };
  }
}