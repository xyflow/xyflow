import styled from '@emotion/styled';
import { Box } from 'reflexbox';

import { getThemeSpacePx, getThemeColor, device } from 'utils/css-utils';

export const H1 = styled.h1`
  font-size: ${(p) => p.theme.fontSizesPx[4]};
  line-height: 1.1;
  letter-spacing: 1px;
  font-weight: 900;
  margin: ${getThemeSpacePx(3)} 0;

  @media ${device.tablet} {
    font-size: ${(p) => p.theme.fontSizesPx[5]};
  }
`;

export const H2 = styled.h2`
  font-size: ${(p) => p.theme.fontSizesPx[3]};
  line-height: 1.1;
  letter-spacing: 1px;
  font-weight: 900;
  margin: ${getThemeSpacePx(3)} 0;

  @media ${device.tablet} {
    font-size: ${(p) => p.theme.fontSizesPx[4]};
  }
`;

export const H3 = styled.h3`
  font-size: ${(p) => p.theme.fontSizesPx[2]};
  line-height: 1.4;
  letter-spacing: 1px;
  font-weight: 900;
  margin: ${getThemeSpacePx(3)} 0;

  @media ${device.tablet} {
    font-size: ${(p) => p.theme.fontSizesPx[3]};
  }
`;

export const H4 = styled.h4`
  font-size: ${(p) => p.theme.fontSizesPx[1]};
  line-height: 1.3;
  letter-spacing: 1px;
  font-weight: 900;
  margin: ${getThemeSpacePx(2)} 0;

  @media ${device.tablet} {
    font-size: ${(p) => p.theme.fontSizesPx[2]};
  }
`;

export const H5 = H4;

export const UL = styled.ul`
  padding: 0;
  list-style: none;
`;

const BulletPointSvg = encodeURIComponent(
  `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="2" fill="#F7F8F8"/></svg>`
);

export const LI = styled.li`
  color: ${getThemeColor('textLight')};
  list-style-image: url('data:image/svg+xml;utf8,${BulletPointSvg}');
`;

export const Text = styled(Box)`
  font-size: ${(p) => p.theme.fontSizesPx[p.fontSize || 1]};
  line-height: 1.6;
`;

export const TextLight = styled(Text)`
  color: ${getThemeColor('textLight')};
`;

export const Label = styled(Box)`
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 1px;
`;

export const AttributionText = styled(TextLight)`
  text-align: center;
  margin-top: 12px;
  font-size: ${(p) => p.theme.fontSizesPx[0]};
`;

export const Paragraph = styled(Box)`
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
  letter-spacing: 0.5px;
  line-height: 1.5;

  code {
    color: ${(p) => p.theme.colors.violet};
  }
`;
