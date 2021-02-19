require("dotenv").config();

const path = require("path");

module.exports = {
  siteMetadata: {
    title: `Credit Card`,
    description: ``,
    author: `Cooper Kelley`,
    siteUrl: `https://creditcardeval.com/`,
  },
  plugins: [
    {
      resolve: "gatsby-source-contentful",
      options: {
        accessToken: `${process.env.GATSBY_CONTENTFUL_ACCESS_TOKEN}`,
        spaceId: `${process.env.GATSBY_CONTENTFUL_SPACE_ID}`,
      },
    },
    {
      resolve: "gatsby-plugin-root-import",
      options: {
        root: path.join(__dirname, "src"),
        images: path.join(__dirname, "src/images"),
        components: path.join(__dirname, "src/components"),
        utils: path.join(__dirname, "src/utils"),
        context: path.join(__dirname, "src/context"),
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
