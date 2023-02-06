import React, { useState, useEffect } from "react";
import FriendCard from "../modules/FriendCard.js";
import "./Friend.css";
import { get } from "../../utilities";

const FriendCardBlock = (props) => {

  useEffect(() => {
    let promises = [];
    for (let i = 0; i < props.user.friends.length; i++) {
      promises.push(get("/api/user", { userid: props.user.friends[i] }));
    }
    Promise.all(promises).then((results) => {props.setFriendDisplay(results);});
  }, [props.user?._id]);

  let friendsList = null;
  if (props.userFriends?.length !== 0) {
    friendsList = props.userFriends?.map((personObj) => (<> 
      <FriendCard 
        user={props.user}
        cardUser={personObj} 
        currUserId={props.currUserId} 
        setFriendDisplay={props.setFriendDisplay}
        setInReqsDisplay={props.setInReqsDisplay}
        setOutReqsDisplay={props.setOutReqsDisplay}
        addFriendDisplay={props.addFriendDisplay}
        addInReqsDisplay={props.addInReqsDIsplay}
        addOutReqsDisplay={props.addOutReqsDisplay}  
        removeFriendDisplay={props.removeFriendDisplay}
        removeInReqsDisplay={props.removeInReqsDisplay}
        userFriends={props.userFriends}
        userInReqs={props.userInReqs}
        userOutReqs={props.userOutReqs}
      /> 
    </> ));
  } else {
    friendsList = <p> No Friends Added Yet </p>;
  }

  return <div className="FriendCardBlock-scroll"> {friendsList} </div>;
};


const InReqCardBlock = (props) => {

  useEffect(() => {
    let promises = [];
    for (let i = 0; i < props.user.inReqs.length; i++) {
      promises.push(get("/api/user", { userid: props.user.inReqs[i] }));
    }
    Promise.all(promises).then((results) => {props.setInReqsDisplay(results);});
  }, [props.user?._id]);

  let inReqsList = null;
  if (props.userInReqs?.length !== 0) {
    inReqsList = props.userInReqs?.map((personObj) => (<> 
      <FriendCard 
        user={props.user}
        cardUser={personObj} 
        currUserId={props.currUserId} 
        setFriendDisplay={props.setFriendDisplay}
        setInReqsDisplay={props.setInReqsDisplay}
        setOutReqsDisplay={props.setOutReqsDisplay}
        addFriendDisplay={props.addFriendDisplay}
        addInReqsDisplay={props.addInReqsDIsplay}
        addOutReqsDisplay={props.addOutReqsDisplay}  
        removeFriendDisplay={props.removeFriendDisplay}
        removeInReqsDisplay={props.removeInReqsDisplay}
        userFriends={props.userFriends}
        userInReqs={props.userInReqs}
        userOutReqs={props.userOutReqs}
      /> 
    </> ));
  } else {
    inReqsList =  <p> No Incoming Friend Requests </p>;
  }

  return <div className="RequestCardBlock-scroll"> {inReqsList} </div>;
};


const OutReqCardBlock = (props) => {

  useEffect(() => {
    let promises = [];
    for (let i = 0; i < props.user.outReqs.length; i++) {
      promises.push(get("/api/user", { userid: props.user.outReqs[i] }));
    }
    Promise.all(promises).then((results) => {props.setOutReqsDisplay(results);});
  }, [props.user?._id]);

  let outReqsList = null;
  if (props.userOutReqs?.length !== 0) {
    outReqsList = props.userOutReqs?.map((personObj) => (<> 
      <FriendCard 
        user={props.user}
        cardUser={personObj} 
        currUserId={props.currUserId} 
        setFriendDisplay={props.setFriendDisplay}
        setInReqsDisplay={props.setInReqsDisplay}
        setOutReqsDisplay={props.setOutReqsDisplay}
        addFriendDisplay={props.addFriendDisplay}
        addInReqsDisplay={props.addInReqsDIsplay}
        addOutReqsDisplay={props.addOutReqsDisplay}  
        removeFriendDisplay={props.removeFriendDisplay}
        removeInReqsDisplay={props.removeInReqsDisplay}
        userFriends={props.userFriends}
        userInReqs={props.userInReqs}
        userOutReqs={props.userOutReqs}
      /> 
    </> ));
  } else {
    outReqsList =  <p> No Outgoing Friend Requests </p>;
  }

  return <div className="RequestCardBlock-scroll"> {outReqsList} </div>;
};



export { FriendCardBlock, InReqCardBlock, OutReqCardBlock };







