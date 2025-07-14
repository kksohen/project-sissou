import isExistUsername from "@/lib/auth/github/exist-username";
import getGoogleAccessToken from "@/lib/auth/google/get-accessToken";
import getGoogleProfile from "@/lib/auth/google/get-profile";
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

  const {error, access_token} = await getGoogleAccessToken(code);
  if(error){
    return new Response(null, {
      status: 400,
    });
  };

  const {id, email, name, picture: avatar_url} = await getGoogleProfile(access_token);

  const user = await db.user.findFirst({
    where: {
      OR: [
        {email},
        {google_id: id + ""}
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

  const isExist = await isExistUsername(name);

  const newUser = await db.user.create({
    data: {
      username: isExist ? `${name}-gl` : name,
      google_id: id + "", 
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