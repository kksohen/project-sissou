import { notFound } from "next/navigation";
import { getOtherWorks, getWorkById } from "../../actions";
import { Metadata } from "next";
import Image from "next/image";
import HandleBackBtn from "@/components/community/posts/handle-back-btn";
import Link from "next/link";

type Params = Promise<{id: string;}>;

export async function generateMetadata({params}: {params : Params}):Promise<Metadata>{
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return{
      title: "게시글을 찾을 수 없습니다."
    }
  };
  const work = await getWorkById(idNumber, "graphic");

  if(!work){
    return{
      title: "게시글을 찾을 수 없습니다."
    }
  };

  return{
    title: `${work.title}`
  };
};

export default async function PortfolioDetail({params}: {params: Params}){
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return notFound();
  };

  const work = await getWorkById(idNumber, "graphic");
  if(!work) return notFound();

  //이전, 다음 게시물 받아오기
  const otherWorks = await getOtherWorks("graphic", idNumber);

  return(
    <>
    <div className="fixed left-0 p-4 pb-2
    pt-10 mode-bg w-full md:w-1/3 md:pr-0">
      <div className="flex items-start">
        {/* left - backBtn */}
        <HandleBackBtn/>
        {/* middle */}
        <div className="flex flex-col gap-2 w-full">
          {/* desc */}
          <div className="py-2 px-3 md:py-2.5 md:px-3.5
          loading-bg rounded-3xl form-text-color">

            <p className="opacity-60 italic 
            font-weight-basic username-spacing-comm
            text-xs md:text-sm lg:text-base xl:text-lg">{work.date}</p>

            <h3 className="leading-5 md:leading-6 lg:leading-7
            desc-text-color text-xl md:text-2xl lg:text-3xl font-weight-basic username-spacing-comm">{work.title}</h3>

            <div className="pt-3 xl:pt-6
            text-xs md:text-sm lg:text-base xl:text-lg lg:leading-6">
              <p className="font-weight-basic username-spacing-comm">▪ {work.type}</p>
              <p className="font-weight-basic username-spacing-comm">▪ Project : <span className="opacity-60 font-weight-form">
                {work.project}</span>
              </p>
              <p className="font-weight-basic username-spacing-comm">▪ Tools : <span className="opacity-60 font-weight-form">{work.tools.join(", ")}</span>
              </p>
              <p className="pt-3 xl:pt-6 
              font-weight-basic username-spacing-desc">{work.desc}</p>
            </div>
          </div>
          {/* menu */}
          <div className="py-2 px-3 md:py-2.5 md:px-3.5
          loading-bg rounded-3xl 
          text-xs md:text-sm lg:text-base xl:text-lg">      
            {otherWorks.map(year => (
            <div key={year.year} className="pb-2">
              <h3 className="italic form-text-color font-weight-basic username-spacing-comm leading-6 md:leading-8">{year.year}</h3>
              
              <div className="flex gap-1.5 flex-wrap">
              {year.works.map(other => (
                <Link key={other.id} href={`/portfolio/graphic/${other.id}`} data-cursor-target
                className="px-1 bg-[var(--desc-text-color)] text-[var(--loading-bg)] opacity-60 hover:opacity-100 transition-all">
                  {other.title}
                </Link>
              ))}
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* right - img */}
    <div className="flex flex-col gap-1
    absolute -z-1 mt-10 pb-10 px-4 
    right-0 top-79 sm:top-71 md:top-0
    w-full md:w-2/3">
    {work.detailImages.map((img, index)=> (
      <Image key={index} src={img} 
      alt={`${work.title} ${index+1}`}
      width={1240} height={886} priority quality={100}
      placeholder="blur" 
      blurDataURL={work.photoBlur?.[index] || ""}
      />
    ))}
    </div>
    </>
  );
}