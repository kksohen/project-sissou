export function formatToWon(price: number):string{
  return price.toLocaleString('ko-KR');
};

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
    path.endsWith("/add"),
    path.endsWith("/edit"),
    path.includes("/edit/"), 
    path.includes("/posts/add"),
    path.includes("/posts/edit"),
    isModal && /\/profile\/\d+$/.test(pathname), //프로필 모달 제외
    path.includes("/.well-known/"),
    path.includes("/favicon"),
    path.includes("/_next/"),
    path.startsWith("/api/"),
  ].some(Boolean);

  return result;
};