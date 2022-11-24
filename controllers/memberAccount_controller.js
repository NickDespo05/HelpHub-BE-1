const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = express.Router();
const Account = require("../models/memberAccount");
const bcrypt = require("bcrypt");

/**
 * @TODO : (Frontend)
 * for the locations we need to access them via user input through a req.body through
 * a fetch request
 */

router.get("/", async (req, res) => {
    await Account.find({ accountType: "provider", location: req.body.location })
        .select("-password -_id")
        .lean()
        .then((foundAccount) => {
            res.json(foundAccount);

            res.status(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

//gets and account by id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    try {
        Account.findById(id)
            .select("-_id -password")
            .then((foundAccount) => {
                res.json(foundAccount);
            });
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

//route for login of user with the response being a json object excluding the id and password
//code pulled from: https://www.codegrepper.com/code-examples/javascript/mongoose+exclude+field+from+..find
// https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
router.post("/login", async (req, res) => {
    try {
        Account.findOne({ email: req.body.email }, (err, foundAccount) => {
            console.log(foundAccount);
            if (err) throw err;

            foundAccount.comparePassword(req.body.password, (err, isMatch) => {
                if (err) throw err;
                else if (isMatch == true) {
                    Account.findOne({ email: req.body.email })
                        .select("-password -_id")
                        .then((foundAccount) => {
                            res.json(foundAccount);
                        });
                } else {
                    res.status(404);
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
});

bcrypt.compare()
//makes new account with encrypted password
//documentation used: https://www.npmjs.com/package/mongoose-bcrypt
router.post("/", (req, res) => {
    Account.create(req.body, (err, createdAccount) => {
        console.log(createdAccount);
        res.json(createdAccount);
        if (!err) {
            createdAccount.verifyPassword(req.body.password, (err, valid) => {
                if (err) {
                    console.log(err);
                } else if (valid) {
                    console.log("valid");
                } else {
                    console.log("invalid");
                }
            });
        } else {
            console.log(err);
        }
    });
});

//edits account
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

//deletes account
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
