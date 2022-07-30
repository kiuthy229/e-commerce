import React, {useEffect, useState} from "react";
import { ADD_PRODUCT_MUTATION } from "../../data/mutations/add-product";
import { useMutation } from "@apollo/client/react/hooks";
import "./AddProduct.css"
import axios from "axios";

const AddProduct = () => {
    const [productName, setProductName] = useState()
    const [productPrice, setProductPrice] = useState()
    const [stock, setStock] = useState()
    const [productColors, setProductColor] = useState()
    const [colorHexValue, setColorHexValue] = useState()
    const [description, setProductDescription] = useState()
    const [categories, setCategories] = useState()

    //handle upload image
    const [pictures, setPictures] = useState()
    const [selectedFile, setSelectedFile] = useState()

    const [sizes, setSizes] = useState()
    const [featuringFrom, setFeaturingFrom] = useState()
    const [featuringTo, setFeaturingTo] = useState()

    //function called everytime image changed
    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setPictures(event.target.files[0].name)
      };

    const [createProduct, {error, loading, data}] = useMutation(ADD_PRODUCT_MUTATION)

    const addProduct = () => {

        //save image to ./build folder
        const formData = new FormData();
        formData.append("myFile", selectedFile);
        // console.log(selectedFile);
        axios.post("http://localhost:3001/upload", formData, {
            headers: {
                "content-type": "multipart/form-data",
            },
        })
        .then(res => {
            console.log('Axios response: ', res)
          })
        .catch((error) => {
              if (!error?.response) {
                  console.log("No Server Response");
              } else if (error.response?.status === 404) {
                  console.log("404 - Not Found");
              } else if (error?.code) {
                  console.log("Code: " + error.code);
              } else {
                  console.log("Unknown Error");
              }
        });

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
            <div className="nameField">
                <label className="lbl-name">Name</label>
                <input className="ipt-name" placeholder="Product name" onChange={(e) => {setProductName(e.target.value)}}/>
            </div>
            
            <div className="priceField">
                <label className="lbl-price">Price</label>
                <input className="ipt-price" placeholder="Product price" type="number" onChange={(e) => {setProductPrice(e.target.value)}}/>
            </div>
            
            <div className="stockField">
                <label className="lbl-stock">Stock</label>
                <input className="ipt-stock" placeholder="Stock" type="number" onChange={(e) => {setStock(e.target.value)}}/>
            </div>

            <div className="colorField">
                <label className="lbl-color">Colors</label>
                <input className="ipt-color-hex" type="color" onChange={(e) => {setColorHexValue(e.target.value)}}/>
                <input className="ipt-color-name" defaultValue={colorHexValue} type="text" onChange={(e) => {setProductColor(e.target.value)}}/>
            </div>
            
            <div className="descriptionField">
                <label className="lbl-description">Description</label>
                <input className="ipt-description" placeholder="Description" onChange={(e) => {setProductDescription(e.target.value)}}/>
            </div>
            
            <div className="categoriesField">
                <label className="lbl-categories">Categories</label>
                <input className="ipt-categories" placeholder="Categories" onChange={(e) => {setCategories(e.target.value)}}/>
            </div>
            
            <div className="picturesField">
                <label className="lbl-pictures">Pictures</label>
                <input className="ipt-pictures" placeholder="Pictures" type="file" name="myFile" onChange={onFileChange}/>
            </div>

            <div className="sizesField">
                <label className="lbl-sizes">Sizes</label>
                <input className="ipt-sizes" placeholder="Sizes" onChange={(e) => {setSizes(e.target.value)}}/>
            </div>

            <div>
                <label className="">Featuring From</label>
                <input className="" type="date" onChange={(e) => {setFeaturingFrom(e.target.value)}}/>
            </div>

            <div>
                <label className="">Featuring To</label>           
                <input className="" type="date" onChange={(e) => {setFeaturingTo(e.target.value)}}/>
            </div>

            <div>
                <button onClick={addProduct}>Submit</button>
            </div>

            <div>
                <button><a href="/products">Products</a></button>
            </div>

    </div> );
}
 
export default AddProduct;