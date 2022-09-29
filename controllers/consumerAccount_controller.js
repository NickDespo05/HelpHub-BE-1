const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = express.Router();

router.get("/", (req, res) => {
    res.send("consumerAccount page");
});

module.exports = router;
