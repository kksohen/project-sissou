import getSession from "@/lib/session/get-session";
import { skipHistory } from "@/lib/utils";
import { canAccessPage } from "@/middleware";
import { NextResponse } from "next/server";

export async function GET(request: Request){
  try{
    const session = await getSession();
    const history = session.navigationHistory || [];
    const isLoggedIn = !!session.id;

    const referer = request.headers.get("referer");
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

    const workingHistory = [...cleanHistory];
    let targetPage = "/";
    const filterHistory: string[] = [];

    //현재 페이지가 히스토리의 마지막인지
    const lastHistory = workingHistory[workingHistory.length - 1];
    if(lastHistory === currentPath){
      workingHistory.pop(); //현재 페이지가 히스토리에 있을 때만 제거
    };

    if(workingHistory.length === 0){
      return NextResponse.json({path: "/"});
    };

    while(workingHistory.length > 0){
      const candidatePage = workingHistory.pop(); //후보 페이지 검사      
      if(!candidatePage) continue;

      const [pathname] = candidatePage.split("?");      
      const skipHistoryResult = skipHistory(candidatePage);
      const canAccessResult = canAccessPage(pathname, isLoggedIn);

      if(!skipHistoryResult && canAccessResult){
        targetPage = candidatePage;
        filterHistory.unshift(candidatePage); //타겟 페이지ㅇ
        break;
      };
    };

    //남은 히스토리들 검사해서 유효페이지만 수집
    while(workingHistory.length > 0){
      const page = workingHistory.pop();
      if(page && !skipHistory(page)){
        const [pathname] = page.split("?");
        if(canAccessPage(pathname, isLoggedIn)){
          filterHistory.unshift(page);
        };
      };
    };

    session.navigationHistory = filterHistory;
    await session.save();

    return NextResponse.json({path: targetPage});

  }catch(error){
    console.error(error);
    return NextResponse.json({path: "/"}, {status: 500});
  };
}