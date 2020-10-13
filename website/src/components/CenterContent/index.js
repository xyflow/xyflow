import styled from '@emotion/styled';
import { Box } from 'reflexbox';

import { getThemeSpacePx } from 'utils/css-utils';

export default styled(Box)`
  max-width: ${(p) =>
    p.maxWidth || (p.big ? p.theme.maxWidthBig : p.theme.maxWidth)};
  margin-left: auto;
  margin-right: auto;
  padding-left: ${getThemeSpacePx(3)};
  padding-right: ${getThemeSpacePx(3)};
`;
