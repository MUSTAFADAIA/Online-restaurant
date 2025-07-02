const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

const productModel = require("../models/productModel");
const factory = require("./handlersFactory");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads//${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );

  }
      next();

});

//@desc   Get list of product
//@route   GET /api/v1/products
//@access   Public
exports.getProducts = factory.getAll(productModel, "Products");


//@desc   Get specific product by id
//@route   GET /api/v1/products/:id
//@access   public
exports.getProduct = factory.getOne(productModel, "reviews");

//@desc   Create product
//@route   POST /api/v1/products
//@access   provate
exports.createProduct = factory.createOne(productModel);

//@desc   Update product
//@route   PUT /api/v1/products:id
//@access   provate
exports.updateProduct = factory.updateOne(productModel);
//@desc   Delete product
//@route   DELETE /api/v1/products/:id
//@access   provate
exports.deleteProduct = factory.deleteOne(productModel);
