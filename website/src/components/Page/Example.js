import React from 'react';
import styled from '@emotion/styled';
import { Flex } from 'reflexbox';

import Page from 'components/Page';
import Sidebar from 'components/Sidebar';
import useExamplePages from 'hooks/useExamplePages';

const Wrapper = styled(Flex)`
  border-top: 1px solid ${(p) => p.theme.colors.silverLighten30};
  height: 100%;
  flex-grow: 1;
`;

export default ({ children, title, slug }) => {
  const menu = useExamplePages();

  const metaTags = {
    title: `React Flow - ${title} Example`,
    siteUrl: `https://reactflow.dev/examples/${slug}`,
    robots: 'index, follow',
  };

  return (
    <Page metaTags={metaTags} footerBorder>
      <Wrapper>
        <Sidebar menu={menu} />
        {children}
      </Wrapper>
    </Page>
  );
};
