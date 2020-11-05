declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

interface SvgrComponent extends React.FunctionComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const svgUrl: string;
  const svgComponent: SvgrComponent;
  export default svgUrl;
  export { svgComponent as ReactComponent };
}

declare var __REACT_FLOW_VERSION__: string;
declare var __ENV__: string;
