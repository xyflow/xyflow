import React from 'react';
import styled from '@emotion/styled';
import slugify from 'slugify';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import { H1, H2, H3, H4, Text } from 'components/Typo';
import CodeBlock from 'components/CodeBlock/Mdx';
import InfoBox from 'components/InfoBox';
import Link from 'components/Link';
import { getThemeSpacePx } from 'utils/css-utils';

const DocWrapper = styled.div`
  ${Text} {
    margin-bottom: ${getThemeSpacePx(3)};
    margin-top: ${getThemeSpacePx(3)};

    code {
      background: rgb(246, 248, 250);
      border-radius: 2px;
      padding: 0 3px;
      font-size: 14px;
    }
  }

  ul,
  ol {
    padding-left: ${getThemeSpacePx(4)};
  }

  li {
    margin-bottom: ${getThemeSpacePx(2)};

    code {
      font-size: 14px;
    }
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

export const getAnchorId = (props = {}) => {
  let id = '';
  let nextChildren = props.children;

  // when a react component is passed instead of just text
  // we need to go through the children until we reach the text content
  while (nextChildren) {
    if (typeof nextChildren === 'string') {
      id = slugify(nextChildren, { lower: true });
    }

    nextChildren = nextChildren?.props?.children;
  }

  return id;
};

const CustomComponents = {
  h1: (props) => <DocH1 {...props} id={getAnchorId(props)} />,
  h2: (props) => <DocH2 {...props} id={getAnchorId(props)} />,
  h3: (props) => <DocH3 {...props} id={getAnchorId(props)} />,
  h4: (props) => <DocH4 {...props} id={getAnchorId(props)} />,
  p: Text,
  pre: (props) => <div {...props} />,
  code: CodeBlock,
  a: Link,
  InfoBox,
};

const BlogMdx = ({ content = null }) => {
  return (
    <MDXProvider components={CustomComponents}>
      <DocWrapper>
        <MDXRenderer>{content}</MDXRenderer>
      </DocWrapper>
    </MDXProvider>
  );
};

export default BlogMdx;
