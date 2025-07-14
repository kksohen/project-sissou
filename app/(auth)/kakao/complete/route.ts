import isExistUsername from "@/lib/auth/github/exist-username";
import getKakaoAccessToken from "@/lib/auth/kakao/get-accessToken";
import getKakaoProfile from "@/lib/auth/kakao/get-profile";
import db from "@/lib/db";
import updateSession from "@/lib/session/update-session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if(!code){
    return new Response(null, {
      status: 400,
    });
  };

  const { error, access_token } = await getKakaoAccessToken(code);
  if(error){
    return new Response(null, {
      status: 400,
    });
  };

  const profile = await getKakaoProfile(access_token);
  if(!profile){
    return new Response(null, {
      status: 400,
    });
  };

  const user = await db.user.findUnique({
    where: {
      kakao_id: String(profile.id),
    },
    select: {
      id: true,
    },
  });

  if(user){
    await updateSession(user.id);
    return redirect("/profile");
  };

  const isExist = await isExistUsername(profile.nickname);
  const newUser = await db.user.create({
    data: {
      username: isExist ? `${profile.nickname}-ka` : profile.nickname,
      kakao_id: String(profile.id),
      avatar: profile.profile_image,
    },
    select: {
      id: true,
    },
  });

  await updateSession(newUser.id);
  return redirect("/profile");
}