import React, {useEffect} from 'react'
import { useQuery, gql } from '@apollo/client';

const GET_LOCATIONS = gql`
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
export function Cart() {
    const { loading, error, data } = useQuery(GET_LOCATIONS, {
        variables:{
            productId: "6ede0d38-6524-4a91-a09f-2ddb22c0e87b"
        }
    });
    if (loading) return <div>Loading...</div>
    return(
        <div>
            <div>{data.product.id}</div>
            <div>{data.product.name}</div>
            <div>{data.product.price}</div>
            <div><img src= {data.product.pictures} style={{ height: 100, width: 100 }} /></div>
            
        </div>
    );
}