import PortfolioDetail from "@/components/portfolio/portfolio-detail";
import { generatePortfolioMetadata } from "@/lib/portfolio/utils";

type Params = Promise<{id: string;}>;

export const generateMetadata = ({params}: {params : Params})=>generatePortfolioMetadata(params, "graphic");

export default async function GraphicDetail({params}: {params: Params}){

  return(
    <PortfolioDetail params={params} category={"graphic"}/>
  );
}