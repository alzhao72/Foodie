import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import { get, post } from "../../utilities";
import "./NewPostInput.css";
import ReactStars from "react-rating-stars-component";
import ReactHtmlParser from 'react-html-parser';

import purple from "../../public/purple.png";
import like from "../../public/like.png";
import unlike from "../../public/unlike.png";


/**
 * Story is a component that renders creator and content of a story
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {string} creator_name
 * @param {string} creator_id
 * @param {string} content of the story
 */


const SingleStory = (props) => {
  const [saved, setSaved] = useState(null);
  const [liked, setLiked] = useState(null);
  const [numLikes, setNumLikes] = useState();

  useEffect(() => {
    setSaved(props.savedStoriesIds.includes(props._id));
  }, [props.savedStoriesIds]);

  const deleteCardDisplay = () => {
    post(`/api/deleteStoryRank`, { storyid: props._id }).then((res) => {
      post(`/api/deleteStory`, { storyid: props._id });
      props.removePostDisplay(props._id);
    });

    // if (saved) {
    //   post(`/api/deleteSaved`, { storyid: props._id });
    //   if (props.page === "feed") {
    //     props.removeSavedPost(props._id);
    //   }
    //   setSaved(false);
    // }
  };

  const handleUnsave = () => {
    post(`/api/deleteSaved`, { storyid: props._id });
    if (props.page === "feed") {
      props.removeSavedPost(props._id);
    }
    setSaved(false);
  }

  const handleSave = () => {
    post(`/api/addSaved`, { storyid: props._id });
    if (props.page === "feed") {
      props.addSavedPost(props._id);
    }
    setSaved(true);
  }
  
  const handleLikes = () => {
    const newLiked = (liked + 1) % 2;
    if (newLiked === 1) {
      post(`/api/likeCounter`, { storyid: props._id, increment: "+" });
      setNumLikes(numLikes + 1);
    } else {
      post(`/api/likeCounter`, { storyid: props._id, increment: "-" });
      setNumLikes(numLikes - 1);
    }
    setLiked(newLiked);
  }

  useEffect(() => {
    if (props.likes?.includes(props.userId)) {
      setLiked(1);
    } else {
      setLiked(0);
    }
    setNumLikes(props.likes?.length);
  }, []);

  return (
    <div className="Card-story">
      <div className="Create-row">
        <div className="Post-creator">
          <Link input to={`/profile/${props.creator_id}`} className="u-link u-bold profile-color"> {props.creator_name} </Link>
        </div>
        <div className="Post-button">
        {saved ? (<button input className="Save-button" onClick={handleUnsave}> Unsave </button>) 
               : (<button input className="Save-button" onClick={handleSave}> Save </button>)}
        {props.userId === props.creator_id && (<button input className="Delete-button" onClick={deleteCardDisplay}> Delete </button>)}
      </div>
      </div>
      <div className="Purple">
        <h3> {props.title} </h3>
        <a href={`https://www.google.com/maps/search/${props.title}`} target="_blank"> <img src = {purple}/> </a>
      </div>

      < ReactStars size={32} isHalf={true} value={props.rating} edit={false} char="♥" color="#C0C0C0" activeColor="#505489"/>
      <img src={props.image}/>
      
      <div className="Card-storyContent">{ReactHtmlParser(props.content)}</div>

      {liked === 1 ? (<button input className="Like-button" onClick={handleLikes}> <img src = {unlike}/> {numLikes} </button>) 
               : (<button input className="Like-button" onClick={handleLikes}> <img src = {like}/> {numLikes} </button>)}
      
    </div>
  );
};

export default SingleStory;
