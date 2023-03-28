const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const methodOverride = require("method-override");
require("dotenv").config();
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const bcrypt = require("mongoose-bcrypt");
const defineCurrentUser = require("./middleware/defineCurrentUser");
const http = require("http");
const { Server } = require("socket.io");
const compression = require("compression");

//the code below came from: https://stackoverflow.com/questions/9177049/express-js-req-body-undefined?answertab=modifieddesc#tab-top
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(defineCurrentUser);

app.get("/", (req, res) => {
    res.send("running");
});

const memberAccount_controller = require("./controllers/memberAccount_controller");
app.use("/memberAccounts", memberAccount_controller);

const job_controller = require("./controllers/job_controller");
app.use("/jobs", job_controller);

app.use("/chats", require("./controllers/chat_controller"));

const search_controller = require("./controllers/search_controller");
app.use("/search", search_controller);

// const authentication_controller = require("./controllers/authentication");
// app.use("/authentication", authentication_controller);

app.post("/my-server/create-paypal-order", async (req, res) => {
    try {
        const order = await paypal.createOrder();
        res.json(order);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/my-server/capture-paypal-order", async (req, res) => {
    const { orderID } = req.body;
    try {
        const captureData = await paypal.capturePayment(orderID);
        res.status(200).json(captureData);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`connected at port ${process.env.PORT}`);
});

mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("connected to mongo");
    }
);
