const mongoose = require("mongoose");

//define a comment schema for the database
const FriendRequestSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
});

// compile model from schema
module.exports = mongoose.model("friendRequest", FriendRequestSchema);