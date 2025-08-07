import MenuBar from "@/components/menu-bar";
import ConditionBar from "@/components/community/condition-bar";
import PostsWrap from "@/components/community/posts-wrap";
import Chats from "../chats/page";

export const metadata = {
  title: 'Community',
};

export default async function Community(){
  //loading page building
  // await new Promise(resolve => setTimeout(resolve, 50000));

  return(
    <>
      <Chats/>
      <PostsWrap/>

      <ConditionBar />
      <MenuBar />
    </>
  );
}