import React, { useEffect, useState} from "react"
import { gql, useQuery } from '@apollo/client';
import './ViewProduct.css';
import Product from "../ProductDetail/ProductDetail";

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
export const Viewallproducts = () => {
  const {error, loading, data} = useQuery(GET_PRODUCTS)
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    if (data) {
      setProducts(data.products)
      console.log(data)
    }
  })
  return <>
    {products && 
    products.map((product) =>
    <div class="product-card">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <div class="product-pic">
      </div>
      <div class="product-colors">
      </div>
      <div class="product-info">
        <div class="product-price">{product.price}</div>
        <a href="#" class="product-button">Add to Cart</a>
      </div>
    </div>
    )}
  </>;
};
