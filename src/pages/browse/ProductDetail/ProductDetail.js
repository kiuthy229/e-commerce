import  React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { IoIosAdd, IoMdRemove } from "react-icons/io";
import styled from "styled-components";
import { GET_PRODUCT } from "../../../data/queries/get-product";
import { useMutation } from '@apollo/client';
import { ADD_TO_CART_MUTATION } from "../../../data/mutations/add-to-cart";
import { borderRadius } from '@mui/system';
import '../ProductsCard/ViewProduct.css';

const Container = styled.div`
  
`;
const Wrapper = styled.div`
  
  
`;

const ImgContainer = styled.div`
  flex: 1;
`;

const Image = styled.img`
  
 
`;

const InfoContainer = styled.div`
  
`;

const Title = styled.h1`
  
`;

const Desc = styled.p`
  margin: 20px 0px;
`;

const Price = styled.span`
  
`;

const FilterContainer = styled.div`
 

`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const FilterTitle = styled.span`
  
`;

const FilterColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin: 0px 5px;
  cursor: pointer;
`;

const FilterSize = styled.select`
 
`;

const AddContainer = styled.div`
 

`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const input = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`;

const Button = styled.button`
  padding: 15px;
  border: 2px solid teal;
  background-color: white;
  cursor: pointer;
  font-weight: 500;

  &:hover{
      background-color: #f8f4f4;
  }
`;

const Product = () => {
  const params = useParams();
  console.log(params.id)
  const productID = params.id
  const [product, setProduct] = useState({})
  const [pictures, setPictures] = useState([])
  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedQuantity, setSelectedQuantity] = useState("")
  const {error, loading, data} = useQuery(GET_PRODUCT, {
		variables: {
			productId: productID
		},
	})
  const [addToCart, result] = useMutation(ADD_TO_CART_MUTATION)
  const [customerID, setCustomerID] = useState(() => {
    // getting stored value
    const saved = window.localStorage.getItem("customerID");
    const initialValue = JSON.parse(saved);
    return initialValue || "";
  });

  useEffect(()=>{     
      if (data) {
        console.log(data);
        setProduct(data.product);
        setPictures(data.product.pictures);
        setSizes(data.product.sizes);
        setColors(data.product.colors)
      }
  }, [data])

  //Add to cart
  const AddToCart = () => {
      addToCart({
        variables: {
          customerId: customerID,
          item:{
            color: selectedColor,
            productId: productID,
            size: selectedSize,
            quantity: 1
          } 
        }
      })
  }

  useEffect(()=>{
    console.log(selectedSize)
    console.log(selectedColor)
  }, [selectedSize, selectedColor])

  return (
    <div className="detail-container">
      {data && 
        <div className="detail-wrapper">
          <div className="detail-img-container">
              <img className="detail-image" src={process.env.PUBLIC_URL + "logo192.png"}/>
          </div>
          <div className="detail-info-container">
            <div className="detail-title">{product.name}</div>
            <div className="detail-desc">{product.description}</div>
            <div className="detail-price">$ {product.price}</div>
            <div className="detail-filter-container">
              <div className="detail-filter">
                <div className="detail-filter-title">Colors</div>
                {colors.map((color)=>
                    <FilterColor  key={color.hexValue} 
                          style={{backgroundColor:color.hexValue, borderRadius:"50%", padding:"10px", border:"1px solid", cursor:"pointer", margin:"0px 10px"}} 
                          disabled
                          onClick={(e)=>setSelectedColor(color.hexValue)}>
                    </FilterColor>
                )}
              </div>
            </div>
            <div className="detail-filter-container">
              <div className="detail-filter">
                <div className="detail-filter-title">Sizes</div>
                {sizes.map((size, index)=>
                    <p  className="detail-filter-size"
                        key={index} 
                        onClick={(e)=>setSelectedSize(size)}>
                          {size}
                    </p>
                )}
              </div>
            </div>
            <div className="detail-add-container">
              <div className="detail-amount-container">
                <button className="detail-button"><IoMdRemove /></button>
                <input className="detail-input"/>
                <button className="detail-button"><IoIosAdd /></button>
              </div>
              <Button onClick={AddToCart}>ADD TO CART</Button>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default Product;

