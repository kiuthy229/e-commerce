import {gql} from "@apollo/client"

export const UPDATE_PRODUCT_MUTATION = gql`
    mutation Mutation(  $id: ID!
                        $name: String! 
                        $price:Int! 
                        $stock:Int! 
                        $description: String 
                        $categories:[String!] 
                        $pictures: [String!] 
                        $colors: [ColorInput!]! 
                        $sizes: [String!]
                        $featuringFrom: String
                        $featuringTo: String) {
        updateProduct(product: {id:$id, name: $name, price:$price, stock:$stock, description: $description, categories: $categories, pictures:$pictures, colors:$colors, sizes:$sizes, featuringFrom:$featuringFrom, featuringTo:$featuringTo}) {
            id
        }
  }`