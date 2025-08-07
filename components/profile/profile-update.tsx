"use client";
import { profileSchema, ProfileType } from "@/app/(tabs)/profile/[id]/edit/schema";
import FormInput from "../auth/form-input";
import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from "@/lib/constants";
import FormBtn from "../auth/form-btn";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUploadUrl } from "@/app/posts/add/actions";
import { updateProfile } from "@/app/(tabs)/profile/[id]/edit/actions";
import { XMarkIcon } from "@heroicons/react/24/outline";
import HandleBackBtn from "../community/posts/handle-back-btn";

interface profileProps{
  user: ProfileType;
  userId: number;
}

export default function UpdateProfile({user, userId}: profileProps){
  const [uploadUrl, setUploadUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const {register, handleSubmit, setValue, formState: {errors}, setError} = useForm<ProfileType>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(()=>{
    setValue("username", user.username);
    setValue("email", user.email || "");
    setValue("phone", user.phone || "");
    setValue("password", user.password || "");
    setValue("confirm_password", user.confirm_password || "");
    setValue("avatar", user.avatar || "");

    if(user.avatar){
      setPreview(`${user.avatar}`);
    }

  }, [user, setValue]);

  const onImageChange = async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const {target: {files}} = e; 
    if(!files || files.length <= 0 ) return;

    const file = files[0];
    const fileType = file.type;
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if(!allowed.includes(fileType)){
      alert("jpg, jpeg, png 형식의 이미지 파일만 업로드 가능합니다.");
      return;
    }

    const fileSizeMB = 4;
    const fileSizeBytes = fileSizeMB * 1024 * 1024;
    if(file.size > fileSizeBytes){
      alert(`${fileSizeMB}MB 이하의 이미지 파일을 업로드해주세요.`);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    // setIsFileModified(true);

    const {success, result} = await getUploadUrl(); 
    if(success){
      const {id, uploadURL} = result;
      setUploadUrl(uploadURL);
      setValue("avatar", `https://imagedelivery.net/SUpMJ-l_3UCdOiIbGD-vAA/${id}`);
    };
  }

  const removeImage = ()=>{
    setPreview("");
    setFile(null);
    setUploadUrl("");
    setValue("avatar", "");
  }

  const onSubmit = handleSubmit(async(data: ProfileType)=>{
    //img 변경한 경우에만 cloudflare에 업로드ㅇ
    if(file && uploadUrl){
      const cloudflareForm = new FormData();
      cloudflareForm.append("file", file);
      
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: cloudflareForm,
      });
      if(res.status !== 200){
        alert("이미지 업로드에 실패했습니다.");
        return;
      }
    }

    const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email || "");
      formData.append("phone", data.phone || "");
      formData.append("avatar", data.avatar || "");
      formData.append("password", data.password || "");
      formData.append("confirm_password", data.confirm_password || "");

    const errors = await updateProfile(userId, formData);
    if(errors){
      console.error(errors);

      if(errors.fieldErrors){
        Object.entries(errors.fieldErrors).forEach(([field, message])=>{
          if(Array.isArray(message) && message.length > 0){
            setError(field as keyof ProfileType, {
              type: "server",
              message: message[0]
            });
          }
        });
      }
    }
  });

  const onValid = async() => {
    await onSubmit();
  }

  const handleFormSubmit = handleSubmit(onValid);

  return(
    <div className="mt-10 max-w-full lg:max-w-4/5 xl:max-w-3/5 mx-auto">
      <HandleBackBtn/>

      <form onSubmit={handleFormSubmit}>
        {/* avatar img */}
        <div className="flex flex-col items-center gap-3">
          <label htmlFor="avatar" data-cursor-target
          style={{backgroundImage: `url(${preview})`}}
          className="border-[0.0625rem] border-[var(--ring-color)]
          size-36 bg-center bg-cover rounded-full">
          {preview === "" ? (
          <div className="w-full h-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor">
              <path d="M27.233,43.855c1.706-.07,2.609.225,3.782-1.181,2.924-3.502-3.826-12.769-1.522-13.515,2.554-.816,7.326,11.462,10.293,11.068,2.967-.408,10.614-10.055,13.027-8.649,4.195,2.447,9.456,46.296,20.108,17.692,4.043-10.21,3.989,11.63,5.869,1.87,5.869-30.869-14.499-.084-16.325-4.064-.826-1.786,5.956-20.645,7.543-20.279,1.989.45-1.576,9.788.185,10.069.979.153,4.01-6.575,6.962-12.653C70.932,10.05,56.735.15,40.206.15,19.77.15,2.896,15.282.258,34.896c.347-.473.691-.788,1.037-.829,1.696-.197,5.33,9.029,7.254,7.158,1.674-1.631-3.88-17.213.446-12.249,7.434,8.522,14.499-7.777,16.945-5.696,2.272,1.927-12.349,20.562-14.891,22.22-4.666,3.045-5.863-4.289-10.841-.759-.019.013-.039.03-.058.045.697,6.181,2.807,11.934,6,16.938.476-1.482.685-3.414,2.139-5.845,5.163-8.635,13.412-11.785,18.945-12.024ZM39.765,12.466c7.554.563,7.119,18.774.152,19.562-6.88-.478-7.804-19.182-.152-19.562Z"/><path d="M35.081,75.006c-1.288-2.264-5.812-.338-8.029-3.417-4.043-5.625,7.725-10.787,1.279-21.334-3.011-4.936-9.641-3.839-8.478,13.177.432,6.272.273,9.443-1.023,10.84,4.446,2.773,9.473,4.707,14.86,5.578,1.893-1.786,2.294-3.257,1.391-4.844Z"/><path d="M42.847,43.855c-8,12.98,16.543,13.191,13.608,23.612-1.261,4.5-7.13,3.924-8.032,6.68-.703,2.153.99,3.265,3.936,4.373,7.648-2.403,14.305-7.015,19.227-13.081-15.672-.528-22.478-31.755-28.739-21.584Z"/>
            </svg>
          </div>
          ) : null}
          </label>
          {/* X Btn */}
          {preview && (
          <button data-cursor-target type="button" className="size-6 flex items-center justify-center rounded-full bg-[var(--color-error)] text-white"
          onClick={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            removeImage();
          }}>
            <XMarkIcon className="pointer-none size-4 stroke-3"/>
          </button>
          )}
        </div>
        <input type="file" id="avatar" name="avatar" accept="image/*" className="hidden" onChange={onImageChange} />

        {/* userInfo input */}
        <div className="flex flex-col gap-1.75 mt-10">
          <FormInput type="text" placeholder="Name"
          minLength={USERNAME_MIN_LENGTH}
          errors={[errors.username?.message ?? ""]}
          {...register("username")}/>
          <FormInput type="email" placeholder="E-Mail"
          errors={[errors.email?.message ?? ""]}
          {...register("email")}/>
          <FormInput type="text" placeholder="Phone Number"
          errors={[errors.phone?.message ?? ""]}
          {...register("phone")}/>
          <FormInput type="password" placeholder="Password"
          minLength={PASSWORD_MIN_LENGTH}
          errors={[errors.password?.message ?? ""]}
          {...register("password")}/>
          <FormInput type="password" 
          placeholder="Confirm Password"
          minLength={PASSWORD_MIN_LENGTH}
          errors={[errors.confirm_password?.message ?? ""]}
          {...register("confirm_password")}/>

          <FormBtn text="Update"/>
        </div>
      </form>
    </div>
  );
}