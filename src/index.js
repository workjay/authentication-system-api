// load env variables
require("dotenv").config();

// create express app
const express = require("express");
const app = express();
const { sequelize } = require("./config/mysql");

let port = process.env.PORT || 8888;
const cors = require("cors");
const morgan = require("morgan");

// apply middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// use cors to allow access of our backend for specific urls
app.use(
  cors({
    origin: [process.env.APP_BASE_URL],
  })
);
// use morgan to print api calling logs into terminal
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).send(`<h1>Welcome to Authentication System</h1>`);
});

// import all routes
app.use("/api", require("./routes"));

// create common error handler for app
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    status: "0",
    message: "Something went wrong! Please try after sometime.",
  });
});

// test the database connection and listen the server
sequelize
  .authenticate()
  .then(() => {
    console.log(`Database has been connected successfully.`);
    app.listen(port, () => {
      console.log(
        `Server is started on port ${port}, Click here: http://localhost:${port} to visit`
      );
    });
  })
  .catch((err) => {
    console.error(err);
  });
