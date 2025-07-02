const mongoose = require("mongoose");

//Schema
const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "comment required"],
      minlength: [3, "Too short comment name"],
      maxlength: [20, "Too long comment name"],
    },

    comment: {
      type: String,
    },
     user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
  },
  { timestamps: true }
);


//findOne, findAll and update

//model
const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
