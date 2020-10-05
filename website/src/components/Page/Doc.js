import React from 'react';
import styled from '@emotion/styled';
import { Flex, Box } from 'reflexbox';

import Page from 'components/Page';
import Sidebar from 'components/Sidebar';

const Wrapper = styled(Flex)`
  border-top: 1px solid ${(p) => p.theme.colors.silverLighten30};
`;

const DocWrapper = styled(Box)`
  max-width: 620px;
  margin: 0 auto;
  position: relative;
  padding: 0 16px;
`;

export default ({ children, menu = [], ...rest }) => (
  <Page {...rest} footerBorder>
    <Wrapper>
      <Sidebar menu={menu} isDocs />
      <DocWrapper>{children}</DocWrapper>
    </Wrapper>
  </Page>
);
