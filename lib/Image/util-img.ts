"use server";
import { getPlaiceholder } from "plaiceholder";

const defaultBlur = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bmarshallxqEtTjHPw==";

//Image 최적화
export async function getImgPlaceholder(src: string){
  try{
    const res = await fetch(src);
    if(!res.ok) return defaultBlur;
    /* const buffer = await fetch(src).then(async(res)=>{
      return Buffer.from(await res.arrayBuffer());
    }); */
    const buffer = Buffer.from(await res.arrayBuffer());

    const {base64} = await getPlaiceholder(buffer, {size: 8});
    
    return base64;
    
  }catch(error){
    console.error(error);
    return defaultBlur;
  };
}