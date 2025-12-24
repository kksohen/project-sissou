import CommentForm from "@/components/community/posts/comment-form";
import HandleBackBtn from "@/components/community/posts/handle-back-btn";
import LikeBtn from "@/components/community/posts/like-btn";
import { getLikeStatus, getPost } from "@/lib/community/get-post";
import getSession from "@/lib/session/get-session";
import { formatToTimeAgo } from "@/lib/utils";
import { ChatBubbleBottomCenterIcon, EyeIcon } from "@heroicons/react/24/solid";
import { Metadata } from "next";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import HandleDeleteBtn from "@/components/community/posts/handle-delete-btn";
import ImgSlide from "@/components/community/posts/img-slide";
import Link from "next/link";
import { getImgPlaceholder } from "@/lib/Image/util-img";

type Params = Promise<{id: string;}>;

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60
});

async function getCachedLikeStatus(postId: number){
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["pro-like-status"], {
    tags: [`like-status-${postId}`],
    // revalidate: 60
  });
  return cachedOperation(postId, userId!);
};

export async function generateMetadata({params}: {params : Params}):Promise<Metadata>{
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return{
      title: "게시글을 찾을 수 없습니다."
    }
  };
  const post = await getCachedPost(idNumber);
  if(!post){
    return{
      title: "게시글을 찾을 수 없습니다."
    }
  };

  return{
    title: `${post.title}`
  };
};

async function getIsOwner(userId: number){
  const session = await getSession(); //cookie에 저장된 session을 가져오기 때문에 미리 render 불가능 -> dynamic page
  if(session.id){
    return session.id === userId; //로그인한 사용자의 id와 게시물의 userId가 같은지 확인
  };
  return false;
};

export default async function PostDetail({params}: {params : Params}){
  //loading page building
  // await new Promise(resolve => setTimeout(resolve, 10000));

  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return notFound();
  };

  const post = await getCachedPost(idNumber);
  if(!post) return notFound();

  const {isLiked, likeCount} = await getCachedLikeStatus(idNumber);

  const session = await getSession();
  const post_user = post.user;
  const post_comments = post.comments;

  const isOwner = await getIsOwner(post.userId);

  //모든 이미지 추출
  const getAllImages = (photoData: string): string[]=>{
    try{
      const parse = JSON.parse(photoData);
      return Array.isArray(parse) ? parse : [photoData];
    }catch{
      return [photoData];
    };
  };

  const allImages = getAllImages(post.photo);

  const photoBlur = await Promise.all(
    allImages.slice(0, 3).map(async (imageUrl: string)=>{
      return getImgPlaceholder(`${imageUrl}/public`);
    })
  );

  return(
    <div className="my-10">
      <div className="fixed top-0 left-0 right-0 pt-10 z-10
      mode-svg-color-50 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
        
        <div className="mx-auto max-w-screen-xs sm:max-w-lg md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">
          <div className="flex items-center">
            <HandleBackBtn />
            <h1 className="font-weight-basic text-2xl form-h2 username-spacing">{post.title}</h1>
          </div>
          
          <div className="flex items-center pt-2">
            <Link href={`/profile/${post.userId}`} data-cursor-target
            className="flex gap-2 items-center">
              <div className="size-8 md:size-10 lg:size-12 pointer-none">
              {post.user.avatar ? 
                <Image className="rounded-full"
                src={post.user.avatar} alt={post.user.username} width={48} height={48} priority quality={100}/> : 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor">
                  <path d="M27.233,43.855c1.706-.07,2.609.225,3.782-1.181,2.924-3.502-3.826-12.769-1.522-13.515,2.554-.816,7.326,11.462,10.293,11.068,2.967-.408,10.614-10.055,13.027-8.649,4.195,2.447,9.456,46.296,20.108,17.692,4.043-10.21,3.989,11.63,5.869,1.87,5.869-30.869-14.499-.084-16.325-4.064-.826-1.786,5.956-20.645,7.543-20.279,1.989.45-1.576,9.788.185,10.069.979.153,4.01-6.575,6.962-12.653C70.932,10.05,56.735.15,40.206.15,19.77.15,2.896,15.282.258,34.896c.347-.473.691-.788,1.037-.829,1.696-.197,5.33,9.029,7.254,7.158,1.674-1.631-3.88-17.213.446-12.249,7.434,8.522,14.499-7.777,16.945-5.696,2.272,1.927-12.349,20.562-14.891,22.22-4.666,3.045-5.863-4.289-10.841-.759-.019.013-.039.03-.058.045.697,6.181,2.807,11.934,6,16.938.476-1.482.685-3.414,2.139-5.845,5.163-8.635,13.412-11.785,18.945-12.024ZM39.765,12.466c7.554.563,7.119,18.774.152,19.562-6.88-.478-7.804-19.182-.152-19.562Z"/>
                  <path d="M35.081,75.006c-1.288-2.264-5.812-.338-8.029-3.417-4.043-5.625,7.725-10.787,1.279-21.334-3.011-4.936-9.641-3.839-8.478,13.177.432,6.272.273,9.443-1.023,10.84,4.446,2.773,9.473,4.707,14.86,5.578,1.893-1.786,2.294-3.257,1.391-4.844Z"/>
                  <path d="M42.847,43.855c-8,12.98,16.543,13.191,13.608,23.612-1.261,4.5-7.13,3.924-8.032,6.68-.703,2.153.99,3.265,3.936,4.373,7.648-2.403,14.305-7.015,19.227-13.081-15.672-.528-22.478-31.755-28.739-21.584Z"/>
                </svg>
              }</div>
            
              <div className="*:text-xs *:md:text-sm *:lg:text-base pointer-none">
                <h4 className="font-weight-basic username-spacing">{post.user.username}</h4>
                <p className="font-weight-form username-spacing opacity-40 -mt-1">{formatToTimeAgo(post.created_at.toString())}</p>
              </div>
            </Link>
            
            <div className="ml-auto">
              <HandleDeleteBtn isOwner={isOwner} postId={post.id}/>
            </div>
          </div>

        </div>
        <div className="h-[0.0625rem] w-full ring-color opacity-70 mt-3"/>
      </div>
    
      {/* post detail */}
      <div className="pt-32 sm:pt-36 md:pt-40">
        <p className="font-weight-form lg:text-lg md:leading-5 lg:leading-6 opacity-70
        break-all whitespace-pre-wrap text-wrap
        ">{post.description}</p>
        
        <ImgSlide allImages={allImages} title={post.title} photoBlur={photoBlur}/>
      </div>
      
      {/* icons */}
      <div className="text-xs md:text-sm lg:text-base 
      flex gap-3 items-center mt-6 font-weight-form
      *:flex *:items-center *:gap-1">
        <LikeBtn isLiked={isLiked} likeCount={likeCount} postId={idNumber}/>
        
        <span className="opacity-60">
          <ChatBubbleBottomCenterIcon className="size-4"/>
          {post._count.comments}
        </span>
        <span className="ml-auto opacity-60">
          <EyeIcon className="size-4"/>
          {post.views}
        </span>
      </div>

      <div className="h-[0.0625rem] w-full ring-color opacity-70 mt-4"/>
      
      <CommentForm id={idNumber} sessionId={session.id!} comments={post_comments} user={post_user} />

    </div>
  );
}