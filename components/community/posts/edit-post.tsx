"use client";
import { postSchema, PostType } from "@/app/posts/add/schema"
import HandleBackBtn from "./handle-back-btn";
import AddFormInput from "../add-form-input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUploadUrl } from "@/app/posts/add/actions";
import { updatePost } from "@/app/posts/[id]/edit/actions";
import FormBtn from "@/components/auth/form-btn";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface IPostProps{
  post: {
    id: number;
    title: string;
    description?: string | null;
    photo: string;
  };
  postId: number;
};

export default function EditPost({post, postId}: IPostProps){
  //imgs upload 최대 3장 가능ㅇ
  const MAX_IMAGES = 3;
  const [uploadUrl, setUploadUrl] = useState<string[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [file, setFile] = useState<File[]>([]);
  const [imgs, setImgs] = useState<string[]>([]); //최종 이미지 URL
  //react-hook-form + zod
  const {register, handleSubmit, setValue, formState: {errors}, trigger, watch} = useForm<PostType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      photo: "",
      title: "",
      description: ""
    }
  });
  const [isModified, setIsModified] = useState(false);//파일 수정 여부 감지

  useEffect(()=>{
    if(post){
      setValue("title", post.title);
      setValue("description", post.description || "");

      let initImages: string[] = [];
      try{
        const parse = JSON.parse(post.photo);
        if(Array.isArray(parse)){
          initImages = parse;
        }else{
          initImages = [post.photo];
        };
      }catch{
        initImages = [post.photo];
      };

      setValue("photo", initImages[0] || "");
      setImgs(initImages);
      setPreview(initImages.map(img => `${img}/public`));
    };
  }, [post, setValue]);

  //폼 변경 감지
  const watchedValue = watch();
  useEffect(()=>{
    const textChanges = watchedValue.title !== post.title ||
    watchedValue.description !== (post.description || "");

    const imgChanges = file.length > 0;

    setIsModified(textChanges || imgChanges);
  }, [watchedValue, post, file.length]);

  const onImageChange = async(e:React.ChangeEvent<HTMLInputElement>)=>{
      const {target: {files}} = e; 
      if(!files || files.length <= 0 ) return;
      
      const fileArray = Array.from(files);
      const remain = MAX_IMAGES - preview.length; //기존에 업로드된 이미지 수 맞춰서 계산
      const fliesToProcess = fileArray.slice(0, remain);
  
      if(fileArray.length > remain){
        alert(`이미지는 최대 ${MAX_IMAGES}개까지 업로드 가능합니다.`);
        return;
      };
  
      for(const singleFile of fliesToProcess){
        const fileType = singleFile.type;
        const allowed = ["image/jpeg", "image/jpg", "image/png"];
        if(!allowed.includes(fileType)){
          alert("jpg, jpeg, png 형식의 이미지 파일만 업로드 가능합니다.");
          continue;
        };
        
        const fileSizeMB = 4;
        const fileSizeBytes = fileSizeMB * 1024 * 1024;
        if(singleFile.size > fileSizeBytes){
          alert(`${fileSizeMB}MB 이하의 이미지 파일을 업로드해주세요.`);
          continue;
        };
  
        const url = URL.createObjectURL(singleFile);
        const {success, result} = await getUploadUrl(); 
        if(success){
          const {id, uploadURL} = result;
          const photo = `https://imagedelivery.net/SUpMJ-l_3UCdOiIbGD-vAA/${id}`; 
  
          setFile(prev => [...prev, singleFile]);
          setPreview(prev => [...prev, url]);
          setUploadUrl(prev => [...prev, uploadURL]);
          setImgs(prev => {
            const newImages = [...prev, photo];
            if(prev.length === 0){
              setValue("photo", photo); 
              trigger("photo");
            };
            return newImages;
          });
        };
      };
      e.target.value = ''; 
    };
  
    const removeImage = (index:number)=>{
      setFile(prev => prev.filter((_, i) => i !== index));
      setPreview(prev => prev.filter((_, i) => i !== index));
      setUploadUrl(prev => prev.filter((_, i) => i !== index));
      setImgs(prev => {
        const newImages = prev.filter((_, i) => i !== index);
  
        if(index === 0 && newImages.length > 0){
          setValue("photo", newImages[0]);
        }else if(newImages.length === 0){
          setValue("photo", "");
        };
        trigger("photo"); 
        return newImages; 
      });
    };
  
    const onSubmit = handleSubmit(async(data: PostType)=>{
      if(imgs.length === 0){
        alert("이미지를 추가해주세요.");
        return;
      };

      for(let i = 0; i < file.length; i++){
        const singleFile = file[i];
        const singleUploadUrl = uploadUrl[i];
  
        const cloudflareForm = new FormData();
        cloudflareForm.append("file", singleFile);
  
        const res = await fetch(singleUploadUrl, {
        method: "POST",
        body: cloudflareForm
        });
        if(res.status !== 200){
          alert("이미지 업로드에 실패했습니다.");
          return;
        };
      };
  
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");

      const allImages = JSON.stringify(imgs);
      formData.append("photo", allImages);
  
      const errors = await updatePost(postId, formData);
      if(errors){
        console.error(errors);
      };
    });

    const onValid = async()=>{
      await onSubmit();
    };

  return(
    <div className="my-10">
      {/* title */}
      <div className="fixed top-0 left-0 right-0 pt-10 z-10
      mode-svg-color-50 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
        <div className="mx-auto max-w-screen-xs sm:max-w-lg md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">

          <div className="flex items-center">
            <HandleBackBtn />
            
            <h1 className="font-weight-basic text-2xl form-h2 username-spacing">편린 공유 Share Pieces</h1>
            {/* form action */}
            <form action={onValid} className="ml-auto 
            [&>button]:py-0.5 [&>button]:px-2
            [&>button]:sm:py-1 [&>button]:sm:px-3
            [&>button]:rounded-full
            [&>button]:text-sm [&>button]:sm:text-base 
            [&>button]:md:text-lg [&>button]:lg:text-xl">
              <FormBtn text={isModified ? "Update" : "Share"} />
            </form>
          </div>
        </div>
        <div className="h-[0.0625rem] w-full ring-color opacity-70 mt-3"/>
      </div>

      {/* form ui */}
      <div className="pt-18 sm:pt-20">
        <form className="flex flex-col gap-3">
          <AddFormInput required placeholder="Title" type="text"
          errors={[errors.title?.message ?? ""]}
          {...register("title")} />
          <div className="h-[0.0625rem] w-full ring-color opacity-70 "/>
          <textarea placeholder="Description" 
          {...register("description")} rows={20} maxLength={500}
          className="mt-3 w-full focus:outline-none border-none
          mx-auto transition-all
          bg-transparent resize-none
          form-text-color placeholder:text-[var(--form-text-color)]
          placeholder:opacity-30
          font-weight-form"/>

          {/* images */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 xl:gap-8">
            {/* img 있을 때 */}
            {preview.map((singlePreview, index)=>(
            <div key={index} className="relative group">
              <div style={{backgroundImage: `url(${singlePreview})`}} 
              className="w-full aspect-[3/4] rounded-3xl bg-center bg-cover
              border-[0.0625rem] border-[var(--ring-color)]"/>
              <button type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); //버블링 방지
                removeImage(index)
              }}
              data-cursor-target
              className="size-6 absolute top-3 right-3 flex items-center justify-center
              opacity-0 group-hover:opacity-100 rounded-full
              bg-[var(--color-error)] text-white
              transition-all">
                <XMarkIcon className="pointer-none size-4 stroke-3" />
              </button>
            </div>
            ))}
            {/* img 없을 때 */}
            {preview.length < MAX_IMAGES && (
            <label data-cursor-target htmlFor="photo" 
            className="w-full aspect-[3/4] rounded-3xl bg-center bg-cover
            flex flex-col justify-center items-center 
            form-text-color form-bg-color 
            border-[0.0625rem] border-[var(--ring-color)] border-dashed
            hover:bg-transparent transition-all">
              <PhotoIcon className="pointer-none size-10 opacity-30 mb-2"/>
              <span className="username-spacing-desc pointer-none text-xs md:text-sm lg:text-base opacity-40 font-weight-form">
                Add Images ( {preview.length} / {MAX_IMAGES} )
              </span>
            </label>
            )}
        </div>

          <input type="file" id="photo" name="photo" accept="image/*" className="hidden" onChange={onImageChange} multiple />
        </form>
      </div>

    </div>
  );
}