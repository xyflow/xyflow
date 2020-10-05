import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming';

import WbkdLogoWhite from 'assets/images/logo-white.svg';
import WbkdLogoBlack from 'assets/images/logo.svg';

const Image = styled.img`
  display: block;
  width: 75px;
`;

const getLogoSrc = (type, inverted, theme) => {
  if (type) {
    return type === 'white' ? WbkdLogoWhite : WbkdLogoBlack;
  }

  if (inverted) {
    return theme.name === 'light' ? WbkdLogoWhite : WbkdLogoBlack;
  }

  return theme.name === 'light' ? WbkdLogoBlack : WbkdLogoWhite;
};

export default ({ type = null, inverted = false, style = {} }) => {
  const theme = useTheme();
  const logoSrc = getLogoSrc(type, inverted, theme);

  return <Image src={logoSrc} alt="webkid logo" style={style} />;
};
