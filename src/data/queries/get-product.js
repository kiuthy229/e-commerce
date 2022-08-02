import { gql } from "@apollo/client/core";

export const GET_PRODUCT = gql`
    query Query($productId: ID!) {
        product(id: $productId) {
        categories
        id
        name
        price
        stock
        colors {
            name
            hexValue
        }
        description
        pictures
        sizes
        featuringFrom
        featuringTo
        }
    }
`