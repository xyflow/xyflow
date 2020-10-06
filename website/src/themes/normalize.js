import React, { memo } from 'react';
import { Global, css } from '@emotion/core';
import emotionNormalize from 'emotion-normalize';

const NormalizeStyle = memo(() => {
  const globalStyles = css`
    ${emotionNormalize}

    input {
      box-sizing: border-box;
    }
  `;

  return <Global styles={globalStyles} />;
});

export default NormalizeStyle;
