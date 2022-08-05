import React from "react";
import next from "../../common/assets/icon-1.png"
import star from "../../common/assets/icon-2.png"
import "./Main.css"
import NavBar from "../../common/navbar/NavBar";

const MainPage = () => {
    return ( 
        <div>
            <NavBar/>
                  <div class="banner_section layout_padding">
                        <div class="container">
                            <div class="row">
                            <div class="col-md-12">
                                <div class="banner_taital">Find Your Style</div>
                                <p class="banner_text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>     
                                <div class="see_bt"><a href="#">See More</a></div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="arrival_section layout_padding">
                        <div class="container">
                            <div class="row">
                            <div class="col-sm-4">
                                <div class="image_1">
                                    <h2 class="jesusroch_text">Geo Print Shirred Waist Dress</h2>
                                    <p class="movie_text">New Instock</p>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="image_2">
                                    <h2 class="jesusroch_text">Geo Print Shirred Waist Dress</h2>
                                    <p class="movie_text">New Instock</p>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="image_2">
                                    <h2 class="jesusroch_text">Geo Print Shirred Waist Dress</h2>
                                    <p class="movie_text">New Instock</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
        </div>
     );
}
 
export default MainPage;