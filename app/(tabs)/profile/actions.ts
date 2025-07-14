"use server";

import getSession from "@/lib/session/get-session";
import { redirect } from "next/navigation";

export async function logOutAction(){
  const session = await getSession();
  session.destroy();
  redirect("/");
};