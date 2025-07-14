interface INaverProfile {
  id: string;
  nickname: string;
  profile_image: string;
  email: string;
  name: string;
  mobile: string;
}

export default async function getNaverProfile(access_token: string): Promise<INaverProfile>{
  const userProfileRes = await fetch("https://openapi.naver.com/v1/nid/me", {
    headers: {
      Authorization: `Bearer ${access_token}`
    },
    cache: "no-cache"
  });
  const data = await userProfileRes.json();

  return {
    id: data.response.id,
    nickname: data.response.nickname,
    profile_image: data.response.profile_image,
    email: data.response.email,
    name: data.response.name,
    mobile: data.response.mobile
  };
};