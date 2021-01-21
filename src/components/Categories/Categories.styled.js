import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 20px;

  p {
    margin: 0 0 0 16px;
  }
`;

export const CategoryIcon = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  margin: 0 0 8px 8px;
  background-color: lightGray;
  border-radius: 100%;
`;

export const Remove = styled.div`
  position: absolute;
  bottom: -5px;
  right: -5px;
`;
