declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

type SvgrComponent = React.FunctionComponent<React.SVGAttributes<SVGElement>>;

declare module '*.svg' {
  const svgUrl: string;
  const svgComponent: SvgrComponent;
  export default svgUrl;
  export { svgComponent as ReactComponent };
}

declare const __REACT_FLOW_VERSION__: string;
declare const __ENV__: string;
declare const __INJECT_STYLES__: boolean;
