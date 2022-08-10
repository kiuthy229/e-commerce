import React, { useState, useEffect } from 'react'
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
export function Product(productId, price) {
  const [queryPrice, setQueryPrice] = useState(0);
  const getProduct = useQuery(GET_PRODUCT, {
    variables: {
      productId: productId.productId
    }
  });
  useEffect(() => {
    setQueryPrice(getProduct?.data?.product.price);
    price = queryPrice;
    //console.log('in proinfo after', price)
  }, [setQueryPrice, price, queryPrice, getProduct?.data?.product.price])
  if (getProduct.loading) return <div>Loading...</div>
  return (
    <div className='productDetail'>
      <div><img src={getProduct.data?.product?.pictures} style={{ height: 100, width: 100 }} /></div>
      <div className='smallTitle'>{getProduct.data?.product?.name}</div>
      <div>{getProduct.data?.product?.price}</div>

    </div>
  );
}
