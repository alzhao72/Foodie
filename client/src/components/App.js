import React, { useState, useEffect } from "react";
import NavBar from "./modules/NavBar.js";
import { Router } from "@reach/router";
import Feed from "./pages/Feed.js";
import NotFound from "./pages/NotFound.js";
import About from "./pages/About.js";
import Profile from "./pages/Profile.js";
import Chatbook from "./pages/Chatbook.js";
import GoogleMaps from "./pages/GoogleMaps.js";
import { socket } from "../client-socket.js";
import { get, post } from "../utilities";
import jwt_decode from "jwt-decode";
import Skeleton from "./pages/Skeleton.js";
import Friends from "./pages/Friends.js";
import Upload from "./pages/Upload.js";

import "../utilities.css";

const App = () => {
  const [userId, setUserId] = useState(undefined);
  const [currUserId, setCurrUserId] = useState(undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        setUserId(user._id);
        setCurrUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      setCurrUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(null);
    setCurrUserId(null);
    post("/api/logout");
  };

  return (
    <>
      <NavBar handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} setuserId={setUserId}/>

      <div className="App-container">
        <Router>
          <About path="/about" />
          <GoogleMaps path="/map" />
          <Feed path="/feed/:userId" />
          <Profile path="/profile/:userId" currUserId={currUserId}/>
          <Friends path="/friends/:userId" currUserId={currUserId}/>
          <Upload path="/upload/:userId" />
          <Chatbook path="/chat/:userId"/>
          <Skeleton path="/" handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
          <NotFound default />
        </Router>
      </div>
    </>
  );
};

export default App;
