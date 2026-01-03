"use client";
import FormBtn from "@/components/auth/form-btn";
import MenuBar from "@/components/menu-bar";
import React, { useActionState, useEffect, useState } from "react";
import FormInput from "@/components/contact/form-input";
import { contactAction } from "@/app/(tabs)/contact/actions";

export const metadata = {
  title: "Contact"
};

export default function ContactClient(){
  const [state, action] = useActionState(contactAction, null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [detail, setDetail] = useState("");
  const [formData, setFormData] = useState({
    deadline: "",
    budget: "",
    company: "",
    name: "",
    email: "",
    phone: "",
  });

  const types = [
    {id: "Branding", label: "Branding", color: "hover:bg-primary", selectedBg: "bg-primary"},
    {id: "Graphic", label: "Graphic", color: "hover:bg-secondary", selectedBg: "bg-secondary"},
    {id: "Web", label: "Web", color: "hover:bg-accent", selectedBg: "bg-accent"},
    {id: "App", label: "App", color: "hover:bg-point", selectedBg: "bg-point"},
    {id: "Motion", label: "Motion", color: "hover:bg-success", selectedBg: "bg-success"},
    {id: "etc", label: "etc", color: "hover:bg-warning", selectedBg: "bg-warning"},
  ];

  const handleTypeToggle = (typeId: string) => {

    setSelectedTypes((prev: string[]) => {
      if(prev.includes(typeId)){
        return prev.filter(id => id !== typeId);

      }else{
        return [...prev, typeId];
      }
    });
  };

  const getBtnClass = (type: {id: string; label: string; color: string; selectedBg: string}) => {
    const base = "transition-all";
    const isSelected = selectedTypes.includes(type.id);

    return isSelected ? `${base} ${type.selectedBg} text-[#28282C]`:`${base} ${type.color} form-text-color form-bg-color`;
  };

  //form 초기화
  useEffect(()=>{
    if(state?.success){
      setSelectedTypes([]);
      setDetail("");
      setFormData({
        deadline: "",
        budget: "",
        company: "",
        name: "",
        email: "",
        phone: "",
      });

    }
  }, [state?.success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target;
    setFormData((prevData)=>({
      ...prevData,
      [name]: value,
    }));
  };
  
  return(
    <>
    <div className="mt-10 max-w-full lg:max-w-4/5 xl:max-w-3/5 mx-auto mb-12">
      {/* title */}
      <div className="mb-10
      flex flex-col justify-center items-center gap-1.5 text-center">
        <div className="w-24 h-24">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor">
            <path d="M40.663,16.128c-.154-.123-.407-.197-.663-.216h0c-.306-.023-.617.035-.778.227-.402.481-.408,1.263.049,1.707.155.15.46.283.676.283.012,0,.036-.007.052-.01h0c.164-.026.533-.164.63-.235.146-.107.449-.673.445-.861-.005-.252-.211-.734-.413-.894Z"/><path d="M72.195,31.032c1.38-1.201,2.072-1.905,3.087-1.34,4.604.995-1.308-5.416-3.087-6.279,1.38-1.2,2.072-1.905,3.087-1.34,1.674.933,2.295-.735.893-2.527-4.897-6.545-20.027-14.115-16.764-3.647,1.778,4.251,4.047,2.3,4.917-.054,1.418-3.837-4.083-1.697-4.086-2.761-.009-3.718,10.757,1.176,11.997,5.503,1.333,4.65-8.774,8.847-13.249,8.243,1.047-3.659,1.318-7.789-3.775-9.726,2.117,4.165-1.678,6.203-3.576,4.047-1.066-1.21-1.023-3.569-.385-4.91,0,0,1.578-2.986-.512-3.628-2.09-.641-2.581,1.082-2.158,1.583.851,1.005,2.226-1.362,2.759-.521.168.266-.404.809-.642,1.286-.493.988-.952,1.9-1.141,2.988-1.469,8.434-7.604,1.094-7.005,3.91,1.644,5.16-2.159,1.414-2.556-.802-.397,2.216-4.2,5.961-2.556.802.599-2.817-5.536,4.523-7.005-3.91-.189-1.088-.648-2-1.141-2.988-.238-.477-.811-1.02-.642-1.286.533-.842,1.908,1.525,2.759.521.424-.501-.067-2.224-2.158-1.583-2.09.641-.512,3.628-.512,3.628.638,1.34.681,3.7-.385,4.91-1.898,2.155-5.694.117-3.576-4.047-5.092,1.937-4.822,6.067-3.775,9.726-4.475.604-14.582-3.593-13.249-8.243,1.24-4.327,12.006-9.22,11.997-5.503-.002,1.064-5.504-1.076-4.086,2.761.87,2.354,3.139,4.306,4.917.054,3.263-10.467-11.867-2.897-16.764,3.647-1.401,1.792-.781,3.46.893,2.527,1.015-.566,1.707.139,3.087,1.34-1.779.863-7.691,7.273-3.087,6.279,1.015-.566,1.707.139,3.087,1.34-1.778.863-7.692,7.273-3.087,6.279,2.432-1.356,4.596,5.176,16.18,7.184-8.28,3.691-7.004,6.729-3.241,8.501-2.508,4.711-8.343-6.433-12.614-1.855-1.181,1.265-1.277,3.081.059,4.694,1.975,2.385.451,13.447,4.357,13.447,2.648,0-1.118-6.553.69-10.634,1.679-3.789,7.852-1.5,12.262-3.465,1.079,4.077,8.853,6.357,13.872.496.738.994,1.744,1.825,3.098,2.062-1.064,4.186-4.837,1.496-4.95,1.125.726,4.272,3.147,6.415,5.569,6.416,2.422-.001,4.843-2.144,5.569-6.416-.113.372-3.886,3.062-4.95-1.125,1.354-.236,2.36-1.067,3.098-2.062,5.02,5.862,12.793,3.582,13.872-.496,4.411,1.965,10.583-.324,12.262,3.465,1.808,4.08-1.958,10.634.69,10.634,3.906,0,2.383-11.062,4.357-13.447,1.336-1.613,1.24-3.428.059-4.694-4.271-4.577-10.106,6.566-12.614,1.855,3.762-1.772,5.039-4.81-3.241-8.501,11.584-2.008,13.748-8.54,16.18-7.184,4.605.994-1.309-5.416-3.087-6.279ZM64.532,27.894c2.151.489,4.598,1.596,6.154,3.123-2.296,2.402-6.421,4.282-9.225,4.892,3.25-4.179-2.444-7.139-2.444-7.139,0,0,3.527.085,5.515-.876ZM51.615,29.357c2.09.463-.222,2.129,1.565,3.323,2.055,1.374,6.386,2.432,6.347,3.597-9.803,3.461-15.633-7.143-7.912-6.921ZM42.793,33.711c3.185-7.238,1.019,1.477,7.27,4.741-1.324,1.046-4.927-.236-5.156-1.073.405-.529,1.198-2.267-.597-1.585-1.67.635-4.153,3.906-1.518-2.082ZM37.207,33.711c2.635,5.988.153,2.717-1.518,2.082-1.795-.682-1.002,1.056-.597,1.585-.229.837-3.832,2.119-5.156,1.073,6.251-3.263,4.085-11.979,7.27-4.741ZM26.82,32.681c1.787-1.195-.525-2.861,1.565-3.323,7.722-.223,1.892,10.381-7.912,6.921-.039-1.165,4.292-2.223,6.347-3.597ZM15.468,27.894c1.988.961,5.515.876,5.515.876,0,0-5.694,2.961-2.444,7.139-2.804-.61-6.929-2.49-9.225-4.892,1.556-1.527,4.003-2.634,6.154-3.123ZM17.404,41.815c-4.067-.568-12.571-4.805-8.744-10.061,4.056,4.498,11.446,6.697,19.313,7.359-2.869,2.249-7.586,3.251-10.569,2.702ZM23.778,54.669c2.094-.771,3.269-3.544,2.578-4.932,1.088,1.388,4.64,1.323,5.179,1.158.413.982.572,2.343.564,3.145-.036,3.824-7.142,4.581-8.322.629ZM27.974,44.675c3.975-.989,7.26-4.394,7.713-6.615,2.439,1.299,4.149,9.65-1.255,5.068,0,0,.246,1.918.967,3.436-3.299,1.497-7.425,0-7.425-1.888ZM34.431,51.246s.246,1.418.967,2.935c-.893.088-1.748-.544-2.182-2.355-.1-.418-.169-.834-.223-1.247.979-.419,2.221-1.277,3.289-2.52.739,1.003,1.828,1.845,3.098,2.062-.612,3.231-4.011,2.44-4.95,1.125ZM40,28.677c-.182,1.016-1.079,2.346-1.84,2.999-2.406-4.922,1.667-1.454,1.84-9.103,0,.004,0,.007,0,.011,0-.004,0-.007,0-.011.173,7.649,4.245,4.181,1.84,9.103-.761-.653-1.658-1.983-1.84-2.999ZM46.783,51.827c-.433,1.811-1.289,2.443-2.182,2.355.721-1.517.967-2.935.967-2.935-.939,1.316-4.338,2.107-4.95-1.125,1.271-.217,2.36-1.059,3.098-2.062,1.068,1.243,2.31,2.101,3.289,2.52-.054.413-.123.828-.223,1.247ZM44.601,46.563c.721-1.517.967-3.436.967-3.436-5.404,4.583-3.695-3.769-1.255-5.068.453,2.221,3.738,5.625,7.713,6.615,0,1.888-4.126,3.385-7.425,1.888ZM47.9,54.04c-.008-.802.151-2.163.564-3.145.539.165,4.091.229,5.179-1.158-.691,1.388.484,4.161,2.578,4.932-1.18,3.953-8.285,3.196-8.322-.629ZM62.596,41.815c-2.984.55-7.701-.452-10.569-2.702,7.867-.662,15.257-2.861,19.313-7.359,3.827,5.256-4.677,9.493-8.744,10.061Z"/>
          </svg>
        </div>
        <h1 className="font-weight-basic text-3xl leading-7 custom-tracking form-title">Contact</h1>
        <h1 className="font-weight-basic text-2xl form-h2">프로젝트 문의</h1>
      </div>
      
      {/* mail 발송 후 성공, 실패 메시지 */}
      {state?.success && (
      <div className="text-center mb-10 color-primary 
      username-spacing-desc font-weight-basic">{state.message}</div>
      )}
      {state?.error && !state?.success && (
      <div className="text-center mb-10 color-error
      username-spacing-desc font-weight-basic">{state.message}</div>
      )}

      {/* form */}
      <form className="flex flex-col" action={action}>

        <input required type="hidden" name="type" value={selectedTypes.join(", ")}/>

        <div className="flex flex-col gap-1 md:gap-2 form-text-color mb-10">
          {/* select btn */}
          <div className="flex flex-col gap-2 mb-1">
            <h4 className="font-weight-basic username-spacing-comm lg:text-lg">Type*</h4>

            <div className="flex-wrap flex gap-1 sm:gap-2
            text-xs md:text-sm lg:text-base
            font-weight-form username-spacing-comm
            leading-3 md:leading-4
            *:py-1.5 *:lg:py-2
            *:px-2 *:md:px-2.5 *:lg:px-2.75 *:rounded-full
            *:border-[0.0625rem] *:border-[var(--ring-color)]">
              {types.map((type)=>(
                <button key={type.id} data-cursor-target
                onClick={()=> handleTypeToggle(type.id)}
                type="button"
                className={getBtnClass(type)}
                >{type.label}</button>
              ))}
            </div>

            {state?.error?.fieldErrors?.type && (
            <span className="color-warning text-xs md:text-sm font-weight-form pt-0.5 md:pt-1">{state.error.fieldErrors.type[0]}</span>
            )}
          </div>

          <div className="h-[0.0625rem] w-full ring-color opacity-70"/>

          <textarea placeholder="Details*"
          name="details" value={detail}
          onChange={(e)=> setDetail(e.target.value)}
          rows={7} maxLength={300}
          className="my-1 w-full
          focus:outline-none border-none
          mx-auto transition-all
          bg-transparent resize-none
          placeholder:text-[var(--form-text-color)]
          placeholder:opacity-40
          font-weight-form lg:text-lg"/>

          {state?.error?.fieldErrors?.details && (
          <span className="color-warning text-xs md:text-sm font-weight-form">{state.error.fieldErrors.details[0]}</span>
          )}

          <div className="mb-0.5 ml-auto font-weight-form username-spacing-desc form-text-color opacity-40 text-xs md:text-sm lg:text-base">{detail.length} / 300</div>

          <div className="h-[0.0625rem] w-full ring-color opacity-70"/>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 lg:text-lg">
            <div className="items-baseline flex gap-2.5 md:gap-3">
              <h4 className="flex-shrink-0 font-weight-basic username-spacing">마감기한</h4>
              <FormInput placeholder="Deadline" name="deadline" type="date"
              value={formData.deadline} onChange={handleChange}
              errors={state?.error?.fieldErrors?.deadline} />
            </div>

            <div className="block md:hidden h-[0.0625rem] w-full ring-color opacity-70"/>

            <div className="items-baseline flex gap-2.5 md:gap-3">
              <h4 className="flex-shrink-0 font-weight-basic username-spacing">예산범위</h4>
              <FormInput placeholder="Budget" name="budget" type="text"
              value={formData.budget} onChange={handleChange}
              errors={state?.error?.fieldErrors?.budget} />
            </div>
          </div>

          <div className="h-[0.0625rem] w-full ring-color opacity-70"/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 lg:text-lg">
            <div className="items-baseline flex gap-2.5 md:gap-3">
              <h4 className="flex-shrink-0 font-weight-basic username-spacing">소속*</h4>
              <FormInput required placeholder="Company" name="company" type="text"
              value={formData.company} onChange={handleChange}
              errors={state?.error?.fieldErrors?.company} />
            </div>

            <div className="block md:hidden h-[0.0625rem] w-full ring-color opacity-70"/>

            <div className="items-baseline flex gap-2.5 md:gap-3">
              <h4 className="flex-shrink-0 font-weight-basic username-spacing">담당자명*</h4>
              <FormInput required placeholder="Name" name="name" type="text"
              value={formData.name} onChange={handleChange}
              errors={state?.error?.fieldErrors?.name} />
            </div>
          </div>

          <div className="h-[0.0625rem] w-full ring-color opacity-70"/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 lg:text-lg">
            <div className="items-baseline flex gap-2.5 md:gap-3">
              <h4 className="flex-shrink-0 font-weight-basic username-spacing">이메일*</h4>
              <FormInput required placeholder="E-Mail" name="email" type="email"
              value={formData.email} onChange={handleChange}
              errors={state?.error?.fieldErrors?.email} />
            </div>

            <div className="block md:hidden h-[0.0625rem] w-full ring-color opacity-70"/>

            <div className="items-baseline flex gap-2.5 md:gap-3">
              <h4 className="flex-shrink-0 font-weight-basic username-spacing">연락처*</h4>
              <FormInput required placeholder="Phone Number" name="phone" type="text"
              value={formData.phone} onChange={handleChange}
              errors={state?.error?.fieldErrors?.phone} />
            </div>
          </div>
        </div>

        <FormBtn text="Submit"/>
      </form>
    </div>

    <MenuBar/>
    </>
  );
}