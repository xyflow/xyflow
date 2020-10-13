module.exports = {
  siteMetadata: {
    title: `React Flow`,
    siteUrl: `https://reactflow.dev`,
    description:
      'React Flow is a highly customizable library for building interactive node-based editors, flow charts and diagrams.',
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'exampleflows',
        path: `${__dirname}/src/example-flows`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown`,
        path: `${__dirname}/src/markdown`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/src/assets`,
        ignore: [`**/.*`], // ignore files starting with a dot
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: `src/assets/images/react-flow-logo.svg`,
        name: `React Flow`,
        short_name: `react-flow`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#1A192B`,
        display: `standalone`,
        lang: 'en',
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-remark-images`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              linkImagesToOriginal: false,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
              showCaptions: true,
              quality: 85,
              backgroundColor: 'white',
              linkImagesToOriginal: false,
            },
          },
          'gatsby-remark-copy-linked-files',
        ],
        remarkPlugins: [require('remark-unwrap-images')],
        extensions: [`.md`, `.mdx`],
      },
    },
    `gatsby-transformer-json`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-react-svg`,
      options: {
        rule: {
          include: /icons/,
        },
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-netlify`,
    `gatsby-transformer-javascript-frontmatter`,
  ],
};
