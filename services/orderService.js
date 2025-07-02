const orderModel = require("../models/orderModel");
const factory = require("./handlersFactory");



//@desc   Get list of order
//@route   GET /api/v1/order
//@access   Public
exports.getOrders = factory.getAll(orderModel);

//@desc   Get specific order by id
//@route   GET /api/v1/order/:id
//@access   public
exports.getOrder = factory.getOne(orderModel);

//@desc   Create order
//@route   POST /api/v1/order
//@access   provate
exports.createOrder= factory.createOne(orderModel);

//@desc   Update category
//@route   PUT /api/v1/order:id
//@access   provate
exports.updateOrder = factory.updateOne(orderModel);

//@desc   Delete order
//@route   DELETE /api/v1/order/:id
//@access   provate
exports.deleteOrder = factory.deleteOne(orderModel);
