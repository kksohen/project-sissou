import { redirect } from "next/navigation";

export function GET(){
  const baseURL = "https://kauth.kakao.com/oauth/authorize";
  const params = {
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: process.env.KAKAO_REDIRECT_URL!,
    scope: "profile_nickname, profile_image",
    response_type: "code",
  };
  const formattedParams = new URLSearchParams(params).toString();
  const finalURL = `${baseURL}?${formattedParams}`;
  return redirect(finalURL);
};