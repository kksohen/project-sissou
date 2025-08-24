"use client";
import Link from "next/link";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { getWorksWithBlur, IWork } from "@/app/(tabs)/portfolio/actions";

export default function GraphicWorks(){
  const [rotate, setRotate] = useState<Record<number, {x: number, y:number, z: number}>>({});
  const [works, setWorks] = useState<IWork[]>([]);

  //Image pixelate
  useEffect(()=>{
    async function loadWorks() {
      try{
        const work = await getWorksWithBlur("graphic");
        setWorks(work);
      }catch(error){
        console.error(error);
      };
    }

    loadWorks();
  }, []);

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
  }

  return(
    <div className="pt-66 md:pt-71 lg:pt-73 xl:pt-75 2xl:pt-78
    mb-20 sm:mb-40
    grid grid-cols-2 md:grid-cols-3
    portfolio-grid">
    
    {works.map((work, index)=>{
      const current = rotate[index] || {x: 0, y: 0, z: 0};
      
      return(
      <div key={index} className="flex flex-col items-center">

        <div data-cursor-target
        onClick={()=>handleClick(index)}
        className="scene">

          <div className="card"
          style={{transform: `rotateX(${current.x}deg)
          rotateY(${current.y}deg) rotateZ(${current.z}deg)`}}>

            <div className="card-face card-front flex flex-col justify-center items-center username-spacing-comm py-3.5 md:py-6
            relative overflow-hidden">

              <p className="z-1 pointer-none flex-1 opacity-70 font-weight-form text-xs lg:text-base">{work.date}</p>
              <h2 className="z-1 pointer-none flex-1 text-xl md:text-2xl lg:text-3xl font-weight-basic">{work.title}</h2>
              <p className="z-1 pointer-none opacity-70 font-weight-form text-xs lg:text-base">{work.type}</p>

              <div className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url(${work.pixel})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                imageRendering: "pixelated"}}/>

              <Image className="absolute inset-0 object-cover opacity-0"
              alt={work.title} src={work.image}
              loading="lazy"
              style={{
                imageRendering: "pixelated"
              }}
              fill quality={100}
              sizes="(max-width: 374px) 270px,
              (max-width: 407px) 320px, 
              (max-width: 479px) 350px, 
              (max-width: 539px) 410px, 
              (max-width: 767px) 460px, 
              (max-width: 1023px) 392px, 
              (max-width: 1279px) 466px, 
              (max-width: 1535px) 606px, 
              742px"/>              
            </div>
          
            <div className="card-face card-back flex flex-col justify-center items-center username-spacing-comm py-3.5 md:py-6
            relative overflow-hidden">

              <p className="z-1 pointer-none flex-1 opacity-70 font-weight-form text-xs lg:text-base">{work.date}</p>
              <h2 className="z-1 pointer-none flex-1 text-xl md:text-2xl lg:text-3xl font-weight-basic">{work.title}</h2>
              <p className="z-1 pointer-none opacity-70 font-weight-form text-xs lg:text-base">{work.type}</p>

              <div className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url(${work.pixel})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                imageRendering: "pixelated"}}/>

              <Image className="absolute inset-0 object-cover opacity-0"
              alt={work.title} src={work.image}
              loading="lazy"
              style={{
                imageRendering: "pixelated"
              }}
              fill quality={100}
              sizes="(max-width: 374px) 270px,
              (max-width: 407px) 320px, 
              (max-width: 479px) 350px, 
              (max-width: 539px) 410px, 
              (max-width: 767px) 460px, 
              (max-width: 1023px) 392px, 
              (max-width: 1279px) 466px, 
              (max-width: 1535px) 606px, 
              742px"/>              
            </div>

            <div className="card-face card-left">
              <Image alt={work.title} src={work.image} 
              fill priority quality={100}
              sizes="(max-width: 374px) 270px,
              (max-width: 407px) 320px, 
              (max-width: 479px) 350px, 
              (max-width: 539px) 410px, 
              (max-width: 767px) 460px, 
              (max-width: 1023px) 392px, 
              (max-width: 1279px) 466px, 
              (max-width: 1535px) 606px, 
              742px"
              className="object-cover pointer-none"/>
            </div>

            <div className="card-face card-right">
              <Image alt={work.title} src={work.image} 
              fill priority quality={100}
              sizes="(max-width: 374px) 270px,
              (max-width: 407px) 320px, 
              (max-width: 479px) 350px, 
              (max-width: 539px) 410px, 
              (max-width: 767px) 460px, 
              (max-width: 1023px) 392px, 
              (max-width: 1279px) 466px, 
              (max-width: 1535px) 606px, 
              742px"
              className="object-cover pointer-none"/>
            </div>
          </div>
        </div>

        <Link data-cursor-target 
        key={work.id} href={`/portfolio/graphic/${work.id}`}
        className="portfolio-link font-weight-form desc-text-color flex w-full px-3">
          <h4 className="pointer-none">{work.title}</h4>
          <p className="ml-auto pointer-none">+</p>
        </Link>
      </div>
      )
    })}
    </div>
  );
}