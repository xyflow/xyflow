/**
 * The Background can be either a dotted, lined or crossed one
 *
 * @default 'dots'
 */
export type BackgroundVariant = 'dots' | 'lines' | 'cross';

export interface BackgroundProps {
  /**
   * `<Background>` component id
   *
   * This is necessary when you have multiple flows with backgrounds visible at the same time.
   * If no id is explicitly assigned, an auto-generated one is used.
   *
   * @default `pattern-${vueFlowId}${id ? `-${id}` : ''}`
   */
  id?: string;
  /**
   * The background pattern variant {@link BackgroundVariant}
   *
   * @default 'dots'
   */
  variant?: BackgroundVariant;
  /**
   * The background pattern gap
   *
   * Can be either a number or [xGap: number, yGap: number], defining the gap on the X and Y axis respectively
   *
   * @default 20
   */
  gap?: number | number[];
  /**
   * The radius of each dot or the size of each rectangle if the `dots` or `cross` variant is used.
   *
   * Defaults to 1 or 6 respectively, and is ignored by the `lines` variant.
   */
  size?: number;
  /**
   * The stroke thickness used when drawing the pattern.
   *
   * @default 1
   */
  lineWidth?: number;
  /**
   * The background pattern color
   *
   * This only changes the color of the *pattern*, not the background color itself - use {@link BackgroundProps.bgColor} for that.
   */
  color?: string;
  /**
   * The background color
   */
  bgColor?: string;
  /**
   * Class applied to the pattern
   */
  patternClassName?: string;
  /**
   * Background x-coordinate (offset x)
   *
   * @default 0
   */
  x?: number;
  /**
   * Background y-coordinate (offset y)
   * @default 0
   */
  y?: number;
  /**
   * Background pattern offset
   *
   * @default 0
   */
  offset?: number | [number, number];
}
