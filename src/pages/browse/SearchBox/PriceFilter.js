import {React} from 'react';
import './PriceFilter.css';

export const PriceFilter = () => {
    const priceInput = document.querySelectorAll(".price-input input");

    let priceGap = 100;

    priceInput.forEach(input => {
        input.addEventListener("input", e => {
            //getting two inputs value and parsing them to number
            let minVal = parseInt(priceInput[0].value),
                maxVal = parseInt(priceInput[1].value);
            
            if((maxVal - minVal >= priceGap) && maxVal <=10000){
                if(e.target.className === "input-min"){
                    priceInput[0].value = maxVal - priceGap;
                }else{
                    priceInput[1].value = minVal + priceGap;
                }
            }else {
                priceInput[0].value = minVal;
                priceInput[1].value = maxVal;
                // progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
                // progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
            }
        });
    });
    return (
        <span class="wrapper">
            <h4>Price</h4>
        <span class="price-input">
            <div class="field">
                <span>Min</span>
                <input type="number" class="input-min" step={10}/>
            </div>
            <div class="seperator">-</div>
            <div class="field">
                <span>Max</span>
                <input type="number" class="input-max" step={10}/>
            </div>
        </span>
        </span>
    )
};