import React, { useEffect, useRef, useState } from "react";

interface ParticleProps{
  containerRef: React.RefObject<HTMLDivElement | null>;
  selected: string | null;
  currentBG: string;  
};

//random particle
interface Particle{
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
};

//random position 생성(container 내 전체 영역 사용ㅇ)
const getRandomPos = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

const MAX_PARTICLES = 25;

export default function Particle({containerRef, selected, currentBG}: ParticleProps){
  const [particle, setParticle] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);

  const createParticle =()=>{
    if(!containerRef.current) return;
    
    const container = containerRef.current;
    const width = window.innerWidth;
    const height = container.offsetHeight;
    // const rect = containerRef.current.getBoundingClientRect();
    
    const size = Math.random() * 32 + 8; //8~40px size
    const rad = size / 2;
    const padding = 20; //container 밖으로 나가는 것 방지
    
    const newParticle: Particle = {
      id: particleIdRef.current++,
      x: getRandomPos(rad + padding, width - rad - padding),
      y: getRandomPos(rad + padding, height - rad - padding),
      size,
      color: currentBG
    };

    setParticle(prev => {
      const update = [...prev, newParticle]
      
      if(update.length > MAX_PARTICLES){
        return update.slice(update.length - MAX_PARTICLES);
      }

      return update;
    });

    setTimeout(()=>{
      setParticle(prev => prev.filter(p => p.id !== newParticle.id));
    }, 2000);
  };

  useEffect(()=>{
    if(!selected){
      setParticle([]);
      return;
    };

    const interval = setInterval(()=>{
      createParticle();
    }, 200);

    return()=> clearInterval(interval);
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, currentBG]);

  return(
    <div className="absolute inset-0 pointer-events-none">
      {particle.map(p => (
        <div key={p.id}
        className="absolute rounded-full"
        style={{
          left: `${p.x}px`,
          top: `${p.y}px`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          background: p.color,
          transform: `translate(-50%, -50%)`, //중심 기준으로 위치
        }}/>
      ))}
    </div>
  );
}