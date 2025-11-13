import p5 from "p5";

/* p.fill(100, 120, 255);
p.stroke(255, 255, 100);
p.strokeWeight(5);
p.circle(0, 0, size * 4);

p.fill(100, 120, 255);
p.stroke(255, 255, 100);
p.strokeWeight(5);
p.circle(0, 0, size * 2.0); 

p.pop(); */

export const sketch6 = (dimension: {width: number, height: number}) => {
  return (p: p5) => {
    const donuts: {x: number, y: number, size: number}[] = [];
    
    function drawDonut(x: number, y: number, size: number) {
      p.push();
      p.translate(x, y);
      
      p.fill(100, 120, 255);
p.stroke(255, 255, 100);
p.strokeWeight(5);
p.circle(0, 0, size * 4);

p.fill(100, 120, 255);
p.stroke(255, 255, 100);
p.strokeWeight(5);
p.circle(0, 0, size * 2.0); 

p.pop();
    }
    
    p.setup = () => {
      p.createCanvas(dimension.width, dimension.height);
      p.frameRate(60);
    };
    
    p.draw = () => {
      p.background(0);
      
      p.blendMode(p.DIFFERENCE);
      
      // 저장된 모든 도넛 그리기
      for (let i = 0; i < donuts.length; i++) {
        const donut = donuts[i];
        drawDonut(donut.x, donut.y, donut.size);
      }
      
      // 블렌드 모드 원래대로
      p.blendMode(p.BLEND);
    };
    
    // 마우스 클릭 시 새로운 도넛 추가
    p.mousePressed = () => {
      if (p.mouseX >= 0 && p.mouseX <= dimension.width && 
          p.mouseY >= 0 && p.mouseY <= dimension.height) {
        
        const newDonut = {
          x: p.mouseX,
          y: p.mouseY,
          size: p.random(60, 100)
        };
        
        donuts.push(newDonut);
      }
    };
  };
};