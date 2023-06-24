const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });

const ConnetDB = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Database Connected");
  });
  // .catch((err) => {
  //   console.log("Connection Error");
  //   console.log(err);
  //   process.exit(1);
  // });
};

module.exports = ConnetDB;
