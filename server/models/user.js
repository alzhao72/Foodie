const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  email: String,
  bio: String,
  pfp: String,
  friends: [String],
  inReqs: [String],
  outReqs: [String],
  storyRank: [String],
  saved: [String]
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
