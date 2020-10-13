import React from 'react';

import Page from 'components/Page';

const metaTags = {
  title: 'React Flow - 404',
  siteUrl: 'https://reactflow.dev/404',
  robots: 'noindex, nofollow',
};

const NotFound = () => {
  return <Page metaTags={metaTags}>Page not Found</Page>;
};

export default NotFound;
