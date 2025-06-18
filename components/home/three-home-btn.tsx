import React from "react";

interface ThreeHomeBtnProps {
  onClick: () => void;
};

export default function ThreeHomeBtn({onClick}: ThreeHomeBtnProps){

  const handleClick = (e:React.MouseEvent)=>{
    e.stopPropagation();
    e.preventDefault();
    onClick();
  };

  return(
    <button onClick={handleClick}
    className="flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-lg media-bar-w-sm
        shadow-md mode-70">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor" className="pointer-none w-10 h-10 mode-svg-color media-bar-w-xs">
        <polygon points="19.39 72 19.39 50.66 9.563 50.66 9.604 46.913 25.371 46.845 26.997 45.408 16.585 43.258 17.595 39.649 30.549 42.27 31.343 41.568 24.933 38.083 26.777 34.97 17.775 25.967 20.454 23.347 35.308 38.066 35.632 37.78 27.13 24.853 30.396 23.016 33.501 27.696 31.053 18.848 34.671 17.871 36.959 26.936 38.145 11.22 41.892 11.213 40.802 26.514 41.118 26.595 47.283 8 50.905 8.963 44.02 31.09 49.377 23.016 52.644 24.853 44.225 37.653 44.572 37.96 59.319 23.347 61.998 25.967 53.04 34.925 53.157 34.859 55.067 38.083 48.657 41.568 49.451 42.27 62.405 39.649 63.415 43.258 53.003 45.408 54.629 46.845 70.396 46.913 70.437 50.66 60.61 50.66 60.61 72 19.39 72"/>
      </svg>
    </button>
  );
};