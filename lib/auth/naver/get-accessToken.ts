export default async function getNaverAccessToken(code: string, state: string){
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.NAVER_CLIENT_ID!,
    client_secret: process.env.NAVER_CLIENT_SECRET!,
    redirect_uri: process.env.NAVER_REDIRECT_URL!,
    grant_type: "authorization_code",
    code,
    state,
  });

  const accessTokenURL = `https://nid.naver.com/oauth2.0/token?${accessTokenParams}`;

  const {error, access_token} = await(await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    }
  })).json();

  return {error, access_token};
};