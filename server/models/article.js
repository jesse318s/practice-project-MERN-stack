const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    article: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    body: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("article", articleSchema);