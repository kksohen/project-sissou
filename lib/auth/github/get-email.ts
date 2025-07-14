interface IEmail{
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
};

export default async function getEmail(access_token: string): Promise<string | null>{
  try{
    const userEmailRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      cache: "no-cache"
    });

    if(!userEmailRes.ok){
      console.error(userEmailRes.statusText);
      throw new Error("Failed to fetch user emails");
    };

    const emails: IEmail[] = await userEmailRes.json();
    const primaryEmail = emails.find(email => email.primary && email.verified);

    return primaryEmail ? primaryEmail.email : null;

  }catch(error){
    console.error(error);
    return null;
  };
};