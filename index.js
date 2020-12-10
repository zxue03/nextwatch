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

movieApp.get("/", (req, res) => {
    res.send("Landing page")
})
mongoose.connect(
        "mongodb+srv://movieApp:movieApp@cluster0.lygfi.mongodb.net/movieApp?retryWrites=true&w=majority", 
        { useNewUrlParser: true,  useUnifiedTopology: true },
        () => console.log("Connected to db")
    );

movieApp.listen(process.env.PORT || 5000, () => {
    console.log("Server is on");
})