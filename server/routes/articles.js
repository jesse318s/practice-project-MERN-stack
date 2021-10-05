const Article = require("../models/article");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const article = await new Article(req.body).save();
        res.send(article);
    } catch (error) {
        res.send(error);
    }
});

router.get("/", async (req, res) => {
    try {
        const articles = await Article.find();
        res.send(articles);
    } catch (error) {
        res.send(error);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const article = await Article.findOneAndUpdate(
            { _id: req.params.id },
            req.body
        );
        res.send(article);
    } catch (error) {
        res.send(error);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        res.send(article);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;