import React from 'react';
import { Helmet } from 'react-helmet';

const MetaTags = ({
  title,
  description,
  siteUrl,
  robots,
  image,
  pathname,
  article,
}) => {
  if (pathname) {
    siteUrl = `${siteUrl}${pathname}`;
  }

  if (image) {
    image = `https://reactflow.dev${image}`;
  } else {
    image = 'https://reactflow.dev/images/react-flow-header.jpg';
  }

  return (
    <Helmet defaultTitle="React Flow">
      <html lang="en" />
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {description && <meta name="robots" content={robots} />}

      {siteUrl && <meta property="og:url" content={siteUrl} />}
      {(article ? true : null) && <meta property="og:type" content="article" />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}

      {process.env.NODE_ENV === 'production' && (
        <script
          src="https://cdn.usefathom.com/script.js"
          site="LXMRMWLB"
          defer
        ></script>
      )}
    </Helmet>
  );
};

export default MetaTags;
