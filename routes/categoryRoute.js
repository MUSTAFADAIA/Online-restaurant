const express = require("express");

const AuthService = require("../services/authService");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");
const router = express.Router();


router
  .route("/")
  .get(getCategories)
  .post(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategory
  );
router
  .route("/:id")
  .get(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    getCategory
  )
  .put(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    uploadCategoryImage,
    resizeImage,

    updateCategory
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    deleteCategory
  );
module.exports = router;
