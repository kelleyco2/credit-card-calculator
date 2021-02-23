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
  const { handleSubmit, control, register } = useForm();
  const state = useGlobalState();
  // console.log("GLOBAL STATE: ", state);
  const dispatch = useGlobalDispatch();
  const {
    allContentfulCreditCard: { edges },
  } = data;

  // console.log("EDGES: ", edges);

  const formula = useCallback(
    (spendingCategories, combo, customMultiplier) => {
      // console.log("customMultiplier", customMultiplier);
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
        // console.log("multiplier", multiplier);
        const keys = Object.keys(spendingCategories);
        const total = keys.map((key) => {
          let total = 0;
          total += parseInt(spendingCategories[key]) * node[key];
          // console.log("multiplier", multiplier);
          total *= multiplier;
          return total;
        });

        return totals.push(
          total.reduce((a, b) => a + b, 0) - node?.annualFee + node?.credits
        );
      });

      // console.log("totals", totals);

      const newTotals = totals.map((value, i) => {
        return {
          value,
          cardName: finalArray[i]?.node?.cardName,
        };
      });

      newTotals.sort((a, b) => b?.value - a?.value);
      const topThree = newTotals.slice(0, 3);

      dispatch({
        type: "SET_WINNERS",
        payload: topThree,
      });
    },
    [edges, dispatch]
  );

  const submit = (categories) => {
    console.log(categories);
    formula(categories, false);
    const totalSpending = Object.keys(categories).reduce(
      (sum, key) => sum + parseFloat(categories[key] || 0),
      0
    );
    dispatch({
      type: "SET_TOTAL_SPENDING",
      payload: totalSpending,
    });
    dispatch({
      type: "SET_CATEGORY_VALUES",
      payload: categories,
    });
    dispatch({
      type: "SET_STEPS",
      payload: [false, false, true],
    });
  };

  const reCalc = ({ multiplier }) => {
    formula(state?.categoryValues, false, parseInt(multiplier));
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
                .map(
                  (category) =>
                    category !== "other" && (
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
                    )
                )}
              <React.Fragment key={"other"}>
                <label htmlFor={"other"}>{startCase("other")}</label>
                <Controller
                  name={"other"}
                  control={control}
                  defaultValue={state?.categoryValues?.["other"]}
                  render={({ onChange, value }) => (
                    <input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  )}
                />
              </React.Fragment>
              {/* TODO */}
              {/* <h1>{`Total Annual Spending: ${}`}</h1> */}
            </div>
            <Flex
              width="100%"
              maxWidth="700px"
              justify="space-between"
              margin="16px auto 0"
            >
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
          <Flex width="100%" column margin="0 auto">
            <h1>{`Total Spending: $${state?.totalSpending}`}</h1>
            {state?.winners?.map((winner, i) => (
              <h1 key={i}>{`${
                i === 0 ? "Winner" : i === 1 ? "2nd Place" : "3rd Place"
              }: ${winner?.cardName} $${winner?.value}`}</h1>
            ))}
            <Flex
              justify="space-between"
              width="100%"
              maxWidth="700px"
              margin="0 0 20px 0"
              wrap
            >
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
              <form onSubmit={handleSubmit(reCalc)}>
                <label htmlFor="multiplier">Custom Multiplier: </label>
                <input type="number" name="multiplier" ref={register()} />
                <button type="submit">Re-calculate</button>
              </form>
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
