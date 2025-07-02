const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "config.env" });
const dbConnection = require("./config/database");
const ApiError = require("./utills/apiError");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const mountRoutes = require("./routes");

//connect with db
dbConnection();
//app express
const app = express();
app.use(cors());
app.options("*", cors());

app.use(compression());

// Checkout webhook
// app.post(
//   "/webhook-checkout",
//   express.raw({ type: "application/json" }),
//   webhookCheckout
// );

app.use(compression());

//Middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
// else if(process.env.NODE_ENV == "production"){
//   app.use(morgan("prod"));
//   console.log(`mode: ${process.env.NODE_ENV}`);
// }
app.use(mongoSanitize());
app.use(xss());

//Routes
// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);
mountRoutes(app);

app.all("*", (req, res, next) => {
  //Create error and send it to error handling middleware
  // const err = new Error(`can't find this route: ${req.originalUrl}`)
  // next(err.message)

  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

//Global handler error for express
// app.use(globlError);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

//Handler rejaction outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors:${err.name} | ${err.message}`);

  server.close(() => {
    console.error("shutting dom.....");
    process.exit(1);
  });
});
