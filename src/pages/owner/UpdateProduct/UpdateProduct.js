import React, {useEffect, useState} from "react";
import { UPDATE_PRODUCT_MUTATION } from "../../../data/mutations/update-product";
import { useMutation, useQuery } from "@apollo/client/react/hooks";
import "./UpdateProduct.css"
import axios from "axios";
import { Formik, Form, FastField } from "formik";
import Dropzone from "react-dropzone";
import Thumb from "../AddProduct/Thumb";
import { GetColorName } from 'hex-color-to-color-name';
import { GET_PRODUCT } from "../../../data/queries/get-product";

const UpdateProduct = (props) => {
    const dropzoneStyle = {
        width: "400px",
        height: "auto",
        borderWidth: 2,
        borderColor: "rgb(102, 102, 102)",
        borderStyle: "dashed",
        borderRadius: 5,
        margin:"3px 0px 3px 0px",
      };

    const {error, loading, data} = useQuery(GET_PRODUCT, {
		variables: {
			productId: props.productID
		},
	})
    const [updateProduct, result] = useMutation(UPDATE_PRODUCT_MUTATION)
    const [sizesArray, setSizesArray] = useState([])
    const [colorsArray, setColorsArray] = useState([])
    const [sizesArrayLength, setSizesArrayLength] = useState([])
    const [colorsArrayLength, setColorsArrayLength] = useState([])
    const [picturesArray, setPicturesArray] = useState([])
    const [product, setProduct] = useState({})
    var sizesArrayCopy = []

    useEffect(()=>{     
        if (data) {
            setProduct(data.product)
            setColorsArray(data.product.colors)
            setSizesArray(data.product.sizes)
            setPicturesArray(data.product.pictures)
        }
    }, [data])

    const AddSize = () =>{ 
        setSizesArrayLength((array)=>[...array,""])
        console.log(sizesArrayLength)
    }
    const RemoveDefaultSize = (index) => {
        // console.log(sizesArray)
        // console.log(sizesArray[index])
        sizesArrayCopy = [...sizesArray]
        console.log(sizesArrayCopy[index])
        sizesArrayCopy.splice(index,1)
        setSizesArray(sizesArrayCopy)
    }
    const RemoveSize = (index) => {
        sizesArrayLength.splice(index,1)
        setSizesArrayLength(sizesArrayLength)
    }
    const AddColor = () =>{ 
        setColorsArrayLength((array)=>[...array,""])
        console.log(colorsArrayLength)
    }
    return (
        <div className="form-update">
                <Formik
                    initialValues= {{
                        name: product.name,
                        price: parseInt(product.price),
                        stock: parseInt(product.stock),
                        description: '',
                        categories: '',
                        pictures: [],
                        colors: product.colors,
                        sizes: [],
                        featuringFrom:'',
                        featuringTo:''
                    }}

                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            alert(JSON.stringify(product, null, 2));
                            var colorsUpdate = []

                            if(values.colors)
                            {
                                colorsUpdate = values.colors.map((color)=>({ name: GetColorName(color.hexValue), hexValue: color.hexValue })).concat(colorsArray.map((color)=>({ name: GetColorName(color.hexValue), hexValue: color.hexValue })))
                            }
                            else if(!values.colors){
                                colorsUpdate = colorsArray.map((color)=>({ name: GetColorName(color.hexValue), hexValue: color.hexValue }))
                            }

                            updateProduct({
                                variables: {
                                    id:product.id,
                                    name: product.name,
                                    price: parseInt(product.price),
                                    stock: parseInt(product.stock),
                                    description: product.description,
                                    categories: product.categories,
                                    pictures: values.pictures.map((file) => file.name).concat(picturesArray.map((file) => file)),
                                    colors: colorsUpdate,
                                    sizes: values.sizes.map((size) => size).concat(sizesArray.map((size) => size)),
                                    featuringFrom: product.featuringFrom,
                                    featuringTo: product.featuringTo
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
                        props.setCloseUpdate(true)
                    }}
                    >
                    {({ values,
                        errors,
                        touched,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue
                        }) => {
                        
                        const handleChange = (event) => {
                            const name = event.target.name;
                            const value = event.target.value;
                            setProduct(values => ({...values, [name]: value}))
                            console.log(product)
                        }
                        
                        return (
                            <Form onSubmit={handleSubmit} className="update-popup">
                                <h1 className="header-update">Update</h1>
                                    <div className="nameField">
                                        <label className="lbl-name">Name</label>
                                        <input className="upt-name" placeholder="Product name" name="name" onChange={handleChange} defaultValue={product.name}/>
                                    </div>
                                    
                                    <div className="priceField">
                                        <label className="lbl-price">Price</label>
                                        <input className="upt-price" placeholder="Product price" type="number" name="price" onChange={handleChange} defaultValue={product.price}/>
                                    </div>
                                    
                                    <div className="stockField">
                                        <label className="lbl-stock">Stock</label>
                                        <input className="upt-stock" placeholder="Stock" type="number" name="stock" onChange={handleChange} defaultValue={product.stock}/>
                                    </div>

                                    <div className="colorField">
                                        <label className="lbl-color">Colors</label>
                                        <div style={{width:"300px", display: "flex", flexWrap: "wrap"}} >
                                            {colorsArray.map((color, index) => {
                                                return (<span key={index}>
                                                            <input className="ipt-color-hex" type="color" name={`colors[${index}].hexValue`} onChange={(e) => {setFieldValue(`colors[${index}].hexValue`, e.target.value)}} defaultValue={color.hexValue}/>
                                                        </span>        
                                            )})}  
                                            {colorsArrayLength.map((color, index) => {
                                                return (<span key={index}>
                                                            <input className="ipt-color-hex" type="color" name={`colors[${index}].hexValue`} onChange={(e) => {setFieldValue(`colors[${index}].hexValue`, e.target.value)}}/>
                                                        </span>        
                                            )})}
                                        </div>                       
                                        <p className="add-color" onClick={AddColor}>Add color</p>
                                    </div>

                                    <div className="sizesField">
                                        <label className="lbl-sizes">Sizes</label>
                                            {sizesArray.map((size, index) => {
                                                return (<div key={index}>
                                                            <FastField className="upt-sizes" placeholder="Sizes" name={`sizes[${index}]`} onChange={(e) => {setFieldValue(`sizes[${index}]`, e.target.value)}} defaultValue={size}/>
                                                            <p className="remove-btn" onClick={()=>RemoveDefaultSize(index)}>remove</p>
                                                        </div>        
                                            )})}
                                            {sizesArrayLength.map((size, index) => {
                                                return (<div key={index}>
                                                            <FastField className="upt-sizes" placeholder="Sizes" name={`sizes[${index}]`} onChange={(e) => {setFieldValue(`sizes[${index}]`, e.target.value)}}/>
                                                            <p className="remove-btn" onClick={()=>RemoveSize(index)}>remove</p>
                                                        </div>        
                                            )})}                          
                                        <p className="add-size" onClick={AddSize}>Add Size</p>
                                    </div>
                                    
                                    <div className="descriptionField">
                                        <label className="lbl-description">Description</label>
                                        <input className="ipt-description" placeholder="Description" name="description" onChange={handleChange} value={product.description}/>
                                    </div>
                                    
                                    <div className="categoriesField">
                                        <label className="lbl-categories">Categories</label>
                                        <input className="upt-categories" placeholder="Categories" name="categories" onChange={handleChange} value={product.categories}/>
                                    </div>
                                    
                                    <div className="picturesField">
                                        <label className="lbl-pictures">Pictures</label>

                                        <Dropzone  accept="image/*" onDrop={(acceptedFiles) => {
                                            // do nothing if no files
                                            if (acceptedFiles.length === 0) { return; }

                                            // on drop we add to the existing files
                                            setFieldValue("pictures", values.pictures.concat(acceptedFiles));
                                            }}>
                                            {({getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                                                if (isDragActive) {
                                                return "This file is authorized";
                                                }

                                                if (isDragReject) {
                                                return "This file is not authorized";
                                                }

                                                if (picturesArray.length === 0) { 
                                                return <section style={dropzoneStyle}>
                                                            <div {...getRootProps()}>
                                                            <input {...getInputProps()}/>
                                                            <p>Drag and drop some files here, or click to select files</p>
                                                            </div>
                                                        </section>
                                                }
                                                if (picturesArray.length !== 0) { 
                                                return  <section style={dropzoneStyle}>
                                                        {picturesArray.map((pic)=>
                                                            <img style={{padding:"2px", borderRadius:"5px", border:"1px solid #000000", margin:"1px", height:"20%", width:"20%"}} src={process.env.PUBLIC_URL + 'upload-images/' + pic}/>
                                                        )}
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
                                        <input className="upt-featuringFrom" type="text"  name="featuringFrom" onChange={handleChange} value={product.featuringFrom}/>
                                    </div>

                                    <div>
                                        <label className="">Featuring To</label>           
                                        <input className="upt-featuringTo" type="text" name="featuringTo" onChange={handleChange} value={product.featuringTo}/>
                                    </div>

                                    <div>
                                        <button className="cancel" onClick={props.onClose}>Hủy</button>
                                        <button className="update-product" type="submit" disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Update"}</button>
                                    </div>
                            </Form>
                        )
                    }}
                </Formik>
    </div>
 );
}
 
export default UpdateProduct;