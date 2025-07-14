interface IGoogleProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export default async function getGoogleProfile(access_token: string): Promise<IGoogleProfile>{
  const userProfileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${access_token}`
    },
    cache: "no-cache"
  });
  const {id, email, name, picture} = await userProfileRes.json();

  return {id, email, name, picture};
};