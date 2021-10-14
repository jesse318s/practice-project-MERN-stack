const mongoose = require("mongoose");
require('dotenv').config();
const articles = require("./routes/articles");
const cors = require("cors");
const express = require("express");
const app = express();

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.once('open', () => { console.log("MongoDB database connection established successfully.") });

app.use(express.json());
app.use(cors());

app.use("/api/articles", articles);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));