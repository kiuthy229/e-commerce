import React, {useEffect, useState, useReducer} from "react";
import { useQuery, gql } from "@apollo/client/react";
import { LOAD_PRODUCTS } from "../../../data/queries/get-products";
import edit from "../../../common/assets/edit.png"
import { REMOVE_PRODUCT_MUTATION } from "../../../data/mutations/remove-product";
import { useMutation } from "@apollo/client/react/hooks";
import './GetProducts.css'

const GetProducts = () => {
    const {error, loading, data} = useQuery(LOAD_PRODUCTS)
    const [removeProduct, result] = useMutation(REMOVE_PRODUCT_MUTATION)
    const [products, setProducts] = useState([])
    const [reducerValue, forceUpdate] = useReducer( x=> x+1,0)

    useEffect(()=>{     
        if (data) {
            setProducts(data.products)
        }
    }, [data, reducerValue])

    const UpdateProduct = ( ) => {

    }

    const RemoveProduct = ( productID) => {
        // console.log(productID)
        removeProduct({
            variables: {
                id: productID,
            }
        })
        console.log("removed")
        if (result.error) {
            console.log(result.error)
        }
    }

    return (
        <div>
            <input className="search" type="text" placeholder="Find products by name"/>
            <button className="filter-btn">
                Filter
            </button>
            <button className="csv">
                    Export (.csv)
            </button>

            <div className='pagination'>

            </div>

            <table className="list-table">
                <tr className="table-heading">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Colors</th>
                    <th>Description</th>
                    <th>Categories</th>
                    <th>Pictures</th>
                    <th>Sizes</th>
                    <th>Featuring From</th>
                    <th>Featuring To</th>
                </tr>
                
                {products &&
                    products.map((product) =>
                        <tr className="table-content" key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.stock}</td>
                            <td>
                                {product.colors.map((color)=>(<span>{color.name},</span>))}
                            </td>
                            <td>{product.description}</td>
                            <td>{product.categories}</td>
                            <td>
                                {
                                    product.pictures.map((pic)=>
                                        <img style={{width:"25%",height:"25%"}} src={process.env.PUBLIC_URL + 'upload-images/' + pic}/>
                                    )
                                }
                            </td>
                            <td>
                                {   product.sizes.map((size) => <span>{size},</span>)}
                            </td>
                            <td>{product.featuringFrom}</td>
                            <td>{product.featuringTo}</td>
                            <td>
                                <button className="update-product-btn" onClick={UpdateProduct}>
                                    <img src={edit}/>
                                    Update
                                </button>     
                            </td>
                            <td>
                                <button className="remove-product-btn" onClick={()=>{RemoveProduct(product.id)}}>
                                    Remove
                                </button>
                            </td>
                        </tr> 
                )}



            </table>
        </div>
     );
}
 
export default GetProducts;