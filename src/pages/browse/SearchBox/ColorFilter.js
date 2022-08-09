import { React } from 'react';
import styled from "styled-components";
import './ColorFilter.css';

const FilterColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin: 0px 5px;
  cursor: pointer;
`;
export const ColorFilter = () => {
    return (
        <div className="FilterContainer">
            <div className="Filter">
              <h4>Color</h4>
              <div className="Color-bar">
              <FilterColor color="black" />
              <FilterColor color="darkblue" />
              <FilterColor color="gray" />
              </div>
            </div>
        </div>
    )
};