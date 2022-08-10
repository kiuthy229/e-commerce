import  React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { IoIosAdd, IoMdRemove } from "react-icons/io";
import styled from "styled-components";
import { GET_PRODUCT } from "../../../data/queries/get-product";
import boho from "../../../common/assets/dress00.png"

const Container = styled.div`
  margin-top: 50px;
`;
const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  
`;

const ImgContainer = styled.div`
  flex: 1;
`;

const Image = styled.img`
  width: 100%;
  height: 90vh;
  object-fit: cover;
 
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 50px;
 
`;

const Title = styled.h1`
  font-weight: 200;
`;

const Desc = styled.p`
  margin: 20px 0px;
`;

const Price = styled.span`
  font-weight: 100;
  font-size: 40px;
`;

const FilterContainer = styled.div`
  width: 50%;
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;

`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const FilterTitle = styled.span`
  font-size: 20px;
  font-weight: 200;
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
  margin-left: 10px;
  padding: 5px;
`;

const AddContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;

`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Amount = styled.span`
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
  const {error, loading, data} = useQuery(GET_PRODUCT, {
		variables: {
			productId: productID
		},
	})

  useEffect(()=>{     
      if (data) {
        console.log(data);
        setProduct(data.product);
        setPictures(data.product.pictures);
        setSizes(data.product.sizes);
        setColors(data.product.colors)
      }
  }, [data])

  return (
    <Container>
      {data && 
        <Wrapper>
          <ImgContainer>
              <img className="product-pic" src={process.env.PUBLIC_URL + "upload-images/" + pictures[0]}/>
          </ImgContainer>
          <InfoContainer>
            <Title>{product.name}</Title>
            <Desc>{product.description}</Desc>
            <Price>$ {product.price}</Price>
            <FilterContainer>
              <Filter>
                <FilterTitle>Colors</FilterTitle>
                {colors.map((color)=>
                    <input key={color.hexValue} type="color" value={color.hexValue} disabled/>
                )}
              </Filter>
            </FilterContainer>
            <FilterContainer>
              <Filter>
                <FilterTitle>Sizes</FilterTitle>
                {sizes.map((size, index)=>
                    <p key={index} style={{border:"1px", borderRadius:"8px", padding:"5px"}}>{size}</p>
                )}
              </Filter>
            </FilterContainer>
            <AddContainer>
              <AmountContainer>
                <IoMdRemove />
                <Amount>1</Amount>
                <IoIosAdd />
              </AmountContainer>
              <Button>ADD TO CART</Button>
            </AddContainer>
          </InfoContainer>
        </Wrapper>
      }
    </Container>
  );
};

export default Product;

