const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const res = require("express/lib/response");
require("dotenv").config();
const app = express();

app.get("/", (req, res) => {
    res.send("running");
});

app.listen(3000, () => {
    console.log("port connected");
});

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

mongoose.connect(
    "mongodb://localhost:27017",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("connected to mongo");
    }
);
