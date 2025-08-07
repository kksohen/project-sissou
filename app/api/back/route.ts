import getSession from "@/lib/session/get-session";
import { skipHistory } from "@/lib/utils";
import { canAccessPage } from "@/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
  try{
    const session = await getSession();
    const history = session.navigationHistory || [];
    const isLoggedIn = Boolean(session.id);

    const referer = req.headers.get("referer");
    let currentPath = "";

    if(referer){
      const refererUrl = new URL(referer);
      currentPath = refererUrl.pathname + refererUrl.search;
    };

    //히스토리 중복 제거
    const cleanHistory = history.reduce((acc: string[], current: string) => {
      if(acc.length === 0 || acc[acc.length - 1] !== current){
        acc.push(current);
      };
      return acc;
    }, []);

    if(cleanHistory.length === 0){ //이전 히스토리 없을 시 
      return NextResponse.json({path: "/"});
    };

    let targetPage = "/";

    //현재 페이지가 히스토리에 있는지
    const currentPageIndex = cleanHistory.findIndex(page => page === currentPath);

    if(currentPageIndex !== -1){
      //히스토리에 있으면 뒤로가기
      if(currentPageIndex > 0){
        for(let i = currentPageIndex - 1; i >= 0; i--){
          const candidatePage = cleanHistory[i];
          if(!candidatePage) continue;

          const [pathname] = candidatePage.split("?");      
          const skipHistoryResult = skipHistory(candidatePage);
          const canAccessResult = canAccessPage(pathname, isLoggedIn);

          if(!skipHistoryResult && canAccessResult){
            targetPage = candidatePage;
            break; 
          };
        }
      }

      session.navigationHistory = cleanHistory.filter((_, index) => index !== currentPageIndex);

    }else{
      //현재 페이지가 히스토리에 없는 경우, 마지막 유효한 페이지 찾기
      for(let i = cleanHistory.length - 1; i >= 0; i--){
        const candidatePage = cleanHistory[i];
        if(!candidatePage) continue;

        const [pathname] = candidatePage.split("?");      
        const skipHistoryResult = skipHistory(candidatePage);
        const canAccessResult = canAccessPage(pathname, isLoggedIn);

        if(!skipHistoryResult && canAccessResult){
          targetPage = candidatePage;
          break;
        };
      }
    }

    await session.save();

    return NextResponse.json({path: targetPage});

  }catch(error){
    console.error(error);
    return NextResponse.json({path: "/"}, {status: 500});
  };
}