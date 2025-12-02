/**
 * Background pattern variants available in Angular Flow.
 * Provides visual grid patterns to improve UX and spatial awareness.
 */
export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross',
}

/**
 * Configuration options for the Background component.
 * Supports multiple layers and customizable visual patterns.
 */
export interface BackgroundProps {
  /** When multiple backgrounds are present, each should have a unique id. */
  id?: string;
  
  /** Color of the background area. */
  bgColor?: string;
  
  /** Color of the pattern elements (dots, lines, crosses). */
  patternColor?: string;
  
  /** CSS class applied to the pattern elements. */
  patternClass?: string;
  
  /** CSS class applied to the background container. */
  className?: string;
  
  /**
   * The gap between pattern elements. 
   * Pass a tuple to control x and y gap independently.
   * @default 20
   */
  gap?: number | [number, number];
  
  /**
   * The radius of dots or size of crosses.
   * Ignored for lines variant.
   * @default 1 for dots/lines, 6 for cross
   */
  size?: number;
  
  /**
   * Pattern offset for fine positioning control.
   * @default 0
   */
  offset?: number | [number, number];
  
  /**
   * Stroke thickness for pattern drawing.
   * @default 1
   */
  lineWidth?: number;
  
  /**
   * Pattern variant to render.
   * @default BackgroundVariant.Dots
   */
  variant?: BackgroundVariant;
  
  /** Additional CSS styles for the container. */
  style?: { [key: string]: any };
}