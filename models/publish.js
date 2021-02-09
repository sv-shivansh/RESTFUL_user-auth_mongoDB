const mongoose = require("mongoose");

const publishSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "allUser",
  },
  isBlog: {
    type: Boolean,
    defult: false,
  },
  isTutorial: {
    type: Boolean,
    defult: false,
  },
  technology: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
});

module.exports = Publish = mongoose.model("publish", publishSchema);
