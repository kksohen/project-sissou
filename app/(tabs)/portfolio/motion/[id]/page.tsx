import MotionDetail from "@/components/portfolio/motion-detail";
import { generatePortfolioMetadata } from "@/lib/portfolio/utils";

type Params = Promise<{id: string;}>;

export const generateMetadata = ({params}: {params : Params})=>generatePortfolioMetadata(params, "motion");

export default async function WebAppDetail({params}: {params: Params}){

  return(
    <MotionDetail params={params} category={"motion"}/>
  );
}