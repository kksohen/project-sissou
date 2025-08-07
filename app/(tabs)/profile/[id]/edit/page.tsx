import { notFound } from "next/navigation";
import { getCachedUserEdit } from "../../page";
import UpdateProfile from "@/components/profile/profile-update";

type Params = Promise<{id: string;}>;

export default async function EditProfile({params}: {params: Params}){
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return notFound();
  };

  const profile = await getCachedUserEdit(idNumber);
  if(!profile) return notFound();

  const DefaultUserInfo = {
    username: profile.username,
    email: profile.email || "",
    phone: profile.phone || "",
    avatar: profile.avatar || "",
    password: "",
    confirm_password: ""
  }

  return(
    <UpdateProfile user={DefaultUserInfo} userId={profile.id} />
  );
}