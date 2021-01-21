import React, { useState } from "react";
import * as S from "./Categories.styled";
import { Flex } from "components";
import { spendingCategories } from "../../mocks/spending-categories";
import camelCase from "lodash.camelcase";
import { FaWindowClose } from "react-icons/fa";

const Categories = () => {
  const [categories, setCategories] = useState({
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
  });

  console.log(categories);

  const handleCheckBox = (e) => {
    const categoriesCopy = { ...categories };
    categoriesCopy[e?.target?.name] = e?.target?.checked;
    setCategories(categoriesCopy);
  };

  const handleRemove = (category) => {
    const categoriesCopy = { ...categories };
    categoriesCopy[category] = false;
    setCategories(categoriesCopy);
  };

  return (
    <S.Wrapper>
      <Flex wrap justify="flex-start" margin="0 0 32px 0">
        {spendingCategories.map(({ category, icon }) => {
          if (categories[camelCase(category)] === true)
            return (
              <S.CategoryIcon>
                {icon()}
                <S.Remove onClick={() => handleRemove(camelCase(category))}>
                  <FaWindowClose />
                </S.Remove>
              </S.CategoryIcon>
            );
        })}
      </Flex>
      {spendingCategories.map(({ category, icon }) => (
        <Flex key={category}>
          <Flex justify="flex-start" margin="0 0 16px 0">
            {icon()}
            <p>{category}</p>
          </Flex>
          <input
            type="checkbox"
            checked={categories[camelCase(category)]}
            name={camelCase(category)}
            onClick={handleCheckBox}
          />
        </Flex>
      ))}
    </S.Wrapper>
  );
};

export default Categories;
