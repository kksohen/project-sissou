import { getOtherWorks, getWorkById, WorkCategory } from "@/app/(tabs)/portfolio/actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generatePortfolioMetadata(params: Promise<{id: string}>, category: WorkCategory):Promise<Metadata>{
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return{
      title: "게시글을 찾을 수 없습니다."
    }
  };
  const work = await getWorkById(idNumber, category);

  if(!work){
    return{
      title: "게시글을 찾을 수 없습니다."
    }
  };

  return{
    title: `${work.title}`
  };
};

export async function getPortfolioData(params: Promise<{id: string}>, category: WorkCategory){
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return notFound();
  };

  const work = await getWorkById(idNumber, category);
  if(!work) return notFound();

  //이전, 다음 게시물 받아오기
  const otherWorks = await getOtherWorks(category, idNumber);

  return{
    work, otherWorks
  };
};