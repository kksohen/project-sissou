import { redirect } from "next/navigation";

export function GET() {
  const baseURL = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL!,
    scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    response_type: "code",
/* access_type: "offline",
    prompt: "consent", */
  };

  const formattedParams = new URLSearchParams(params).toString();
  const finalURL = `${baseURL}?${formattedParams}`;

  return redirect(finalURL);
}