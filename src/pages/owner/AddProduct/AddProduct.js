import React, {useEffect, useState, useCallback} from "react";
import { ADD_PRODUCT_MUTATION } from "../../../data/mutations/add-product";
import { useMutation } from "@apollo/client/react/hooks";
import "./AddProduct.css"
import axios from "axios";
import { Formik, Form, FastField } from "formik";
import Dropzone from "react-dropzone";
import Thumb from "./Thumb";
import { GetColorName } from 'hex-color-to-color-name';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import remove from '../../../common/assets/remove.png';

const AddProduct = () => {
    //Styling for dropzone
    const dropzoneStyle = {
        width: "600px",
        height: "auto",
        borderWidth: 2,
        borderColor: "rgb(102, 102, 102)",
        borderStyle: "dashed",
        borderRadius: 5,
        margin:"3px 0px 3px 0px",
      };

    const [createProduct, {error, loading, data}] = useMutation(ADD_PRODUCT_MUTATION)
    const [sizesArray, setSizesArray] = useState([""])
    const [colorsArray, setColorsArray] = useState([""])
    const [selectedFiles, setSelectedFiles ] = useState([]);
    const [selectedPictures, setSelectedPictures ] = useState([]);
    const [pictures, setPictures] = useState([]);

    const AddSize = () =>{ 
        setSizesArray((array)=>[...array,""])
    }

    const RemoveSize = useCallback((index) => {
        const sizesArrayCopy = [...sizesArray]
        sizesArrayCopy.splice(index,1)
        setSizesArray(sizesArrayCopy);
    }, [sizesArray]);

    const AddColor = () =>{ 
        setColorsArray((array)=>[...array,""])
    }

    const RemoveColor = useCallback((index) => {
        const colorsArrayCopy = [...colorsArray]
        colorsArrayCopy.splice(index,1)
        setColorsArray(colorsArrayCopy);
    }, [colorsArray]);

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
                sizes: [],
                featuringFrom:'01/01/2022',
                featuringTo:'31/12/2022'
            }}

            validate={values => {
                const errors = {};
                if (!values.name) {
                  errors.name = 'Required';
                } 
                if (!values.price) {
                    errors.price = 'Required';
                }
                if (!values.stock) {
                    errors.stock = 'Required';
                }
                if (!values.colors) {
                    errors.colors = 'Required';
                }
                if (values.description.length > 1000) {
                    errors.description = 'Too long description';
                }
                if (!isBefore(new Date(values.featuringFrom.slice(6,10), values.featuringFrom.slice(3,5) -1, values.featuringFrom.slice(0,2)), new Date())){
                    errors.featuringFrom = '"Featuring from" date should be greater or equal today'
                }
                if (!isAfter(new Date(values.featuringTo.slice(6,10), values.featuringTo.slice(3,5) -1, values.featuringTo.slice(0,2)), 
                            new Date(values.featuringFrom.slice(6,10), values.featuringFrom.slice(3,5) -1, values.featuringFrom.slice(0,2)))){
                    errors.featuringTo = '"Featuring to" date should be greater than “Featuring from” date'
                }
                return errors;
            }}

            onSubmit={(values, { setSubmitting }) => {
                console.log(pictures)
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    createProduct({
                        variables: {
                            name: values.name,
                            price: parseInt(values.price),
                            stock: parseInt(values.stock),
                            description: values.description,
                            categories: values.categories,
                            pictures: selectedPictures,
                            colors: values.colors.map((color)=>({ name: GetColorName(color.hexValue), hexValue: color.hexValue })),
                            sizes: values.sizes.map((size) => size),
                            featuringFrom: values.featuringFrom,
                            featuringTo: values.featuringTo
                        }
                      })
                    const formData = new FormData();
                    pictures.filter((file) =>{formData.append("pictures", file)});
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
                    setFieldTouched
                    }) => {

                        const handleImageChange = (e) => {
                            if (e.target.files) {
                                const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
                                const picturesArray = Array.from(e.target.files).map((file) => file.name);
                                const pictures = Array.from(e.target.files).map((file) => file);
                    
                                setSelectedPictures((prevImages) => prevImages.concat(picturesArray))
                                setSelectedFiles((prevImages) => prevImages.concat(filesArray));
                                setPictures((prevImages) => prevImages.concat(pictures));
                                Array.from(e.target.files).map(
                                    (file) => URL.revokeObjectURL(file) // avoid memory leak
                                );
                            }
                        };
                    
                        const renderPhotos = (source) => {
                            console.log('source: ', source);
                            return source.map((photo) => {
                                return <img src={photo} alt="" key={photo}/>;
                            });
                        };
                
                return (
                    <Form onSubmit={handleSubmit}>
                        <h1 className="header">Create Product</h1>
                            <div>
                                <label className="lbl-name">Name</label>
                                <input className="ipt-name" placeholder="Product name" id="name" name="name" onChange={handleChange} onBlur={() => setFieldTouched('name', true)}/>
                                <span className="error-name">{errors.name && touched.name && errors.name}</span>

                                <label className="lbl-price">Price</label>
                                <input className="ipt-price" placeholder="Product price" type="number" id="price" name="price" onChange={handleChange} onBlur={() => setFieldTouched('price', true)}/>
                                <span className="error-price">{errors.price && touched.price && errors.price}</span>

                                <label className="lbl-stock">Stock</label>
                                <input className="ipt-stock" placeholder="Stock" type="number" id="stock" name="stock" onChange={handleChange} onBlur={() => setFieldTouched('stock', true)}/>
                                <span className="error-stock">{errors.stock && touched.stock && errors.stock}</span>
                            </div>

                            <div className="colorField">
                                <label className="lbl-color">Colors</label>
                                <div style={{width:"500px", display: "flex", flexWrap: "wrap"}} >
                                    {colorsArray.map((color, index) => {
                                        return (<span className="owner-add-colors-container" key={index}>
                                                    <div className="owner-add-color-inner">
                                                        <input className="ipt-color-hex" type="color" name={`colors[${index}].hexValue`} onChange={handleChange}/>
                                                    </div>
                                                    <div className="owner-add-color-inner">
                                                        <button type="button" className="owner-remove-color-btn hide-remove-color" onClick={()=>RemoveColor(index)}></button>
                                                    </div>
                                                </span>        
                                    )})}      
                                </div>  
                                {errors.colors && touched.colors && errors.colors}                       
                                <button type="button" className="add-color" onClick={AddColor}>Add color</button>
                            </div>

                            <div className="sizesField">
                                <label className="lbl-sizes">Sizes</label>
                                {sizesArray.map((size, index) => {
                                    return (<div className="owner-add-sizes-container" key={index}>
                                                <div className="owner-add-size-inner">
                                                    <FastField className="ipt-sizes" placeholder="Sizes" name={`sizes[${index}]`} onChange={handleChange}/>
                                                </div>
                                                <div className="owner-add-size-inner">
                                                    <button type="button" className="owner-remove-size-btn hide-remove-size" onClick={()=>RemoveSize(index)}></button>
                                                </div>
                                            </div>        
                                            )})}                               
                                <button type="button" className="add-size" onClick={AddSize}>Add Size</button>
                            </div>
                            
                            <div className="descriptionField">
                                <label className="lbl-description">Description</label>
                                <textarea rows="10" cols="10" className="ipt-description" placeholder="Description" id="description" name="description" onChange={handleChange} value={values.description}/>
                                {errors.description && touched.description && errors.description}
                            </div>
                            
                            <div className="categoriesField">
                                <label className="lbl-categories">Categories</label>
                                <input className="ipt-categories" placeholder="Categories" id="categories" name="categories" onChange={handleChange} value={values.categories}/>
                            </div>

                            <div>
                                <input type="file" id="file" multiple onChange={handleImageChange}/>
                                <div className="label-holder">
                                    <label htmlFor="file" className="label">
                                        <i className="material-icons">+</i>
                                    </label>
                                </div>
                                <div className="result">{renderPhotos(selectedFiles)}</div>
                            </div>

                            <div>
                                <label className="lbl-featuringFrom">Featuring From</label>
                                <input className="ipt-featuringFrom" type="text" format="dd/mm/yyyy"  name="featuringFrom" onChange={handleChange} defaultValue={values.featuringFrom}/>
                                {errors.featuringFrom && touched.featuringFrom && errors.featuringFrom}

                                <label className="lbl-featuringTo">Featuring To</label>           
                                <input className="ipt-featuringTo" type="text" format="dd/mm/yyyy" name="featuringTo" onChange={handleChange} defaultValue={values.featuringTo}/>
                                {errors.featuringTo && touched.featuringTo && errors.featuringTo}
                            </div>

                            <div>
                                <button className="add-product" type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
                            </div>
                    </Form>
                )
            }}
        </Formik>

    </div>

 );
}
 
export default AddProduct;