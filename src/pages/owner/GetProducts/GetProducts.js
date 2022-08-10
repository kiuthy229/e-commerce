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
    const {error, loading, data, refetch} = useQuery(LOAD_PRODUCTS)
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
        }).then(refetch)
        console.log("removed")
        if (result.error) {
            console.log(result.error)
        }
    }

    const openPopupUpdate = (productID) => {
        setOpenUpdate(true);
        setProductId(productID);
        refetch();
    }

    const togglePopupUpdate= () => {
        setOpenUpdate(!openUpdate);
        document.getElementsByClassName("product-list").fadeOut(200);
        refetch();
      }

    return (
        <div className="products-list" disabled={openUpdate==true}>

            {products &&
                products.map((product) =>
                <div className="owner-card">
                    <img style={{width:"300px",height:"400px"}} src={process.env.PUBLIC_URL + 'upload-images/' + product.pictures[0]}/>
                    <h1 className="owner-product-name">{product.name}</h1>
                    <p className="owner-price">${product.price}</p>
                    <p className="owner-product-description">{product.description}</p>
                    <p className="owner-product-colors">
                        {product.colors.map((color)=>( 
                            <span key={color.hexValue}>
                                <input className="owner-show-color" type="color" defaultValue={color.hexValue} disabled/>
                            </span>
                        ))}
                    </p>
                    <p>
                        <div className="inner" >
                            <button onClick={()=>{RemoveProduct(product.id)}}>
                                    Remove
                            </button>
                        </div>
                        <div className="inner" >
                            <button onClick={()=>{openPopupUpdate(product.id)}}>
                                    <img src={edit}/>
                                    Update
                            </button>
                        </div>
                    </p>
                </div>
            )}

            {openUpdate &&
                        <UpdateProduct  onClose={togglePopupUpdate} 
                                        setCloseUpdate={togglePopupUpdate} 
                                        productID={productId} />
            }

        </div>
     );
}
 
export default GetProducts;