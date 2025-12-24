import { getPortfolioData } from '@/lib/portfolio/utils';
import { WorkCategory } from '../../app/(tabs)/portfolio/actions';
import HandleBackBtn from '../community/posts/handle-back-btn';
import Image from 'next/image';
import OtherWorks from './other-btn';

interface PortfolioDetailProps{
  params: Promise<{id: string}>;
  category: WorkCategory;
};

export default async function PortfolioDetail({params, category}: PortfolioDetailProps){
  const {work, otherWorks} = await getPortfolioData(params, category);

  return(
    <>
    <div className="fixed left-0 p-4 pb-2
    pt-10 mode-svg-color-50 w-full md:w-1/3 md:pr-0
    backdrop-blur-md">
      <div className="flex items-start">
        {/* left - backBtn */}
        <HandleBackBtn/>
        {/* middle */}
        <div className="flex flex-col gap-2 w-full">
          {/* desc */}
          <div className="py-2 px-3 md:py-2.5 md:px-3.5
          mode-svg-color-70 backdrop-blur-md rounded-3xl form-text-color">

            <p className="opacity-60 italic 
            font-weight-basic username-spacing
            text-xs md:text-sm lg:text-base xl:text-lg">{work.date}</p>

            <h3 className="leading-5 md:leading-6 lg:leading-7
            desc-text-color text-xl md:text-2xl lg:text-3xl font-weight-basic username-spacing">{work.title}</h3>

            <div className="pt-3 xl:pt-6
            text-xs md:text-sm lg:text-base xl:text-lg lg:leading-6">
              <p className="font-weight-basic username-spacing">▪ {work.type}</p>
              <p className="font-weight-basic username-spacing">▪ Project : <span className="opacity-60 font-weight-form username-spacing">
                {work.project}</span>
              </p>
              <p className="font-weight-basic username-spacing">▪ Tools : <span className="opacity-60 font-weight-form username-spacing">{work.tools.join(", ")}</span>
              </p>
              <p className="pt-3 xl:pt-6 font-weight-basic username-spacing-desc">{work.desc}</p>
            </div>
          </div>
          {/* menu */}
          <OtherWorks otherWorks={otherWorks} category={category} />
        </div>
      </div>
    </div>

    {/* right - img */}
    <div className="flex flex-col gap-1
    absolute -z-1 mt-10 pb-10 px-4 
    right-0 top-67 sm:top-56 md:top-0
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