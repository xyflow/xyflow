import React from 'react';
import styled from '@emotion/styled';
import { Box } from 'reflexbox';

import { H1, H4 } from 'components/Typo';
import { getThemeSpacePx, getThemeColor } from 'utils/css-utils';

const SectionIntroWrapper = styled(Box)`
  text-align: center;
  /* padding-top: ${getThemeSpacePx(5)};
  padding-bottom: ${getThemeSpacePx(
    6
  )}; */
  max-width: 700px;
  margin: 0 auto;

  ${H1} {
    margin: 0 0 ${getThemeSpacePx(3)} 0;
  }
`;

const SectionSubtitle = styled(H4)`
  font-weight: 400;
  line-height: 1.5;
  color: ${getThemeColor('silverDarken30')};
`;

const SectionIntro = ({ title = '', text = '', ...props }) => {
  return (
    <SectionIntroWrapper pt={[3, 3, 5]} pb={[4, 4, 6]} {...props}>
      <H1>{title}</H1>
      {text && <SectionSubtitle>{text}</SectionSubtitle>}
    </SectionIntroWrapper>
  );
};

export default SectionIntro;
