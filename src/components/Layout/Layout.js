import React from "react";
import { Header, Categories, Flex, CardInfo } from "components";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
