const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false
  },
  userID: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("Todo", TodoSchema);
