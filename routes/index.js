// http://localhost:5000

const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const categoryRoute = require("./categoryRoute");
const commentRoute = require("./commentRoute");
const cartRoute = require("./cartRoute");
const productRoute = require("./productRoute");
const orderRoute = require("./orderRoute");

const mountRoutes = (app) => {
  app.use("/api/v2/users", userRoute);
  app.use("/api/v2/auth", authRoute);
  app.use("/api/v2/categories", categoryRoute);
  app.use("/api/v2/comment", commentRoute);
  app.use("/api/v2/order", orderRoute);

  app.use("/api/v2/cart", cartRoute);
  app.use("/api/v2/products", productRoute);
};

module.exports = mountRoutes;
