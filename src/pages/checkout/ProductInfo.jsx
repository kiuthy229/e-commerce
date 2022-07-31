import React from 'react'
import { useQuery, gql } from '@apollo/client';
import './Cart.css';

const GET_PRODUCT = gql`
  query Query($productId: ID!) {
  product(id: $productId) {
    id
    name
    price
    stock
    colors {
      name
      hexValue
    }
    pictures
  }
}
`;
export function Product(productId, priceList) {

  const getProduct = useQuery(GET_PRODUCT, {
    variables: {
      productId: productId.productId
    }
  });
  priceList = [...priceList, getProduct.data?.product?.price]
  return (
    <div className='product'>
      <div>{getProduct.data?.product?.name}</div>
      <div>{getProduct.data?.product?.price}</div>
      <div><img src={getProduct.data?.product?.pictures} style={{ height: 100, width: 100 }} /></div>
    </div>
  );
}
