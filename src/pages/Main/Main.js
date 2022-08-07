import React, {useState, useEffect} from "react";
import "./Main.css";


const MainPage = () => {
    const [customerID, setCustomerID] = useState("")
    // useEffect(() => {
    //     window.localStorage.setItem("customerID", JSON.stringify(customerID));
    //   }, [customerID]);

    const handleSubmitCusID = () => {
        console.log("onsubmit")
        window.localStorage.setItem("customerID", JSON.stringify(customerID));
    }

    // useEffect(()=>{
    //     const items = JSON.parse(localStorage.getItem('items'));
    //     if (items) {
    //     setItems(items);
    //     }
    // },[])
    return ( 
        <div>
                  <div class="banner_section layout_padding">
                        <div class="container">
                            <div class="row">
                            <div class="col-md-12">
                                <div class="banner_taital">Find Your Style</div>
                                <p class="banner_text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>     
                                <div class="see_bt"><a href="/products">See More</a></div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="arrival_section layout_padding">
                        <div className="customer-id-field">
                            <input className="cusID" type="text" placeholder="Customer ID" onChange={(e)=>setCustomerID(e.target.value)}/>
                            <button className="cusID-submit-btn" type="submit" onClick={handleSubmitCusID}>Submit</button>
                        </div>

                        <div class="container">
                            <div class="row">
                            <div class="col-sm-4">
                                <div class="image_1">
                                    <h2 class="jesusroch_text">Geo Print Shirred Waist Dress</h2>
                                    <p class="des_text">New Instock</p>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="image_2">
                                    <h2 class="jesusroch_text">Geo Print Shirred Waist Dress</h2>
                                    <p class="des_text">New Instock</p>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="image_2">
                                    <h2 class="jesusroch_text">Geo Print Shirred Waist Dress</h2>
                                    <p class="des_text">New Instock</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
        </div>
     );
}
 
export default MainPage;