import { JSX, Show, createEffect, mergeProps, splitProps } from 'solid-js';
import cc from 'classcat';

import { useStore } from '../../hooks/useStore';
import { DotPattern, LinePattern } from './Patterns';
import { containerStyle } from '../../styles/utils';
import { type BackgroundProps, BackgroundVariant } from './types';
import { type SolidFlowState } from '../../types';
import { useRef } from '../../utils/hooks';

const defaultSize = {
  [BackgroundVariant.Dots]: 1,
  [BackgroundVariant.Lines]: 1,
  [BackgroundVariant.Cross]: 6,
};

const selector = (s: SolidFlowState) => ({ transform: s.transform, patternId: `pattern-${s.rfId.get()}` });

function BackgroundComponent(_p: BackgroundProps) {
  const p = mergeProps(
    {
      variant: BackgroundVariant.Dots,
      gap: 20,
      lineWidth: 1,
      offset: 0,
    },
    _p
  );

  const ref = useRef<SVGSVGElement | null>(null);
  const storeData = useStore(selector);
  const patternSize = () => p.size || defaultSize[p.variant];
  const isDots = () => p.variant === BackgroundVariant.Dots;
  const isCross = () => p.variant === BackgroundVariant.Cross;
  const gapXY = () => {
    if (Array.isArray(p.gap)) {
      return p.gap;
    } else {
      return [p.gap, p.gap];
    }
  };
  const scaledGap: () => [number, number] = () => [
    gapXY()[0] * storeData.transform.get()[2] || 1,
    gapXY()[1] * storeData.transform.get()[2] || 1,
  ];
  const scaledSize = () => patternSize() * storeData.transform.get()[2];
  const offsetXY = () => {
    if (Array.isArray(p.offset)) {
      return p.offset;
    } else {
      return [p.offset, p.offset];
    }
  };

  const patternDimensions: () => [number, number] = () => (isCross() ? [scaledSize(), scaledSize()] : scaledGap());

  const scaledOffset: () => [number, number] = () => [
    offsetXY()[0] * storeData.transform.get()[2] || 1 + patternDimensions()[0] / 2,
    offsetXY()[1] * storeData.transform.get()[2] || 1 + patternDimensions()[1] / 2,
  ];

  const _patternId = () => `${storeData.patternId}${p.id ? p.id : ''}`;

  const style = (): JSX.CSSProperties => {
    return {
      ...p.style,
      ...containerStyle,
      '--xy-background-color-props': p.bgColor,
      '--xy-background-pattern-color-props': p.color,
    } as JSX.CSSProperties;
  };

  return (
    <svg
      class={cc(['react-flow__background', p.className])}
      style={style()}
      ref={(el) => (ref.current = el)}
      data-testid="rf__background"
    >
      <pattern
        id={_patternId()}
        x={storeData.transform.get()[0] % scaledGap()[0]}
        y={storeData.transform.get()[1] % scaledGap()[1]}
        width={scaledGap()[0]}
        height={scaledGap()[1]}
        patternUnits="userSpaceOnUse"
        patternTransform={`translate(-${scaledOffset()[0]},-${scaledOffset()[1]})`}
      >
        <Show
          when={isDots()}
          fallback={
            <LinePattern
              dimensions={patternDimensions()}
              lineWidth={p.lineWidth}
              variant={p.variant}
              className={p.patternClassName}
            />
          }
        >
          <DotPattern radius={scaledSize() / 2} className={p.patternClassName} />
        </Show>
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${_patternId()})`} />
    </svg>
  );
}

BackgroundComponent.displayName = 'Background';

/**
 * The `<Background />` component makes it convenient to render different types of backgrounds common in node-based UIs. It comes with three variants: lines, dots and cross.
 *
 * @example
 *
 * A simple example of how to use the Background component.
 *
 * ```tsx
 * import { ReactFlow, Background, BackgroundVariant } from '@xyflow/solid';
 *
 * export default function Flow() {
 *   return (
 *     <ReactFlow defaultNodes={[...]} defaultEdges={[...]}>
 *       <Background color="#ccc" variant={BackgroundVariant.Dots} />
 *     </ReactFlow>
 *   );
 * }
 * ```
 *
 * @example
 *
 * In this example you can see how to combine multiple backgrounds
 *
 * ```tsx
 * import { ReactFlow, Background, BackgroundVariant } from '@xyflow/solid';
 * import '@xyflow/solid/dist/style.css';
 *
 * export default function Flow() {
 *   return (
 *     <ReactFlow defaultNodes={[...]} defaultEdges={[...]}>
 *       <Background
 *         id="1"
 *         gap={10}
 *         color="#f1f1f1"
 *         variant={BackgroundVariant.Lines}
 *       />
 *       <Background
 *         id="2"
 *         gap={100}
 *         color="#ccc"
 *         variant={BackgroundVariant.Lines}
 *       />
 *     </ReactFlow>
 *   );
 * }
 * ```
 *
 * @remarks
 *
 * When combining multiple <Background /> components it's important to give each of them a unique id prop!
 *
 */
export const Background = BackgroundComponent;
