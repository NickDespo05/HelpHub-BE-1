const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = express.Router();
const Account = require("../models/memberAccount");
const Jobs = require("../models/job");
const { create } = require("../models/memberAccount");

Jobs.create({
    name: "Dog Walking",
    location: "PA",
    postedBy: "638ea25cb218100be91a4fa7",
    category: "petCare",
    status: "posted",
});

module.exports = router;
