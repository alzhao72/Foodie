import React, { useState, useEffect, useRef } from "react";
import { get, post } from "../../utilities"
import { socket } from "../../client-socket.js";
import { Link } from "@reach/router";
import PersonalFeed from "../modules/PersonalFeed.js";
import "../../utilities.css";
import "./Profile.css";
import panda from "../../public/panda eating.png";

const Profile = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [PFP, setPFP] = useState(panda);
  const [user, setUser] = useState();
  const [currUser, setCurrUser] = useState();
  const [isFriends, setIsFriends] = useState();

  useEffect(() => {
    document.title = "Profile Page";
	  get(`/api/user`, { userid: props.userId }).then((userObj) => {
      setUser(userObj);
      setPFP(userObj.pfp);
    });
    get(`/api/user`, { userid: props.currUserId }).then((userObj) => {
      setCurrUser(userObj);
      if (userObj.friends.includes(props.userId)) {
        setIsFriends("true");
      } else if (userObj.inReqs.includes(props.userId)) {
        setIsFriends("incoming");
      } else if (userObj.outReqs.includes(props.userId)) {
        setIsFriends("outgoing");
      } else {
        setIsFriends("false");
      }
    });
  }, [props.userId, props.currUserId]);

  const handleBioChange = (event) => {
    setBioInput(event.target.value);
  };

  const updateMyBio = (event) => {
    event.preventDefault();
    post(`/api/bio`, { userid: props.userId, newBio: bioInput }).then((userObj) => setUser(userObj));
    setEditMode(false);
    setBioInput("");
  };
  
  const friendCount = () => {
    const count = user.friends.length;
    if (count !== 1){
      return  <> <h4> {count} Friends </h4></>
    } else {
      return <> <h4> 1 Friend </h4></>
    }
  }

  const handleImageChange = async (event) => {
    event.preventDefault();

    const myImage = new FormData();
    myImage.append("image", event.target.files[0]);

    await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {Authorization: 'Client-ID b15bcccaa86b623',},
      body: myImage
    }).then((response) => response.json())
    .then((responseJSON) => {
      post("/api/pfp", { newPFP : responseJSON.data.link }).then((updatedUser) => {
        console.log("PFP Posted", responseJSON.data.link);
        setPFP(responseJSON.data.link);
      });
    }).catch((err) => {
        console.log("ERROR");
    });
  }

  const handleProfilePic = async (event) => {
    event.preventDefault();
  }

  useEffect(() => {
    const listenIncoming = (data) => {
      if (data.recipient === props.currUserId && data.sender === props.userId) {
        setIsFriends("incoming");
      }
    };
    socket.on("listenIncoming", listenIncoming);
    return () => {socket.off("listenIncoming", listenIncoming)};
  }, [props.userId, props.currUserId]);

  useEffect(() => {
    const listenUnfriend = (data) => {
      if (data.recipient === props.currUserId && data.sender === props.userId) {
        setIsFriends("false");
      }
    };
    socket.on("listenUnfriend", listenUnfriend);
    return () => {socket.off("listenUnfriend", listenUnfriend)};
  }, [props.userId, props.currUserId]);

  useEffect(() => {
    const listenResponse= (data) => {
      if (data.recipient === props.currUserId && data.sender === props.userId) {
        if (data.response === "accept") {
          setIsFriends("true");
        } else {
          setIsFriends("false");
        }
      }
    };
    socket.on("listenResponse", listenResponse);
    return () => {socket.off("listenResponse", listenResponse)};
  }, [props.userId, props.currUserId]);

  const addFriend = async (event) => {
    event.preventDefault();
    const resR1 = await post("/api/addFriend", {sender: props.userId, recipient: props.currUserId});
    const resS1 = await post("/api/addFriend", {sender: props.currUserId, recipient: props.userId});
    const resR2 = await post("/api/removeIncoming", {sender: props.userId, recipient: props.currUserId});
    const resS2 = await post("/api/removeOutgoing", {sender: props.userId, recipient: props.currUserId});

    if (resR1 && resS1 && resR2 && resS2){
      setIsFriends("true");
      post("/api/listenResponse", {response: "accept", sender: props.currUserId, recipient: props.userId}).then((res) => console.log(res));
    }
  };

  const requestFriend = async (event) => {
    event.preventDefault();
    const resR = await post("/api/addIncoming", {sender: props.currUserId, recipient: props.userId});
    const resS = await post("/api/addOutgoing", {sender: props.currUserId, recipient: props.userId});

    if (resR && resS){
      setIsFriends("outgoing");
      post("/api/listenIncoming", {sender: props.currUserId, recipient: props.userId}).then((res) => console.log(res));
    }
  };

  const declineFriend = async (event) => {
    event.preventDefault();
    const resR = await post("/api/removeIncoming", {sender: props.userId, recipient: props.currUserId});
    const resS = await post("/api/removeOutgoing", {sender: props.userId, recipient: props.currUserId});

    if (resR && resS){
      setIsFriends("false");
      post("/api/listenResponse", {response: "decline", sender: props.currUserId, recipient: props.userId}).then((res) => console.log(res));
    }
  };

  const removeFriend = async (event) => {
    event.preventDefault();
    const resR = await post("/api/removeFriend", {sender: props.userId, recipient: props.currUserId});
    const resS = await post("/api/removeFriend", {sender: props.currUserId, recipient: props.userId});

    if (resR && resS){
      setIsFriends("false"); 
      post("/api/listenUnfriend", {sender: props.currUserId, recipient: props.userId}).then((res) => console.log(res));
    }
  };

  const manageButton = () => {
    if (props.userId === props.currUserId){
      return <button className="editProfile-button" onClick={() => {setEditMode(true);}}> Edit Profile </button>
    } else if (isFriends === "true") {
      return <> <button className="editProfile-button" onClick={removeFriend}> Remove Friend </button> </>
    } else if (isFriends === "false") {
      return <> <button className="editProfile-button" onClick={requestFriend}> Send Friend Request </button> </>
    } else if (isFriends === "outgoing") {
      return <> <p className="Friend-p"> &nbsp; Friend Request Sent! </p> </>
    } else if (isFriends === "incoming") {
      return <> <p className="Friend-p"> &nbsp; Pending Friend Request </p>
        <button onClick={addFriend} className="editProfile-button"> Accept </button> &nbsp;
        <button onClick={declineFriend} className="editProfile-button"> Decline </button>
      </>
    }
  };

  if (!user || !currUser) {
	return (<>  </>);
  }
  return (
    <>
      <div className="Profile-headingContainer">
        <h1 className="Profile-heading u-inlineBlock"></h1>
      </div>

      <div className="profile-pic-div">
        
        {PFP === "" || !PFP ? (<img src={panda} className="photo"/>) : (<img src={PFP} className="photo"/>)}
        
        {props.userId === props.currUserId && <form action="" onSubmit={handleProfilePic}>
          <input type="file" id="file" className="file-link" onChange={handleImageChange} />
          <input type="submit" className="uploadBtn" value="Upload Post" />
          <label htmlFor="file" className="uploadBtn"> Choose Photo </label>
        </form>}
        
      </div>

    <div className="Profile-general">
      <div className="Profile-nameAndBio">
        <h1 className="Profile-avatarContainer Profile-name">{user.name}'s Profile </h1>
           
      <div className="Profile-bioContainer">
          
          {editMode ? (<>
            <textarea
              value={bioInput}
              onChange={handleBioChange}
              className="NewPostInput-input"
            />
          </>) : (<>
              <div id="profile-bioDescription"> {user.bio} </div>
          </>)}
        </div>
      </div>
      <div className="buffer">
      </div>      
      <div className="u-flex">
      <div className="Profile-subContainer u-textCenter">
          <h4 className="Profile-subTitle">
          {editMode ? (<>
            <button input className="editProfile-button" onClick={updateMyBio}> Submit </button> &nbsp;
            <button input className="editProfile-button" onClick={() => {setEditMode(false); setBioInput("");}}> Quit </button>
          </>) : (<>
            {manageButton()}
          </>)}
          </h4>
        </div>
        {/* <div className="Profile-subContainer u-textCenter">
          <h4 className="Profile-subTitle">{user.email}</h4>
        </div> */}
        
        <div className="Profile-subContainer u-textCenter">
          <h4> <Link to={`/friends/${props.userId}`} className="friends-link"> {friendCount()} </Link> </h4>
        </div>
      </div>

    <div class="line">
    </div>

    </div>

      <div className="Profile-headingContainer u-inlineBlock"> 
        <h4 className="Profile-ranking ">Posts</h4>
      </div>

      <PersonalFeed user={user} currUser={currUser} userId={props.userId} />

    </>
  );
};

export default Profile;