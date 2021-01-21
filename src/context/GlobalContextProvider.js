import React, { useReducer, createContext, useContext } from "react";

const GlobalStateContext = createContext();
const GlobalDispatchContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);
export const useGlobalDispatch = () => useContext(GlobalDispatchContext);

const initialState = {
  categories: {
    flights: false,
    hotels: false,
    rideShare: false,
    rentalCar: false,
    cruises: false,
    travelAgencies: false,
    restaurants: false,
    foodDeliveryServices: false,
    groceryStores: false,
    drugstores: false,
    entertainment: false,
    gasStations: false,
    streamingServices: false,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CATEGORIES": {
      return {
        ...state,
        categories: action?.payload,
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
