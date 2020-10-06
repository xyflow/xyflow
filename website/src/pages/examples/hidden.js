import React from 'react';

import ExamplePage from 'components/Page/Example';
import Flow from 'example-flows/Hidden';
import { ReactFlowProvider } from 'react-flow-renderer';

export const frontmatter = {
  title: 'Hidden',
  slug: 'hidden',
  order: 12,
};

export default () => {
  return (
    <ExamplePage title={frontmatter.title} slug={frontmatter.slug}>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </ExamplePage>
  );
};
