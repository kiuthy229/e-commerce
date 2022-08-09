import React, { useEffect, useState} from "react"
import { gql, useQuery } from '@apollo/client';
import { FaSearch } from 'react-icons/fa';
import styled from "styled-components";
import './ViewProduct.css';
import { Dropdown } from '../SearchBox/Dropdown';
import { ColorFilter } from "../SearchBox/ColorFilter";
import { PriceFilter } from "../SearchBox/PriceFilter";
//import Product from "../ProductDetail/ProductDetail";

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
  border: 1px solid black;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 5px 20px;
  margin-top:50px;
`;
const Input = styled.input`
  border: none;
  background: none;

`;
export const Viewallproducts = () => {
  const {error, loading, data} = useQuery(GET_PRODUCTS)
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [searchClicked, setSearchClicked] = useState(false)
  
  useEffect(() => {
    if (data) {
      setProducts(data.products)
    }
  })

  const OpenDetails = (id) => {
    //mo trang detail voi id =id treen

  }

  const handleSearch = () => {
        setSearchResult([])
        setSearchClicked(true)
        if (searchTerm !== ""){
          const filteredProducts = products.filter((product, index) => {
            return product.name.toLowerCase().includes(searchTerm.toLowerCase()) 
          })
          setSearchResult(filteredProducts)
          // console.log(searchResult)
      }  
    }
  const [selected, setSelected] = useState("");
  return (
    <div>
      <SearchContainer className="search-bar">
        <Input type="search" id="searchbar__input" placeholder="Search" onChange={(e)=>setSearchTerm(e.target.value)}/> 
        <button id="search" onClick={handleSearch}><FaSearch /></button>
      </SearchContainer>
      <div id="slider-range"></div>   
      {/*------------------*/}  
      <div class="container">
        <div class="row">
          <div class="col-sm">
            <Dropdown selected={selected} setSelected={setSelected} />
            <ColorFilter />
            <PriceFilter />
          </div>
          <div class="col-sm">
            <div className="card-container">  
              {products && !searchClicked &&
                products.map((product) =>
                <div class="product-card">
                    <div><img class="product-pic" src={process.env.PUBLIC_URL + 'upload-images/' + product.pictures[0]}/>
                    </div>
                    <h1 class="product-name">{product.name}</h1>
                    <div class="product-colors"></div>
                      <div class="product-price">${product.price}</div>
                      <p>
                        <div>
                        <button className="product-button" onClick={()=>OpenDetails(product.id)}>Add to Cart</button>
                        </div>
                      </p>
                </div>
                )
              }
                </div>
          </div>
        </div>
      </div>
      {/*------------------*/}   
          {/*Side-bar*/}
      {/* <div className="side-bar"> */}
          <Dropdown selected={selected} setSelected={setSelected} />
          <ColorFilter />
          <PriceFilter />
      {/* </div> */}
      <div className="card-container">  
    {products && !searchClicked &&
      products.map((product) =>
      <div class="product-card">
          <div><img class="product-pic" src={process.env.PUBLIC_URL + 'upload-images/' + product.pictures[0]}/>
          </div>
          <h1 class="product-name">{product.name}</h1>
          <div class="product-colors"></div>
            <div class="product-price">${product.price}</div>
            <p>
              <div>
              <button className="product-button" onClick={()=>OpenDetails(product.id)}>Add to Cart</button>
              </div>
            </p>
      </div>
      )
    }
      </div>
      {searchClicked && 
      searchResult.map((product) =>
        <div class="product-card">
          {/* {pid} */}
          <h1 class="product-name">{product.name}</h1>
          {/* <p>{product.description}</p> */}
          <div><img class="product-pic" src={process.env.PUBLIC_URL + 'upload-images/' + product.pictures[0]}/>
          </div>
          <div class="product-colors">
          </div>
          <div class="product-info">
            <div class="product-price">{product.price}</div>
            <a href="#" class="product-button" onClick={()=>OpenDetails(product.id)}>Add to Cart</a>
          </div>
        </div>
      )}
      </div>
    )
};