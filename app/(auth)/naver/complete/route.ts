
import isExistUsername from "@/lib/auth/github/exist-username";
import getNaverAccessToken from "@/lib/auth/naver/get-accessToken";
import getNaverProfile from "@/lib/auth/naver/get-profile";
import db from "@/lib/db";
import updateSession from "@/lib/session/update-session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  if(!code || !state){
    return new Response(null,{
      status: 400,
    });
  };

  const {error, access_token} = await getNaverAccessToken(code, state);
  if(error){
    return new Response(null,{
      status: 400,
    });
  };

  const profile = await getNaverProfile(access_token);

  const user = await db.user.findFirst({
    where: {
      OR : [
        {email: profile.email},
        {naver_id: String(profile.id)},
      ],
    },
    select: {
      id: true,
    }
  });

  if(user){
    await updateSession(user.id);
    return redirect("/profile");
  }

  const isExist = await isExistUsername(profile.name);
  const newUser = await db.user.create({
    data: {
      naver_id: String(profile.id),
      email: profile.email,
      username: isExist ? `${profile.name}-nv` : profile.name,
      avatar: profile.profile_image,
    },
    select: {
      id: true,
    }
  });
  await updateSession(newUser.id);
  return redirect("/profile");
}