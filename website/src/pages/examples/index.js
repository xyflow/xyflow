import React from 'react';

import ExamplePage from 'components/Page/Example';
import Flow from 'example-flows/Overview';
import { ReactFlowProvider } from 'react-flow-renderer';

export const frontmatter = {
  title: 'Overview',
  slug: '',
  order: 0,
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
