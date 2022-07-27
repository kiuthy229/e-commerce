import { gql } from "@apollo/client/core";

export const LOAD_PRODUCTS = gql`
    query Products {
        products {
        id
        name
        price
        stock
        colors {
            name
            hexValue
        }
        description
        categories
        pictures
        sizes
        featuringFrom
        featuringTo
        }
    }
`