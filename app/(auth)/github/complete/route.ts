import isExistUsername from "@/lib/auth/github/exist-username";
import getAccessToken from "@/lib/auth/github/get-accessToken";
import getEmail from "@/lib/auth/github/get-email";
import getProfile from "@/lib/auth/github/get-profile";
import db from "@/lib/db";
import updateSession from "@/lib/session/update-session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
  const code = req.nextUrl.searchParams.get("code");
  if(!code){
    return new Response(null, {
      status: 400
    });
  };

  const {error, access_token} = await getAccessToken(code);
  if(error){
    return new Response(null, {
      status: 400,
    });
  };

  const email = await getEmail(access_token);

  const {id, avatar_url, login} = await getProfile(access_token);

  const user = await db.user.findFirst({
    where: {
      OR: [
        {email},
        {github_id: id + ""}
      ]
    },
    select: {
      id: true
    }
  });

  if(user){
    await updateSession(user.id);
    return redirect("/profile");
  };

  const isExist = await isExistUsername(login);

  const newUser = await db.user.create({
    data: {
      username: isExist ? `${login}-gh` : login,
      github_id: id + "", //string으로 변환
      avatar: avatar_url,
      email,
    },
    select: {
      id: true
    }
  });

  await updateSession(newUser.id);
  return redirect("/profile");
}