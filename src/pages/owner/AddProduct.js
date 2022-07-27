import React, {useEffect, useState} from "react";
import { ADD_PRODUCT_MUTATION } from "../../data/mutations/add-product";
import { useMutation } from "@apollo/client/react/hooks";

const AddProduct = () => {
    const [productName, setProductName] = useState()
    const [productPrice, setProductPrice] = useState()
    const [stock, setStock] = useState()
    const [productColors, setProductColor] = useState()
    const [colorHexValue, setColorHexValue] = useState()
    const [description, setProductDescription] = useState()
    const [categories, setCategories] = useState()
    const [pictures, setPictures] = useState()
    const [sizes, setSizes] = useState()
    const [featuringFrom, setFeaturingFrom] = useState()
    const [featuringTo, setFeaturingTo] = useState()


    const [createProduct, {error, loading, data}] = useMutation(ADD_PRODUCT_MUTATION)

    const addProduct = () => {
        createProduct({
            variables: {
                name: productName,
                price: parseInt(productPrice),
                stock: parseInt(stock),
                description: description,
                categories: categories,
                pictures: pictures,
                colors: [{
                    name:productColors,
                    hexValue: colorHexValue
                    }],
                sizes: sizes
            }
        })

        console.log(productColors)

        if (error) {
            console.log(error)
        }
    }

    return ( 
    <div>
        <h1 className="header">Create Product</h1>
            <div>
                <label className="">Name</label>
                <input className="" placeholder="Product name" onChange={(e) => {setProductName(e.target.value)}}/>
            </div>
            
            <div>
                <label className="">Price</label>
                <input className="" placeholder="Product price" type="number" onChange={(e) => {setProductPrice(e.target.value)}}/>
            </div>
            
            <div>
                <label className="">Stock</label>
                <input className="" placeholder="Stock" type="number" onChange={(e) => {setStock(e.target.value)}}/>
            </div>

            <div>
                <label className="">Colors</label>
                <input className="" type="color" onChange={(e) => {setColorHexValue(e.target.value)}}/>
                <input className="" defaultValue={colorHexValue} type="text" onChange={(e) => {setProductColor(e.target.value)}}/>
            </div>
            
            <div>
                <label className="">Description</label>
                <input className="" placeholder="Description" onChange={(e) => {setProductDescription(e.target.value)}}/>
            </div>
            
            <div>
                <label className="">Categories</label>
                <input className="" placeholder="Categories" onChange={(e) => {setCategories(e.target.value)}}/>
            </div>
            
            <div>
                <label className="">Pictures</label>
                <input className="" placeholder="Pictures" type="file" onChange={(e) => {setPictures(e.target.value)}}/>
            </div>

            <div>
                <label className="">Sizes</label>
                <input className="" placeholder="Sizes" onChange={(e) => {setSizes(e.target.value)}}/>
            </div>

            <div>
                <label className="">Featuring From</label>
                <input className="" type="date" style={{color:"#1E0D03"}} onChange={(e) => {setFeaturingFrom(e.target.value)}}/>
            </div>

            <div>
                <label className="">Featuring To</label>           
                <input className="" type="date" onChange={(e) => {setFeaturingTo(e.target.value)}}/>
            </div>

            <div>
                <button onClick={addProduct}>Submit</button>
            </div>

    </div> );
}
 
export default AddProduct;