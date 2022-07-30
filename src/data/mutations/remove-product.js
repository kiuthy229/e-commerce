import {gql} from "@apollo/client"

export const REMOVE_PRODUCT_MUTATION = gql`
    mutation Mutation(  $id: ID! ) {
        removeProduct(id: $id) {
            id
        }
  }
`