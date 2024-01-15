export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross'
}

export type BackgroundProps = {
  id?: string;
  /** color of the background */
  bgColor?: string;
  /** color of the pattern */
  patternColor?: string;
  /** class applied to the pattern */
  patternClass?: string;
  /** class applied to the container */
  class?: string;
  /** gap between repetitions of the pattern */
  gap?: number | [number, number];
  /** size of a single pattern element */
  size?: number;
  /** line width of the Line pattern */
  lineWidth?: number;
  /** variant of the pattern
   * @example BackgroundVariant.Lines, BackgroundVariant.Dots, BackgroundVariant.Cross
   * 'lines', 'dots', 'cross'
   */
  variant?: BackgroundVariant;
};
