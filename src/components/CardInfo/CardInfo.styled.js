import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 20px 30px;
  box-shadow: 0 0 8px 0 rgb(0 0 0 / 25%);
  border: 3px solid
    ${({ place, myCard }) =>
      myCard
        ? "black"
        : place === 0
        ? "Gold"
        : place === 1
        ? "Silver"
        : "Chocolate"};
  border-radius: 8px;
  width: 75%;
  margin: 16px auto;

  div {
    font-size: 24px;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  meter[value="1"]::-webkit-meter-optimum-value {
    background: green;
  }
  meter[value="2"]::-webkit-meter-optimum-value {
    background: yellow;
  }
  meter[value="3"]::-webkit-meter-optimum-value {
    background: orange;
  }
  meter[value="4"]::-webkit-meter-optimum-value {
    background: orangered;
  }
  meter[value="5"]::-webkit-meter-optimum-value {
    background: red;
  }
`;

export const Multiplier = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;
