import db from "@/lib/db";

export default async function isExistUsername(username: string):Promise<boolean>{
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true
    }
  });

  return Boolean(user);
};