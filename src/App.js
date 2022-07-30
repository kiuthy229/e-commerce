import React from "react";
import "./App.css";
import GetProducts from "./pages/owner/GetProducts";
import AddProduct from "./pages/owner/AddProduct";
import {Checkout} from "./pages/checkout/index.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom"

function App() {
  return (
      <div className="App">        
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AddProduct/>}/>
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
