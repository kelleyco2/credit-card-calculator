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
  height: 50vh;
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
        <Flex>
          <Button to="/formula" state={{ selectCards: true }}>
            Compare Multiple Cards
          </Button>
          <Button to="/formula" state={{ allCards: true }}>
            All Cards
          </Button>
        </Flex>
      </Hero>
    </Layout>
  );
};

export default Index;
