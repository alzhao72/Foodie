import React, { useState, useEffect } from "react";

import "./SingleMessage.css";

/**
 * Renders a single chat message
 *
 * Proptypes
 * @param {MessageObject} message
 */
const SingleMessage = (props) => {
  return (
    <div className={"u-flex u-flex SingleMessage-container"}>
      <span className=" SingleMessage-sender u-bold">{props.message.sender.name + ":"}</span>
      {props.message.sender._id === props.userId ? (
        <span className="SingleMessage-mine">{props.message.content}</span>
      ) : (
        <span className="SingleMessage-content">{props.message.content}</span>
      )}
    </div>
  );
}

export default SingleMessage;
