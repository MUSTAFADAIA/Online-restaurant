const express = require("express");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");
const router = express.Router();
const AuthService = require("../services/authService");
// const reviewRoute= require('../routes/reviewRoute')

// router.use('/:productId/reviews',reviewRoute)
router
  .route("/")
  .get(
    AuthService.protect,
    AuthService.allowedTo("user","admin", "manager"),
    getProducts
  )
  .post(
    AuthService.protect,
    AuthService.allowedTo("user","admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProduct
  );
router
  .route("/:id")
  .get(
    AuthService.protect,
    AuthService.allowedTo("user","admin", "manager"),
    getProduct
  )
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProduct
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    deleteProduct
  );
module.exports = router;
