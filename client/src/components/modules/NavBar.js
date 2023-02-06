import React from "react";
import { Link } from "@reach/router";
import "./NavBar.css";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "563732121786-em6bqfav47oin2kha948oabicagt0dgf.apps.googleusercontent.com";

const NavBar = ({ userId, handleLogin, handleLogout }) => {
  return (
    <nav className="NavBar-container">
      <div className="NavBar-title u-inlineBlock">
        <Link to="/" className="NavBar-link">
          FOODIE 
        </Link>
      </div>

      <div className="NavBar-linkContainer u-inlineBlock">
        {userId && (
          <Link to={`/feed/${userId}`} className="NavBar-link">
            Feed
          </Link>
        )}
        
        
        {userId && (
          <Link to={`/upload/${userId}`} className="NavBar-link">
            Upload
          </Link>
        )}

        {userId && (
          <Link to={`/profile/${userId}`} className="NavBar-link">
            Profile
          </Link>
        )}

        {userId && (
          <Link to={`/friends/${userId}`} className="NavBar-link">
            Friends
          </Link>
        )}
        {userId && (
          <Link to={`/chat/${userId}`} className="NavBar-link">
            Chat
          </Link>
        )}
      </div>
      <div className = "NavBar-right ">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {userId ? (<button input className="my-button" onClick={() => {
              googleLogout();
 
              handleLogout();
            }}> <Link to ='/' className="Logout-link"> Logout </Link> </button>) : (<GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />)
          }
        </GoogleOAuthProvider>
      </div>
    </nav>
  );
};

export default NavBar;
