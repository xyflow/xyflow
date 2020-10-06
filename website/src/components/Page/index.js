import React from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from 'emotion-theming';
import { Flex, Box } from 'reflexbox';

import Header from 'components/Header';
import Footer from 'components/Footer';
import themes from 'themes';

import NormalizeStyle from 'themes/normalize';
import GlobalStyle from 'themes/global';
import MetaTags from './MetaTags';
import { getThemeColor } from 'utils/css-utils';

const PageWrapper = styled(Flex)`
  color: ${getThemeColor('text')};
  width: 100%;
  position: relative;
  flex-direction: column;
  height: 100vh;
  position: relative;
`;

const PageContent = styled(Box)`
  flex: 1 0 auto;
`;

const Page = ({
  children,
  theme = 'light',
  metaTags,
  footerBorder = false,
  ...rest
}) => {
  const pageTheme = themes[theme];

  return (
    <ThemeProvider theme={pageTheme}>
      <MetaTags {...metaTags} />
      <NormalizeStyle />
      <GlobalStyle />
      <PageWrapper>
        <Header />
        <PageContent {...rest}>{children}</PageContent>
        <Footer hasBorder={footerBorder} />
      </PageWrapper>
    </ThemeProvider>
  );
};

export default Page;
