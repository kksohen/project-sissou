import { formatToTimeAgo } from "@/lib/utils";
import { ChatBubbleBottomCenterIcon, EyeIcon, HeartIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

interface PostListProps{
  id: number;
  title: string;
  description?: string | null;
  views: number;
  photo: string;
  created_at: Date;
  _count: {
    comments: number;
    likes: number;
  };
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
};

export default function PostList({id, title, description, views, photo, created_at, _count, user}: PostListProps){
  //desc 글자수 제한
  const textMaxlength = (text: string | null | undefined, maxLength: number = 20)=>{
    if(!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + " . . ." : text;
  };

  //썸네일 이미지 경로 추출
  const getThumbnailImage = (photoData: string):string => {
    try{
      const parse = JSON.parse(photoData);
      return Array.isArray(parse) ? parse[0] : photoData;
    }catch{
      return photoData;
    };
  };

  return(
  <div>
    {/* logo modal */}
    <div className="flex justify-center">
      <Link href={`/profile/${user.id}?modal=true`} data-cursor-target>
        <div className="inline-flex flex-col items-center">
          <div className="size-16">
            {user.avatar ? <Image className="rounded-full pointer-none"
            src={user.avatar} alt={user.username} width={64} height={64} priority/> :
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor" className="pointer-none">
              <path d="M27.233,43.855c1.706-.07,2.609.225,3.782-1.181,2.924-3.502-3.826-12.769-1.522-13.515,2.554-.816,7.326,11.462,10.293,11.068,2.967-.408,10.614-10.055,13.027-8.649,4.195,2.447,9.456,46.296,20.108,17.692,4.043-10.21,3.989,11.63,5.869,1.87,5.869-30.869-14.499-.084-16.325-4.064-.826-1.786,5.956-20.645,7.543-20.279,1.989.45-1.576,9.788.185,10.069.979.153,4.01-6.575,6.962-12.653C70.932,10.05,56.735.15,40.206.15,19.77.15,2.896,15.282.258,34.896c.347-.473.691-.788,1.037-.829,1.696-.197,5.33,9.029,7.254,7.158,1.674-1.631-3.88-17.213.446-12.249,7.434,8.522,14.499-7.777,16.945-5.696,2.272,1.927-12.349,20.562-14.891,22.22-4.666,3.045-5.863-4.289-10.841-.759-.019.013-.039.03-.058.045.697,6.181,2.807,11.934,6,16.938.476-1.482.685-3.414,2.139-5.845,5.163-8.635,13.412-11.785,18.945-12.024ZM39.765,12.466c7.554.563,7.119,18.774.152,19.562-6.88-.478-7.804-19.182-.152-19.562Z"/>
              <path d="M35.081,75.006c-1.288-2.264-5.812-.338-8.029-3.417-4.043-5.625,7.725-10.787,1.279-21.334-3.011-4.936-9.641-3.839-8.478,13.177.432,6.272.273,9.443-1.023,10.84,4.446,2.773,9.473,4.707,14.86,5.578,1.893-1.786,2.294-3.257,1.391-4.844Z"/>
              <path d="M42.847,43.855c-8,12.98,16.543,13.191,13.608,23.612-1.261,4.5-7.13,3.924-8.032,6.68-.703,2.153.99,3.265,3.936,4.373,7.648-2.403,14.305-7.015,19.227-13.081-15.672-.528-22.478-31.755-28.739-21.584Z"/>
            </svg>
            }
          </div>
          <h4 className="py-2 font-weight-basic username-spacing-comm text-center lg:text-lg">{user.username}</h4>
        </div>
      </Link>
    </div>
    
    {/* post */}
    <Link href={`/community/posts/${id}`} data-cursor-target>

      <div className="pt-3 px-10 trapezoid-posts text-center
      form-text-color form-bg-color font-weight-form">

        <div className="username-spacing-desc pointer-none">
          <h2 className="font-weight-basic username-spacing
          text-base md:text-lg lg:text-xl">{title}</h2>
          <p className="lg:text-lg md:leading-5 lg:leading-6 opacity-70">{textMaxlength(description, 20)}</p>
          <p className="text-xs md:text-sm lg:text-base opacity-40">{formatToTimeAgo(created_at.toString())}</p>
        </div>

        <div className="h-[0.0625rem] w-full ring-color mt-3 pointer-none"/>

        <div className="pointer-none text-xs md:text-sm lg:text-base opacity-60
        flex gap-4 items-center py-3
        *:flex *:items-center *:gap-1">
          <span>
            <HeartIcon className="size-4 -mt-0.5"/>
            {_count.likes}
          </span>
          <span>
            <ChatBubbleBottomCenterIcon className="size-4"/>
            {_count.comments}
          </span>
          <span className="ml-auto">
            <EyeIcon className="size-4"/>
            {views}
          </span>
        </div>
      </div>

      <div>
        <Image className="rounded-t-none rounded-b-3xl object-cover
        w-full h-auto aspect-video mx-auto pointer-none"
        src={`${getThumbnailImage(photo)}/public`} alt={title} width={400} height={225} priority/>
      </div>
    </Link>
  </div>
  );
}