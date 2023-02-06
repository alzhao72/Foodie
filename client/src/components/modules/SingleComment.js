import React from "react";
import { Link } from "@reach/router";
import "./NewPostInput.css";


/**
 * Component to render a single comment
 * 
 * Proptypes
 * @param {string} _id of comment
 * @param {string} creator_name
 * @param {string} content of the comment
 */
const SingleComment = (props) => {
  return (
    <div className="Card-commentBody">
      <Link input to={`/profile/${props.creator_id}`} className="u-link u-bold profile-color">
        {props.creator_name}
      </Link>
      <span>{" • " + props.content}</span>
    </div>
  );
};

export default SingleComment;
