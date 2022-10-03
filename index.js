const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("running");
});

const consumerAccount_controller = require("./controllers/consumerAccount_controller");
app.use("/consumerAccounts", consumerAccount_controller);

app.listen(3000, () => {
    console.log("port connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
    "mongodb://localhost:27017/HelpHub",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("connected to mongo");
    }
);
