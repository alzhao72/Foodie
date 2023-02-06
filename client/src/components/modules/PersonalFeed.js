import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from "../modules/Card.js";
import "./Card.css";
import "./Friend.css";
import "../pages/Profile";

import { get, post } from "../../utilities";

const PersonalFeed = (props) => {
  const [dragMode, setDragMode] = useState(false);
  const [myStories, setMyStories] = useState([]);

  useEffect(() => {
    let promises = [];
    for (let i = 0; i < props.user.storyRank.length; i++) {
      promises.push(get("/api/story", { storyid: props.user.storyRank[i] }));
    }
    Promise.all(promises).then((results) => {setMyStories(results);});
  }, [props.user.storyRank]);

    function handleDrop(result) {
        if (!result.destination) return;
        const items = Array.from(myStories);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setMyStories(items);
    }

    const removePostDisplay = (storyid) => {
        const checkStory = (storyObj) => {return storyObj._id !== storyid};
        setMyStories(myStories.filter(checkStory));
    };

    const savePostOrder = (event) => {
        event.preventDefault();
        const storyRank = myStories.map((storyObj) => (storyObj._id));
        console.log("storyRank", storyRank);
        post("/api/storyRank", {userid: props.currUser._id, newRank: storyRank}).then((storyObjs) => {setDragMode(false);});
    }

    const displayDragDropButton = () => {
        if (props.userId === props.currUser?._id){
        if (dragMode) {
            return <button input className="editProfile-button" onClick={savePostOrder}> Save Rankings </button>
        } else {
            return <button input className="editProfile-button" onClick={() => {setDragMode(true);}}> Rank Your Posts </button>
        }
        }
    } 

    const displayMyStories = () => {
    if(dragMode) {
        return (
            <div className="DragDrop-container">
                <DragDropContext onDragEnd={handleDrop}>
                    <Droppable droppableId="myStories">
                        {(provided) => (
                            <ul className="myStories" {...provided.droppableProps} ref={provided.innerRef}>
                                {myStories.map(({_id, creator_name, title, image}, index) => {
                                    return (
                                        <Draggable key={_id} draggableId={_id} index={index}>
                                        {(provided) => (
                                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <div className="MiniCard-container">
                                                    <img src={image} className="DragDrop-icon"/> &nbsp;
                                                    { title }
                                                </div>
                                            </li>
                                        )}
                                        </Draggable>
                                    );
                                })}
                            {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    } else {
        let storiesList = null;
        if (myStories.length !== 0) {
            storiesList = myStories.map((storyObj) => (
            <Card
                key={`Card_${storyObj._id}`}
                _id={storyObj._id}
                creator_name={storyObj.creator_name}
                creator_id={storyObj.creator_id}
                userId={props.currUser?._id}
                content={storyObj.content}
                title={storyObj.title}
                rating={storyObj.rating}
                image={storyObj.image}
                removePostDisplay={removePostDisplay}
                savedStoriesIds={props.user.saved} 
                likes={storyObj.likes}
                page="profile"
            />
            ));
        } else {
            storiesList = <div className="No-posts">No posts yet!</div>;
        }
        return storiesList;
    }
 }

  return <> 
        {displayDragDropButton()} 
        {displayMyStories()} 
    </>
};

export default PersonalFeed;