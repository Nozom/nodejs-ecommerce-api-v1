const express = require("express");
const ConnectDB = require("./config/DB");
require("dotenv").config({ path: "./config/.env" });
const logger = require("./middleware/logger");
const ApiError = require("./utils/ApiError");
const Globalerror = require("./middleware/GlobalError");

// express App
const app = express();

//Connect to DB
ConnectDB();

if (process.env.NODE_ENV === "development") {
  // middleware
  app.use(logger);
  console.log(`mode : ${process.env.NODE_ENV}`);
}

// middlewares
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Routes
app.get("/", (req, res) => {
  res.send("ecommerce api v1");
});

// Mount Routes
app.use("/api/v1/categories", require("./routes/category"));
app.use("/api/v1/products", require("./routes/product"));
app.use("/api/v1/brands", require("./routes/brand"));
app.use("/api/v1/subcategories", require("./routes/subcategory"));

app.all("*", (req, res, next) => {
  next(new ApiError(`cant find This route ${req.originalUrl}`, 500));
});
// Global Error Handeling for express
app.use(Globalerror);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`APP IS LISTENING ON PORT ${process.env.APP_BASE_URL}${PORT}`);
});

// Events ==> list ==> callback(err)
// Handel rejection outside express
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("shutting dowen....");
    process.exit(1);
  });
});
