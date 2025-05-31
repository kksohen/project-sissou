import DarkModeBtn from "./dark-mode-btn";
import HomeSound from "./home-sound";

export default function ConditionBar() {

  return(
    <ul className="flex flex-col items-center justify-between 
    fixed right-4 top-10 z-0">
      {/* home - 1 */}
      <li data-cursor-target
      className="relative z-10 w-16 h-16 flex items-center justify-center media-bar-w-lg mode-secondary-50 backdrop-blur-lg rounded-full">
        <DarkModeBtn />
      </li>
      {/* 이음 선 */}
      <li className="-m-6 relative z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 60" 
        transform="matrix(-1.8369701987210297e-16,-1,1,-1.8369701987210297e-16,0,0)"
        className="w-16 h-16 mode-bar-color media-bar-w-lg">
          <defs>
            <mask id="half-circle-mask">
              <rect width="100%" height="100%" fill="black"/>
              <circle cx="37.5" cy="30" r="30" fill="white"/>
            </mask>
          </defs>
          <path d="M0 60c9.26 0 17.55-4.2 23.05-10.8 3.7-4.44 8.67-8.2 14.45-8.2s10.75 3.76 14.45 8.2C57.45 55.8 65.74 60 75 60V0c-9.78 0-18.47 4.68-23.95 11.92C47.73 16.33 43.02 20 37.5 20s-10.23-3.67-13.55-8.08C18.47 4.68 9.78 0 0 0"
          mask="url(#half-circle-mask)"/>
        </svg>
      </li>
      
      {/* home - 2 */}
      <li data-cursor-target
      className="relative z-10 w-16 h-16 flex items-center justify-center media-bar-w-lg mode-secondary-50 backdrop-blur-lg rounded-full">
        <button className="flex items-center justify-center w-12 h-12 mode-secondary-50 rounded-full backdrop-blur-lg media-bar-w-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor" className="pointer-none w-10 h-10 mode-svg-color media-bar-w-xs">
            <polygon points="19.39 72 19.39 50.66 9.563 50.66 9.604 46.913 25.371 46.845 26.997 45.408 16.585 43.258 17.595 39.649 30.549 42.27 31.343 41.568 24.933 38.083 26.777 34.97 17.775 25.967 20.454 23.347 35.308 38.066 35.632 37.78 27.13 24.853 30.396 23.016 33.501 27.696 31.053 18.848 34.671 17.871 36.959 26.936 38.145 11.22 41.892 11.213 40.802 26.514 41.118 26.595 47.283 8 50.905 8.963 44.02 31.09 49.377 23.016 52.644 24.853 44.225 37.653 44.572 37.96 59.319 23.347 61.998 25.967 53.04 34.925 53.157 34.859 55.067 38.083 48.657 41.568 49.451 42.27 62.405 39.649 63.415 43.258 53.003 45.408 54.629 46.845 70.396 46.913 70.437 50.66 60.61 50.66 60.61 72 19.39 72"/>
          </svg>
        </button>
      </li>
      {/* 이음 선 */}
      <li className="-m-6 relative z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 60" 
        transform="matrix(-1.8369701987210297e-16,-1,1,-1.8369701987210297e-16,0,0)"
        className="w-16 h-16 mode-bar-color media-bar-w-lg">
          <defs>
            <mask id="half-circle-mask">
              <rect width="100%" height="100%" fill="black"/>
              <circle cx="37.5" cy="30" r="30" fill="white"/>
            </mask>
          </defs>
          <path d="M0 60c9.26 0 17.55-4.2 23.05-10.8 3.7-4.44 8.67-8.2 14.45-8.2s10.75 3.76 14.45 8.2C57.45 55.8 65.74 60 75 60V0c-9.78 0-18.47 4.68-23.95 11.92C47.73 16.33 43.02 20 37.5 20s-10.23-3.67-13.55-8.08C18.47 4.68 9.78 0 0 0"
          mask="url(#half-circle-mask)"/>
        </svg>
      </li>

      {/* time */}
      <li data-cursor-target
      className="relative z-10 w-16 h-16 flex items-center justify-center media-bar-w-lg mode-secondary-50 backdrop-blur-lg rounded-full">
        <button className="flex items-center justify-center w-12 h-12 mode-secondary-50 rounded-full backdrop-blur-lg media-bar-w-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"
          fill="currentColor" className="pointer-none w-11 h-11 mode-svg-color media-bar-w-sm"
          >
            <circle cx="55.315" cy="55.314" r="4.243" />
            <circle cx="40" cy="14.243" r="4.243" />
            <circle cx="30.135" cy="16.207" r="4.243" />
            <circle cx="40" cy="27.853" r="4.243" />
            <circle cx="31.419" cy="31.419" r="4.243" />
            <circle cx="48.581" cy="31.419" r="4.243" />
            <circle cx="27.853" cy="40" r="4.243" />
            <circle cx="31.419" cy="48.601" r="4.243" />
            <circle cx="40" cy="52.122" r="4.243" />
            <circle cx="48.592" cy="48.601" r="4.243" />
            <circle cx="21.787" cy="21.787" r="4.243" />
            <circle cx="16.198" cy="30.141" r="4.243" />
            <circle cx="14.243" cy="40" r="4.243" />
            <circle cx="16.198" cy="49.859" r="4.243" />
            <circle cx="21.787" cy="58.207" r="4.243" />
            <circle cx="30.135" cy="63.802" r="4.243" />
            <circle cx="40" cy="65.757" r="4.243" />
            <circle cx="49.866" cy="63.802" r="4.243" />
            <circle cx="49.86" cy="16.207" r="4.243" />
            <circle cx="58.208" cy="21.787" r="4.243" />
            <circle cx="63.801" cy="30.141" r="4.243" />
            <circle cx="65.757" cy="40" r="4.243" />
          </svg>
        </button>
      </li>
      {/* 이음 선 */}
      <li className="-m-6 relative z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 60" 
        transform="matrix(-1.8369701987210297e-16,-1,1,-1.8369701987210297e-16,0,0)"
        className="w-16 h-16 mode-bar-color media-bar-w-lg">
          <defs>
            <mask id="half-circle-mask">
              <rect width="100%" height="100%" fill="black"/>
              <circle cx="37.5" cy="30" r="30" fill="white"/>
            </mask>
          </defs>
          <path d="M0 60c9.26 0 17.55-4.2 23.05-10.8 3.7-4.44 8.67-8.2 14.45-8.2s10.75 3.76 14.45 8.2C57.45 55.8 65.74 60 75 60V0c-9.78 0-18.47 4.68-23.95 11.92C47.73 16.33 43.02 20 37.5 20s-10.23-3.67-13.55-8.08C18.47 4.68 9.78 0 0 0"
          mask="url(#half-circle-mask)"/>
        </svg>
      </li>

      {/* sound */}
      <li data-cursor-target
      className="relative z-10 w-16 h-16 flex items-center justify-center media-bar-w-lg mode-secondary-50 backdrop-blur-lg rounded-full">
        <HomeSound />
      </li>
    </ul>
  );
}