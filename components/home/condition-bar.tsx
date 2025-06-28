import DarkModeBtn from "./dark-mode-btn";
import HomeModalWrap from "./home-modal-wrap";
import HomeSound from "./home-sound";
import ThreeHomeBtn from "./three-home-btn";

interface ConditionBarProps{
  onToggleThreeCanvas: ()=>void;
};

export default function ConditionBar({onToggleThreeCanvas}: ConditionBarProps) {

  return(
    <ul className="flex flex-col items-center justify-between 
    fixed right-4 top-10 z-10">
      {/* home - 1 */}
      <li data-cursor-target
      className="relative z-10 w-16 h-16 flex items-center justify-center media-bar-w-lg mode-secondary-50 backdrop-blur-lg rounded-full
      border-custom-top
      ">
        <DarkModeBtn />
      </li>
      {/* 이음 선 */}
      <li className="-m-6 relative z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 60" 
        transform="matrix(-1.8369701987210297e-16,-1,1,-1.8369701987210297e-16,0,0)"
        className="w-16 h-16 mode-bar-color media-bar-w-lg ">
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
      className="relative z-10 w-16 h-16 flex items-center justify-center media-bar-w-lg mode-secondary-50 backdrop-blur-lg rounded-full
      border-custom-middle">
        <HomeModalWrap />
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
      className="relative z-10 w-16 h-16 flex items-center justify-center media-bar-w-lg mode-secondary-50 backdrop-blur-lg rounded-full
      border-custom-middle
      ">
        <ThreeHomeBtn onClick={onToggleThreeCanvas}/>
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
      className="relative z-10 w-16 h-16 flex items-center justify-center media-bar-w-lg mode-secondary-50 backdrop-blur-lg rounded-full border-custom-bottom">
        <HomeSound />
      </li>
    </ul>
  );
}