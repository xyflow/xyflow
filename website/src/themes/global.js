import React from 'react';
import { useTheme } from 'emotion-theming';
import { Global, css } from '@emotion/core';

const GlobalStyle = () => {
  const theme = useTheme();

  const globalStyles = css`
    html,
    body {
      background-color: ${theme.colors.background};
      font-family: ${theme.fonts.sans};
      font-weight: 400;
      letter-spacing: 0.5px;
      line-height: 1.5;
      font-size: 16px;
      padding: 0;
      margin: 0;
      min-height: 100vh;
    }

    a {
      color: ${theme.colors.red};
      text-decoration: none;
    }

    a:visited,
    a:focus,
    a:active {
      color: ${theme.colors.red};
      text-decoration: none;
    }

    a:hover {
      color: ${theme.colors.red};
      text-decoration: none;
    }

    .fullOpacity {
      opacity: 1;
    }

    code,
    pre {
      font-family: ${theme.fonts.mono};
      background: rgb(246, 248, 250);
      padding: 2px 6px;
      border-radius: 5px;
    }
  `;

  return <Global styles={globalStyles} />;
};

export default GlobalStyle;
