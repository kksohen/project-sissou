import p5 from "p5";

export const sketch1 = (dimension: {width: number, height: number}, onClear?: (cl: ()=> void) => void) => {
  return(p: p5)=>{
    let pg: p5.Graphics;
    let auto = false;

    let nOffset = 0; //노이즈 오프셋
    let currentX = 0; 
    let xDir = 1; //1: 좌-우, -1: 우-좌
    const xStep = 6;
    let prevYVal: number[] = []; //좌→우로 갈 때 그린 y값 저장

    const leftPalette = ["#6478FF", "#FFFF64", "#6478FF"];
    const rightPalette = ["#6478FF", "#121214", "#6478FF"];

    const clearCanvas = ()=>{
      pg.clear();
      pg.noStroke();
      pg.background("#FFFF64");
      prevYVal = [];
    };

    p.setup = ()=>{
      p.createCanvas(dimension.width, dimension.height);

      pg = p.createGraphics(dimension.width, dimension.height);

      pg.background("#FFFF64");

      if(onClear){
        onClear(clearCanvas);
      }
    };

    p.windowResized = () => {
      const newPg = p.createGraphics(dimension.width, dimension.height);
      newPg.image(pg, 0, 0, dimension.width, dimension.height);
      pg = newPg;

      p.resizeCanvas(dimension.width, dimension.height);
    };

    p.draw = ()=>{
      p.image(pg, 0, 0);

      if(auto){
        const nVal = p.noise(nOffset); 
        const autoY = pg.height / 2 + p.map(nVal, 0, 1, -220, 220); //y값 높낮이 조절

        const index = Math.floor(currentX / xStep);
        
        //좌-우
        if(xDir === 1){
          const prevY = prevYVal[index]; //이전 y값
          brush(currentX, autoY, leftPalette, nOffset, xDir, prevY !== undefined ? prevY : null);
          prevYVal[index] = autoY; //현재 y값 저장
        }else{ //우-좌
          const prevY = prevYVal[index];
          brush(currentX, autoY, rightPalette, nOffset, xDir, prevY);
        };
        
        currentX += xDir * xStep; //x축 이동

        if(currentX >= pg.width){ //끝에 닿으면 방향 전환
          currentX = pg.width;
          xDir = -1;
        }else if(currentX <= 0){
          currentX = 0;
          xDir = 1;
        };

        nOffset += 0.04;
      }
    };

    p.mousePressed=()=>{ 
      //캔버스 위에서 마우스 클릭 시 드로잉 토글
      if(p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height){
        auto = !auto;

        if(auto){
          p.noiseSeed(p.floor(p.random(10000)));
          nOffset = 0;
          currentX = 0;
          xDir = 1;
          //첫 시작에 prevYVal 초기화
          if(prevYVal.length === 0){
            prevYVal = [];
          };
        }
      }
    };

    const brush = (x: number, y: number, palette: string[], nOffset: number, dir: number, prevY: number | null)=>{
      const xNoise = p.noise(nOffset + 100);
      const offsetAmount = 5;
      
      const finalX = Math.round(x + p.map(xNoise, 0, 1, -offsetAmount, offsetAmount));
      const finalY = Math.round(y);

      const brushW = 10;
      const rad = 20;
      const segmentW = Math.round(brushW / 3); //색상별 선 폭
      const overlap = 1; //겹치는 부분 보정

      pg.push();
      pg.noStroke();
      
      if(dir === 1 && prevY !== null){ //처음 그리는 선ㄴ, 좌-우ㅇ
        //겹치는 곳에 흰색 면ㅇ
        const minY = Math.min(finalY, prevY); //위
        const maxY = Math.max(finalY, prevY); //아래
        
        pg.fill("#6478FF");
        pg.rect(finalX - brushW/2, minY, brushW, maxY - minY);
        
        //색상별 선 그리기
        for(let i = 0; i < 3; i++){
          const color = palette[i];
          pg.fill(color);
          
          const segmentX = Math.round(finalX - brushW/2 + i * segmentW);
          
          //클리핑 마스크
          pg.drawingContext.save();
          pg.drawingContext.beginPath();
          pg.drawingContext.rect(segmentX, -rad, segmentW, finalY + rad * 2);
          pg.drawingContext.clip();
          
          pg.rect(segmentX, -overlap, segmentW, minY + overlap); //위 ~ minY
          pg.rect(segmentX, maxY - overlap, segmentW, finalY - maxY + overlap * 2); //maxY ~ finalY
          pg.arc(finalX, finalY, brushW, brushW, 0, p.PI); //아래 둥글게
          
          pg.drawingContext.restore();
        }
      }else if(dir === -1 && prevY !== null){ //처음 그리는 선ㄴ, 우-좌ㅇ
        //겹치는 곳에 검정색 면ㅇ
        const minY = Math.min(finalY, prevY); //위
        const maxY = Math.max(finalY, prevY); //아래
        
        pg.fill("#121214");
        pg.rect(finalX - brushW/2, minY, brushW, maxY - minY);
        
        //색상별 선 그리기
        for(let i = 0; i < 3; i++){
          const color = palette[i];
          pg.fill(color);
          
          const segmentX = Math.round(finalX - brushW/2 + i * segmentW);
          
          //클리핑 마스크
          pg.drawingContext.save();
          pg.drawingContext.beginPath();
          pg.drawingContext.rect(segmentX, -rad, segmentW, finalY + rad * 2);
          pg.drawingContext.clip();
          
          pg.rect(segmentX, -overlap, segmentW, minY + overlap); //위 ~ minY
          pg.rect(segmentX, maxY - overlap, segmentW, finalY - maxY + overlap * 2); //maxY ~ finalY
          pg.arc(finalX, finalY, brushW, brushW, 0, p.PI); //아래 둥글게
          
          pg.drawingContext.restore();
        }
      }else{ //처음 선 그리는 경우
        for(let i = 0; i < 3; i++){
          const color = palette[i];
          pg.fill(color);
          
          const segmentX = Math.round(finalX - brushW/2 + i * segmentW);
          
          //클리핑 마스크
          pg.drawingContext.save();
          pg.drawingContext.beginPath();
          pg.drawingContext.rect(segmentX, -rad, segmentW, finalY + rad * 2);
          pg.drawingContext.clip();
          
          pg.rect(segmentX, -overlap, segmentW, finalY + overlap * 2);
          pg.arc(finalX, finalY, brushW, brushW, 0, p.PI);
          
          pg.drawingContext.restore();
        }
      };
      
      pg.pop();
    };

    p.keyPressed=()=>{
      if(p.key === "x" || p.key === "X" || p.keyCode === 27 || p.keyCode === 46 || p.keyCode === 8){
        clearCanvas();
      }
    };
  }
};