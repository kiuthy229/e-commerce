import React from 'react';
import {Cart} from "./Cart.jsx";
import {CustomerInfo} from "./CustomerInfo.jsx";
export function Checkout (){
    return(
        <div>
            <Cart/>
            <CustomerInfo />
        </div>
        
    );
}