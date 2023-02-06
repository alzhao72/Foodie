import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities"
import { socket } from "../../client-socket.js";
import { FriendCardBlock, InReqCardBlock, OutReqCardBlock } from "../modules/FriendCardBlock.js";
import FriendCard from "../modules/FriendCard.js";

import "../../utilities.css";
import "../modules/Friend.css"

const Friends = (props) => {
  const [user, setUser] = useState();
  const [cardUser, setCardUser] = useState(false);
  const [searchField, setSearchField] = useState("");
  const [userFriends, setUserFriends] = useState([]);
  const [userInReqs, setUserInReqs] = useState([]);
  const [userOutReqs, setUserOutReqs] = useState([]);

  useEffect(() => {
    document.title = "Friends Page";
	  get(`/api/user`, { userid: props.userId }).then((userObj) => {setUser(userObj)});
  }, [props.userId, props.currUserId]);



  useEffect(() => {
    const listenUnfriend = (data) => {
      if (data.recipient === props.currUserId && props.userId === props.currUserId) {
        get(`/api/user`, { userid: data.recipient }).then((recipientObj) => {
          let promises = []
          for (let i = 0; i < recipientObj.friends.length; i++) {
            promises.push(get("/api/user", { userid: recipientObj.friends[i] }));
          }
          Promise.all(promises).then((results) => {setUserFriends(results)});
        });
      }
    };
    socket.on("listenUnfriend", listenUnfriend);
    return () => {socket.off("listenUnfriend", listenUnfriend)};
  }, [props.userId, props.currUserId]);


  useEffect(() => {
    const listenIncoming = (data) => {
      if (data.recipient === props.currUserId && props.userId === props.currUserId) {
        get(`/api/user`, { userid: data.recipient }).then((recipientObj) => {
          let promises = [];
          for (let i = 0; i < recipientObj.inReqs.length; i++) {
            promises.push(get("/api/user", { userid: recipientObj.inReqs[i] }));
          }
          Promise.all(promises).then((results) => {setUserInReqs(results)});
        });
      }
    };

    socket.on("listenIncoming", listenIncoming);
    return () => {socket.off("listenIncoming", listenIncoming)};
  }, [props.userId, props.currUserId]);
  

  useEffect(() => {
    const listenResponse = (data) => {
      if (data.recipient === props.currUserId && props.userId === props.currUserId) {
        get(`/api/user`, { userid: data.recipient }).then((recipientObj) => {
          let promisesO = [];
          for (let i = 0; i < recipientObj.outReqs.length; i++) {
            promisesO.push(get("/api/user", { userid: recipientObj.outReqs[i] }));
          }
          Promise.all(promisesO).then((results) => {setUserOutReqs(results)});

          let promisesF = []
          for (let i = 0; i < recipientObj.friends.length; i++) {
            promisesF.push(get("/api/user", { userid: recipientObj.friends[i] }));
          }
          Promise.all(promisesF).then((results) => {setUserFriends(results)});
        });
      }
    };

    socket.on("listenResponse", listenResponse);
    return () => {socket.off("listenResponse", listenResponse)};
  }, [props.userId, props.currUserId]);

  const setFriendDisplay = (personObjArray) => {
    setUserFriends(personObjArray);
  };

  const setInReqsDisplay = (personObjArray) => {
    setUserInReqs(personObjArray);
  };

  const setOutReqsDisplay = (personObjArray) => {
    setUserOutReqs(personObjArray);
  };

  const addFriendDisplay = (personObjArray) => {
    setUserFriends(personObjArray.concat(userFriends));
  };

  const addInReqsDisplay = (personObjArray) => {
    setUserInReqs(personObjArray.concat(userInReqs));
  };

  const addOutReqsDisplay = (personObjArray) => {
    setUserOutReqs(personObjArray.concat(userOutReqs));
  };

  const removeFriendDisplay = (personObj) => {
    const checkPerson = (friendObj) => {return friendObj._id !== personObj._id;};
    setUserFriends(userFriends.filter(checkPerson));
  };

  const removeInReqsDisplay = (personObj) => {
    const checkPerson = (requesterObj) => {return requesterObj._id !== personObj._id;};
    setUserInReqs(userInReqs.filter(checkPerson));
  };

  const handleSearchChange = (event) => {
    setSearchField(event.target.value);
  };
  
  const searchUserEmail = (event) => {
    event.preventDefault();
    get("/api/userEmail", { targetEmail: searchField }).then((userObj) => {setCardUser(userObj)});
  };
  
  const searchRendering = () => {
    if (cardUser.length === 1){
      if (cardUser[0]?._id === props.currUserId){
        return <p> You! </p>
      } else{
        return <FriendCard 
                  user={user} 
                  cardUser={cardUser[0]} 
                  currUserId={props.currUserId} 
                  setFriendDisplay={setFriendDisplay}
                  setInReqsDisplay={setInReqsDisplay}
                  setOutReqsDisplay={setOutReqsDisplay}
                  addFriendDisplay={addFriendDisplay}
                  addInReqsDisplay={addInReqsDisplay}
                  addOutReqsDisplay={addOutReqsDisplay}  
                  removeFriendDisplay={removeFriendDisplay} 
                  removeInReqsDisplay={removeInReqsDisplay} 
                  userFriends={userFriends}
                  userInReqs={userInReqs}
                  userOutReqs={userOutReqs}
               /> 
      };
    } else if(cardUser.length === 0){
      return <p> No User With The Entered Email Exists </p>
    } 
  };

  if (!user || !props.currUserId) {
	  return (<> </>);
  };
  return (
    <div className="User-friends">

      {user?._id === props.currUserId && (<>
        <div className="FriendCardBlock-container">
          <h5> Search Users </h5>
          <div className="Hidden-scroll">
            <div className="NewFriendSearch-container">
              <input type="text" placeholder="Enter Email" onChange = {handleSearchChange} className="NewFriendSearch-input" />
              <button onClick = {searchUserEmail} className="NewFriendSearch-button"> Submit </button>
            </div>
            {searchRendering()}
          </div>
        </div>

        <div className="FriendCardBlock-container">
          <h5> Incoming Friend Requests </h5>
            <InReqCardBlock 
              user={user} 
              currUserId={props.currUserId}
              setFriendDisplay={setFriendDisplay}
              setInReqsDisplay={setInReqsDisplay}
              setOutReqsDisplay={setOutReqsDisplay}
              addFriendDisplay={addFriendDisplay}
              addInReqsDisplay={addInReqsDisplay}
              addOutReqsDisplay={addOutReqsDisplay}  
              removeFriendDisplay={removeFriendDisplay} 
              removeInReqsDisplay={removeInReqsDisplay} 
              userFriends={userFriends}
              userInReqs={userInReqs}
              userOutReqs={userOutReqs}
            />
            
          <h5> Outgoing Friend Requests </h5>
          <OutReqCardBlock 
            user={user} 
            currUserId={props.currUserId}
            setFriendDisplay={setFriendDisplay}
            setInReqsDisplay={setInReqsDisplay}
            setOutReqsDisplay={setOutReqsDisplay}
            addFriendDisplay={addFriendDisplay} 
            addInReqsDisplay={addInReqsDisplay}
            addOutReqsDisplay={addOutReqsDisplay} 
            removeFriendDisplay={removeFriendDisplay} 
            removeInReqsDisplay={removeInReqsDisplay} 
            userFriends={userFriends}
            userInReqs={userInReqs}
            userOutReqs={userOutReqs}
          />
        </div>
      </>)}

      <div className="FriendCardBlock-container" >
        <h5> {user.name}'s Friends </h5>
        <FriendCardBlock 
          user={user} 
          currUserId={props.currUserId} 
          setFriendDisplay={setFriendDisplay}
          setInReqsDisplay={setInReqsDisplay}
          setOutReqsDisplay={setOutReqsDisplay}
          addInReqsDisplay={addInReqsDisplay}
          addFriendDisplay={addFriendDisplay}
          addOutReqsDisplay={addOutReqsDisplay}  
          removeFriendDisplay={removeFriendDisplay} 
          removeInReqsDisplay={removeInReqsDisplay} 
          userFriends={userFriends}/>
      </div>

    </div>
  );
};
export default Friends;


