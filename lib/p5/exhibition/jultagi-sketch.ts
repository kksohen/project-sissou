import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import p5 from "p5";

interface rainDrop{
  x: number;
  y: number;
  speed: number;
};

//직선들끼리의 교점 계산식
const intersect = (
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number
)=>{
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if(Math.abs(denom) < 0.0001) return null;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  return{
    x: x1 + t * (x2 - x1),
    y: y1 + t * (y2 - y1)
  }
};

export const jultagiSketch=(dimension: {width: number; height: number;})=>{
  return(p: p5)=>{
    let img: p5.Image;
    let hands: p5.Image;
    let rain: rainDrop[] = [];

    let isReady = false;
    let angle = 0;
    let roll_angle = 0;
    let rollX = 0;

    let video: p5.Element | null = null;
    let handLandmark: HandLandmarker | null = null;
    let handDetect = false;
    let indexTipX = 0; //검지 끝
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

          const indexTip = result.landmarks[0][0]; //손목
          //정규화 좌표 -> 캔버스 변환
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
      if(!handDetect){
        rain = [];
        return;
      };

      p.push();
      p.resetMatrix(); //이미지, 선 등 다른 요소에 영향X

      const max = 12; //빗줄기 최대 개수
      if(p.frameCount % 4 === 0 && rain.length < max){
        rain.push({
          x: indexTipX + p.random(-90, 90),
          y: 0,
          speed: p.random(8, 18)
        });
      }

      rain = rain.filter(dr => dr.y < dimension.height);

      for(const dr of rain){
        p.stroke("#f7f7f9");
        p.strokeWeight(2.5);
        p.line(dr.x, 0, dr.x, dr.y);
        dr.y += dr.speed;
      }

      p.pop();
    };

    p.setup = async()=>{
      p.createCanvas(dimension.width, dimension.height);
      img = await p.loadImage("/assets/images/pomegranate.png");
      hands = await p.loadImage("/assets/images/fingers.png");

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
      
      const baseW = 1545; //반응형

      //bg
      p.noStroke();
      p.fill("#21498e");

      const padding = p.constrain(80 * (dimension.width / baseW), 24, 80);
      p.rect(padding, padding, dimension.width - padding * 2, dimension.height - padding * 2);

      //base hands - bot
      const scale = p.constrain(0.25 * (dimension.width / baseW), 0.05, 0.25);
      const hand2W = hands.width * scale;
      const hand2H = hands.height * scale;
      p.push();
      p.imageMode(p.CENTER);
      p.image(hands, dimension.width / 2, dimension.height - hand2H / 2, hand2W, hand2H);
      p.pop();
      //base hands - top
      p.push();
      p.imageMode(p.CENTER);
      p.translate(dimension.width / 2, hand2H / 2);
      p.scale(1, -1); //y축 반전
      p.image(hands, 0,0, hand2W, hand2H);
      p.pop();

      //seesaw
      const cx = dimension.width / 2;
      const cy = dimension.height / 2;

      if(handDetect){
        //손 위치에 따라 기우는 방향 달라짐
        const normX = p.map(indexTipX, 0, dimension.width, -1, 1);
        //const speed = Math.sin(p.frameCount * 0.007); //속도
        angle = normX * 20;//기울기 20px //Math.pow(speed, 3) * 20; 
      }else{
        angle = 0;
      }

      const leftY = cy - (Math.tan(angle * (Math.PI / 180)) * cx);
      const rightY = cy + (Math.tan(angle * (Math.PI / 180)) * cx);

      const ratio = Math.min(
        dimension.width / img.width,
        dimension.height / img.height
      ) * 0.2;
      const drawW = img.width * ratio;
      const drawH = img.height * ratio;

      //center horizon line
      p.stroke("#f7f7f9");
      p.strokeWeight(2.5);
      // p.line(0, dimension.height / 2, dimension.width, dimension.height / 2);
      p.line(0, leftY, dimension.width, rightY);

      const imgBotX = cx + rollX;
      const imgBotY = cy;
      const spreadX = dimension.width * 2;
      const img_spreadX = dimension.width * 0.5;

      const startX = imgBotX;
      const startY = p.lerp(leftY, rightY, imgBotX / dimension.width);

      //lines
      p.push();
      //교점 3개 계산
      const pt1 = intersect(
        0, leftY, dimension.width, rightY, //직선
        imgBotX, imgBotY, imgBotX - img_spreadX, dimension.height //line 1
      );
      const pt2 = intersect(
        0, leftY, dimension.width, rightY,
        startX, startY, imgBotX - spreadX, dimension.height //line 3
      );
      const pt3 = intersect(
        imgBotX, imgBotY, imgBotX - img_spreadX, dimension.height,
        startX, startY, imgBotX - spreadX, dimension.height //line 3
      );
      //삼각형 채우기
      if(pt1 && pt2 && pt3){
        p.noStroke();
        p.fill("#f7f7f9");
        p.beginShape();
        p.vertex(pt1.x, pt1.y);
        p.vertex(pt2.x, pt2.y);
        p.vertex(pt3.x, pt3.y);
        p.endShape(p.CLOSE);
      }

      //line 1 - img bot 기준
      p.stroke("#f7f7f9");
      p.strokeWeight(1);
      p.line(imgBotX, imgBotY, imgBotX - img_spreadX, dimension.height);
      //line 2 - 직선 기준
      p.line(startX, startY, imgBotX + spreadX * 2, dimension.height);
      //line 3 - 직선 기준
      p.line(startX, startY, imgBotX - spreadX, dimension.height);
      p.pop();

      rollX = angle * 8;
      roll_angle = angle * 0.3;

      p.noStroke();
      p.imageMode(p.CENTER);
      //선 기울기
      p.push();
      p.translate(cx, cy);
      p.rotate(angle * (Math.PI / 180));
      //이미지 회전
      p.translate(rollX, -drawH / 2); //y fix
      p.rotate(roll_angle);
      // p.image(img, dimension.width / 2, dimension.height / 2 - drawH / 2, drawW, drawH);
      p.image(img, 0, 0, drawW, drawH);
      p.pop();

      //hand tracking
      if(p.frameCount % 3 === 0) runTracking();
      drawHand();
    };
  }
}