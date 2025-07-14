import { redirect } from "next/navigation";
import crypto from "crypto";

export function GET(){
  const baseURL = "https://nid.naver.com/oauth2.0/authorize";
  const state = crypto.randomBytes(16).toString('hex');
  const params = {
    client_id: process.env.NAVER_CLIENT_ID!,
    redirect_uri: process.env.NAVER_REDIRECT_URL!,
    scope: "profile email name mobile",
    response_type: "code",
    state
  };
  const formattedParams = new URLSearchParams(params).toString();
  const finalURL = `${baseURL}?${formattedParams}`;
  return redirect(finalURL);
};