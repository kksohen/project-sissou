"use client";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, PanInfo } from 'framer-motion';

interface ImgSlideProps{
  allImages: string[];
  title: string;
  photoBlur?: string[];
};

export default function ImgSlide({allImages, title,photoBlur}: ImgSlideProps){
  const [isExpand, setIsExpand] = useState(false); //펼쳐진 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageWidth, setImageWidth] = useState(420);
  const [isDragEnabled, setIsDragEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxImages = 3;
  const displayedImages = allImages.slice(0, maxImages); //이미지 배열 - 3
  const maxIndex = displayedImages.length - 1; //마지막 3번째 이미지

  //2xl부터는 드래그 X
  const checkDragEnabled = useCallback(() => {
    setIsDragEnabled(window.innerWidth < 1536);
  }, []);

  useEffect(() => {
    checkDragEnabled();

    //너비 측정
    if(containerRef.current){
      const rect = containerRef.current.getBoundingClientRect();
      if(rect.width > 0){
        setImageWidth(Math.min(rect.width, 420));
      }
    };
    
    setTimeout(() => setIsExpand(true), 300); //펼쳐지는 애니
  }, [checkDragEnabled]);

  useEffect(() => {
    const handleResize = () => {
      checkDragEnabled();
      
      if(containerRef.current){
        const rect = containerRef.current.getBoundingClientRect();
        if(rect.width > 0){
          setImageWidth(Math.min(rect.width, 420));
        }
      };
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkDragEnabled]);

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (displayedImages.length <= 1) return;
    if (!isDragEnabled) return;
    
    const threshold = 75;

    if(Math.abs(info.offset.x) > threshold){
      if(info.offset.x > 0 && currentIndex > 0){
        setCurrentIndex(prev => prev - 1); //우측 드래그(이전)
      }else if(info.offset.x < 0 && currentIndex < maxIndex){
        setCurrentIndex(prev => prev + 1); //좌(다음)
      };
    };
  };

  //이미지 초기 rotate, zIndex
  const getInitStyle = (index: number)=>{
    if(index === 0) return {rotate: 0, z: 4};
    if(index === 1) return {rotate: 5, z: 3};
    if(index === 2) return {rotate: -5, z: 2};
    return {rotate: 0, z: 0};
  };

  //단일 이미지인 경우
  if(allImages.length === 1){
    return(
      <motion.div initial={{opacity: 0, scale: 0.7}}
      animate={{opacity: 1, scale: 1}}
      className="mt-12">
        <Image src={`${allImages[0]}/public`}
        alt={title}
        width={420}
        height={560}
        priority
        quality={100}
        placeholder="blur" blurDataURL={photoBlur?.[0]}
        className="w-full max-w-[420px] aspect-[3/4] rounded-3xl mx-auto object-cover"/>
      </motion.div>
    );
  };

  return(
    <div className="mt-12 overflow-hidden">
      <div ref={containerRef}
      className="relative w-full max-w-[420px] aspect-[3/4]">

        {/* 초기 모션 */}
        <motion.div 
        initial={{opacity: 0}}
        drag={isExpand && displayedImages.length > 1 && isDragEnabled ? "x" : false} //펼쳐짐 + 이미지 2개 이상 + 드래그ㅇ
        dragConstraints={{
          left: -maxIndex * (imageWidth + 8), //사이 간격 8px
          right: 0
        }}
        dragElastic={0.1} //드래그 탄성
        dragMomentum={false} //이미지 1개씩만 넘기도록 하기 위함
        onDragEnd={isExpand && isDragEnabled ? handleDragEnd : undefined}
        animate={{
          x: -currentIndex * (imageWidth + 8),
          opacity: 1
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}>
        
        {/* 펼쳐지는 모션 */}
        {displayedImages.map((img, index) => {
          const initStyle = getInitStyle(index);
          const finalX = isExpand ? index * (imageWidth + 8) : 0;
          const finalRotate = isExpand ? (index === 0 ? initStyle.rotate : 0) : initStyle.rotate;

          return(
            <motion.div key={index}
              className="absolute w-full aspect-[3/4]"
              style={{zIndex: initStyle.z}}
              initial={{
                rotate: initStyle.rotate,
                scale: 0.7,
              }}
              animate={{
                rotate: finalRotate,
                scale: isExpand ? 1 : [0.7, 0.9, 0.7],
                x: finalX,
              }}
              transition={{
                delay: index * 0.15,
                duration: 0.45,
                ease: "easeInOut",
                scale:{
                  duration: 0.3,
                  ease: "easeInOut"
                }
              }}>
              <Image src={`${img}/public`}
                alt={`${title}-${index + 1}`}
                width={420}
                height={560}
                priority
                quality={100}
                placeholder="blur" blurDataURL={photoBlur?.[index]}
                className="rounded-3xl aspect-[3/4] object-cover pointer-events-none"/>
            </motion.div>
          );
        })}
        </motion.div>
      </div>
    </div>
  );
}