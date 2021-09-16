const mongoose = require("mongoose");
require('dotenv').config();

module.exports = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URL
        );
        console.log("Connected to database.");
    } catch (error) {
        console.log("Could not connect to database.", error);
    }
};