import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import "./ViewProduct.css";
import '../SearchBox/PriceFilter.css';
import "../SearchBox/Filter.css";

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
  const [filterResult, setFilterResult] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  //Set data
  useEffect(() => {
    if (data) {
      setProducts(data.products);
    }
  });

  //Search
  const handleSearch = () => {
    setSearchResult([]);
    setMinPrice("")
    setMaxPrice("")
    setSelectedColor("")
    setSelectedCategory("")
    setSearchClicked(true);
    if (searchTerm !== "") {
      const filteredProducts = products.filter((product, index) => {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setSearchResult(filteredProducts);
    }
  };

  //Filter by price
  useEffect(()=>{
    setFilterResult([])
    setSelectedCategory("")
    setSelectedColor("")
    products.filter((product)=>{
      if (parseInt(minPrice)<product.price && product.price<parseInt(maxPrice)){
        setFilterResult(value=>[...value, product])
      }
      if (product.categories === selectedCategory){
        setFilterResult(value=>[...value, product])
      }
    })
  },[minPrice, maxPrice])

  //Filter by caetgory
  useEffect(()=>{   
    setFilterResult([])
    setMinPrice("")
    setMaxPrice("")
    setSelectedColor("")
    products.filter((product)=>{
      if (product.categories.toString().toLowerCase() === selectedCategory.toLowerCase()){
        const filterResultCopy = [...filterResult]
        filterResultCopy.push(product)
        setFilterResult(filterResultCopy)
        console.log(filterResult)
      }
    })
  },[selectedCategory])

  //Filter by color
  useEffect(()=>{
    setFilterResult([])
    setMinPrice("")
    setMaxPrice("")
    setSelectedCategory("")
    products.filter((product)=>{
      console.log(selectedColor)
      if (product.colors[0].name === selectedColor){
        const filterResultCopy = [...filterResult]
        filterResultCopy.push(product)
        setFilterResult(filterResultCopy)
      }
    })
  },[selectedColor])

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
          
          {/* Filter section */}
          <section id="sidebar">
            <div>
              <h6 class="p-1 border-bottom">Categories</h6>
                <ul>
                  <li>
                    <a href="#" onClick={(e)=>setSelectedCategory("Dresses")}>Dresses</a>
                  </li>
                  <li>
                    <a href="#" onClick={(e)=>setSelectedCategory("T-shirts")}>T-shirts</a>
                  </li>
                  <li>
                    <a href="#" onClick={(e)=>setSelectedCategory("Pants")}>Pants</a>
                  </li>
                  <li>
                    <a href="#" onClick={(e)=>setSelectedCategory("Skirts")}>Skirts</a>
                  </li>
                  <li>
                    <a href="#" onClick={(e)=>setSelectedCategory("Jeans")}>Jeans</a>
                  </li>
                  <li>
                    <a href="#" onClick={(e)=>setSelectedCategory("Sweaters")}>Sweaters</a>
                  </li>
                </ul>
            </div>
            <div>
                <h6 class="p-1 border-bottom">Color</h6>
                {/* <p class="mb-2">Color</p> */}
                <ul class="list-group" style={{zIndex:"9"}}>
                  {products && products.map((product, index)=>
                      <li class="list-group-item list-group-item-action mb-2 rounded" onClick={(e)=>setSelectedColor(product.colors[0].name)}>
                          <a href="#">
                              <span class="fa fa-circle pr-1">{product.colors[0].name}</span>
                          </a>
                      </li>
                  )}
                </ul>
            </div>

            <div>
              <h6 class="p-1 border-bottom">Price</h6>
              <span class="wrapper">
              <span class="price-input" style={{zIndex:"9"}}>
                  <div class="field">
                      <span>Min</span>
                      <input type="number" class="input-min" onChange={(e)=>setMinPrice(e.target.value)}/>
                  </div>
                  <div class="seperator">-</div>
                  <div class="field">
                      <span>Max</span>
                      <input type="number" class="input-max" onChange={(e)=>setMaxPrice(e.target.value)}/>
                  </div>
              </span>
              </span>
            </div>

          </section>
        </div>

        <div className="col-9">
          <div className="card-container">
            {products && !minPrice && !maxPrice && selectedCategory === "" &&
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
                        <button className="product-button">
                          Add to Cart
                        </button>
                      </div>
                    </p>
                  </div>
                </a>
              ))}
 
            {minPrice && maxPrice && selectedCategory === "" && selectedColor === "" &&
              filterResult.map((product) => (
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
                        <button className="product-button">
                          Add to Cart
                        </button>
                      </div>
                    </p>
                  </div>
                </a>
            ))}

            {selectedCategory && minPrice === "" && maxPrice === "" && selectedColor === "" &&
              filterResult.map((product) => (
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
                        <button className="product-button">
                          Add to Cart
                        </button>
                      </div>
                    </p>
                  </div>
                </a>
            ))}

            {selectedColor && minPrice === "" && maxPrice === "" && selectedCategory === "" &&
              filterResult.map((product) => (
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
                        <button className="product-button">
                          Add to Cart
                        </button>
                      </div>
                    </p>
                  </div>
                </a>
            ))}

            {searchClicked && minPrice === "" && maxPrice === "" && selectedCategory === "" && selectedColor === "" &&
              searchResult.map((product) => (
                <a href={`/product/${product.id}`}>
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
                          <button className="product-button">
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
