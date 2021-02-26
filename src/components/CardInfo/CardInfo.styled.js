import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 30px;
  box-shadow: 0 0 8px 0 rgb(0 0 0 / 25%);
  border: 3px solid
    ${({ place }) =>
      place === 0 ? "Gold" : place === 1 ? "Silver" : "Chocolate"};
  border-radius: 8px;
  width: 75%;
  margin: 16px auto;

  div {
    font-size: 24px;
  }

  h1,
  h2 {
    margin: 0;
  }

  meter[value="1"]::-webkit-meter-optimum-value {
    background: green;
  }
  meter[value="2"]::-webkit-meter-optimum-value {
    background: orange;
  }
  meter[value="3"]::-webkit-meter-optimum-value {
    background: red;
  }
`;
