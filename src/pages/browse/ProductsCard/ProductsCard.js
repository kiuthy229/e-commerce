import React, { useEffect, useState} from "react"
import { gql, useQuery } from '@apollo/client';
import { FaSearch } from 'react-icons/fa';
import styled from "styled-components";
import './ViewProduct.css';
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
        // Set search result = all items when search term's empty
        // if (searchTerm === ""){
        //   setSearchResult(products)
        // }
        if (searchTerm !== ""){
          //loop through all elements
          const filteredProducts = products.filter((product, index) => {
            //check if text includes the search value
            return product.name.toLowerCase().includes(searchTerm.toLowerCase()) 
          })

          setSearchResult(filteredProducts)
          // console.log(searchResult)
      }
        
    } 
  return (
    <div>
          <SearchContainer className="search-bar">
            <Input type="search" id="searchbar__input" placeholder="Search" onChange={(e)=>setSearchTerm(e.target.value)}/> 
            <button id="search" onClick={handleSearch}><FaSearch /></button>
          </SearchContainer>
          <div className="price-box-slider">
            <div id="slider-range"></div>
            <p>
              <input type="range" id="amount" readonly style={{border:"0", color:"#fbb714", fontWeight:"bold"}}/>
              <button className="btn hvr-hover" type="submit">Filter</button>
            </p>
          </div>
      <div class="card-container">  
    {products && !searchClicked &&
      products.map((product) =>
      
      <div class="product-card">
          {/* {pid} */}
          <h1 class="product-name">{product.name}</h1>
          {/* <p>{product.description}</p> */}
          <div>{product.pictures.map((pic) => <img class="product-pic" src={pic}/>)}
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
      {searchClicked && 
      searchResult.map((product) =>
        <div class="product-card">
          {/* {pid} */}
          <h1 class="product-name">{product.name}</h1>
          {/* <p>{product.description}</p> */}
          <div>{product.pictures.map((pic) => <img class="product-pic" src={pic}/>)}
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

{/* <div class="content">
  <div class="grid wide">
    <div class="grid__row">
      <div class="grid__col2 hide-on-tablet-mobile">
        <div class="category">
          <div class="category__heading">
            <i class="categogy__heading-icon fas fa-list"></i>
            <span class="category__heading-title">Filter</span>
          </div>
      {/* Sidebar  */}
          // <ul class="category__list">
          //   <li class="category__item category__item--active"><a class="category__item-link" href="#">Category</a></li>
           {/* checkbox */}
//             <li class="category__item"><a class="category__item-link" href="#">Color</a></li>
//             <li class="filter-price-left">
//               <div class="title-left">
//                 <h3>Price</h3>
//               </div>
//               <div class="price-box-slider">
//                 <div id="slider-range"></div>
//                   <p>
//                     <input type="text" id="amount" readonly style="border:0; color:#fbb714; font-weight:bold;"/>
//                     <button class="btn hvr-hover" type="submit">Filter</button>
//                   </p>
//                 </div>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// Product catalog
//   <div class="home-products">
//   <div class="grid__row">
//     <div class="grid__col2-4 l-2-4 m-6 c-4">
//       <a href="#" class="product-item">
//         <div class="product-item__img" style="background-image: url(https://cf.shopee.vn/file/fcbb24fb7ef075b91e9fb994ac0675e8_tn)">
//         </div>
//         <h4 class="product-item__product-name">Bút kẻ mắt</h4>
//         <div class="product-item__origin">
//           <span>Merzy</span>
//           <span>Hàn Quốc</span>
//         </div> */}