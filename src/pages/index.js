import React, { useCallback, useState } from "react";

import { graphql } from "gatsby";
import startCase from "lodash.startcase";
import { useForm, Controller } from "react-hook-form";

import { Header, Categories, Flex } from "components";
import {
  useGlobalState,
  useGlobalDispatch,
} from "context/GlobalContextProvider";

const IndexPage = ({ data }) => {
  const { handleSubmit, control } = useForm();
  const state = useGlobalState();
  console.log("GLOBAL STATE: ", state);
  const dispatch = useGlobalDispatch();
  const {
    allContentfulCreditCard: { edges },
  } = data;

  // console.log("EDGES: ", edges);

  const [customMultiplier, setCustomMultiplier] = useState(null);

  const formula = useCallback(
    (spendingCategories, combo) => {
      let finalArray;
      const edgesCopy = [...edges];
      const filteredEdges = edgesCopy.filter(
        ({ node: { cardName } }) => !cardName.includes("+")
      );
      if (combo) {
        finalArray = edgesCopy;
      } else {
        finalArray = filteredEdges;
      }
      // console.log(finalArray);
      let cardName = "";
      let totals = [];
      let multiplier = 0;
      finalArray.map(({ node }, i) => {
        // console.log(`${node?.cardName}: ${i}`);
        if (customMultiplier) {
          multiplier = customMultiplier;
        } else if (
          node?.cardName === "Chase Sapphire Reserve" ||
          node?.cardName ===
            "Chase Sapphire Reserve + Chase Freedom Unlimited" ||
          node?.cardName.includes("Amex")
        ) {
          multiplier = 1.5;
        } else if (node?.cardName === "Chase Sapphire Preferred") {
          multiplier = 1.25;
        } else {
          multiplier = 1;
        }
        // console.log(`${node?.cardName} multiplier`, multiplier);
        const keys = Object.keys(spendingCategories);
        const total = keys.map((key) => {
          let total = 0;
          total += parseInt(spendingCategories[key]) * node[key];
          total *= multiplier;
          return total;
        });

        return totals.push(
          total.reduce((a, b) => a + b, 0) - node?.annualFee + node?.credits
        );
      });

      console.log("totals", totals);

      const max = totals.reduce((a, b) => {
        return Math.max(a, b);
      });

      const secondMax = (arr) => {
        const arrCopy = [...arr];
        arrCopy.splice(arr.indexOf(max), 1);
        const secondMax = arrCopy.reduce((a, b) => {
          return Math.max(a, b);
        });
        const secondMaxIndex = totals.indexOf(secondMax);
        return {
          max: secondMax,
          cardName: finalArray[secondMaxIndex]?.node.cardName,
        };
      };

      const thirdMax = (arr) => {
        const arrCopy = [...arr];
        arrCopy.splice(arrCopy.indexOf(max), 1);
        const secondMax = arrCopy.reduce((a, b) => {
          return Math.max(a, b);
        });
        arrCopy.splice(arrCopy.indexOf(secondMax), 1);
        const thirdMax = arrCopy.reduce((a, b) => {
          return Math.max(a, b);
        });
        const thirdMaxIndex = totals.indexOf(thirdMax);
        return {
          max: thirdMax,
          cardName: finalArray[thirdMaxIndex]?.node?.cardName,
        };
      };

      const secondPlace = secondMax(totals);
      const thirdPlace = thirdMax(totals);

      const cardIndex = totals.indexOf(max);
      cardName = finalArray[cardIndex]?.node?.cardName;

      const winner = {
        max,
        cardName,
      };

      dispatch({
        type: "SET_WINNERS",
        payload: [winner, secondPlace, thirdPlace],
      });
    },
    [edges, dispatch]
  );

  const submit = (categories) => {
    formula(categories, false);
    dispatch({
      type: "SET_CATEGORY_VALUES",
      payload: categories,
    });
    dispatch({
      type: "SET_STEPS",
      payload: [false, false, true],
    });
  };

  return (
    <>
      <Header />
      <main>
        {state?.steps?.[0] && <Categories />}
        {state?.steps?.[1] && (
          <form onSubmit={handleSubmit(submit)}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "700px",
                width: "100%",
                margin: "0 auto",
              }}
            >
              {Object.keys(state?.categories)
                .filter((key) => state?.categories?.[key] === true)
                .map((category) => (
                  <React.Fragment key={category}>
                    <label htmlFor={category}>{startCase(category)}</label>
                    <Controller
                      name={category}
                      control={control}
                      defaultValue={state?.categoryValues?.[category]}
                      render={({ onChange, value }) => (
                        <input
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                        />
                      )}
                    />
                  </React.Fragment>
                ))}
              {/* TODO */}
              {/* <h1>{`Total Annual Spending: ${}`}</h1> */}
            </div>
            <Flex width="700px" justify="space-between" margin="16px auto 0">
              <button
                onClick={() =>
                  dispatch({
                    type: "SET_STEPS",
                    payload: [true, false, false],
                  })
                }
              >
                Previous
              </button>
              <button type="submit">Show Results</button>
            </Flex>
          </form>
        )}
        {state?.steps?.[2] && (
          <Flex width="fit-content" column margin="0 auto">
            {/* <h1>{`Winner: ${winner?.cardName} $${winner?.max}`}</h1> */}
            {state?.winners?.map((winner, i) => (
              <h1 key={i}>{`${
                i === 0 ? "Winner" : i === 1 ? "2nd Place" : "3rd Place"
              }: ${winner?.cardName} $${winner?.max}`}</h1>
            ))}
            <Flex justify="space-between" width="700px" margin="0 0 20px 0">
              <button
                onClick={() =>
                  dispatch({ type: "SET_STEPS", payload: [false, true, false] })
                }
              >
                Previous
              </button>
              <button onClick={() => formula(state?.categoryValues, false)}>
                Show Single Card
              </button>
              <button onClick={() => formula(state?.categoryValues, true)}>
                Show Multiple Cards
              </button>
              <button onClick={() => dispatch({ type: "RESET" })}>
                Start Over
              </button>
            </Flex>
            <Flex>
              <label htmlFor="multiplier">Current Multiplier: </label>
              <input
                type="number"
                name="multiplier"
                value={customMultiplier}
                onChange={(e) => setCustomMultiplier(e?.target?.value)}
              />
              <button onClick={() => formula(state?.categoryValues, false)}>
                Re-calculate
              </button>
            </Flex>
          </Flex>
        )}
      </main>
    </>
  );
};

export default IndexPage;

export const query = graphql`
  query AllCreditCards {
    allContentfulCreditCard {
      edges {
        node {
          cardName
          annualFee
          credits
          shopping
          foodDrink
          other
          gas
          groceries
          entertainment
          hotels
          transit
          flights
          rentalCar
          otherTravel
          drugstores
        }
      }
    }
  }
`;
