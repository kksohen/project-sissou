"use client";
import MenuBar from "@/components/menu-bar";
import FormInput from '@/components/auth/form-input';
import FormBtn from "@/components/auth/form-btn";
import SocialLogin from "@/components/auth/social-login";
import Link from "next/link";
import { useActionState, useState } from "react";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function Login(){
  const [formData, setFormData] = useState({
      email: '',
      password: '',
  });
  
  const [state, action] = useActionState(login, null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target;
    setFormData((prevData)=>({
      ...prevData,
      [name]: value,
    }));
  };

  return(
    <div className="mt-10 max-w-full lg:max-w-4/5 xl:max-w-3/5 mx-auto">
      <div className="mb-10
      flex flex-col justify-center items-center gap-3 text-center">
        <div className="w-24 h-24">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor">
          <path d="M76.623,12.454c-.334-11.554.933-8.642-11.041-8.713-4.165-.025-20.307.204-25.543.119-12.964-.211-28.977-.802-30.27-.845-6.242-.208-6.936.258-6.686,5.626.322,6.91-.36,27.223-.46,30.439-.344,11.002.028,21.855.438,33.161.177,4.889,2.02,4.784,7.529,4.78,3.343-.003,43.051-.132,64.193-.126,2.939.138,2.783-2.528,2.692-5.008-.215-5.867-.88-41.258-.853-59.433ZM72.019,74.366c-20.36,1.081-44.743-1.472-64.135-.03-.83.062-1.561-.548-1.602-1.379-1.084-21.532-.248-42.847-.541-64.484-.011-.805.635-1.469,1.44-1.48,19.394-.284,44.607-.624,64.962-.919.78-.011,1.441.59,1.486,1.37,1.216,20.797.036,58.021-.221,65.511-.026.759-.63,1.371-1.388,1.411Z"/><path d="M58.168,48.252c1.476-.737,1.475-1.942-.002-2.678l-.582-.29c-1.477-.735-3.358-2.507-4.18-3.938l-4.733-8.236c-.822-1.431-.178-2.897,1.432-3.258,0,0,20.775-4.664,20.775-9.797,0-5.905-24.456-10.176-24.456-10.176-1.625-.284-1.617,1.661.019,1.878,0,0,15.066-.005,15.066,8.335s-15.029,8.626-15.029,8.626c-1.65.031-2.177,1.128-1.172,2.436,0,0,4.299,5.599,4.716,13.063.367,6.578-3.598,7.237-3.598,7.237-1.628.27-2.959,1.841-2.959,3.491v7.607c0,1.65,1.35,3,3,3h6.178c1.65,0,3,1.217,3,2.705s.688,2.705,1.53,2.705,1.53-1.217,1.53-2.705,1.35-2.705,3-2.705h6.178c1.65,0,3-1.217,3-2.705s-1.304-3.056-2.897-3.484l-17.937-4.823c-1.593-.428-1.689-1.382-.213-2.12l8.338-4.166ZM67.818,62.099c0,1.078-1.35,1.959-3,1.959h-3.118c-1.65,0-3-.882-3-1.959s1.35-1.959,3-1.959h3.118c1.65,0,3,.882,3,1.96ZM52.64,60.139c1.65,0,3,.882,3,1.96s-1.35,1.959-3,1.959h-3.118c-1.65,0-3-.882-3-1.96s1.35-1.96,3-1.96h3.118Z"/><path d="M29.98,44.215c.417-7.464,4.716-13.063,4.716-13.063,1.005-1.309.477-2.405-1.172-2.436,0,0-15.029-.286-15.029-8.626s15.066-8.335,15.066-8.335c1.636-.217,1.644-2.162.019-1.878,0,0-24.456,4.271-24.456,10.176,0,5.133,20.775,9.797,20.775,9.797,1.61.361,2.254,1.828,1.432,3.258l-4.733,8.236c-.822,1.431-2.703,3.203-4.18,3.938l-.582.29c-1.477.735-1.478,1.94-.002,2.678l8.338,4.166c1.476.737,1.38,1.691-.213,2.12l-17.937,4.823c-1.593.428-2.897,2.129-2.897,3.779v4.822c0,1.65.688,3,1.53,3s1.53-1.35,1.53-3v-4.822c0-1.65,1.35-3,3-3h3.118c1.65,0,3,1.35,3,3v4.822c0,1.65,1.35,3,3,3h9.237c1.65,0,3-1.35,3-3v-13.018c0-1.65-1.332-3.221-2.959-3.491,0,0-3.965-.659-3.598-7.237ZM27.36,69.469c-1.65,0-3-1.35-3-3v-3.33c0-1.65,1.35-3,3-3h3.118c1.65,0,3,1.35,3,3v3.33c0,1.65-1.35,3-3,3h-3.118Z"/><path d="M40,34.946c-.995,0-1.802.807-1.802,1.802s.807,1.802,1.802,1.802,1.802-.807,1.802-1.802-.807-1.802-1.802-1.802Z"/><path d="M40,42.145c-.995,0-1.802.807-1.802,1.802s.807,1.802,1.802,1.802,1.802-.807,1.802-1.802-.807-1.802-1.802-1.802Z"/><path d="M24.42,34.857c1.362-.932,1.283-1.786-.394-1.22-3.707,1.252-10.534,1.415-10.534,1.415-1.63.254-3.048,1.529-3.151,2.834s4.379,3.407,5.741,2.475c0,0,6.976-4.573,8.338-5.505Z"/><path d="M55.58,34.857c-1.362-.932-1.283-1.786.394-1.22,3.707,1.252,10.534,1.415,10.534,1.415,1.63.254,3.048,1.529,3.151,2.834s-4.379,3.407-5.741,2.475c0,0-6.976-4.573-8.338-5.505Z"/>
        </svg>
        </div>
        <h1 className="font-weight-basic text-3xl leading-7 custom-tracking form-title">Log In</h1>
        <h1 className="font-weight-basic text-2xl form-h2">로그인</h1>
      </div>

      <form action={action} className="flex flex-col gap-3 mb-2.5 md:mb-3.5">
        <FormInput name="email" required type="email" placeholder="E-Mail"
        errors={state?.fieldErrors.email} 
        value={formData.email} onChange={handleChange}
        />
        <FormInput name="password" required type="password" placeholder="Password"
        minLength={PASSWORD_MIN_LENGTH}
        errors={state?.fieldErrors.password} 
        value={formData.password} onChange={handleChange}
        />

        <FormBtn text="Submit" />
      </form>

      {/* resister */}
      <div className="flex justify-end-safe">
        <Link data-cursor-target href="/create-account" className="form-text-color opacity-40 hover:opacity-100 transition-all font-weight-form">회원가입 · Register</Link>
      </div>

      <SocialLogin/>

      {/* <ConditionBar /> */}
      <MenuBar />
    </div>
  );
}