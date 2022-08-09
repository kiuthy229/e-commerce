import React from "react";
import "./NavBar.css"
import { FaShoppingCart } from 'react-icons/fa';
import styled from "styled-components";
import logo from '../assets/logo.png';
        
const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
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
  margin-left: 30px;
  justify-content: flex-end;

`;

const NavBar = () => {
    return ( 
        <div>
            <div className="header_section">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Right>
                        <a className="logo" href="/"><img src={logo} style={{width: "80px", height: "80px"}} /></a>
                        <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <MenuItem>
                                    <a className="nav-link" href="/products">Products</a>
                                </MenuItem>
                            </li>
                            <li className="nav-item">
                                <MenuItem>
                                    <a className="nav-link" href="/addproduct">Add Product</a>
                                </MenuItem>
                            </li>
                            <li className="nav-item">
                                <MenuItem>
                                    <a className="nav-link" href="/customer">Customer</a>
                                </MenuItem>
                            </li>
                            <li className="nav-item">
                                <MenuItem>
                                    <a className="nav-link" href="/checkout">Checkout</a>
                                </MenuItem>
                            </li>
                            <li className="nav-item">
                            <MenuItem>
                                <FaShoppingCart style={{fontSize: 20}}/>   
                            </MenuItem>
                            </li>
                        </ul> 
                        </ div>
                    </Right>
                </nav>
            </div>
        </div>
     );
}
 
export default NavBar;