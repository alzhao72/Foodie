import React, { useState, useEffect } from "react";
import SingleUser from "./SingleUser.js";

import "./SingleUser.css";
import "./Chat.css";
import "./ChatList.css";
/**
 * List of users that are online to chat with and all chat
 *
 * Proptypes
 * @param {UserObject[]} users to display
 * @param {UserObject} active user in chat
 * @param {UserObject} user current logged in user
 * @param {(UserObject) => ()} setActiveUser function that takes in user, sets it to active
 */
const ChatList = (props) => {
  return (
    <>
    <div className="u-flexColumn ChatList-container">Open Chats</div>
      {props.users
        ?.map((user, i) => (
          <SingleUser
            key={i}
            setActiveUser={props.setActiveUser}
            user={user}
            // friends={user === props.friends}
            active={user === props.active}
          />
        ))}{" "}
    </>
  );
};

export default ChatList;
