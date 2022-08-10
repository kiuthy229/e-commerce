import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import "./ViewProduct.css";
import {Filter} from "../SearchBox/Filter"

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      stock
      description
      colors {
        name
        hexValue
      }
      categories
      pictures
      sizes
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 0ox;
  padding: 5px 15px;
  margin-top: 100px;
`;
const Input = styled.input`
  border: none;
  background: none;
`;
export const Viewallproducts = () => {
  const { error, loading, data } = useQuery(GET_PRODUCTS);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);

  useEffect(() => {
    if (data) {
      setProducts(data.products);
    }
  });

  const OpenDetails = (id) => {
    //mo trang detail voi id =id treen
  };

  const handleSearch = () => {
    setSearchResult([]);
    setSearchClicked(true);
    if (searchTerm !== "") {
      const filteredProducts = products.filter((product, index) => {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setSearchResult(filteredProducts);
      // console.log(searchResult)
    }
  };
  const [selected, setSelected] = useState("");
  return (
    <div className="larger-container">
      <div id="slider-range"></div>
      <div className="customer-container">
        <div className="col-3">
          {/*Side-bar*/}
          <SearchContainer className="search-bar">
            <Input
              type="search"
              id="searchbar__input"
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button id="search" onClick={handleSearch}>
              <FaSearch />
            </button>
          </SearchContainer>
          <Filter/>
        </div>

        <div className="col-9">
          <div className="card-container">
            {products &&
              !searchClicked &&
              products.map((product) => (
                <a href={`/product/${product.id}`}>
                  <div class="product-card">
                    <div>
                      <img className="product-pic" src={process.env.PUBLIC_URL + "upload-images/" + product.pictures[0]}/>
                    </div>
                    <h1 class="product-name">{product.name}</h1>
                    <div class="product-colors"></div>
                    <div class="product-price">${product.price}</div>
                    <p>
                      <div>
                        <button className="product-button" onClick={() => OpenDetails(product.id)}>
                          Add to Cart
                        </button>
                      </div>
                    </p>
                  </div>
                </a>
              ))}

            {searchClicked &&
              searchResult.map((product) => (
                <a href="/product/6154c746-25df-4977-b3c4-ba7362a50043">
                  <div class="product-card">
                      <div>
                        <img
                          class="product-pic"
                          src={
                            process.env.PUBLIC_URL +
                            "upload-images/" +
                            product.pictures[0]
                          }
                        />
                      </div>
                      <h1 class="product-name">{product.name}</h1>
                      <div class="product-colors"></div>
                      <div class="product-price">${product.price}</div>
                      <p>
                        <div>
                          <button
                            className="product-button"
                            onClick={() => OpenDetails(product.id)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </p>
                  </div>
                </a>
              ))}
          </div>

        </div>
      </div>
    </div>
  );
};
