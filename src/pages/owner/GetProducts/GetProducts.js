import React, {useEffect, useState, useReducer} from "react";
import { useQuery, gql } from "@apollo/client/react";
import { LOAD_PRODUCTS } from "../../../data/queries/get-products";
import edit from "../../../common/assets/edit.png"
import { REMOVE_PRODUCT_MUTATION } from "../../../data/mutations/remove-product";
import { useMutation } from "@apollo/client/react/hooks";
import UpdateProduct from "../UpdateProduct/UpdateProduct";
import './GetProducts.css'
import NavBar from "../../../common/navbar/NavBar";

const GetProducts = () => {
    const {error, loading, data} = useQuery(LOAD_PRODUCTS)
    const [removeProduct, result] = useMutation(REMOVE_PRODUCT_MUTATION)
    const [products, setProducts] = useState([])
    const [openUpdate,setOpenUpdate] = useState(false)
    const [productId, setProductId] = useState(0)
    const [customerID, setCustomerID] = useState(() => {
        // getting stored value
        const saved = window.localStorage.getItem("customerID");
        const initialValue = JSON.parse(saved);
        return initialValue || "";
      });

    useEffect(()=>{
        console.log(customerID)
    },[customerID])

    useEffect(()=>{     
        if (data) {
            setProducts(data.products)
        }
    }, [data])

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

    const sizeTag = {
        backgroundColor: "#EAF1F8",
        border: "0.5px solid #919DBA",
        borderRadius: "4px",
        width: "15px",
        height: "15px",
        margin:"2px",
        fontSize: "12px",
        justifyContent:"center",
        alignItems: "center",
        color:"#919DBA",
        padding:"3px 5px 2px 5px",
        flexWrap:"wrap"
    };

    const openPopupUpdate = (productID) => {
        setOpenUpdate(true);
        setProductId(productID);
    }

    const togglePopupUpdate= () => {
        setOpenUpdate(!openUpdate);
        document.getElementsByClassName("product-list").fadeOut(200);
      }

    return (
        <div className="products-list" disabled={openUpdate==true}>
        {products &&
            products.map((product) =>
            <div class="card" key={product.id}>
                <div class="left">
                    <img style={{width:"100%",height:"100%"}} src={process.env.PUBLIC_URL + 'upload-images/' + product.pictures[0]}/>
                    <i class="fa fa-long-arrow-left"></i>
                    <i class="fa fa-long-arrow-right"></i>
                </div>
                <div class="right">
                    <div class="product-info">
                        <div class="product-name">
                                    <h1>{product.name}</h1>
                        </div>
                        <div class="details">
                            <h3>{product.description}</h3>
                            <h4><span class="fa fa-dollar"></span>$ {product.price}</h4>
                        </div>
                        <ul>
                            <li>SIZE</li>
                            {   product.sizes.map((size) => <li className="bg"><i>{size}</i></li>)}
                        </ul>
                        <ul>
                            <li>COLOR</li>
                            {product.colors.map((color)=>(  <span key={color.hexValue}>
                                                                        <input className="show-color" type="color" defaultValue={color.hexValue} disabled/>
                                                                    </span>
                            ))}
                        </ul>
                        <button className="update-product-btn" onClick={()=>{openPopupUpdate(product.id)}}>
                            <img src={edit}/>
                            Update
                        </button>
                        <button className="remove-product-btn" onClick={()=>{RemoveProduct(product.id)}}>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        )}

        {openUpdate &&
                     <UpdateProduct  onClose={togglePopupUpdate} 
                                     setCloseUpdate={togglePopupUpdate} 
                                     productID={productId} />
        }

            {/* <input className="search" type="text" placeholder="Find products by name"/>
            <button className="filter-btn">
                Filter
            </button>

            <div className='pagination'>

            </div>

            <table className="list-table">
                <tr className="table-heading">
                    <th></th>
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
                            <td style={{width:"140px"}}>
                                {product.colors.map((color)=>(  <span key={color.hexValue}>
                                                                    <input className="show-color" type="color" defaultValue={color.hexValue} disabled/>
                                                                </span>
                                                                ))}
                            </td>
                            <td>{product.description}</td>
                            <td>{product.categories}</td>
                            <td>
                                {
                                    product.pictures.map((pic)=>
                                        <img style={{width:"50%",height:"50%"}} src={process.env.PUBLIC_URL + 'upload-images/' + pic}/>
                                    )
                                }
                            </td>
                            <td style={{width:"140px", display: "flex", flexWrap:"wrap"}}>
                                {   product.sizes.map((size) => <span style={sizeTag}><i>{size}</i></span>)}
                            </td>
                            <td>{product.featuringFrom}</td>
                            <td>{product.featuringTo}</td>
                            <td>
                                <button className="update-product-btn" onClick={()=>{openPopupUpdate(product.id)}}>
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

            </table> */}

        </div>
     );
}
 
export default GetProducts;