import React from 'react';

import ExamplePage from 'components/Page/Example';
import Flow from 'example-flows/Provider';

export const frontmatter = {
  title: 'Provider',
  slug: 'provider',
  order: 4,
};

export default () => {
  return (
    <ExamplePage title={frontmatter.title} slug={frontmatter.slug}>
      <Flow />
    </ExamplePage>
  );
};
