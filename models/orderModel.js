const mongoose = require("mongoose");

//Schema
const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "name required"],
      minlength: [3, "Too short  name"],
      maxlength: [20, "Too long  name"],
    },
    cardNumber:{
       type:Number,
      //  required: [true, "cardNumber required"],

    },
    expirydate:{
      type:Date,
      //  required: [true, "expirydate required"],

    },
    cvv:{
        type:Number,
      //  required: [true, "cvv required"],

    },

  },
  { timestamps: true }
);



//model
const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
