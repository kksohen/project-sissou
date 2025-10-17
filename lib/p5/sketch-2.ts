import p5 from "p5";

export const sketch2 = (dimension: {width: number, height: number}, onClear?: (cl: ()=> void) => void) => {
  return(p: p5)=>{
    const colors: string[] = [];
    let pg: p5.Graphics;

    const clearCanvas = ()=>{
      pg.clear();
      pg.background("#121214");
    };

    p.setup = () => {
      p.createCanvas(dimension.width, dimension.height);

      pg = p.createGraphics(dimension.width, dimension.height); //화면 리사이즈 시에도 캔버스 유지
      p.background("#121214");

      colors.push("#c60001", "#e86f20", "#e9a005", "#14742d", "#234779", "#65311b", "#fc7da8", "#754e91");

      if(onClear){
        onClear(clearCanvas);
      }
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
        
        while(count < 8){ //빠르게 사각형 그림
          brush();
          count++;
        };
      }
    };

    const brush = () => {
      const c = p.random(colors); //random color
      const col = p.color(c);
      const alpha = p.random(100, 255);
      col.setAlpha(alpha);

      const x = p.randomGaussian(p.mouseX, 20); //사각형 범위
      const y = p.randomGaussian(p.mouseY, 20);
      const s = p.random(0.05, 8); //사각형 크기

      pg.noStroke();
      pg.fill(col);
      
      //만다라(만화경)
      pg.rect(x, y, s, s); //사각형: x, y, w, h
      pg.rect(pg.width - x, y, s, s); //좌우 반전
      pg.rect(x, pg.height - y, s, s); //상하
      pg.rect(pg.width - x, pg.height - y, s, s); //대각선
    };

    //canvas 지우기(초기화) - x, esc, delete, backspace
    p.keyPressed=()=>{
      if(p.key === "x" || p.key === "X" || p.keyCode === 27 || p.keyCode === 46 || p.keyCode === 8){
        clearCanvas();
      }
    };
  }
};