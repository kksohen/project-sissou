import DarkModeBtn from "../home/dark-mode-btn";

export default function ConditionBar() {

  return(
    <ul className="flex flex-col items-center justify-between 
    fixed right-4 top-10 z-10">
      {/* home - 1 */}
      <li data-cursor-target
      className="relative z-10 w-16 h-16 flex items-center justify-center media-bar-w-lg mode-secondary-50 backdrop-blur-lg rounded-full
      border-custom-all">
        <DarkModeBtn />
      </li>
    </ul>
  );
}