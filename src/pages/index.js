import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "gatsby";

import { Layout, Flex } from "components";
import { useGlobalDispatch } from "context/GlobalContextProvider";

const Hero = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 20vh;
`;

const Button = styled(Link)`
  padding: 8px 16px;
  background-color: black;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  margin-right: 16px;
`;

const Index = () => {
  const dispatch = useGlobalDispatch();
  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [dispatch]);
  return (
    <Layout>
      <Hero>
        <Flex column maxWidth="1240px" height="20vh">
          <h2 style={{ textAlign: "center" }}>
            Weclome to WhatCard! We're here to help you fin the best credit
            cards available based on your individual spending. To begin, choose
            below for what you'd like to do.
          </h2>
          <Flex>
            <Button to="/formula" state={{ selectCards: true }}>
              Compare My Cards
            </Button>
            <Button to="/formula" state={{ selectCards: true }}>
              Compare Multiple Cards
            </Button>
            <Button to="/formula" state={{ allCards: true }}>
              Open New Card
            </Button>
          </Flex>
        </Flex>
      </Hero>
    </Layout>
  );
};

export default Index;
