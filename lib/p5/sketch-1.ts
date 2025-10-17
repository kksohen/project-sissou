import p5 from "p5";

export const sketch1 = (dimension: {width: number, height: number}, onClear?: (cl: ()=> void) => void) => {
  return(p: p5)=>{
    const leftColors: string[] = [];
    const rightColors: string[] = [];
    let pg: p5.Graphics;

    let prevMouseX = 0, prevMouseY = 0;

    //clear canvas
    const clearCanvas = ()=>{
      pg.clear();
      pg.noStroke();

      pg.fill("#f7f7f9");
      pg.rect(0, 0, pg.width/2, pg.height);

      pg.fill("#121214");
      pg.rect(pg.width/2, 0, pg.width/2, pg.height);
    };

    p.setup = () => {
      p.createCanvas(dimension.width, dimension.height);

      pg = p.createGraphics(dimension.width, dimension.height); //화면 리사이즈 시에도 캔버스 유지

      //bg color
      //left
      pg.noStroke();
      pg.fill("#f7f7f9");
      pg.rect(0, 0, pg.width/2, pg.height);
      //right
      pg.fill("#121214");
      pg.rect(pg.width/2, 0, pg.width/2, pg.height);

      leftColors.push("#F3ECC3", "#c60001", "#121214");
      rightColors.push("#c60001", "#234779", "#f7f7f9");

      if(onClear){
        onClear(clearCanvas);
      }

      prevMouseX = p.mouseX;
      prevMouseY = p.mouseY;
    };

    p.windowResized = () => {
      const newPg = p.createGraphics(dimension.width, dimension.height); //버퍼 복사
      newPg.image(pg, 0, 0, dimension.width, dimension.height);
      pg = newPg;

      p.resizeCanvas(dimension.width, dimension.height);
    };

    p.draw = () => {
      p.image(pg, 0, 0);

      if(p.mouseIsPressed){ //mouse press 시
        let count = 0;
        
        while(count < 5){
          brush();
          count++;
        };
      }

      prevMouseX = p.mouseX;
      prevMouseY = p.mouseY;
    };

    const brush = () => {
      //캔버스 중앙 찾기
      const centerX = pg.width / 2;
      const centerY = pg.height / 2;

      //마우스 속도
      const speed = p.dist(p.mouseX, p.mouseY, prevMouseX, prevMouseY);
      
      //물감 튀김 정도
      const splatter = p.map(speed, 0, 40, 20, 60);
      
      //물감 방울
      const x = p.randomGaussian(p.mouseX, splatter * 0.2);
      const y = p.randomGaussian(p.mouseY, splatter * 0.2);
      
      //물감 방울 크기
      const size = p.random(1, 8) + speed * 0.2;
      
      //color
      const originColor = x < centerX ? p.random(leftColors) : p.random(rightColors);
      const mirrorColor = x < centerX ? p.random(rightColors) : p.random(leftColors);
      
      //물감 opacity
      const alpha = p.random(100, 255);

      //데칼코마니
      const mirrorX = centerX + (centerX - x); //좌우 반전
      const mirrorY = centerY + (centerY - y); //상하 반전

      pg.noStroke();
      
      //left
      const leftC = p.color(originColor);
      leftC.setAlpha(alpha);
      pg.fill(leftC);
      //타원
      const w = size * p.random(0.1, 1.8);
      const h = size * p.random(0.1, 1.8);
      const angle = p.random(p.TWO_PI);
      
      pg.push();
      pg.translate(x, y);
      pg.rotate(angle);
      pg.ellipse(0, 0, w, h);
      pg.pop();
      
      //right
      const rightC = p.color(mirrorColor);
      rightC.setAlpha(alpha);
      pg.fill(rightC);

      pg.push();
      pg.translate(mirrorX, mirrorY);
      pg.rotate(-angle);
      pg.ellipse(0, 0, w, h);
      pg.pop();

      //물감 튀김(작은 입자)
      if(speed > 5){
        for(let i = 0; i < 3; i++){
          const splatterX = x + p.randomGaussian(0, splatter);
          const splatterY = y + p.randomGaussian(0, splatter);
          const splatterSize = p.random(1, 4);
          
          const mirrorSplatterX = centerX + (centerX - splatterX);
          const mirrorSplatterY = centerY + (centerY - splatterY);
          
          const splatterAlpha = p.random(50, 150);
          
          //left
          const leftSplatter = p.color(originColor);
          leftSplatter.setAlpha(splatterAlpha);
          pg.fill(leftSplatter);
          pg.ellipse(splatterX, splatterY, splatterSize, splatterSize);
          //right
          const rightSplatter = p.color(mirrorColor);
          rightSplatter.setAlpha(splatterAlpha);
          pg.fill(rightSplatter);
          pg.ellipse(mirrorSplatterX, mirrorSplatterY, splatterSize, splatterSize);
        }
      }

      //물감 흘러내림
      if(p.random(1) < 0.2){
        const dripLength = p.random(4, 28);
        const dripThickness = p.random(1, 3);
        
        pg.strokeWeight(dripThickness);
        
        const dripC = p.color(originColor);
        dripC.setAlpha(alpha * 0.8);
        pg.stroke(dripC);
        pg.line(x, y, x + p.random(-5, 5), y + dripLength);
        
        const dripMirrorC = p.color(mirrorColor);
        dripMirrorC.setAlpha(alpha * 0.8);
        pg.stroke(dripMirrorC);
        pg.line(mirrorX, mirrorY, mirrorX + p.random(-5, 5), mirrorY + dripLength);
      }
    };

    //canvas 지우기(초기화) - x, esc, delete, backspace
    p.keyPressed=()=>{
      if(p.key === "x" || p.key === "X" || p.keyCode === 27 || p.keyCode === 46 || p.keyCode === 8){
        clearCanvas();
      }
    };
  }
};