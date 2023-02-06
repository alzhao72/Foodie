import React, { useState, useEffect } from "react";
import Card from "../modules/Card.js";
import ScrollUpButton from "react-scroll-up-button";
import { get } from "../../utilities";
import "../modules/Friend.css"
import "../../utilities.css";

const Feed = (props) => {
  const [stories, setStories] = useState([]);
  const [friendStories, setFriendStories] = useState([]);
  const [savedStoriesIds, setSavedStoriesIds] = useState([]);
  const [viewMode, setViewMode] = useState("all");

  const viewOptions = [{name: 'All Posts', value: 'all'}, {name: 'Friends Only', value: 'friends'}, {name: 'Saved Posts', value: 'saved'}];

  // called when the "Feed" component "mounts", i.e.
  // when it shows up on screen
  useEffect(() => {
    document.title = "Feed";
    get("/api/stories").then((allStoryObjs) => {
      let reversedStoryObjs = allStoryObjs.reverse();
	    setStories(reversedStoryObjs);
      get("/api/user", { userid: props.userId }).then((currUserObj) => {
        const checkCreator = (storyObj) => {return currUserObj.friends.includes(storyObj.creator_id)};
        let filteredStoryObjs = reversedStoryObjs.filter(checkCreator);
        setFriendStories(filteredStoryObjs);

        const checkSaved = (storyObj) => {return currUserObj.saved.includes(storyObj._id)};
        let savedStoryObjs = reversedStoryObjs.filter(checkSaved);
        setSavedStoriesIds(savedStoryObjs.map((storyObj) => (storyObj._id)));
      });
    });
  }, []);

  const removePostDisplay = (storyId) => {
    const checkStory = (storyObj) => {return storyObj._id !== storyId};
    setStories(stories.filter(checkStory));
    setFriendStories(friendStories.filter(checkStory));
  };

  const removeSavedPost = (storyId) => {
    const checkSavedStoryId = (savedStoryId) => {return savedStoryId !== storyId};
    setSavedStoriesIds(savedStoriesIds.filter(checkSavedStoryId));
  }

  const addSavedPost = (storyId) => {
    setSavedStoriesIds([storyId].concat(savedStoriesIds));
  }

  const handleSelectorChange = (event) => {
    setViewMode(event.target.value);
  }

  let storiesList = null;
  if (viewMode === "all" && stories.length !== 0) {
    storiesList = stories.map((storyObj) => (
      <Card
        key={`Card_${storyObj._id}`}
        _id={storyObj._id}
        creator_name={storyObj.creator_name}
        creator_id={storyObj.creator_id}
        userId={props.userId}
        content={storyObj.content}
        title={storyObj.title}
        rating={storyObj.rating}
        image={storyObj.image}
        removePostDisplay={removePostDisplay}
        removeSavedPost={removeSavedPost}
        addSavedPost={addSavedPost}
        savedStoriesIds={savedStoriesIds} 
        likes={storyObj.likes}
        page="feed"
      />
    ));
  } else if (viewMode === "friends" && friendStories.length !== 0) {
    storiesList = friendStories.map((storyObj) => (
      <Card
        key={`Card_${storyObj._id}`}
        _id={storyObj._id}
        creator_name={storyObj.creator_name}
        creator_id={storyObj.creator_id}
        userId={props.userId}
        content={storyObj.content}
        title={storyObj.title}
        rating={storyObj.rating}
        image={storyObj.image}
        removePostDisplay={removePostDisplay}  
        removeSavedPost={removeSavedPost}
        addSavedPost={addSavedPost}
        savedStoriesIds={savedStoriesIds}
        likes={storyObj.likes}
        page="feed"
      />
    ));
  } else if (viewMode === "friends") {
    storiesList = <div className="No-friends"> No Friend Posts!</div>;
  } else if (viewMode === "saved" && savedStoriesIds.length !== 0) {
    const checkSaved = (storyObj) => {return savedStoriesIds.includes(storyObj._id)};
    const savedStories = stories.filter(checkSaved);
    storiesList = savedStories.map((storyObj) => (
      <Card
        key={`Card_${storyObj._id}`}
        _id={storyObj._id}
        creator_name={storyObj.creator_name}
        creator_id={storyObj.creator_id}
        userId={props.userId}
        content={storyObj.content}
        title={storyObj.title}
        rating={storyObj.rating}
        image={storyObj.image}
        removePostDisplay={removePostDisplay}  
        removeSavedPost={removeSavedPost}
        addSavedPost={addSavedPost}
        savedStoriesIds={savedStoriesIds} 
        likes={storyObj.likes}
        page="feed"
      />
    ));
  } else if (viewMode === "saved") {
    storiesList = <div className="No-friends"> No Saved Posts!</div>;
  }

  return (<>
    <div className="Feed-container">
      <select onChange={handleSelectorChange} value={viewMode} className="FeedSelector-container">
          {viewOptions.map((item) => ( <option value={item.value}> {item.name} </option> ))}
      </select>
      <div className="CardBlock-container">
      {storiesList}
      </div>
      <div className="Empty"> Empty </div>
      <ScrollUpButton ContainerClassName="ScrollUpButton" />
    </div> 
   </>);
};

export default Feed;
