import { CSSProperties } from 'react';

export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross',
}

/**
 * @expand
 */
export type BackgroundProps = {
  id?: string;
  /** Color of the pattern */
  color?: string;
  /** Color of the background */
  bgColor?: string;
  /** Class applied to the container */
  className?: string;
  /** Class applied to the pattern */
  patternClassName?: string;
  /**
   * Gap between repetitions of the pattern
   * @default 20
   */
  gap?: number | [number, number];
  /** Size of a single pattern element */
  size?: number;
  /** Offset of the pattern
   * @default 0
   */
  offset?: number | [number, number];
  /** Line width of the Line pattern
   * @default 1
   */
  lineWidth?: number;
  /**
   * Variant of the pattern
   * @default BackgroundVariant.Dots
   * @example BackgroundVariant.Lines, BackgroundVariant.Dots, BackgroundVariant.Cross
   * 'lines', 'dots', 'cross'
   */
  variant?: BackgroundVariant;
  /** Style applied to the container */
  style?: CSSProperties;
};
