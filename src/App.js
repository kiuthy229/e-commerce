import React from "react";
import "./App.css";
import GetProducts from "./pages/owner/GetProducts/GetProducts";
import AddProduct from "./pages/owner/AddProduct/AddProduct";
import PostImage from "./pages/owner/PostImage";
import {Checkout} from "./pages/checkout/index.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {CustomerProduct} from "./pages/browse/ProductPage"
import MainPage from "./pages/Main/Main"
import Product from "./pages/browse/ProductDetail/ProductDetail";
import NavBar from "./common/navbar/NavBar";
import Success from "./pages/checkout/Success";

function App() {
  return (
      <div className="App">        
        <BrowserRouter>
          <NavBar/>
          <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/customer" element={<CustomerProduct/>}/>
            <Route path="/product/:id" element={<Product/>} exact/>
            <Route path="/addproduct" element={<AddProduct/>}/>
            <Route path="/postimage" element={<PostImage/>}></Route>
            <Route path="/products" element={<GetProducts/>}/>
            <Route path="/checkout" element={<Checkout/>}></Route>     
            <Route path="/success" element={<Success/>}></Route>     
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
