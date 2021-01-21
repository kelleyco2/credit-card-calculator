import React from "react";
import GlobalContextProvider from "context/GlobalContextProvider";

export const wrapRootElement = ({ element }) => (
  <GlobalContextProvider>{element}</GlobalContextProvider>
);
