"use client";

import { IWork, WorkCategory } from "@/app/(tabs)/portfolio/actions";
import Image from "next/image";
import Link from "next/link";

interface PortfolioCubeProps{
  work: IWork;
  index: number;
  rotation: {x: number, y: number, z: number};
  onCubeClick: (index: number) => void;
  category: WorkCategory;
};

export default function PortfolioCube({work, index, rotation, onCubeClick, category}: PortfolioCubeProps){
  const cardFaceContent = (
    <>
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
    </>
  );

  return(
    <div className="flex flex-col items-center">
      <div data-cursor-target
      onClick={()=>onCubeClick(index)}
      className="scene">

        <div className="card"
        style={{transform: `rotateX(${rotation.x}deg)
        rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`}}>
          
          <div className="card-face card-front flex flex-col justify-center items-center username-spacing-comm py-3.5 md:py-6 relative overflow-hidden">
            {cardFaceContent}
          </div>

          <div className="card-face card-back flex flex-col justify-center items-center username-spacing-comm py-3.5 md:py-6 relative overflow-hidden">
            {cardFaceContent}
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
      href={`/portfolio/${category}/${work.id}`}
      className="portfolio-link font-weight-form desc-text-color flex w-full px-3">
        <h4 className="pointer-none">{work.title}</h4>
        <p className="ml-auto pointer-none">+</p>
      </Link>
    </div>
  )
}