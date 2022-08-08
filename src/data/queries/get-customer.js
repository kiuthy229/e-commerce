import {gql} from "@apollo/client";

export const GET_CUSTOMER = gql`
    query Query($customerId: ID!) {
        customer(customerId: $customerId) {
        id
        }
    }
`