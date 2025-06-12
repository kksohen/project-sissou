import { useEffect } from "react";
import { IUseModelsParams } from "./three-types";

export function useBgColor({refs}: IUseModelsParams){
  const {
    targetBgColorRef
  } = refs;

  useEffect(()=>{
    //sceneBGColor - dark, light mode
    const updateBG = ()=>{
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue("--three-mode-bg").trim();
      targetBgColorRef.current.set(bgColor);
    };

    updateBG();

    const observer = new MutationObserver(updateBG);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return()=> observer.disconnect();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};