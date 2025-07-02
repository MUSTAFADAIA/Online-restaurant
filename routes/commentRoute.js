const express = require("express");

const AuthService = require("../services/authService");

const {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
  createFilterObj,
  setProductIdToBody
} = require("../services/commentService");
const router = express.Router();


router
  .route("/")
  .get(createFilterObj,getComments)
  .post(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    setProductIdToBody,
    createComment
  );
router
  .route("/:id")
  .get(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    getComment
  )
  .put(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    
    updateComment
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    deleteComment
  );
module.exports = router;
