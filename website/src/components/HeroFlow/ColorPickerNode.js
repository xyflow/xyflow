import React, { memo, useCallback } from 'react';
import styled from '@emotion/styled';
import { Handle } from 'react-flow-renderer';

import { getThemeColor } from 'utils/css-utils';

const ColorPickerNodeWrapper = styled.div`
  padding: 10px;
  background: white;
  border: 1px solid ${getThemeColor('violet')};
  border-radius: 4px;
  box-shadow: ${(p) =>
    p.selected ? `0 0 0 0.25px ${p.theme.colors.violet}` : 'none'};

  .react-flow__handle {
    background: ${(p) => p.color};
  }

  input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    background: ${getThemeColor('silver')};
    outline: none;
    border-radius: 2px;
  }

  input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: ${(p) => p.color};
    cursor: pointer;
    border-radius: 100%;
  }

  input::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: ${(p) => p.color};
    cursor: pointer;
    border-radius: 100%;
  }
`;

const ColorPickerNode = memo(({ data, id, selected }) => {
  const onChange = useCallback((event) => data.onChange(event, id), [data, id]);
  const colorName = `${data.color[0].toUpperCase()}${data.color.substr(1)}`;

  return (
    <ColorPickerNodeWrapper
      color={data.color}
      value={data.value}
      selected={selected}
    >
      <div>{colorName} amount</div>
      <input
        type="range"
        min="0"
        max="255"
        value={data.value}
        onChange={onChange}
        className="nodrag"
      />
      <Handle type="source" position="right" />
    </ColorPickerNodeWrapper>
  );
});

export default ColorPickerNode;
