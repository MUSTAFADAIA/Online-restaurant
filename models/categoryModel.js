const mongoose = require("mongoose");

//Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [20, "Too long category name"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (dec) => {
  if (dec.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${dec.image}`;
    dec.image = imageUrl;
  }
};
//findOne, findAll and update
categorySchema.post("init", (dec) => {
  setImageURL(dec);
});
//create
categorySchema.post("save", (dec) => {
  setImageURL(dec);
});

//model
const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
