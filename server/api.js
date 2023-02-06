const express = require("express");

// import models 
const User = require("./models/user");
const Story = require("./models/story");
const Comment = require("./models/comment");
const Message = require("./models/message");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }
  res.send(req.user);
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.get("/story", (req, res) => {
  Story.findById(req.query.storyid).then((storyObj) => res.send(storyObj));
});

router.get("/stories", (req, res) => {
  Story.find({}).then((stories) => res.send(stories));
});

router.post("/story", (req, res) => {
  const newStory = new Story({
    creator_name: req.user.name,
    creator_id: req.user._id,
    content: req.body.content,
    title: req.body.title,
    rating: req.body.rating,
    image: req.body.image,
  });
  newStory.save().then((story) => res.send(story)).catch((err) => {
    return console.log("Error Posting Story to Feed");
  });
});

router.post("/deleteStory", (req, res) => {
  Story.deleteOne({ _id: req.body.storyid }).catch((err) => {
    return console.log("Error Deleting Story");
  });
});

router.post("/deleteStoryRank", (req, res) => {
  User.findById(req.user._id).then((userObj) => {
    const notStory = (storyId) => {
      return storyId !== req.body.storyid;
    };
    const copyRank = [...userObj.storyRank];
    const newRank = copyRank.filter(notStory);
    return Object.assign(userObj, {storyRank: newRank});
  }).then((userObj) => {
    return userObj.save();
  }).then((updatedUser) => {
    res.send(updatedUser);
  }).catch((err) => {
    return console.log("Error Removing Story From Rank");
  });
});

router.post("/insertStoryRank", (req, res) => {
  User.findById(req.user._id).then((userObj) => {
    if (userObj.storyRank.includes(req.body.storyid)){
      return Object.assign(userObj, {storyRank: userObj.storyRank});
    } else {
      return Object.assign(userObj, {storyRank: [req.body.storyid].concat(userObj.storyRank)});
    }
  }).then((userObj) => {
    return userObj.save();
  }).then((updatedUser) => {
    res.send(updatedUser);
  }).catch((err) => {
    return console.log("Error Updating Rank");
  });
});

router.post("/addSaved", (req, res) => {
  User.findById(req.user._id).then((userObj) => {
    if (userObj.saved.includes(req.body.storyid)){
      return Object.assign(userObj, {saved: userObj.saved});
    } else {
      return Object.assign(userObj, {saved: [req.body.storyid].concat(userObj.saved)});
    }
  }).then((userObj) => {
    return userObj.save();
  }).then((updatedUser) => {
    res.send(updatedUser);
  }).catch((err) => {
    return console.log("Error Saving to Liked Posts");
  });
});

router.post("/deleteSaved", (req, res) => {
  User.findById(req.user._id).then((userObj) => {
    const notStory = (storyId) => {
      return storyId !== req.body.storyid;
    };
    const copySaved = [...userObj.saved];
    const newSaved = copySaved.filter(notStory);
    return Object.assign(userObj, {saved: newSaved});
  }).then((userObj) => {
    return userObj.save();
  }).then((updatedUser) => {
    res.send(updatedUser);
  }).catch((err) => {
    return console.log("Error Removing Story From Rank");
  });
});

router.post("/likeCounter", (req, res) => {
  Story.findById(req.body.storyid).then((storyObj) => {
    if (!storyObj.likes) {
      return Object.assign(storyObj, {likes: [req.user._id]});
    }
    else if (req.body.increment === "+") {
      if (storyObj.likes.includes(req.user._id)){
        return Object.assign(storyObj, {likes: storyObj.likes});
      } else {
        return Object.assign(storyObj, {likes: [req.user._id].concat(storyObj.likes)});
      }
    } else {
      const notStory = (userId) => {
        return userId !== req.user._id;
      };
      const copyLikes = [...storyObj.likes];
      const newLikes = copyLikes.filter(notStory);
      return Object.assign(storyObj, {likes: newLikes})
    }
  }).then((storyObj) => {
    return storyObj.save();
  }).then((updatedStory) => {
    res.send(updatedStory);
  }).catch((err) => {
    return console.log("Error Incrementing Likes");
  });
});

router.get("/comment", (req, res) => {
  Comment.find({ parent: req.query.parent }).then((comments) => {
    res.send(comments);
  });
});

router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  }).catch((err) => {
    return console.log("Error Getting User");
  });
});
 
router.get("/userEmail", (req, res) => {
  User.find({ email: req.query.targetEmail }).then((users) => {
    res.send(users);
  });
});

router.post("/addFriend", (req, res) => {
  User.findById(req.body.sender).then((userObj) => {
    if (userObj.friends.includes(req.body.recipient)){
      return Object.assign(userObj, {friends: userObj.friends});
    } else {
      return Object.assign(userObj, {friends: [req.body.recipient].concat(userObj.friends)});
    }
  }).then((userObj) => {
    return userObj.save();
  }).then((updatedSender) => {
    res.send(updatedSender);
  }).catch((err) => {
    return console.log("Error Adding Friend");
  });
});

router.post("/addIncoming", (req, res) => {
  User.findById(req.body.recipient).then((userObj) => {
    if (userObj.inReqs.includes(req.body.sender)){
      return Object.assign(userObj, {inReqs: userObj.inReqs});
    } else {
      return Object.assign(userObj, {inReqs: [req.body.sender].concat(userObj.inReqs)});
    }
  }).then((userObj) => {
    return userObj.save();
  }).then((updatedRecipient) => {
    res.send(updatedRecipient);
  }).catch((err) => {
    return console.log("Error Adding Incoming Req");
  });
});

router.post("/listenIncoming", (req, res) => {
  const activeIDs = socketManager.getAllConnectedUsersIDs();
  const notif = { recipient: req.body.recipient, sender: req.body.sender };
  if (activeIDs.includes(req.body.recipient)){
    socketManager.getSocketFromUserID(req.body.recipient).emit("listenIncoming", notif);
  }
  res.send(notif);
});

router.post("/addOutgoing", (req, res) => {
  User.findById(req.body.sender).then((userObj) => {
    if (userObj.outReqs.includes(req.body.recipient)){
      return Object.assign(userObj, {outReqs: userObj.outReqs});
    } else {
      return Object.assign(userObj, {outReqs: [req.body.recipient].concat(userObj.outReqs)});
    }
  }).then((userObj) => {
    return userObj.save();
  }).then((updatedSender) => {
    res.send(updatedSender);
  }).catch((err) => {
    return console.log("Error Adding Outgoing Req");
  });
});

router.post("/removeFriend", (req, res) => {
  User.findById(req.body.sender).then((userObj) => {
    const notRecipient = (friendId) => {
      return friendId !== req.body.recipient;
    };
    const copyFriends = [...userObj.friends];
    const newFriends = copyFriends.filter(notRecipient);
    return Object.assign(userObj, {friends: newFriends});
  }).then((userObj) => {
    return userObj.save();
  }).then((updatedRecipient) => {
    res.send(updatedRecipient);
  }).catch((err) => {
    return console.log("Error Removing Friend");
  });
});

router.post("/removeIncoming", (req, res) => {
  User.findById(req.body.recipient).then((userObj) => {
    const notSender = (senderId) => {
      return senderId !== req.body.sender;
    };
    const copyIncoming = [...userObj.inReqs];
    const newIncoming = copyIncoming.filter(notSender);
    return Object.assign(userObj, {inReqs: newIncoming});
  }).then((userObj) => {
    return userObj.save();
  }).then((updatedRecipient) => {
    res.send(updatedRecipient);
  }).catch((err) => {
    return console.log("Error Removing Friend");
  });
});

router.post("/removeOutgoing", (req, res) => {
  User.findById(req.body.sender).then((userObj) => {
    const notRecipient = (recipientId) => {
      return recipientId !== req.body.recipient;
    };
    const copyOutgoing = [...userObj.outReqs];
    const newOutgoing = copyOutgoing.filter(notRecipient);
    return Object.assign(userObj, {outReqs: newOutgoing});
  }).then((userObj) => {
    return userObj.save();
  }).then((updatedSender) => {
    res.send(updatedSender);
  }).catch((err) => {
    return console.log("Error Removing Friend");
  });
});

router.post("/listenResponse", (req, res) => {
  const activeIDs = socketManager.getAllConnectedUsersIDs();
  const notif = { response: req.body.response, recipient: req.body.recipient, sender: req.body.sender };
  if (activeIDs.includes(req.body.recipient)){
    socketManager.getSocketFromUserID(req.body.recipient).emit("listenResponse", notif);
  }
  res.send(notif);
});

router.post("/listenUnfriend", (req, res) => {
  const activeIDs = socketManager.getAllConnectedUsersIDs();
  const notif = { recipient: req.body.recipient, sender: req.body.sender };
  if (activeIDs.includes(req.body.recipient)){
    socketManager.getSocketFromUserID(req.body.recipient).emit("listenUnfriend", notif);
  }
  res.send(notif);
});

router.post("/comment", (req, res) => {
  const newComment = new Comment({
    creator_name: req.user.name,
    creator_id: req.user._id,
    content: req.body.content,
    parent: req.body.parent,
    content: req.body.content,
  });
  newComment.save().then((comment) => res.send(comment));
});


router.post("/bio", (req, res) => {
  const newBio = req.body.newBio;

  User.findById(req.body.userid).then((userObj) => {
      return Object.assign(userObj, {bio: newBio});
  }).then((userObj) => {
      return userObj.save();
  }).then((updatedUser) => {
      res.send(updatedUser);
  }).catch((err) => {
      res.send(err);
  });

});

router.post("/pfp", (req, res) => {
  User.findById(req.user._id).then((userObj) => {
      return Object.assign(userObj, {pfp: req.body.newPFP});
  }).then((userObj) => {
      return userObj.save();
  }).then((updatedUser) => {
      res.send(updatedUser);
  }).catch((err) => {
      res.send(err);
  });

});

router.post("/storyRank", (req, res) => {
  const newRank = req.body.newRank;

  User.findById(req.body.userid).then((userObj) => {
      return Object.assign(userObj, {storyRank: newRank});
  }).then((userObj) => {
      return userObj.save();
  }).then((updatedRank) => {
      res.send(updatedRank);
  }).catch((err) => {
      res.send(err);
  });
});

//chatbook

router.post("/initsocket", (req, res) => {
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

router.get("/chat", (req, res) => {
  let query;
  if (req.query.recipient_id === "ALL_CHAT") {
    query = { "recipient._id": "ALL_CHAT" };
  } else {
    // get messages that are from me->you OR you->me
    query = {
      $or: [
        { "sender._id": req.user._id, "recipient._id": req.query.recipient_id },
        { "sender._id": req.query.recipient_id, "recipient._id": req.user._id },
      ]
    }
  }

  Message.find(query).then((messages) => res.send(messages));
});

router.post("/message", auth.ensureLoggedIn, (req, res) => {
  console.log(`Received a chat message from ${req.user.name}: ${req.body.content}`);
  const message = new Message({
    recipient: req.body.recipient,
    sender: {
      _id: req.user._id,
      name: req.user.name,
    },
    content: req.body.content,
  });
  message.save();

  if (req.body.recipient._id == "ALL_CHAT") {
    socketManager.getIo().emit("message", message);
  } else {
    socketManager.getSocketFromUserID(req.user._id).emit("message", message);
    if (req.user._id !== req.body.recipient._id) {
      socketManager.getSocketFromUserID(req.body.recipient._id).emit("message", message);
    }
  }
});

router.get("/activeUsers", (req, res) => {
  res.send({ activeUsers: socketManager.getAllConnectedUsers() });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
