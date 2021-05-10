import React from "react";
import styled from "styled-components";
import { Header, Categories, Flex, CardInfo } from "components";

const Wrapper = styled.div`
  hr {
    width: 100%;
    height: 4px;
    background: black;
  }
`;

const Layout = ({ children }) => {
  return (
    <Wrapper>
      <Header />
      {children}
    </Wrapper>
  );
};

export default Layout;
