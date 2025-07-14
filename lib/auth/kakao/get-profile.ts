interface IKakaoProfile {
  id: string;
  nickname: string;
  profile_image: string;
}

export default async function getKakaoProfile(access_token: string): Promise<IKakaoProfile>{
  const userProfileRes = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${access_token}`
    },
    cache: "no-cache"
  });
  const data = await userProfileRes.json();

  return {
    id: data.id,
    nickname: data.properties.nickname,
    profile_image: data.properties.profile_image
  };
};