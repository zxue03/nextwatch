const express = require("express");
const movieApp = express();
const authRoute = require("./routes/auth");
const movieRoute = require("./routes/movies");
const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();
movieApp.use(express.static("public"));
movieApp.use(express.json());
movieApp.use("/api/user", authRoute);
movieApp.use("/api/user", movieRoute);

mongoose.connect(
        process.env.mongoConnect, 
        { useNewUrlParser: true,  useUnifiedTopology: true },
        () => console.log("Connected to db")
    );

movieApp.listen(3000, () => {
    console.log("Server is on");
})