import {gql} from "@apollo/client";

export const ADD_CUSTOMER_MUTATION = gql`
    mutation UpdateCustomer($customer: CustomerInput!) {
        updateCustomer(customer: $customer) {
        id
        }
    }  
`