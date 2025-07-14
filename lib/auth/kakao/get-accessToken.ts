export default async function getKakaoAccessToken(code: string){
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: process.env.KAKAO_REDIRECT_URL!,
    grant_type: "authorization_code",
    code,
  });

  const res = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: accessTokenParams
  });

  const {error, access_token} = await res.json();
  return {error, access_token};
};