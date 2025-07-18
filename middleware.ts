import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session/get-session";
import { skipHistory } from "./lib/utils";

interface Routes {
  [key: string] : boolean;
};

const authOnlyUrls : Routes = { //로그인한 사용자는 접근ㄴ, /profile로 ㅇ
  "/create-account": true,
  "/login": true,
  "/sms": true,
  "/github/start": true,
  "/github/complete": true,
  "/google/start": true,
  "/google/complete": true,
  "/kakao/start": true,
  "/kakao/complete": true,
  "/naver/start": true,
  "/naver/complete": true,
};

const publicOnlyUrls : Routes = { //아무나 접근ㅇ
  "/": true,
  "/exhibition-born": true,
  "/exhibition-growth": true,
  "/portfolio": true,
  "/exhibition-climax": true,
  "/exhibition-end": true,
  "/brand": true,
  "/goods": true,
  "/contact": true,
  ...authOnlyUrls
};

//페이지 접근 권한
export function canAccessPage(pathname: string, isLoggedIn: boolean){
  const isPublicUrl = publicOnlyUrls[pathname];
  const isAuthUrl = authOnlyUrls[pathname];
  
  if(isLoggedIn){
    return !isAuthUrl;
  }else{
    return isPublicUrl === true;
  };
}

export async function middleware(req: NextRequest){
  const session = await getSession();
  const fullPath = req.nextUrl.pathname + req.nextUrl.search; //쿼리파라미터 포함ㅇ

  const isPublicUrl = publicOnlyUrls[req.nextUrl.pathname];
  const isAuthUrl = authOnlyUrls[req.nextUrl.pathname];
  
  if(!session.id){ 
    if(!isPublicUrl){ //로그인 필요한 페이지 접근 시 로그인 페이지로
      return NextResponse.redirect(new URL("/login", req.url));
    };
  }else{ //로그인 시 authOnlyUrls 접근ㄴ
    if(isAuthUrl){
      return NextResponse.redirect(new URL("/profile", req.url));
    };
  };

  //인증 성공 후 히스토리 관리
  try{
    if(!session.navigationHistory){
      session.navigationHistory = [];
    };

    //modal + auth 페이지 아닌 경우
    if(!skipHistory(fullPath) && !isAuthUrl){ 
      const history = [...session.navigationHistory];
      const lastPage = history[history.length - 1];

      if(lastPage !== fullPath){
        //현재 페이지가 히스토리에 있는지
        const existingIndex = history.findIndex(page => page === fullPath);

        if(existingIndex !== -1){
          //뒤로가기 + 해당 페이지 이후 모든 히스토리 제거
          session.navigationHistory = history.slice(0, existingIndex + 1);
        }else{//새로운 페이지인 경우
          session.navigationHistory.push(fullPath);
        }
      }else{ 
        
      };
    }

    if(session.navigationHistory.length > 5){ //히스토리 개수 제한(오래된 순으로 제거)
      session.navigationHistory = session.navigationHistory.slice(-5);
    };

    await session.save();

  }catch(error){
    console.error(error);
  };

  return NextResponse.next();
}

export const config = { //middleware 적용할 페이지(api, _next/static, _next/image, favicon.ico, public/assets 제외)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"]
};