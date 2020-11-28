const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 5,
        max: 50
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 50
    },
    watchList: {
        type: [],
    }
});

module.exports = mongoose.model("User", userSchema, "users");