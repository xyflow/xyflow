export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross'
}

export type BackgroundProps = {
  id?: string;
  /** Color of the background */
  bgColor?: string;
  /** Color of the pattern */
  patternColor?: string;
  /** Class applied to the pattern */
  patternClass?: string;
  /** Class applied to the container */
  class?: string;
  /** Gap between repetitions of the pattern */
  gap?: number | [number, number];
  /** Size of a single pattern element */
  size?: number;
  /** Line width of the Line pattern */
  lineWidth?: number;
  /** Variant of the pattern
   * @example BackgroundVariant.Lines, BackgroundVariant.Dots, BackgroundVariant.Cross
   * 'lines', 'dots', 'cross'
   */
  variant?: BackgroundVariant;
};
