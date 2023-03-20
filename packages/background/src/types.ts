import { CSSProperties } from 'react';

export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross',
  TwinLines = 'twinLines'
}

export type BackgroundProps = {
  color?: string;
  twinColor?: string;
  className?: string;
  gap?: number | [number, number];
  twinGap?: number | [number, number];
  size?: number;
  lineWidth?: number;
  twinLineWidth?: number;
  variant?: BackgroundVariant;
  style?: CSSProperties;
};
