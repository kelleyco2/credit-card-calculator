import React from "react";

import { Flex } from "components";
import * as S from "./CardInfo.styled";
import CC from "images/credit-card-placeholder.jpeg";

const CardInfo = ({ winner, place }) => {
  // console.log(place);
  // console.log(winner);
  return (
    <S.Wrapper place={place}>
      <Flex column>
        <img src={CC} alt="Credit Card" />
        <button style={{ width: "100%", margin: "16px 0" }}>Apply Now</button>
        <button style={{ width: "100%" }}>View Details</button>
      </Flex>
      <Flex column align="flex-start" justify="flex-start">
        <h2 style={{ marginBottom: "24px" }}>{winner?.cardName}</h2>
        <div style={{ marginBottom: "24px" }}>
          Annual Fee: ${winner?.annualFee || 0}
        </div>
        {winner?.currentSignUpPromotion && (
          <div>Signup Promotion: {winner?.currentSignUpPromotion}</div>
        )}
        {winner?.creditsTest && (
          <Flex column align="flex-start" margin="16px 0 0 0">
            <h3 style={{ margin: "0" }}>Credits</h3>
            {winner?.creditsTest.map((credit, i) => (
              <Flex margin="8px 0 0 0" key={i}>
                <p style={{ marginRight: "16px" }}>{credit}</p>
                {winner?.creditsDifficulty[i]}
                <meter
                  value={winner?.creditsDifficulty[i]}
                  min="0"
                  max="5"
                ></meter>
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>
      <Flex column justify="center" align="center">
        <p style={{ textAlign: "center" }}>
          Estimated
          <br /> Annual Cash
          <br /> Return{" "}
          <sup
            onClick={() =>
              alert(
                "Based on your spending, this represents the monetary value you could receive in a year after taking into account any annual fees or credits. This return is esclusive of any current sign up bonuses."
              )
            }
            style={{ color: "blue", cursor: "pointer" }}
          >
            1
          </sup>
        </p>
        <h1>${Math.ceil(winner?.value)}</h1>
      </Flex>
    </S.Wrapper>
  );
};

export default CardInfo;
