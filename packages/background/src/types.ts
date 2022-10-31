import { CSSProperties } from 'react';

export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross',
}

export type BackgroundProps = {
  color?: string;
  className?: string;
  gap?: number | [number, number];
  size?: number;
  lineWidth?: number;
  variant?: BackgroundVariant;
  style?: CSSProperties;
};
