//import { Badge } from "@mui/material";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
// import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import React from "react";
import styled from "styled-components";
//import { mobile } from "../responsive";

const Container = styled.div`
  height: 60px;

`;

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Language = styled.span`
  font-size: 14px;
  cursor: pointer;

`;

const SearchContainer = styled.div`
  border: 1px solid black;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 5px 20px;
  
`;

const Input = styled.input`
  border: none;
  background: none;

`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: bold;
  font-size: 30px;
`;
const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;

`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;

`;

const Navbar = () => {
    const handleSearchChange = (e) => {
        console.log(e.target.value)
    }
  return (
    <Container>
      <Wrapper>
        <Left>
          <Language>EN</Language>
          <SearchContainer>
            <Input placeholder="Search"  onChange={(e) => handleSearchChange(e)}/> 
            <FaSearch style={{ color: "black", fontSize: 16 }} /> 
          </SearchContainer>
        </Left>
        <Center>
          <Logo>THE MERMAID CLOTHING.</Logo>
        </Center>
        <Right>
          <MenuItem>SIGN IN</MenuItem>
          <MenuItem>
            {/* <Badge badgeContent={4} color="primary" style={{fontSize: 10}}> */}
            <FaShoppingCart style={{fontSize: 20}}/>
            {/* </Badge> */}
          </MenuItem>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;