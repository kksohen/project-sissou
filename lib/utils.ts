export function formatToWon(price: number):string{
  return price.toLocaleString('ko-KR');
};

export function formatTimeDuration(start: Date, end: Date): string{
  const durationMs = end.getTime() - start.getTime();
  const seconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;
  
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export function formatToDate(date: string): string{
  const messageDate = new Date(date);

  return messageDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short"
  });
}

export function formatToTime(date: string):string{
  const msgDate = new Date(date);
  const timeString = msgDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, //24시간제
    timeZone: "Asia/Seoul"
  });

  return timeString.replace(/^24:/, "00:"); //24->00시 변환
}

export function formatToDayTime(date: string):string{
  const msgDate = new Date(date);
  const now = new Date();

  //오늘 날짜
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());
  
  //날짜 차이 계산
  const diffTime = today.getTime() - msgDay.getTime();
  const diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const timeString = msgDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul"
  }).replace(/^24:/, "00:");

  if(diffDay === 0){ //오늘
    return timeString;

  }else if(diffDay < 7){
    return `${diffDay}일 전`;

  }else{
    const dateString = msgDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    });
    return `${dateString}`;
  };
}

export function formatToTimeAgo(date: string): string{
  //1. 현재시간과 비교해서 n시간 전에 만들어졌는지 알기
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = time - now;

  const absDiff = Math.abs(diff);
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;
  
  //2.포맷 지정해주기
  const formatter = new Intl.RelativeTimeFormat('en', {numeric: 'auto'});

  if(absDiff<minute){
    return formatter.format(Math.round(diff/1000), 'second');
  }else if(absDiff<hour){
    return formatter.format(Math.round(diff/minute), 'minute');
  }else if(absDiff<day){
    return formatter.format(Math.round(diff/hour), 'hour');
  }else if(absDiff<month){
    return formatter.format(Math.round(diff/day), 'day');
  }else if(absDiff<year){
    return formatter.format(Math.round(diff/month), 'month');
  }else{
    return formatter.format(Math.round(diff/year), 'year');
  };
}

//사이트 내 페이지 뒤로가기 관리
export function skipHistory(path: string){
  let pathname = path;
  let isModal = false;
  
  const [pathPart, queryPart] = path.split("?");
  pathname = pathPart;

  if(queryPart){
    const params=  new URLSearchParams(queryPart);
    isModal = params.get("modal") === "true";
  }

  const result = [
    pathname.endsWith("/add"),
    pathname.endsWith("/edit"),
    pathname.includes("/edit/"),
    pathname.includes("/chats/"),
    pathname.includes("/graphic/"),
    pathname.includes("/motion/"),
    pathname.includes("/web-app/"),
    pathname.includes("/branding/"),
    isModal && /\/profile\/\d+$/.test(pathname), //프로필 모달 제외
    path.includes("/.well-known/"),
    path.includes("/favicon"),
    path.includes("/_next/"),
    path.startsWith("/api/"),
  ].some(Boolean);

  return result;
};

//썸네일 이미지 경로 추출
export function getThumbnailImage(photoData: string): string{
  try{
    const parse = JSON.parse(photoData);
    return Array.isArray(parse) ? parse[0] : photoData;
  }catch{
    return photoData;
  };
}