"use server";
import { readFileSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const defaultBlur = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bmarshallxqEtTjHPw==";

//Image pixelate
async function getImgPlaceholder(src: string){
  try{
    let buffer: Buffer;

    if(src.startsWith("/")){ //상대 경로
      const path = join(process.cwd(), "public", src);
      buffer = readFileSync(path);
    }else{ //절대 경로
      const res = await fetch(src);
      if(!res.ok) return defaultBlur;
      buffer = Buffer.from(await res.arrayBuffer());
    };
    
    const pixelBuffer = await sharp(buffer).resize(
      40, 50, {
        kernel: "nearest",
        fit: "fill"
      }
    ).png().toBuffer();

    const base64 = `data:image/png;base64,${pixelBuffer.toString("base64")}`;
    
    return base64;
    
  }catch(error){
    console.error(error);
    return defaultBlur;
  };
}

export interface IWork{
  id: number;
  date: string;
  title: string;
  desc: string;
  image: string;
  pixel: string;
}

export async function getWorksWithBlur():Promise<IWork[]> {
  const works = [
    { 
      id: 5, 
      date:"2025",
      title: "Animal Farm", 
      desc: "Book Cover Design", 
      image: "/assets/images/mockup/animal-thum.jpg",
      pixel: ""
    },
    { 
      id: 4, 
      date:"2025", 
      title: "1984", 
      desc: "Book Cover Design", 
      image: "/assets/images/mockup/1984-thum.jpg",
      pixel: ""
    },
    { 
      id: 3, 
      date:"2025", 
      title: "Этажи", 
      desc: "Vinyl Album Design", 
      image: "/assets/images/mockup/etazhi-thum.jpg",
      pixel: ""
    },
    { 
      id: 2, 
      date:"2025", 
      title: "RusKor", 
      desc: "Type Design", 
      image: "/assets/images/mockup/ruskor-thum.jpg",
      pixel: ""
    },
    { 
      id: 1, 
      date:"2024", 
      title: "2024年13月", 
      desc: "Poster Design", 
      image: "/assets/images/mockup/newyear-thum.jpg",
      pixel: ""
    }
  ];

  const worksWithBlur = await Promise.all(
    works.map(async work=>{
      try{
        const pixel = await getImgPlaceholder(work.image);
        
        return {...work, pixel};

      }catch(error){
        console.error(error);
        return {...work, pixel: ""};
      }
    })
  );

  return worksWithBlur;
}