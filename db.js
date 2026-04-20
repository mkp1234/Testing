const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.URI);
        // await mongoose.connect(URI);

        console.log("MongoDB connected successfully");

    } catch (error) {

        console.log("MongoDB connection error:", error);

        process.exit(1);

    }
};

module.exports = connectDB;