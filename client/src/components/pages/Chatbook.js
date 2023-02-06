import React, { useEffect, useState } from "react";
import ChatList from "../modules/ChatList.js";
import Chat from "../modules/Chat.js";
import { socket } from "../../client-socket.js";
import { get } from "../../utilities";

import "./Chatbook.css";

const ALL_CHAT = {
  _id: "ALL_CHAT",
  name: "Public Chat",
};

const Chatbook = (props) => {
  /**
   * @typedef UserObject
   * @property {string} _id
   * @property {string} name
   */
  /**
   * @typedef MessageObject
   * @property {UserObject} sender
   * @property {string} content
   */
  /**
   * @typedef ChatData
   * @property {MessageObject[]} messages
   * @property {UserObject} recipient
   */

  const [activeUsers, setActiveUsers] = useState([]);
  const [activeChat, setActiveChat] = useState({ recipient: ALL_CHAT, messages: [] });

  const loadMessageHistory = (recipient) => {
    get("/api/chat", { recipient_id: recipient._id }).then((messages) => {setActiveChat({ recipient: recipient, messages: messages })});
  };

  useEffect(() => {
    document.title = "Chat";
  }, []);

  useEffect(() => {
    loadMessageHistory(activeChat.recipient);
  }, [activeChat.recipient._id]);

  useEffect(() => {
    const getFriends = async () => {
      let promises = [];
      const currUser = await get("/api/user", { userid: props.userId });

      for (let i = 0; i < currUser.friends.length; i++) {
        promises.push(get("/api/user", { userid: currUser.friends[i] }));
      }
      Promise.all(promises).then((results) => {setActiveUsers([ALL_CHAT].concat(results))});
    }
    getFriends();
  }, []);  

  useEffect(() => {
    const addMessages = (data) => {
      if (
        (data.recipient._id === activeChat.recipient._id &&
          data.sender._id === props.userId) ||
        (data.sender._id === activeChat.recipient._id &&
          data.recipient._id === props.userId) ||
        (data.recipient._id === "ALL_CHAT" && activeChat.recipient._id === "ALL_CHAT")
      ) {
        setActiveChat(prevActiveChat => ({
          recipient: prevActiveChat.recipient,
          messages: prevActiveChat.messages.concat(data),
        }));
      }
    };
    socket.on("message", addMessages);
    return () => {
      socket.off("message", addMessages);
    };
  }, [activeChat.recipient._id, props.userId]);

  const setActiveUser = (user) => {
    if (user._id !== activeChat.recipient._id) {
        setActiveChat({
            recipient: user,
            message: []
        });
    };
  };   

  if (!props.userId) {
    return <div> Log in before using Chatbook </div>;
  }
  return (
    <>
      <div className="u-flex u-relative Chatbook-container">
        <div className="Chatbook-userList">
            <ChatList 
            setActiveUser={setActiveUser}
            userId={props.userId}
            users={activeUsers}
            active={activeChat.recipient}
            />
        </div>
        <div className="Chatbook-chatContainer u-relative">
          <Chat data={activeChat} userId={props.userId} />
        </div>
      </div>
    </>
  );
};

export default Chatbook;
