import EditPost from "@/components/community/posts/edit-post";
import { getPost } from "@/lib/community/get-post";
import { unstable_cache as nextCache } from "next/cache";
import { notFound } from "next/navigation";

type Params = Promise<{id: string;}>;

const getCachedPost = nextCache(getPost,['post-detail'],{
  tags: ['post-detail']
});

export default async function EditPosts({params}: {params : Params}){
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return notFound();
  };
  const post = await getCachedPost(idNumber);
  if(!post){
    return notFound();
  };

  return(
    <EditPost post={post} postId={post.id}/>
  );
}