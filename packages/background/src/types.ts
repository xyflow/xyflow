import { CSSProperties } from 'react';

export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross',
}

export type BackgroundProps = {
  id?: string
  color?: string;
  className?: string;
  gap?: number | [number, number];
  size?: number;
  offset?: number;
  lineWidth?: number;
  variant?: BackgroundVariant;
  style?: CSSProperties;
};
