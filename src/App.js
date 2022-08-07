import React from "react";
import "./App.css";
import GetProducts from "./pages/owner/GetProducts/GetProducts";
import AddProduct from "./pages/owner/AddProduct/AddProduct";
import PostImage from "./pages/owner/PostImage";
import {Checkout} from "./pages/checkout/index.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Main from "./pages/browse/Main";
import MainPage from "./pages/Main/Main"
import Product from "./pages/browse/ProductDetail/ProductDetail";
import NavBar from "./common/navbar/NavBar";

function App() {
  return (
      <div className="App">        
        <BrowserRouter>
          <NavBar/>
          <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/addproduct" element={<AddProduct/>}/>
            <Route path="/thithien" element={<Main/>}/>
            <Route path="/thithien2" element={<Product/>}/>
            <Route path="/postimage" element={<PostImage/>}></Route>
            <Route path="/products" element={<GetProducts/>}>
              {/* <Route path="detail" element={<Page3/>}/>
              <Route path="image" element={<Page4/>}/>
              <Route path=":pageName/:pageId" element={<PageVariable/>}/> */}
            </Route>       
            <Route path="/checkout" element={<Checkout/>}></Route>     
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
