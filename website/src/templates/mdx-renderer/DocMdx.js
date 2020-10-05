import React from 'react';
import styled from '@emotion/styled';

import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import { H1, H2, H3, H4, Text } from 'components/Typo';
import CodeBlock from 'components/CodeBlock/Mdx';

import { getThemeSpacePx } from 'utils/css-utils';

const PostWrapper = styled.div`
  ${Text} {
    margin-bottom: ${getThemeSpacePx(3)};
    margin-top: ${getThemeSpacePx(3)};

    code {
      background: rgb(246, 248, 250);
      border-radius: 2px;
      padding: 0 3px;
    }
  }

  ul,
  ol {
    padding-left: ${getThemeSpacePx(5)};
  }

  li {
    margin-bottom: ${getThemeSpacePx(2)};
  }

  hr {
    max-width: calc(680px - 32px);
  }

  h1 {
    margin-top: ${getThemeSpacePx(6)};
  }

  h2 {
    margin-top: ${getThemeSpacePx(5)};
  }

  h3 {
    margin-top: ${getThemeSpacePx(4)};
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    a  {
      color: ${(p) => p.theme.colors.text};
    }
  }

  iframe {
    display: block;
    width: 100%;
  }

  .gatsby-resp-image-wrapper {
    border: 1px solid ${(p) => p.theme.colors.silver};
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: ${getThemeSpacePx(5)};
    margin-top: ${getThemeSpacePx(5)};
  }

  em {
    .gatsby-resp-image-figure {
      margin: 0;
    }

    .gatsby-resp-image-figcaption {
      font-style: normal;
    }
  }

  .gatsby-resp-image-figure {
    max-width: 1200px;
  }

  .gatsby-resp-image-figcaption {
    color: ${(p) => p.theme.colors.textLight};
    margin-top: -${getThemeSpacePx(5)};
    text-align: center;
  }

  a:hover {
    opacity: 0.6;
  }
`;

const DocH1 = styled(H1)`
  margin: ${getThemeSpacePx(6)} 0 ${getThemeSpacePx(3)} 0;
`;

const DocH2 = styled(H2)`
  margin: ${getThemeSpacePx(6)} 0 ${getThemeSpacePx(3)} 0;
`;

const DocH3 = styled(H3)`
  margin: ${getThemeSpacePx(6)} 0 ${getThemeSpacePx(3)} 0;
`;

const DocH4 = styled(H4)`
  margin: ${getThemeSpacePx(6)} 0 ${getThemeSpacePx(3)} 0;
`;

const CustomComponents = {
  h1: DocH1,
  h2: DocH2,
  h3: DocH3,
  h4: DocH4,
  p: Text,
  pre: (props) => <div {...props} />,
  code: CodeBlock,
};

const BlogMdx = ({ content = null }) => {
  return (
    <MDXProvider components={CustomComponents}>
      <PostWrapper>
        <MDXRenderer>{content}</MDXRenderer>
      </PostWrapper>
    </MDXProvider>
  );
};

export default BlogMdx;
