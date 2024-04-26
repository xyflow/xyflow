import { Component, JSX } from "solid-js";

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

type SvgrComponent = Component<JSX.SVGAttributes<SVGElement>>;

declare module '*.svg' {
  const svgUrl: string;
  const svgComponent: SvgrComponent;
  export default svgUrl;
  export { svgComponent as ReactComponent };
}
