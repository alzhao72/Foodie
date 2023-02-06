import React, { useState, useEffect } from "react";
import SingleStory from "./SingleStory.js";
import CommentsBlock from "./CommentsBlock.js";
import { get } from "../../utilities";

import "./Card.css";

const Card = (props) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    get("/api/comment", { parent: props._id }).then((comments) => {
      setComments(comments);
    });
  }, []);

  const addNewComment = (commentObj) => {
    setComments(comments.concat([commentObj]));
  };

  return (
    <div className="Card-container">
      <SingleStory
        _id={props._id}
        creator_name={props.creator_name}
        creator_id={props.creator_id}
        content={props.content}
        title={props.title}
        rating={props.rating}
        image={props.image}
        userId={props.userId}
        removePostDisplay={props.removePostDisplay}
        removeSavedPost={props.removeSavedPost}
        addSavedPost={props.addSavedPost}
        savedStoriesIds={props.savedStoriesIds} 
        likes={props.likes}
        page={props.page}
      />
     <div className="Card-story"> 
      <CommentsBlock
        story={props}
        comments={comments}
        creator_id={props.creator_id}
        userId={props.userId}
        addNewComment={addNewComment}
      />
    </div>
    </div>
  );
};

export default Card;
