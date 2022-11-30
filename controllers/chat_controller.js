const express = require("express");
require("dotenv").config();
const router = express.Router();

const Chats = require("../models/chat");

//returns all chats
router.get("/", async (req, res) => {
  try {
    const chat = await Chats.find();
    res.json(chat);
    res.status(200).json();
  } catch (error) {
    console.log(error);
    res.status(404);
  }
});

//returns a chat by its job id
router.get("/:id", async (req, res) => {
  await Chats.find({ job_id: req.params.id })
    .then((foundChat) => {
      res.json(foundChat);
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
  console.log(req.params.message);
  Chats.findOneAndUpdate(
    { job_id: req.params.id },
    //prettier-ignore
    { $push: { messages: req.body.message } },
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
    .then((deletedJob) => {
      console.log(deletedJob);
      res.status(200).json();
    })
    .catch((error) => {
      console.log(error);
      res.status(404);
    });
});

module.exports = router;
