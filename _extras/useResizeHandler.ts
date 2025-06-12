import { useCallback, useEffect } from "react";
import { IUseModelsParams } from "../three-types";
import { CONSTANTS } from "@/lib/constants";

export function useResizeHandler({refs}: IUseModelsParams){
  const {
    rendererRef,
    cameraRef,
    mainPassRef,
    backPassRef,
    sceneBufferRef,
  } = refs;

  //resize handler
  const handleResize = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current) return;

    //camera update
    cameraRef.current.aspect = window.innerWidth / window.innerHeight;
    cameraRef.current.updateProjectionMatrix();

    //renderer update
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);

    //buffer update
    const newWidth = window.innerWidth * CONSTANTS.PIXEL_DENSITY;
    const newHeight = window.innerHeight * CONSTANTS.PIXEL_DENSITY;

    sceneBufferRef.current?.setSize(newWidth, newHeight);
    mainPassRef.current?.resize();
    backPassRef.current?.resize();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=>{
    window.addEventListener("resize", handleResize);

    return()=>window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return handleResize;
};