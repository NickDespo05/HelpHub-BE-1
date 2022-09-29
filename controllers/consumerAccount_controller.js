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

router.post("/", async (req, res) => {
    try {
        const createdAccount = await new Account({
            name: req.body.name,
            emai: req.body.email,
            password: req.body.password,
            location: req.body.location,
            age: req.body.age,
            paymentType: req.body.paymentType,
        }).save();
        res.json({ message: "created Account" });
        console.log("created account");
    } catch (error) {
        res.status(500).json({ message: "error on post" });
        console.log(error);
    }
});

module.exports = router;
