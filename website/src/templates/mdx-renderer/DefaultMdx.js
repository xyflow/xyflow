import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';

const Mdx = ({ content = null }) => {
  return (
    <MDXProvider>
      <MDXRenderer>{content}</MDXRenderer>
    </MDXProvider>
  );
};

export default Mdx;
