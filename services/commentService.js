const commentModel = require("../models/commentModels");
const factory = require("./handlersFactory");



exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObjects = filterObject;
  next();
};


exports.setProductIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if(!req.body.user) req.body.user=req.user._id
  next();
};
//@desc   Get list of comment
//@route   GET /api/v1/comment
//@access   Public
exports.getComments = factory.getAll(commentModel);

//@desc   Get specific comment by id
//@route   GET /api/v1/comment/:id
//@access   public
exports.getComment = factory.getOne(commentModel);

//@desc   Create comment
//@route   POST /api/v1/comment
//@access   provate
exports.createComment = factory.createOne(commentModel);

//@desc   Update comment
//@route   PUT /api/v1/comment:id
//@access   provate
exports.updateComment = factory.updateOne(commentModel);

//@desc   Delete comment
//@route   DELETE /api/v1/comment/:id
//@access   provate
exports.deleteComment = factory.deleteOne(commentModel);
