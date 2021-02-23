import React, { useReducer, createContext, useContext } from "react";

const GlobalStateContext = createContext();
const GlobalDispatchContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);
export const useGlobalDispatch = () => useContext(GlobalDispatchContext);

const isSSR = typeof window === "undefined";
//TODO: Add session storage
const existingSteps = JSON.parse(!isSSR && sessionStorage.getItem("steps"));
const existingWinners = JSON.parse(!isSSR && sessionStorage.getItem("winners"));
const existingCategories = JSON.parse(
  !isSSR && sessionStorage.getItem("categories")
);
const existingCategoryValues = JSON.parse(
  !isSSR && sessionStorage.getItem("categoryValues")
);
const existingTotalSpending = JSON.parse(
  !isSSR && sessionStorage.getItem("totalSpending")
);

const initialState = {
  steps: existingSteps || [true, false, false],
  winners: existingWinners || [],
  categories: existingCategories || {
    shopping: false,
    foodDrink: false,
    other: true,
    gas: false,
    groceries: false,
    entertainment: false,
    hotels: false,
    transit: false,
    flights: false,
    rentalCar: false,
    otherTravel: false,
    drugstores: false,
  },
  categoryValues: existingCategoryValues || {
    shopping: 0,
    foodDrink: 0,
    other: 0,
    gas: 0,
    groceries: 0,
    entertainment: 0,
    hotels: 0,
    transit: 0,
    flights: 0,
    rentalCar: 0,
    otherTravel: 0,
    drugstores: 0,
  },
  totalSpending: existingTotalSpending || 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CATEGORIES": {
      !isSSR &&
        sessionStorage.setItem("categories", JSON.stringify(action?.payload));
      return {
        ...state,
        categories: action?.payload,
      };
    }
    case "SET_CATEGORY_VALUES": {
      !isSSR &&
        sessionStorage.setItem(
          "categoryValues",
          JSON.stringify(action?.payload)
        );
      return {
        ...state,
        categoryValues: action?.payload,
      };
    }
    case "SET_STEPS": {
      !isSSR &&
        sessionStorage.setItem("steps", JSON.stringify(action?.payload));
      return {
        ...state,
        steps: action?.payload,
      };
    }
    case "SET_TOTAL_SPENDING": {
      !isSSR &&
        sessionStorage.setItem(
          "totalSpending",
          JSON.stringify(action?.payload)
        );
      return {
        ...state,
        totalSpending: action?.payload,
      };
    }
    case "SET_WINNERS": {
      !isSSR &&
        sessionStorage.setItem("winners", JSON.stringify(action?.payload));
      return {
        ...state,
        winners: action?.payload,
      };
    }
    case "RESET": {
      !isSSR && sessionStorage.clear();
      return {
        steps: [true, false, false],
        winners: [],
        categories: {
          shopping: false,
          foodDrink: false,
          other: true,
          gas: false,
          groceries: false,
          entertainment: false,
          hotels: false,
          transit: false,
          flights: false,
          rentalCar: false,
          otherTravel: false,
          drugstores: false,
        },
        categoryValues: {
          shopping: 0,
          foodDrink: 0,
          other: 0,
          gas: 0,
          groceries: 0,
          entertainment: 0,
          hotels: 0,
          transit: 0,
          flights: 0,
          rentalCar: 0,
          otherTravel: 0,
          drugstores: 0,
        },
      };
    }
    default:
      throw new Error("Bad Action Type");
  }
};

const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export default GlobalContextProvider;
