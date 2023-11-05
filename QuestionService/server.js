const express = require("express");
const mongoose = require("mongoose");
const questionRoutes = require("./routes/questions");
const config = require("./config/config");

const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// go to question routes
app.use("/api/questions", questionRoutes);

// define port number
portNumber = 3003;

// connect to database
mongoose
  .connect(
    config.mongodbUri
    // "mongodb+srv://admin:70eLGyahMN7cDMd1@questioncluster.brpdmd1.mongodb.net/?retryWrites=true&w=majority"
    /*
    config.mongodbUri, // for testing
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } 
    */
  )
  .then(() => {
    console.log("connected to database");
    app.listen(portNumber, () => {
      console.log("listening for requests on port", portNumber);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;