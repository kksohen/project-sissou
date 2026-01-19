"use client";
import { useEffect, useState } from "react";

export default function Clock(){
  const [time, setTime] = useState(new Date()); 

  useEffect(()=>{
    const timer = setInterval(()=> setTime(new Date()), 1000);
    return ()=> clearInterval(timer);
  }, []);

  //시계 반대로 돌리기
  const hours = -((time.getHours() % 12) * 30 + time.getMinutes() * 0.5);
  const minutes = -(time.getMinutes() * 6);
  const seconds = -(time.getSeconds() * 6);
  
  return(
    <div className="flex justify-center items-center w-full h-full">
      <svg width="80%" height="80%" viewBox="0 0 200 200">
        {/* 시간 눈금 */}
        {[...Array(12)].map((_, i)=>{
          const angle = i * 30;
          return(
            <line key={i}
            x1="100"
            y1="20"
            x2="100"
            y2="32"
            stroke="currentColor"
            strokeWidth="2"
            transform={`rotate(${angle} 100 100)`}/>
          );
        })}
        {/* 시침 */}
        <line x1="100" y1="110" x2="100" y2="65"
        stroke="currentColor"
        strokeWidth="2"
        transform={`rotate(${hours} 100 100)`}/> 
        {/* 분침 */}
        <line x1="100" y1="110" x2="100" y2="35"
        stroke="currentColor"
        strokeWidth="2"
        transform={`rotate(${minutes} 100 100)`}/>
        {/* 초침 */}
        <line x1="100" y1="110" x2="100" y2="35"
        stroke="#E8FD00"
        strokeWidth="2"
        transform={`rotate(${seconds} 100 100)`}/>
      </svg>
    </div>
  );
}