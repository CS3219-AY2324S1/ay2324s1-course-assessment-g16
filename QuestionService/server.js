const config = require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const questionRoutes = require("./routes/questions");
const cors = require("cors");

const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// cors middleware
app.use(
  cors({
    // origin: 'http://localhost:3000',
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);

// go to question routes
app.use("/api/questions", questionRoutes);

// define port number
const portNumber = 3003;

// connect to database
mongoose
  .connect(config.mongodbUri)
  .then(() => {
    console.log("connected to the database");
    app.listen(portNumber, () => {
      console.log("listening for requests on port", portNumber);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app