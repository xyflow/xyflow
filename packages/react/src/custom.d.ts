declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare const __DEV__: boolean;

type SvgrComponent = React.FunctionComponent<React.SVGAttributes<SVGElement>>;

declare module '*.svg' {
  const svgUrl: string;
  const svgComponent: SvgrComponent;
  export default svgUrl;
  export { svgComponent as ReactComponent };
}
