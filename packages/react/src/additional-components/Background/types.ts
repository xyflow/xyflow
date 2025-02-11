import { CSSProperties } from 'react';

/**
 * The three variants are exported as an enum for convenience. You can either import
 * the enum and use it like `BackgroundVariant.Lines` or you can use the raw string
 * value directly.
 * @public
 */
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
  /** Gap between repetitions of the pattern */
  gap?: number | [number, number];
  /** Size of a single pattern element */
  size?: number;
  /** Offset of the pattern */
  offset?: number | [number, number];
  /** Line width of the Line pattern */
  lineWidth?: number;
  /**
   * Variant of the pattern
   * @example BackgroundVariant.Lines, BackgroundVariant.Dots, BackgroundVariant.Cross
   * 'lines', 'dots', 'cross'
   */
  variant?: BackgroundVariant;
  /** Style applied to the container */
  style?: CSSProperties;
};
