import {gql} from "@apollo/client";

export const ADD_TO_CART_MUTATION = gql`
    mutation Mutation($customerId: ID!, $item: CartItemInput!) {
        addItemToCart(customerId: $customerId, item: $item) {
        id
        }
    } 
`