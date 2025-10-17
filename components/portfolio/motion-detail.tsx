import { IWork, WorkCategory } from "../../app/(tabs)/portfolio/actions";
import HandleBackBtn from "../community/posts/handle-back-btn";
import OtherWorks from "./other-btn";
import React from "react";
import { getPortfolioData } from "@/lib/portfolio/utils";
import Image from "next/image";
import P5CanvasWrap from "./p5-canvas-wrap";
import P5Canvas3 from "./p5-canvas3";

interface PortfolioDetailProps {
  params: Promise<{ id: string }>;
  category: WorkCategory;
}

const MotionRender: React.FC<{ work: IWork }> = ({ work }) => {
  switch (work.id) {
    case 9: return (
        <div className="aspect-video flex flex-col gap-1">
          {work.detailImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`${work.title} ${index + 1}`}
              width={1240}
              height={886}
              priority
              quality={100}
              placeholder="blur"
              blurDataURL={work.photoBlur?.[index] || ""}
            />
          ))}

          {work.video?.map((vid, index) => (
            <video
              key={index}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={vid} type="video/mp4"></source>
            </video>
          ))}
        </div>
      );
    case 10:
      return <P5CanvasWrap work={work}/>
    case 11:
      return <P5Canvas3 work={work} model="/assets/models/gun.obj"/>

    default:
      return <div>None Content</div>;
  }
};

export default async function MotionDetail({
  params,
  category,
}: PortfolioDetailProps) {
  const {work, otherWorks} = await getPortfolioData(params, category);

  return (
    <>
      <div className="fixed left-0 p-4 pb-2
      pt-10 mode-svg-color-50 w-full md:w-1/3 md:pr-0
      backdrop-blur-md">
        <div className="flex items-start">
          {/* left - backBtn */}
          <HandleBackBtn />
          {/* middle */}
          <div className="flex flex-col gap-2 w-full">
            {/* desc */}
            <div
              className="py-2 px-3 md:py-2.5 md:px-3.5
          mode-svg-color-70 backdrop-blur-md rounded-3xl form-text-color"
            >
              <p
                className="opacity-60 italic 
            font-weight-basic username-spacing-comm
            text-xs md:text-sm lg:text-base xl:text-lg"
              >
                {work.date}
              </p>

              <h3
                className="leading-5 md:leading-6 lg:leading-7
            desc-text-color text-xl md:text-2xl lg:text-3xl font-weight-basic username-spacing-comm"
              >
                {work.title}
              </h3>

              <div className="pt-3 xl:pt-6
            text-xs md:text-sm lg:text-base xl:text-lg lg:leading-6">
                <p className="font-weight-basic username-spacing-comm">
                  ▪ {work.type}
                </p>
                <p className="font-weight-basic username-spacing-comm">
                  ▪ Project :{" "}
                  <span className="opacity-60 font-weight-form">
                    {work.project}
                  </span>
                </p>
                <p className="font-weight-basic username-spacing-comm">
                  ▪ Tools :{" "}
                  <span className="opacity-60 font-weight-form">
                    {work.tools.join(", ")}
                  </span>
                </p>
                <p
                  className="pt-3 xl:pt-6 
              font-weight-basic username-spacing-desc"
                >
                  {work.desc}
                </p>
              </div>
            </div>
            {/* menu */}
            <OtherWorks otherWorks={otherWorks} category={category} />
          </div>
        </div>
      </div>

      {/* right - artwork */}
      <div className="absolute -z-1 mt-10 pb-10 px-4
      right-0 top-67 sm:top-56 md:top-0
      w-full md:w-2/3">
        <MotionRender work={work} />
      </div>
    </>
  );
}
