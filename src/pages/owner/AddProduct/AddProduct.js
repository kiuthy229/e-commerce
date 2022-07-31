import React, {useEffect, useState} from "react";
import { ADD_PRODUCT_MUTATION } from "../../../data/mutations/add-product";
import { useMutation } from "@apollo/client/react/hooks";
import "./AddProduct.css"
import axios from "axios";
import { Formik, Form, FastField } from "formik";
import Dropzone from "react-dropzone";
import Thumb from "./Thumb";
import { GetColorName } from 'hex-color-to-color-name';

const AddProduct = () => {
    const dropzoneStyle = {
        width: "90%",
        height: "auto",
        borderWidth: 2,
        borderColor: "rgb(102, 102, 102)",
        borderStyle: "dashed",
        borderRadius: 5
      };

    const [createProduct, {error, loading, data}] = useMutation(ADD_PRODUCT_MUTATION)
    const [sizesArray, setSizesArray] = useState([""])
    const [colorsArray, setColorsArray] = useState([""])

    const AddSize = () =>{ 
        setSizesArray((array)=>[...array,""])
    }
    const AddColor = () =>{ 
        setColorsArray((array)=>[...array,""])
    }
    return ( 
        <div className="form-add">
        <Formik
            initialValues= {{
                name: '',
                price: 0,
                stock: 0,
                description: '',
                categories: '',
                pictures: [],
                colors: [{
                    name:'',
                    hexValue: ''
                }],
                sizes: []
            }}
            validate={values => {
                const errors = {};
                if (!values.name) {
                  errors.name = 'Required';
                } 
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    createProduct({
                        variables: {
                            name: values.name,
                            price: parseInt(values.price),
                            stock: parseInt(values.stock),
                            description: values.description,
                            categories: values.categories,
                            pictures: values.pictures.map((file) => file.name),
                            colors: values.colors.map((color)=>({ name: GetColorName(color.hexValue), hexValue: color.hexValue })),
                            sizes: values.sizes.map((size) => size)
                        }
                      })
                    const formData = new FormData();
                    values.pictures.filter((file) =>{formData.append("pictures", file)});
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
                    setSubmitting(false);
                }, 400);
            }}
            >
            {({     values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                    setField
                    }) => {
                
                return (
                    <Form onSubmit={handleSubmit}>
                        <h1 className="header">Create Product</h1>
                            <div className="nameField">
                                <label className="lbl-name">Name</label>
                                <input className="ipt-name" placeholder="Product name" id="name" name="name" onChange={handleChange} value={values.name}/>
                                {errors.name && touched.name && errors.name}
                            </div>
                            
                            <div className="priceField">
                                <label className="lbl-price">Price</label>
                                <input className="ipt-price" placeholder="Product price" type="number" id="price" name="price" onChange={handleChange} value={values.price}/>
                            </div>
                            
                            <div className="stockField">
                                <label className="lbl-stock">Stock</label>
                                <input className="ipt-stock" placeholder="Stock" type="number" id="stock" name="stock" onChange={handleChange} value={values.stock}/>
                            </div>

                            <div className="colorField">
                                <label className="lbl-color">Colors</label>
                                <div style={{width:"250px", display: "flex", flexWrap: "wrap"}}>
                                    {colorsArray.map((color, index) => {
                                        return (<span key={index}>
                                                    <input className="ipt-color-hex" type="color" name={`colors[${index}].hexValue`} onChange={handleChange}/>
                                                </span>        
                                    )})}      
                                </div>                         
                                <p className="add-color" onClick={AddColor}>Add color</p>
                            </div>

                            <div className="sizesField">
                                <label className="lbl-sizes">Sizes</label>
                                {sizesArray.map((size, index) => {
                                    return (<div key={index}>
                                                <FastField className="ipt-sizes" placeholder="Sizes" name={`sizes[${index}]`} onChange={handleChange}/>
                                            </div>        
                                )})}                               
                                <p className="add-size" onClick={AddSize}>Add Size</p>
                            </div>
                            
                            <div className="descriptionField">
                                <label className="lbl-description">Description</label>
                                <input className="ipt-description" placeholder="Description" id="description" name="description" onChange={handleChange} value={values.description}/>
                            </div>
                            
                            <div className="categoriesField">
                                <label className="lbl-categories">Categories</label>
                                <input className="ipt-categories" placeholder="Categories" id="categories" name="categories" onChange={handleChange} value={values.categories}/>
                            </div>
                            
                            <div className="picturesField">
                                <label className="lbl-pictures">Pictures</label>
                                {/* <input className="ipt-pictures" placeholder="Pictures" type="file" id="pictures" name="pictures" onChange={handleChange} value={values.pictures}/> */}
                                <Dropzone  accept="image/*" onDrop={(acceptedFiles) => {
                                    // do nothing if no files
                                    if (acceptedFiles.length === 0) { return; }

                                    // on drop we add to the existing files
                                    setFieldValue("pictures", values.pictures.concat(acceptedFiles));
                                    setField("pictures", values.pictures.concat(acceptedFiles));
                                    }}>
                                    {({getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                                        if (isDragActive) {
                                        return "This file is authorized";
                                        }

                                        if (isDragReject) {
                                        return "This file is not authorized";
                                        }

                                        if (values.pictures.length === 0) { 
                                        return <section style={dropzoneStyle}>
                                                    <div {...getRootProps()}>
                                                    <input {...getInputProps()}/>
                                                    <p>Drag and drop some files here, or click to select files</p>
                                                    </div>
                                                </section>
                                        }
                                        if (values.pictures.length !== 0) { 
                                        return  <section style={dropzoneStyle}>
                                                {values.pictures.map((file, i) => (<Thumb key={i} file={file} />))}
                                                <div {...getRootProps()}>
                                                <input {...getInputProps()}/>
                                                <p>Drag and drop some files here, or click to select files</p>
                                                </div>
                                                </section>
                                        }
                                    }}
                                </Dropzone>
                            </div>

                            <div>
                                <label className="">Featuring From</label>
                                <input className="" type="date"/>
                            </div>

                            <div>
                                <label className="">Featuring To</label>           
                                <input className="" type="date"/>
                            </div>

                            <div>
                                <button className="add-product" type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
                            </div>

                            <div>
                                <button><a href="/products">Products</a></button>
                            </div>
                    </Form>
                )
            }}
        </Formik>

    </div>

 );
}
 
export default AddProduct;