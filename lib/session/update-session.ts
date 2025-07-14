import getSession from "./get-session";

export default async function updateSession(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
};