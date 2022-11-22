const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = express.Router();
const Account = require("../models/memberAccount");
const Chats = require("../models/chats");

router.get("/consumer", async (req, res) => {
    await Chats.find({ consumerAccount: req.body.Account._id })
        .lean()
        .then((foundChats) => {
            res.json(foundChats);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

router.get("/provider", async (req, res) => {
    await Chats.find({ providerAccount: req.body.accountId })
        .lean()
        .then((foundChats) => {
            res.json(foundChats);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

router.get("/:id", async (req, res) => {
    await Chats.find(req.params.id)
        .lean()
        .then((foundChats) => {
            res.json(foundChats);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

router.post("/", async (req, res) => {
    await Chats.create(req.body)
        .then((createdChat) => {
            console.log(createdChat);
            res.status(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(400);
        });
});

router.put("/:id", async (req, res) => {
    await Chats.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedChats) => {
            console.log(updatedChats);
            res.status(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

router.delete("/id", (req, res) => {
    Chats.findByIdAndDelete(req.params.id)
        .then((deletedChats) => {
            console.log(deletedChats);
            res.status(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(400);
        });
});

module.exports = router;
