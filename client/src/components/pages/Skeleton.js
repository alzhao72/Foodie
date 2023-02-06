import React, { useEffect } from "react";
import { Link } from "@reach/router";
import "../../utilities.css";
import "./Skeleton.css";
import bubble from "../../public/bubbleTitle2.png";


const Example = () => {

    
useEffect(() => {
    document.title = "FOODIE";
  }, []);

    return(
        <div className="Homepage">
            <img src={bubble}  className="Foodie-title"/>
                <button className="About-button"> <Link to ='/about' className="About-link"> Welcome! </Link> </button>
        </div>
    )
}
  
export default Example;