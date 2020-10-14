import React from 'react';
import styled from '@emotion/styled';
import { Flex, Box } from 'reflexbox';

import Page from 'components/Page';
import Sidebar from 'components/Sidebar';
import useExamplePages from 'hooks/useExamplePages';
import CodeBlock from 'components/CodeBlock';
import { H4 } from 'components/Typo';

import 'example-flows/Overview';

const Wrapper = styled(Flex)`
  flex-grow: 1;
`;

const ReactFlowWrapper = styled(Box)`
  flex-grow: 1;

  .react-flow {
    border-bottom: 1px solid ${(p) => p.theme.colors.silverLighten30};
    height: 65vh;
  }
`;

const SourceWrapper = styled(Box)`
  max-width: 1000px;
  margin: 0 auto;
`;

const SourceCodeBlock = ({ absolutePath, internal }) => {
  const splittedPath = absolutePath.split('/');
  const fileName = splittedPath[splittedPath.length - 1];

  return (
    <Box>
      <Box>{fileName}</Box>
      <CodeBlock code={internal.content} />
    </Box>
  );
};

export default ({ children, title, slug, sourceCodeFiles = [] }) => {
  const menu = useExamplePages();

  const metaTags = {
    title: `React Flow - ${title} Example`,
    siteUrl: `https://reactflow.dev/examples/${slug}`,
    robots: 'index, follow',
  };

  const hasSource = sourceCodeFiles.length > 0;

  return (
    <Page metaTags={metaTags} footerBorder>
      <Wrapper>
        <Sidebar menu={menu} />
        <ReactFlowWrapper>
          {children}
          {hasSource && (
            <SourceWrapper p={3}>
              <H4 as="div">{title} Source Code</H4>
              {sourceCodeFiles.map((source) => (
                <SourceCodeBlock key={source.absolutePath} {...source} />
              ))}
            </SourceWrapper>
          )}
        </ReactFlowWrapper>
      </Wrapper>
    </Page>
  );
};
