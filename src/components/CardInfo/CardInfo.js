import React from "react";

import { Flex } from "components";
import * as S from "./CardInfo.styled";
import CC from "images/credit-card-placeholder.jpeg";

const CardInfo = ({ winner, place }) => {
  console.log(place);
  return (
    <S.Wrapper place={place}>
      <Flex column>
        <img src={CC} alt="Credit Card" />
        <button style={{ width: "100%", margin: "16px 0" }}>Apply Now</button>
        <button style={{ width: "100%" }}>View Details</button>
      </Flex>
      <Flex column align="flex-start">
        <h2>{winner?.cardName}</h2>
        <div>Annual Fee: {winner?.annualFee || 0}</div>
        <div>Signup Promotion: {winner?.currentSignUpPromotion || 0}</div>
        <Flex>
          <div style={{ marginRight: "16px" }}>
            Credits: {winner?.credits || 0}
          </div>
          <meter id={place} value={place + 1} min="0" max="3"></meter>
        </Flex>
      </Flex>
      <Flex column justify="center">
        <h1>${winner?.value}</h1>
      </Flex>
    </S.Wrapper>
  );
};

export default CardInfo;
