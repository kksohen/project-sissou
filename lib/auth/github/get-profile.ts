interface IUserProfile {
  id: number;
  avatar_url: string;
  login: string;
}

export default async function getProfile(access_token: string): Promise<IUserProfile>{
  const userProfileRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`
    },
    cache: "no-cache"
  });
  const {id, avatar_url, login} = await userProfileRes.json();

  return {id, avatar_url, login};
};