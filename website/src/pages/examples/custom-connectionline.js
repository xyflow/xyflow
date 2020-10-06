import React from 'react';

import ExamplePage from 'components/Page/Example';
import Flow from 'example-flows/CustomConnectionLine';
import { ReactFlowProvider } from 'react-flow-renderer';

export const frontmatter = {
  title: 'Custom Connectionline',
  slug: 'custom-connectionline',
  order: 10,
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
