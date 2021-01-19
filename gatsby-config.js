require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: "credit-card-calculator",
  },
  plugins: [
    {
      resolve: "gatsby-source-contentful",
      options: {
        accessToken: `${process.env.GATSBY_CONTENTFUL_ACCESS_TOKEN}`,
        spaceId: `${process.env.GATSBY_CONTENTFUL_SPACE_ID}`,
      },
    },
    "gatsby-plugin-styled-components",
    "gatsby-plugin-sharp",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
  ],
};
