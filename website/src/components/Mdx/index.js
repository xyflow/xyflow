import React from 'react';
import styled from '@emotion/styled';

import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import { H1, H2, H3, H4, Text } from 'components/Typo';
import CodeBlock from 'components/Mdx/CodeBlock';
import CenterContent from 'components/CenterContent';

const doNotWrap = ['BlogpostAd'];

const MdxWrapper = ({ children }) => {
  return children.map((child, i) =>
    doNotWrap.includes(child.props?.mdxType) ? (
      child
    ) : (
      <CenterContent key={i} mb={2} maxWidth="680px">
        {child}
      </CenterContent>
    )
  );
};

const PostWrapper = styled.div`
  img {
    width: 100%;
  }

  .gatsby-resp-image-wrapper {
    border: 1px solid ${(p) => p.theme.colors.silver};
    border-radius: 2px;
    overflow: hidden;
  }
`;

const CustomComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: Text,
  pre: (props) => <div {...props} />,
  code: CodeBlock,
  wrapper: MdxWrapper,
};

const Mdx = ({ content = null }) => {
  return (
    <MDXProvider components={CustomComponents}>
      <PostWrapper>
        <MDXRenderer>{content}</MDXRenderer>
      </PostWrapper>
    </MDXProvider>
  );
};

export default Mdx;
