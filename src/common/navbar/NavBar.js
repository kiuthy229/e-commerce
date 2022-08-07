import React from "react";
import "./NavBar.css"

const NavBar = () => {
    return ( 
        <div>
            <div class="header_section">
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="logo" href=""><img src=""/></a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <a class="nav-link" href="/products">Products</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/addproduct">Add Product</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="">Customer</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/checkout">Checkout</a>
                        </li>
                    </ul>
                    </div>
                </nav>
            </div>
        </div>
     );
}
 
export default NavBar;