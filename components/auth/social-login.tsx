import { EnvelopeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SocialLogin() {
return(
  <>
  {/* bar */}
  <div className="flex justify-center items-center gap-4">
    <div className="h-[0.0625rem] w-full ring-color"></div>
    <div className="form-text-color opacity-30 font-weight-form">or</div>
    <div className="h-[0.0625rem] w-full ring-color"></div>
  </div>
  {/* sms icons */}
  <div className="mt-4 flex items-center justify-between">
    <Link href="/sms" data-cursor-target>
      <div className="size-11 social-btn-size mode-secondary mode-svg-color
      rounded-full flex justify-center items-center">
        <EnvelopeIcon className="size-7 social-svg-size pointer-none" />
      </div>
    </Link>

    <Link href="/kakao/start" data-cursor-target>
      <div className="size-11 social-btn-size mode-secondary mode-svg-color
      rounded-full flex justify-center items-center">
        <svg className="size-7 social-svg-size pointer-none"
        fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path d="M255.5 48C299.345 48 339.897 56.5332 377.156 73.5996C414.415 90.666 443.871 113.873 465.522 143.22C487.174 172.566 498 204.577 498 239.252C498 273.926 487.174 305.982 465.522 335.42C443.871 364.857 414.46 388.109 377.291 405.175C340.122 422.241 299.525 430.775 255.5 430.775C241.607 430.775 227.262 429.781 212.467 427.795C148.233 472.402 114.042 494.977 109.892 495.518C107.907 496.241 106.012 496.15 104.208 495.248C103.486 494.706 102.945 493.983 102.584 493.08C102.223 492.177 102.043 491.365 102.043 490.642V489.559C103.126 482.515 111.335 453.169 126.672 401.518C91.8486 384.181 64.1974 361.2 43.7185 332.575C23.2395 303.951 13 272.843 13 239.252C13 204.577 23.8259 172.566 45.4777 143.22C67.1295 113.873 96.5849 90.666 133.844 73.5996C171.103 56.5332 211.655 48 255.5 48Z"></path>
        </svg>
      </div>
    </Link>

    <Link href="/naver/start" data-cursor-target>
      <div className="size-11 social-btn-size mode-secondary mode-svg-color
      rounded-full flex justify-center items-center">
        <svg className="size-[1.375rem] social-naver-size pointer-none"
        fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 32V480H181.366V255.862L331.358 480H504V32H331.358V255.862L181.366 32H9Z"></path>
        </svg>
      </div> 
    </Link>

    <Link href="/google/start" data-cursor-target>
      <div className="size-11 social-btn-size mode-secondary mode-svg-color
      rounded-full flex justify-center items-center">
        <svg className="size-[1.625rem] social-google-size pointer-none"
        fill="currentColor" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
          <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
          <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
          <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" />
          <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
        </svg>
      </div>
    </Link>

    <Link href="/github/start" data-cursor-target>
      <div className="size-11 social-btn-size mode-secondary mode-svg-color
      rounded-full flex justify-center items-center">
        <svg className="size-[1.875rem] social-github-size pointer-none"
        viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
          fillRule="evenodd"
          clipRule="evenodd"/>
        </svg>
      </div>
    </Link>
  </div>
  </>
);
};