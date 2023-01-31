const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = express.Router();
const Account = require("../models/memberAccount");
const Jobs = require("../models/job");

router.get("/account/name/:searchTerm", async (req, res) => {
    let search = await Account.find({ name: req.params.searchTerm });
    res.json(search);
});

router.get("/account/location/:location", async (req, res) => {
    let search = await Account.find({ location: req.params.location });
    res.json(search);
});

router.get("/job/location/:location", async (req, res) => {
    let search = await Jobs.find({ location: req.params.location });
    res.json(search);
});

router.get("/job/category/:category", async (req, res) => {
    let search = await Jobs.find({ category: req.params.category });
    res.json(search);
});

module.exports = router;
