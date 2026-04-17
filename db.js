const mongoose = require('mongoose');
require("dotenv").config();

const URI = process.env.URI;

const connectDB = mongoose.connect(URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

module.exports = connectDB;