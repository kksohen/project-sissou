"use client";

import { getWorksWithBlur, IWork, WorkCategory } from "@/app/(tabs)/portfolio/actions";
import { useEffect, useState } from "react";
import PortfolioCube from "./portfolio-cube";

interface PortfolioListProps{
  category: WorkCategory; 
};

export default function PortfolioList({category}: PortfolioListProps){
  const [rotate, setRotate] = useState<Record<number, {x: number, y:number, z: number}>>({});
  const [works, setWorks] = useState<IWork[]>([]);

  //Image pixelate
  useEffect(()=>{
    async function loadWorks() {
      try{
        const work = await getWorksWithBlur(category);
        setWorks(work);
      }catch(error){
        console.error(error);
      };
    }

    loadWorks();
  }, [category]);

  //cube animation
  const handleClick = (index: number)=>{
    setRotate(prev => {
      const prevRot = prev[index] || {x: 0, y: 0, z: 0};
      const delta = 90;

      //index rot odd: right->left / even: left->right
      const direct = (index % 2 === 0) ? -delta : delta;

      const newRot = {
        x: prevRot.x,
        y: prevRot.y + direct,
        z: prevRot.z
      }

      return{
        ...prev,
        [index]: newRot
      };
    });
  };

  return(
    <div className="pt-66 md:pt-70 lg:pt-72 xl:pt-74 2xl:pt-77
    mb-6
    grid grid-cols-2 md:grid-cols-3
    portfolio-grid">
      {works.map((work, index)=>{
      const current = rotate[index] || {x: 0, y: 0, z: 0};
      
        return(
          <PortfolioCube 
          key={work.id}
          work={work}
          index={index}
          rotation={current}
          onCubeClick={handleClick}
          category={category}/>
        );
      })}
    </div>
  );
}