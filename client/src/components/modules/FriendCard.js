import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";

import "./Friend.css";

const FriendCard = (props) => {
  const [isFriends, setIsFriends] = useState();

  useEffect(() => {
    get("/api/user", { userid: props.cardUser?._id }).then((cardUserObj) => {
      if (cardUserObj.friends.includes(props.currUserId)) {
        setIsFriends("true");
      } else if (cardUserObj.inReqs.includes(props.currUserId)) {
        setIsFriends("outgoing");
      } else if (cardUserObj.outReqs.includes(props.currUserId)) {
        setIsFriends("incoming");
      } else {
        setIsFriends("false");
      }
    });
  }, [props.user?._id, props.cardUser?._id, props.currUserId, props.userFriends, props.userInReqs, props.userOutReqs]);

  useEffect(() => {
    const listenIncoming = (data) => {
      if (data.recipient === props.currUserId && data.sender === props.cardUser._id) {
        console.log("Recieved friend request from", props.cardUser.name);
        setIsFriends("incoming");
      }
    };
    socket.on("listenIncoming", listenIncoming);
    return () => {socket.off("listenIncoming", listenIncoming)};
  }, [props.user?._id, props.cardUser?._id, props.currUserId]);

  useEffect(() => {
    const listenUnfriend = (data) => {
      if (data.recipient === props.currUserId && data.sender === props.cardUser._id) {
        console.log("Removed from friends list by", props.cardUser.name);
        setIsFriends("false");
      }
    };
    socket.on("listenUnfriend", listenUnfriend);
    return () => {socket.off("listenUnfriend", listenUnfriend)};
  }, [props.user?._id, props.cardUser?._id, props.currUserId]);

  useEffect(() => {
    const listenResponse= (data) => {
      if (data.recipient === props.currUserId && data.sender === props.cardUser._id) {
        if (data.response === "accept") {
          console.log("Friend req was accepted by", props.cardUser.name);
          setIsFriends("true");
        } else {
          console.log("Friend req was declined by", props.cardUser.name);
          setIsFriends("false");
        }
      }
    };
    socket.on("listenResponse", listenResponse);
    return () => {socket.off("listenResponse", listenResponse)};
  }, [props.user?._id, props.cardUser?._id, props.currUserId]);

  const addFriend = async (event) => {
    event.preventDefault();
    const resR1 = await post("/api/addFriend", {sender: props.cardUser._id, recipient: props.currUserId});
    const resS1 = await post("/api/addFriend", {sender: props.currUserId, recipient: props.cardUser._id});
    const resR2 = await post("/api/removeIncoming", {sender: props.cardUser._id, recipient: props.currUserId});
    const resS2 = await post("/api/removeOutgoing", {sender: props.cardUser._id, recipient: props.currUserId});

    if (resR1 && resS1 && resR2 && resS2){
      setIsFriends("true");
      post("/api/listenResponse", {response: "accept", sender: props.currUserId, recipient: props.cardUser._id}).then((res) => console.log(res));
      if (props.user._id === props.currUserId) {
        props.removeInReqsDisplay(props.cardUser);
        props.addFriendDisplay([props.cardUser]);
      } 
      console.log("Added Friend", resR1.name, resS1.name);
    }
  };

  const requestFriend = async (event) => {
    event.preventDefault();
    const resR = await post("/api/addIncoming", {sender: props.currUserId, recipient: props.cardUser._id});
    const resS = await post("/api/addOutgoing", {sender: props.currUserId, recipient: props.cardUser._id});

    if (resR && resS){
      setIsFriends("outgoing");
      post("/api/listenIncoming", {sender: props.currUserId, recipient: props.cardUser._id}).then((res) => console.log(res));
      if (props.user._id === props.currUserId) {
        props.addOutReqsDisplay([props.cardUser]);
      } 
      console.log("Sent Request to", resR.name, resS.name);
    }
  };

  const declineFriend = async (event) => {
    event.preventDefault();
    const resR = await post("/api/removeIncoming", {sender: props.cardUser._id, recipient: props.currUserId});
    const resS = await post("/api/removeOutgoing", {sender: props.cardUser._id, recipient: props.currUserId});

    if (resR && resS){
      setIsFriends("false");
      post("/api/listenResponse", {response: "decline", sender: props.currUserId, recipient: props.cardUser._id}).then((res) => console.log(res));
      if (props.user._id === props.currUserId) {
        props.removeInReqsDisplay(props.cardUser);
      } 
      console.log("Deleted Request from", resS.name, resR.name);
    }
  };

  const removeFriend = async (event) => {
    event.preventDefault();
    const resR = await post("/api/removeFriend", {sender: props.cardUser._id, recipient: props.currUserId});
    const resS = await post("/api/removeFriend", {sender: props.currUserId, recipient: props.cardUser._id});

    if (resR && resS){
      setIsFriends("false"); 
      post("/api/listenUnfriend", {sender: props.currUserId, recipient: props.cardUser._id}).then((res) => console.log(res));
      if (props.user._id === props.currUserId) {
        props.removeFriendDisplay(props.cardUser);
      } 
      console.log("Deleted Friend", resR.name, resS.name);
    }
  };

  const manageFriendButton = () => {
    if (props.currUserId === props.cardUser?._id){
      return <> <p className="Friend-p"> &nbsp; • You! </p> </>
    } else if (isFriends === "true") {
      return <> <p className="Friend-p"> &nbsp; • Friends </p> <button onClick={removeFriend} className="Friend-button"> Remove </button> </>
    } else if (isFriends === "false") {
      return <> <button onClick={requestFriend} className="Friend-button"> Send Request </button> </>
    } else if (isFriends === "outgoing") {
      return <> <p className="Friend-p"> &nbsp; • Request Sent! </p> </>
    } else if (isFriends === "incoming") {
      return <> <p className="Friend-p"> &nbsp; • Pending </p>
        <button onClick={addFriend} className="Friend-button"> Accept </button>
        <button onClick={declineFriend} className="Friend-button"> Decline </button>
      </>
    }
  };

  return (
    <div className="FriendCard-container">
      <Link to={`/profile/${props.cardUser?._id}`} className="u-link u-bold profile-color"> <p className="Friend-p"> {props.cardUser?.name} </p></Link>
      {manageFriendButton()}
    </div>
  );
};

export default FriendCard;
