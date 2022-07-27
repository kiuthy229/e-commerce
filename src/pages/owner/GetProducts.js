import React, {useEffect, useState} from "react";
import { useQuery, gql } from "@apollo/client/react";
import { LOAD_PRODUCTS } from "../../data/queries/get-products";

const GetProducts = () => {
    const {error, loading, data} = useQuery(LOAD_PRODUCTS)
    const [products, setProducts] = useState([])

    useEffect(()=>{     
        if (data) {
            setProducts(data.products)
        }
    }, [data])

    return (
        <div>
            <input className="search" type="text" placeholder="Find products by name"/>
            <button className="locve">
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
                            <td>{product.colors[0].name}</td>
                            <td>{product.description}</td>
                            <td>{product.categories}</td>
                            <td>{product.pictures}</td>
                            <td>{product.sizes}</td>
                            <td>{product.featuringFrom}</td>
                            <td>{product.featuringTo}</td>
                            <td>
                            <button className="update-product-btn">
                                Update
                            </button>
                            <button className="remove-product-btn">
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