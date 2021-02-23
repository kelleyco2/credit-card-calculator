import styled from "styled-components";

const Flex = styled.div`
  display: flex;
  flex-direction: ${({ column }) => (column ? "column" : "row")};
  justify-content: ${({ justify }) => (justify ? justify : "space-between")};
  align-items: ${({ align }) => (align ? align : "center")};
  flex-wrap: ${({ wrap }) => (wrap ? "wrap" : "nowrap")};
  width: ${({ width }) => width};
  max-width: ${({ maxWidth }) => maxWidth};
  height: ${({ height }) => height};
  padding: ${({ padding }) => padding};
  margin: ${({ margin }) => margin};
`;

export default Flex;
