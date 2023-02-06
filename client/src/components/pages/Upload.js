import React, { useState, useEffect } from "react";
import Card from "../modules/Card.js";
import { NewStory } from "../modules/NewPostInput.js";
import "./upload.css";
import panda from "../../public/panda yay.png";

import { get } from "../../utilities";

const Upload = (props) => {

  useEffect(() => {
    document.title = "Upload";
  }, []);

  return (<>
    <div className="Upload-container">
      {props.userId && <NewStory />}
    </div>
  </>);
};

export default Upload;
