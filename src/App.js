import React from "react";
import "./App.css";
import { client } from "./client/client";
import { ApolloProvider } from '@apollo/client';
import GetProducts from "./pages/owner/GetProducts";
import AddProduct from "./pages/owner/AddProduct";
import {Checkout} from "./pages/checkout/index.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom"

function App() {
  return (
    <ApolloProvider client={client}>
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
    </ApolloProvider>
  );
}

export default App;
