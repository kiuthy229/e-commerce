import {gql} from "@apollo/client"

export const ADD_PRODUCT_MUTATION = gql`
    mutation Mutation(  $name: String! 
                    $price:Int! $stock:Int! 
                    $description: String 
                    $categories:[String!] 
                    $pictures: [String!] 
                    $colors: [ColorInput!]! 
                    $sizes: [String!]) {
        addProduct(product: {name: $name, price:$price, stock:$stock, description: $description, categories: $categories, pictures:$pictures, colors:$colors sizes:$sizes}) {
            id
        }
  }
`