export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross'
}

export type BackgroundProps = {
  color?: string;
  class?: string;
  gap?: number | [number, number];
  size?: number;
  lineWidth?: number;
  variant?: BackgroundVariant;
  style?: string;
};
