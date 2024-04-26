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
  const p = mergeProps({
    gap: 20,
    lineWidth: 1,
    offset: 2,
    variant: BackgroundVariant.Dots,
  }, _p);

  const ref = useRef<SVGSVGElement | null>(null);
  const { transform, patternId } = useStore(selector);
  const patternSize = () => p.size || defaultSize[p.variant];
  const isDots = () => p.variant === BackgroundVariant.Dots;
  const isCross = () => p.variant === BackgroundVariant.Cross;
  const gapXY = () => {
    const gap = p.gap;
    if (Array.isArray(gap)) {
      return gap;
    } else {
      return [gap, gap];
    }
  };
  const scaledGap: () => [number, number] = () => [gapXY()[0] * transform.get()[2] || 1, gapXY()[1] * transform.get()[2] || 1];
  const scaledSize = () => patternSize() * transform.get()[2];

  const patternDimensions: () => [number, number] = () => (isCross() ? [scaledSize(), scaledSize()] : scaledGap());

  const patternOffset = () => {
    if (isDots()) {
      return [scaledSize() / p.offset, scaledSize() / p.offset];
    } else {
      return [patternDimensions()[0] / p.offset, patternDimensions()[1] / p.offset];
    }
  };

  const _patternId = () => `${patternId}${p.id ? p.id : ''}`;

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
        x={transform.get()[0] % scaledGap()[0]}
        y={transform.get()[1] % scaledGap()[1]}
        width={scaledGap()[0]}
        height={scaledGap()[1]}
        patternUnits="userSpaceOnUse"
        patternTransform={`translate(-${patternOffset()[0]},-${patternOffset()[1]})`}
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
          <DotPattern radius={scaledSize() / p.offset} className={p.patternClassName} />
        </Show>
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${_patternId()})`} />
    </svg>
  );
}

BackgroundComponent.displayName = 'Background';

export const Background = BackgroundComponent;
