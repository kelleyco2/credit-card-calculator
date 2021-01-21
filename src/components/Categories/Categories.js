import React from "react";
import * as S from "./Categories.styled";
import { Flex } from "components";
import { spendingCategories } from "../../mocks/spending-categories";
import camelCase from "lodash.camelcase";
import { FaWindowClose } from "react-icons/fa";
import {
  useGlobalState,
  useGlobalDispatch,
} from "context/GlobalContextProvider";

const Categories = () => {
  const state = useGlobalState();
  const dispatch = useGlobalDispatch();

  const handleCheckBox = (e) => {
    const categoriesCopy = { ...state?.categories };
    categoriesCopy[e?.target?.name] = e?.target?.checked;
    dispatch({
      type: "SET_CATEGORIES",
      payload: categoriesCopy,
    });
  };

  const handleRemove = (category) => {
    const categoriesCopy = { ...state?.categories };
    categoriesCopy[category] = false;
    dispatch({
      type: "SET_CATEGORIES",
      payload: categoriesCopy,
    });
  };

  return (
    <S.Wrapper>
      <Flex wrap="true" justify="flex-start" margin="0 0 32px 0">
        {spendingCategories.map(
          ({ category, icon }) =>
            state?.categories[camelCase(category)] === true && (
              <S.CategoryIcon key={category}>
                {icon()}
                <S.Remove onClick={() => handleRemove(camelCase(category))}>
                  <FaWindowClose />
                </S.Remove>
              </S.CategoryIcon>
            )
        )}
      </Flex>
      {spendingCategories.map(({ category, icon }) => (
        <Flex key={category} margin="0 0 16px 0">
          <Flex justify="center">
            {icon()}
            <p>{category}</p>
          </Flex>
          <input
            type="checkbox"
            checked={state?.categories[camelCase(category)]}
            name={camelCase(category)}
            onChange={handleCheckBox}
          />
        </Flex>
      ))}
    </S.Wrapper>
  );
};

export default Categories;
