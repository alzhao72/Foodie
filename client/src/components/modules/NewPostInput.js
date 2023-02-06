import React, { useState } from "react";
import "./NewPostInput.css";
import { post } from "../../utilities";

import ReactStars from "react-rating-stars-component";
import  ReactQuill  from  "react-quill";
import  "react-quill/dist/quill.snow.css";
import panda from "../../public/panda yay.png";


/**
 * New Comment is a New Post component for comments
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} storyId to add comment to
 */
const NewComment = (props) => {
  const [commentValue, setCommentValue] = useState("");
  
  // called whenever the user types in the new post input box
  const handleCommentChange = (event) => {
    setCommentValue(event.target.value);
  };
  
  // called when the user hits "Submit" for a new post
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const body = { parent: props.storyId, content: commentValue };
    post("/api/comment", body).then((comment) => {
      // display this comment on the screen
      props.addNewComment(comment);
    });

    setCommentValue("");
  };
  
  return (
    <div className="u-flex">
      <input
        type="text"
        placeholder="New Comment"
        value={commentValue}
        onChange={handleCommentChange}
        className="NewPostInput-input"
      />
      <button input 
        type="submit"
        className="NewPostInput-button u-pointer"
        value="Submit"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};


/**
 * New Story is a New Post component for comments
 */
const NewStory = (props) => {
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [ratingValue, setRatingValue] = useState("");  
  const [imageValue, setImageValue] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // called whenever the user types in the new post input box
  const handleTitleChange = (event) => {
    setTitleValue(event.target.value);
  };

  const handleImageChange = async (event) => {
    setImageValue(event.target.files[0]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const myImage = new FormData();
    myImage.append("image", imageValue);

    await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {Authorization: 'Client-ID b15bcccaa86b623',},
      body: myImage
    }).then((response) => response.json())
    .then((responseJSON) => {
      const storyBody = { title: titleValue, content: contentValue, rating: ratingValue, image: responseJSON.data.link };
      post("/api/story", storyBody).then((newStory) => {
        const rankBody = { storyid: newStory._id };
        post("/api/insertStoryRank", rankBody).then((result) => {
          setTitleValue("");
          setContentValue("");
          setRatingValue("");
          setImageValue("");
          setSubmitted(true);
        });
      });
    }).catch((err) => {
        console.log("ERROR");
    });
  }
  
  const rating = {
    size: 28,
    starDimension: '70px',
    isHalf: true,
    value: 0,
    char: "♥",
    color: "#C0C0C0",
    activeColor: "#505489",
    onChange: newValue => {
      setRatingValue(newValue);
    }
  };
  
  return(<> 
    {submitted ? (

      <div className="Overall-post">
      <div className="Post-panda">
      <img src = {panda} />
      </div>
      <button className="Postpanda-button u-pointer" onClick={() => {setSubmitted(false)}}> New Post </button>
      </div>
      
    ) : (<>

      <form action="" onSubmit={handleSubmit}>
        <div className="Post-heading"> <h4>Create Post</h4> </div>

        <div className="Upload-form2">
          <input type="text" placeholder="Restaurant Name" value={titleValue} onChange={handleTitleChange} className="NewPostInput-input" />
        </div>

        <div className="Upload-form u-flex">
          <h4>Rating: &nbsp;</h4> 
          <ReactStars {...rating} />
        </div>

        <div className="Upload-form">
          <input type="file" onChange={handleImageChange} />
          <span>File names must end in .jpg, .jpeg, or .png </span>
        </div>

        <div className="Upload-form2">
          <ReactQuill theme="snow" scrollingContainer="#editorcontainer" value={contentValue} onChange={setContentValue} className = "QuillEditor"/>
        </div>

        <div className="Upload-form2">
          <input type="submit" className="Upload-button u-pointer" value="Upload Post" />
        </div>

      </form>

    </>)} 
  </>);
};

export { NewComment, NewStory };
