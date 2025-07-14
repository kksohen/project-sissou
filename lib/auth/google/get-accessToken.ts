export default async function getGoogleAccessToken(code: string){
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL!,
    grant_type: "authorization_code",
    code,
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
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