declare module "*.svg" {
  import { SVGProps } from "react";
  const ReactComponent: React.FunctionComponent<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}