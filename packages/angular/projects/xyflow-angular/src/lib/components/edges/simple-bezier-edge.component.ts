import { Component, computed, input } from '@angular/core';
import { Position, getBezierEdgeCenter } from '@xyflow/system';
import { BaseEdgeComponent } from './base-edge.component';
import type { BaseEdgeProps, SimpleBezierEdgeProps } from './types';

export interface GetSimpleBezierPathParams {
  sourceX: number;
  sourceY: number;
  /** @default Position.Bottom */
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  /** @default Position.Top */
  targetPosition?: Position;
}

interface GetControlParams {
  pos: Position;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function getControl({ pos, x1, y1, x2, y2 }: GetControlParams): [number, number] {
  if (pos === Position.Left || pos === Position.Right) {
    return [0.5 * (x1 + x2), y1];
  }

  return [x1, 0.5 * (y1 + y2)];
}

/**
 * The `getSimpleBezierPath` util returns everything you need to render a simple
 * bezier edge between two nodes.
 * @public
 * @returns
 * - `path`: the path to use in an SVG `<path>` element.
 * - `labelX`: the `x` position you can use to render a label for this edge.
 * - `labelY`: the `y` position you can use to render a label for this edge.
 * - `offsetX`: the absolute difference between the source `x` position and the `x` position of the
 * middle of this path.
 * - `offsetY`: the absolute difference between the source `y` position and the `y` position of the
 * middle of this path.
 */
export function getSimpleBezierPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
}: GetSimpleBezierPathParams): [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number] {
  const [sourceControlX, sourceControlY] = getControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
  });
  const [targetControlX, targetControlY] = getControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
  });
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY,
  });

  return [
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
    labelX,
    labelY,
    offsetX,
    offsetY,
  ];
}

@Component({
  selector: 'simple-bezier-edge',
  standalone: true,
  imports: [BaseEdgeComponent],
  template: `
    <xy-base-edge
      [id]="id()"
      [path]="path()"
      [labelX]="labelX()"
      [labelY]="labelY()"
      [label]="label()"
      [labelStyle]="labelStyle()"
      [labelShowBg]="labelShowBg()"
      [labelBgStyle]="labelBgStyle()"
      [labelBgPadding]="labelBgPadding()"
      [labelBgBorderRadius]="labelBgBorderRadius()"
      [style]="style()"
      [markerEnd]="markerEnd()"
      [markerStart]="markerStart()"
      [interactionWidth]="interactionWidth() ?? 20"
    />
  `
})
export class SimpleBezierEdgeComponent {
  // Input properties
  id = input<string>();
  sourceX = input.required<number>();
  sourceY = input.required<number>();
  targetX = input.required<number>();
  targetY = input.required<number>();
  sourcePosition = input<Position>(Position.Bottom);
  targetPosition = input<Position>(Position.Top);
  label = input<BaseEdgeProps['label']>();
  labelStyle = input<BaseEdgeProps['labelStyle']>();
  labelShowBg = input<BaseEdgeProps['labelShowBg']>();
  labelBgStyle = input<BaseEdgeProps['labelBgStyle']>();
  labelBgPadding = input<BaseEdgeProps['labelBgPadding']>();
  labelBgBorderRadius = input<BaseEdgeProps['labelBgBorderRadius']>();
  style = input<BaseEdgeProps['style']>();
  markerEnd = input<BaseEdgeProps['markerEnd']>();
  markerStart = input<BaseEdgeProps['markerStart']>();
  interactionWidth = input<BaseEdgeProps['interactionWidth']>();

  // Computed path properties
  private pathData = computed(() => {
    return getSimpleBezierPath({
      sourceX: this.sourceX(),
      sourceY: this.sourceY(),
      sourcePosition: this.sourcePosition(),
      targetX: this.targetX(),
      targetY: this.targetY(),
      targetPosition: this.targetPosition(),
    });
  });

  path = computed(() => this.pathData()[0]);
  labelX = computed(() => this.pathData()[1]);
  labelY = computed(() => this.pathData()[2]);
}
