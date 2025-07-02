const categoryModel = require("../models/categoryModel");
const factory = require("./handlersFactory");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);
  }
  //Save image into our db
  req.body.image = filename;
  next();
});

//@desc   Get list of category
//@route   GET /api/v1/catecories
//@access   Public
exports.getCategories = factory.getAll(categoryModel);

//@desc   Get specific category by id
//@route   GET /api/v1/catecories/:id
//@access   public
exports.getCategory = factory.getOne(categoryModel);

//@desc   Create category
//@route   POST /api/v1/catecories
//@access   provate
exports.createCategory = factory.createOne(categoryModel);

//@desc   Update category
//@route   PUT /api/v1/catecories:id
//@access   provate
exports.updateCategory = factory.updateOne(categoryModel);

//@desc   Delete category
//@route   DELETE /api/v1/catecories/:id
//@access   provate
exports.deleteCategory = factory.deleteOne(categoryModel);
