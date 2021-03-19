import React, { useCallback } from "react";

import { graphql } from "gatsby";
import startCase from "lodash.startcase";
import { useForm, Controller } from "react-hook-form";

import { Header, Categories, Flex, CardInfo } from "components";
import {
  useGlobalState,
  useGlobalDispatch,
} from "context/GlobalContextProvider";

const IndexPage = ({ data }) => {
  const { handleSubmit, control, register, watch } = useForm();
  const allFields = watch();
  // console.log("allFields", allFields);
  const state = useGlobalState();
  // console.log("GLOBAL STATE: ", state);
  const dispatch = useGlobalDispatch();
  const {
    allContentfulCreditCard: { edges },
  } = data;

  // console.log("EDGES: ", edges);

  const formula = useCallback(
    (spendingCategories, combo, multipliers) => {
      console.log("customMultiplier", multipliers);
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
        if (multipliers) {
          if (node?.cardName.includes("Amex") && node?.cashBack === false) {
            multiplier = parseInt(multipliers?.amex);
          } else if (
            node?.cardName.includes("Chase") &&
            node?.cashBack === false
          ) {
            multiplier = parseInt(multipliers?.chase);
          } else if (
            node?.cardName.includes("Citi") &&
            node?.cashBack === false
          ) {
            multiplier = parseInt(multipliers?.citi);
          } else {
            multiplier = 1;
          }
        } else {
          multiplier = node?.multiplier;
        }

        console.log("multiplier", `${node?.cardName}: ${multiplier}`);
        const keys = Object.keys(spendingCategories);
        const total = keys.map((key) => {
          let total = 0;
          total += spendingCategories[key] * node[key];
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
        // console.log(finalArray[i]?.node);
        return {
          value,
          ...finalArray[i]?.node,
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

  // console.log(state?.winners);

  const submit = useCallback(
    ({
      drugstores = 0,
      drugstores_time = 1,
      entertainment = 0,
      entertainment_time = 1,
      flights = 0,
      flights_time = 1,
      foodDrink = 0,
      foodDrink_time = 1,
      gas = 0,
      gas_time = 1,
      groceries = 0,
      groceries_time = 1,
      hotels = 0,
      hotels_time = 1,
      other = 0,
      other_time = 1,
      otherTravel = 0,
      otherTravel_time = 1,
      rentalCar = 0,
      rentalCar_time = 1,
      shopping = 0,
      shopping_time = 1,
      transit = 0,
      transit_time = 1,
    }) => {
      console.log(drugstores, drugstores_time);
      const newCategories = {
        drugstores: parseInt(drugstores) * parseInt(drugstores_time),
        entertainment: parseInt(entertainment) * parseInt(entertainment_time),
        flights: parseInt(flights) * parseInt(flights_time),
        foodDrink: parseInt(foodDrink) * parseInt(foodDrink_time),
        gas: parseInt(gas) * parseInt(gas_time),
        groceries: parseInt(groceries) * parseInt(groceries_time),
        hotels: parseInt(hotels) * parseInt(hotels_time),
        other: parseInt(other) * parseInt(other_time),
        otherTravel: parseInt(otherTravel) * parseInt(otherTravel_time),
        rentalCar: parseInt(rentalCar) * parseInt(rentalCar_time),
        shopping: parseInt(shopping) * parseInt(shopping_time),
        transit: parseInt(transit) * parseInt(transit_time),
      };
      console.log("newCategories", newCategories);
      formula(newCategories, false);
      const totalSpending = Object.keys(newCategories).reduce(
        (sum, key) => sum + parseFloat(newCategories[key] || 0),
        0
      );
      dispatch({
        type: "SET_TOTAL_SPENDING",
        payload: totalSpending,
      });
      dispatch({
        type: "SET_CATEGORY_VALUES",
        payload: newCategories,
      });
      dispatch({
        type: "SET_STEPS",
        payload: [false, false, true],
      });
    },
    [dispatch, formula]
  );

  const reCalc = (multipliers) => {
    // console.log(multipliers);
    formula(state?.categoryValues, false, multipliers);
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
                      <Flex justify="flex-start" margin="16px 0 0 0">
                        <React.Fragment key={category}>
                          <label
                            htmlFor={category}
                            style={{
                              marginRight: "16px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {startCase(category)}
                          </label>
                          <Controller
                            name={category}
                            control={control}
                            defaultValue={state?.categoryValues?.[category]}
                            render={({ onChange, value }) => (
                              <input
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                style={{ marginRight: "16px", width: "100%" }}
                              />
                            )}
                          />
                        </React.Fragment>
                        <select name={`${category}_time`} ref={register()}>
                          <option value={52}>Weekly</option>
                          <option value={12}>Monthly</option>
                          <option value={1} selected>
                            Yearly
                          </option>
                        </select>
                      </Flex>
                    )
                )}
              <Flex justify="flex-start" margin="16px 0 0 0">
                <>
                  <label htmlFor={"other"} style={{ marginRight: "16px" }}>
                    {startCase("other")}
                  </label>
                  <Controller
                    name={"other_time"}
                    control={control}
                    defaultValue={state?.categoryValues?.["other"]}
                    render={({ onChange, value }) => (
                      <input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        style={{ marginRight: "16px", width: "100%" }}
                      />
                    )}
                  />
                </>
                <select name={"other"} ref={register()}>
                  <option value={52}>Weekly</option>
                  <option value={12}>Monthly</option>
                  <option value={1} selected>
                    Yearly
                  </option>
                </select>
              </Flex>
            </div>
            <Flex
              width="100%"
              maxWidth="700px"
              justify="flex-end"
              margin="16px auto 0"
            >
              <button type="submit">Show Results</button>
            </Flex>
          </form>
        )}
        {state?.steps?.[2] && (
          <Flex width="100%" column margin="0 auto">
            <h2>{`Based on your spending of $${state?.totalSpending
              .toString()
              .replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )} a year, the following cards would give you the highest possible return on your credit card spending`}</h2>
            {state?.winners?.map((winner, i) => (
              <CardInfo winner={winner} place={i} />
            ))}
            <Flex
              justify="space-between"
              width="100%"
              maxWidth="700px"
              margin="0 0 20px 0"
              wrap={"true"}
            >
              <button
                onClick={() =>
                  dispatch({ type: "SET_STEPS", payload: [true, true, false] })
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
                <Flex column width="100%">
                  {["amex", "chase", "citi"].map((company) => (
                    <Flex width="100%" margin="0 0 16px 0" key={company}>
                      <label htmlFor={company}>
                        {startCase(company)} Membership Reward Value:{" "}
                      </label>
                      <input
                        type="number"
                        name={company}
                        ref={register()}
                        step="0.1"
                      />
                    </Flex>
                  ))}
                  <button type="submit">Re-calculate</button>
                </Flex>
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
          childContentfulCreditCardDescriptionTextNode {
            description
          }
          cashBack
          multiplier
          currentSignUpPromotion
          annualFee
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
          credits
          creditsTest
          creditsDifficulty
        }
      }
    }
  }
`;
