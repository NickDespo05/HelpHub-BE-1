const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = express.Router();
const Account = require("../models/consumerAccount");

router.get("/:id", (req, res) => {
    const id = req.params.id;
    try {
        Account.findById(id).then((foundAccount) => {
            res.json(foundAccount);
        });
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

router.post("/", (req, res) => {
    Account.create(req.body)
        .then((createdAccount) => {
            console.log(createdAccount);
            res.status(200);
        })
        .catch((error) => {
            console.log(error);
            res.send("404").status(404);
        });

    console.log("created account");
});

router.put("/:id", (req, res) => {
    try {
        Account.findByIdAndUpdate(req.params.id, req.body).then(
            (updatedAccount) => {
                res.json(updatedAccount);
            }
        );
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

router.delete("/:id", (req, res) => {
    try {
        Account.findByIdAndDelete(req.params.id).then((deletedAccount) => {
            res.json(deletedAccount);
        });
    } catch (error) {
        res.status(500).json({ message: "delete error" });
        console.log(error);
    }
});

module.exports = router;
