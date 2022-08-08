import React from "react";
import "./NavBar.css"
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import styled from "styled-components";
//import { Viewallproducts } from "../../pages/browse/ProductsCard/ProductsCard";
//import { gql } from '@apollo/client';

// const GET_PRODUCTS = gql`
//   query GetProducts {
//     products {
//         id
//         name
//         price
//         stock
//         description
//         colors {
//           name
//           hexValue
//         }
//         categories
//         pictures
//         sizes
//       }
//   }
// `;
// export const Viewallproducts = () => {
//     const {error, loading, data} = useQuery(GET_PRODUCTS)
//     const [products, setProducts] = useState([])
    
//     useEffect(() => {
//       if (data) {
//         setProducts(data.products)
//         console.log(data)
//       }
//     })
    //return (
        const handleSearch = () => {
            let searchInput = document.getElementById("searchbar-input").value;
            let elements = document.querySelectorAll(".product-name");
            let cards = document.querySelectorAll(".card-container");
            //loop through all elements
            elements.forEach((element, index) => {
              //check if text includes the search value
              if (element.innerText.includes(searchInput.toUpperCase())) {
                //display matching card
                cards[index].classList.remove("hide");
              } else {
                //hide others
                cards[index].classList.add("hide");
              }
        })
    } 
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
                    <Left>
                    {/* //SEARCH BAR */}
                        <SearchContainer className="search-bar">
                            <Input type="search" id="searchbar__input" placeholder="Search" /> 
                            <button id="search" onClick={handleSearch}><FaSearch /></button>
                        </SearchContainer>
                    </Left>
                    <Right>
                        <a className="logo" href=""><img src=""/></a>
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
                                    <a className="nav-link" href="">Customer</a>
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