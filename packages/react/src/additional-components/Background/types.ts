import { CSSProperties } from 'react';

export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross',
}

export type BackgroundProps = {
  id?: string;
  /** color of the pattern */
  color?: string;
  /** color of the background */
  bgColor?: string;
  /** class applied to the container */
  className?: string;
  /** class applied to the pattern */
  patternClassName?: string;
  /** gap between repetitions of the pattern */
  gap?: number | [number, number];
  /** size of a single pattern element */
  size?: number;
  /** offset of the pattern */
  offset?: number;
  /** line width of the Line pattern */
  lineWidth?: number;
  /** variant of the pattern
   * @example BackgroundVariant.Lines, BackgroundVariant.Dots, BackgroundVariant.Cross
   * 'lines', 'dots', 'cross'
   */
  variant?: BackgroundVariant;
  /** style applied to the container */
  style?: CSSProperties;
};
