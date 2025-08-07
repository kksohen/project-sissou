import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
  navigationHistory?: string[];
}

export default async function getSession() {
  return getIronSession<SessionContent>(await cookies(), {
    cookieName: "user-session",
    password: process.env.COOKIE_PASSWORD!,
  });
}