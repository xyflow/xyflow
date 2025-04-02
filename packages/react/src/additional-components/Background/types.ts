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
  /** When multiple backgrounds are present on the page, each one should have a unique id. */
  id?: string;
  /** Color of the pattern. */
  color?: string;
  /** Color of the background. */
  bgColor?: string;
  /** Class applied to the container. */
  className?: string;
  /** Class applied to the pattern. */
  patternClassName?: string;
  /**
   * The gap between patterns. Passing in a tuple allows you to control the x and y gap
   * independently.
   * @default 20
   */
  gap?: number | [number, number];
  /**
   * The radius of each dot or the size of each rectangle if `BackgroundVariant.Dots` or
   * `BackgroundVariant.Cross` is used. This defaults to 1 or 6 respectively, or ignored if
   * `BackgroundVariant.Lines` is used.
   */
  size?: number;
  /**
   * Offset of the pattern.
   * @default 0
   */
  offset?: number | [number, number];
  /**
   * The stroke thickness used when drawing the pattern.
   * @default 1
   */
  lineWidth?: number;
  /**
   * Variant of the pattern.
   * @default BackgroundVariant.Dots
   * @example BackgroundVariant.Lines, BackgroundVariant.Dots, BackgroundVariant.Cross
   * 'lines', 'dots', 'cross'
   */
  variant?: BackgroundVariant;
  /** Style applied to the container. */
  style?: CSSProperties;
};
