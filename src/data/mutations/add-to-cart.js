import {gql} from "@apollo/client";

export const ADD_TO_CART_MUTATION = gql`
    mutation AddItemToCart($customer: CustomerInput!) {
        updateCustomer(customer: $customer) {
        id
        }
    }  
`