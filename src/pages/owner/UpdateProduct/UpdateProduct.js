import React, {Fragment, useEffect, useState, useCallback} from "react";
import { UPDATE_PRODUCT_MUTATION } from "../../../data/mutations/update-product";
import { useMutation, useQuery } from "@apollo/client/react/hooks";
import "./UpdateProduct.css"
import axios from "axios";
import { Formik, Form, FastField } from "formik";
import Dropzone from "react-dropzone";
import Thumb from "../AddProduct/Thumb";
import { GetColorName } from 'hex-color-to-color-name';
import { GET_PRODUCT } from "../../../data/queries/get-product";
import isBefore from 'date-fns/isBefore';
import remove from '../../../common/assets/remove.png';

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

    useEffect(()=>{     
        if (data) {
            setProduct(data.product)
            setColorsArray(data.product.colors)
            setSizesArray(data.product.sizes)
            setPicturesArray(data.product.pictures)
        }
    }, [data])

    const AddSize = useCallback(() => {
        setSizesArrayLength((array)=>[...array,""])
        console.log(sizesArrayLength)
    },[sizesArrayLength]);

    const RemoveDefaultSize = useCallback((index) => {
        const sizesArrayCopy = [...sizesArray]
        sizesArrayCopy.splice(index,1)
        setSizesArray(sizesArrayCopy);
    }, [sizesArray]);
    
    const RemoveNewSize = useCallback((index) => {
        const sizesArrayLengthCopy = [...sizesArrayLength]
        sizesArrayLengthCopy.splice(index,1)
        setSizesArrayLength(sizesArrayLengthCopy)
    }, [sizesArrayLength]);

    const AddColor = useCallback(() => {
        setColorsArrayLength((array)=>[...array,""])
        console.log(colorsArrayLength)
    },[colorsArrayLength]);

    const RemoveDefaultColor = useCallback((index) => {
        const colorsArrayCopy = [...colorsArray]
        colorsArrayCopy.splice(index,1)
        setColorsArray(colorsArrayCopy);
    }, [colorsArray]);
    
    const RemoveNewColor = useCallback((index) => {
        const colorsArrayLengthCopy = [...colorsArrayLength]
        colorsArrayLengthCopy.splice(index,1)
        setColorsArrayLength(colorsArrayLengthCopy)
    }, [colorsArrayLength]);
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
                        sizes: sizesArray,
                        featuringFrom:'',
                        featuringTo:''
                    }}

                    validate = {values => {
                        const errors = {};
                        if (!isBefore(new Date(values.featuringFrom.toString().slice(6,10), values.featuringFrom.toString().slice(3,5) -1, values.featuringFrom.toString().slice(0,2)), new Date())){
                            errors.featuringFrom = '“Featuring from” date should be greater or equal today'
                        }
                        return errors
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
                                    <div>
                                        <label className="update-lbl-name">Name</label>
                                        <input className="update-ipt-name" placeholder="Product name" name="name" onChange={handleChange} defaultValue={product.name}/>

                                        <label className="update-lbl-price">Price</label>
                                        <input className="update-ipt-price" placeholder="Product price" type="number" name="price" onChange={handleChange} defaultValue={product.price}/>

                                        <label className="update-lbl-stock">Stock</label>
                                        <input className="update-ipt-stock" placeholder="Stock" type="number" name="stock" onChange={handleChange} defaultValue={product.stock}/>
                                    </div>

                                    <div className="update-colorField">
                                        <label className="update-lbl-color">Colors</label>
                                        <div style={{width:"600px", display: "flex", flexWrap: "wrap"}} >
                                            {colorsArray.map((color, index) => {
                                                return (<span className="owner-add-colors-container" key={index}>
                                                            <div className="owner-add-color-inner">
                                                                <input className="ipt-color-hex" type="color" name={`colors[${index}].hexValue`} onChange={(e) => {setFieldValue(`colors[${index}].hexValue`, e.target.value)}} value={color.hexValue}/>
                                                            </div>
                                                            <div className="owner-add-color-inner">
                                                                <button type="button" className="owner-remove-color-btn hide-remove-color" onClick={()=>RemoveDefaultColor(index)}></button>
                                                            </div>
                                                        </span>        
                                            )})}  
                                            {colorsArrayLength.map((color, index) => {
                                                return (<span className="owner-add-colors-container" key={index}>
                                                            <div className="owner-add-color-inner">
                                                                <input className="ipt-color-hex" type="color" name={`colors[${index}].hexValue`} onChange={(e) => {setFieldValue(`colors[${index}].hexValue`, e.target.value)}} defaultValue={color.hexValue}/>
                                                            </div>
                                                            <div className="owner-add-color-inner">
                                                                <p className="owner-remove-color-btn hide-remove-color" onClick={()=>RemoveNewColor(index)}>
                                                                    <img src={remove} style={{width:"13px", height:"13px"}}/>
                                                                </p>
                                                            </div>
                                                        </span>        
                                            )})}
                                        </div>                       
                                        <input type="button" className="add-color" onClick={AddColor} value="Add Color"/>
                                    </div>

                                    <div className="sizesField">
                                        <label className="update-lbl-sizes">Sizes</label>
                                        <div style={{width:"600px", display: "flex", flexWrap: "wrap"}}>
                                            {sizesArray.map((size, index) => {
                                                return (<div className="owner-add-sizes-container" key={index}>
                                                            <div className="owner-add-size-inner">
                                                                <input className="udt-sizes" placeholder="Sizes" name={`sizes[${index}]`} onChange={(e) => {setFieldValue(`sizes[${index}]`, e.target.value)}} value={size}/>
                                                            </div>
                                                            <div className="owner-add-size-inner">
                                                                <button type="button" className="owner-remove-size-btn hide-remove-sizes" onClick={()=>RemoveDefaultSize(index)}></button>
                                                            </div>
                                                        </div>        
                                            )})}
                                            {sizesArrayLength.map((size, index) => {
                                                return (<div className="owner-add-sizes-container" key={index}>
                                                            <div className="owner-add-size-inner">
                                                                <input className="udt-sizes" placeholder="Sizes" name={`sizes[${index}]`} onChange={(e) => {setFieldValue(`sizes[${index}]`, e.target.value)}} defaultValue={size}/>
                                                            </div>
                                                            <div className="owner-add-size-inner">
                                                                <p className="owner-remove-size-btn hide-remove-sizes" onClick={()=>RemoveNewSize(index)}>
                                                                    <img src={remove} style={{width:"20px", height:"20px"}}/>
                                                                </p>
                                                            </div>
                                                        </div>        
                                            )})} 
                                        </div>                         
                                        <input type="button"  className="add-size" onClick={AddSize} value="Add Size"/>
                                    </div>
                                    
                                    <div className="descriptionField">
                                        <label className="update-lbl-description">Description</label>
                                        <textarea className="update-ipt-description" placeholder="Description" name="description" onChange={handleChange} value={product.description}/>
                                    </div>

                                    <div>
                                        <label className="update-lbl-categories">Categories</label>
                                        <input className="update-ipt-categories" placeholder="Categories" name="categories" onChange={handleChange} value={product.categories}/>
                                    </div>
                                    
                                    <div className="picturesField">
                                        <label className="update-lbl-pictures">Pictures</label>

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
                                        <label className="update-lbl-featuringFrom">Featuring From</label>
                                        <input className="update-ipt-featuringFrom" type="text"  name="featuringFrom" onChange={handleChange} value={product.featuringFrom}/>
                                        {errors.featuringFrom && touched.featuringFrom && errors.featuringFrom}

                                        <label className="update-lbl-featuringTo">Featuring To</label>           
                                        <input className="update-ipt-featuringTo" type="text" name="featuringTo" onChange={handleChange} value={product.featuringTo}/>
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