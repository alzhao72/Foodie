import React from "react";
import "../../utilities.css";
import "./Skeleton.css";

import panda from "../../public/panda eating.png";
import panda2 from "../../public/panda on phone.png";
import panda3 from "../../public/panda sleeping.png";

const About = () => {

    return(
        <div className="About-Container">
        <h2> Hello there! </h2>
        <p> Welcome to our humble website. We created Foodie as a way 
            to connect friends together through a shared love of food. 
            With so many places to eat, the options can be overwhelming. 
            People ask each other for food recommendations all the time. Sure, you could go
            on Yelp or Google, but wouldn't you trust a friend's opinion more? They know
            the best places around! Foodie is a social media platform that allows you to
            rate and rank your favorite places and see where your friends have been. </p>
        <p> Well, what are you waiting for? Sign in and get started! </p>
        <p></p>
                <div className="Pictures">
                    <div className="Panda2-pic">
                        <img src = {panda2}/>
                        <span> Discover your friend's <br></br> favorite restaurant.</span>
                    </div>
                    <div className="Panda-pic">
                        <img src = {panda}/>
                        <span> Enjoy the food. </span>
                    </div>
                    <div className="Panda3-pic">
                        <img src = {panda3}/>
                        <span> Take a nap for a job well done. </span>
                    </div>
                </div>
        </div>

    )
}
  
export default About;