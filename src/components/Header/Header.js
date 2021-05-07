import React from "react";
import { navigate } from "@reach/router";
import * as S from "./Header.styled";

const Header = () => {
  return (
    <S.Header>
      <h1 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        WhatCard
      </h1>
    </S.Header>
  );
};

export default Header;
