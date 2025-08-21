import { useEffect, useState } from "react";
import { getImgPlaceholder } from "./util-img";

export function useImageBlur(src: string | null){
  const [blurDataURL, setBlurDataURL] = useState<string>("");

  useEffect(()=>{
    if(!src){
      setBlurDataURL("");
      return;
    };

    getImgPlaceholder(src).then(setBlurDataURL);
  },[src]);

  return blurDataURL;
}