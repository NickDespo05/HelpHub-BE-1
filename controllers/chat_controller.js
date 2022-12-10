const express = require("express");
require("dotenv").config();
const router = express.Router();

const Chats = require("../models/chat");

//returns all chats
router.get("/account/:id", async (req, res) => {
    try {
        const chat = await Chats.find({ bothMembers: [req.params.id] });
        res.json(chat);
        res.status(200);
        console.log(chat);
    } catch (error) {
        console.log(error);
        res.status(404);
    }
});

//returns a chat by its id
router.get("/:id", async (req, res) => {
    await Chats.find({ _id: req.params.id })
        .then((foundChat) => {
            console.log(...foundChat);
            res.json(...foundChat);
            res.status(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

//creates a chat
router.post("/", (req, res) => {
    Chats.create(req.body)
        .then((createChat) => {
            console.log(createChat);
            res.status(200).json();
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

//updates a chat
router.put("/:id", (req, res) => {
    console.log(req.body);
    Chats.findOneAndUpdate(
        { _id: req.params.id },
        //prettier-ignore
        { $push: { messages: req.body.messages } },
        { new: true }
    )
        .then((updatedChat) => {
            console.log(updatedChat);
            res.status(200).json(updatedChat);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

//deletes a chat
router.delete("/:id", (req, res) => {
    Chats.findByIdAndDelete(req.params.id)
        .then((deletedChat) => {
            console.log(deletedChat);
            res.status(200).json();
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

module.exports = router;
