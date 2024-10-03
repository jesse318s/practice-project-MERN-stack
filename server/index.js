const mongoose = require("mongoose");
const connection = require("./db");
require("dotenv").config();
const articles = require("./routes/articles");
const cors = require("cors");
const express = require("express");
const app = express();

mongoose.set('strictQuery', false);

connection();

app.use(express.json());
app.use(cors());

app.use("/api/articles", articles);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
