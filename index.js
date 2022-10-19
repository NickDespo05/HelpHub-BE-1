const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const bcrypt = require("mongoose-bcrypt");

//the code below came from: https://stackoverflow.com/questions/9177049/express-js-req-body-undefined?answertab=modifieddesc#tab-top
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("running");
});

const memberAccount_controller = require("./controllers/memberAccount_controller");
app.use("/memberAccounts", memberAccount_controller);

const job_controller = require("./controllers/job_controller");
app.use("/jobs", job_controller);

app.listen(process.env.PORT, () => {
    console.log("port connected");
});

mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("connected to mongo");
    }
);
