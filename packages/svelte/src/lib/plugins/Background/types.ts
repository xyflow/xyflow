export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross'
}

export type BackgroundProps = {
  bgColor?: string;
  patternColor?: string;
  patternClass?: string;
  class?: string;
  gap?: number | [number, number];
  size?: number;
  lineWidth?: number;
  variant?: BackgroundVariant;
};
