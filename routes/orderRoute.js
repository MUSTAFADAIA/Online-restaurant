const express = require("express");

const AuthService = require("../services/authService");

const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../services/orderService");
const router = express.Router();

router
  .route("/")
  .get(getOrders)
  .post(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    createOrder
  );
router
  .route("/:id")
  .get(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    getOrder
  )
  .put(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    updateOrder
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    deleteOrder
  );
module.exports = router;
