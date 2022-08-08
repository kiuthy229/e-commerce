import {gql} from "@apollo/client";

export const UPDATE_CUSTOMER_MUTATION = gql`
    mutation UpdateCustomer($customer: CustomerInput!) {
        updateCustomer(customer: $customer) {
        id
        }
    }  
`