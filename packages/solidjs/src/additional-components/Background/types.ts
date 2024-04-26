
import { JSX } from 'solid-js';

export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross',
}

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
  offset?: number;
  /** Line width of the Line pattern */
  lineWidth?: number;
  /** Variant of the pattern
   * @example BackgroundVariant.Lines, BackgroundVariant.Dots, BackgroundVariant.Cross
   * 'lines', 'dots', 'cross'
   */
  variant?: BackgroundVariant;
  /** Style applied to the container */
  style?: JSX.CSSProperties;
};
