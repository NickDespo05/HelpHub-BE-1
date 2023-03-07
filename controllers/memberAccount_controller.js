const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = express.Router();
const Account = require("../models/memberAccount");
const bcrypt = require("bcrypt");
const jwt = require("json-web-token");
const Jobs = require("../models/job");

router.get("/", async (req, res) => {
    await Account.find({ location: req.body.location })
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

router.get("/memberAccount", (req, res) => {
    res.json(req.currentUser);
    console.log("This is where its going");
    console.log(req.currentUser);
});

router.get("/getRequests/:id", async (req, res) => {
    const account = await Account.findById(req.params.id);
    const reqs = account.requests;

    res.status(200).json(reqs);
});

router.post("/login", async (req, res) => {
    let user = await Account.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        res.status(404).json({
            message:
                "Could not find a user with the provided email and/or password",
        });
    } else {
        const result = await jwt.encode(process.env.JWT_SECRET, {
            id: user._id,
        });

        res.json({ user: user, token: result.value });
    }
});

//makes new account with encrypted password
//documentation used: https://www.npmjs.com/package/mongoose-bcrypt
router.post("/", (req, res) => {
    if (req.body.accountType == "provider") {
        Account.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                location: req.body.location,
                age: req.body.age,
                jobsCompleted: [],
                accountType: req.body.accountType,
                requests: req.body.requests,
                accountStatus: "not",
                currentJob: "",
            },
            (err, createdAccount) => {
                console.log(req.body);

                console.log(createdAccount);
                if (!err) {
                    createdAccount.verifyPassword(
                        req.body.password,
                        (err, valid) => {
                            if (err) {
                                console.log(err);
                                res.json({ message: "error in validation" });
                            } else if (valid) {
                                console.log("valid");
                                res.status(200);
                                res.json(createdAccount);
                            } else {
                                console.log("invalid");
                            }
                        }
                    );
                } else {
                    res.status(400).json(err);
                    console.log(err, " hey");
                }
            }
        );
    } else if (req.body.accountType == "consumer") {
        Account.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                location: req.body.location,
                age: req.body.age,
                jobsCompleted: req.body.jobsCompleted,
                accountType: req.body.accountType,
                postedJobs: req.body.postedJobs,
            },
            (err, createdAccount) => {
                console.log(req.body);

                console.log(createdAccount);
                if (!err) {
                    createdAccount.verifyPassword(
                        req.body.password,
                        (err, valid) => {
                            if (err) {
                                console.log(err);
                                res.json({ message: "error in validation" });
                            } else if (valid) {
                                console.log("valid");
                                res.status(200);
                                res.json(createdAccount);
                            } else {
                                console.log("invalid");
                            }
                        }
                    );
                } else {
                    res.status(400).json(err);
                    console.log(err, " create job error");
                }
            }
        );
    }
});

//edits account, first checks the password if it is correct
router.put("/:id", async (req, res) => {
    let user = await Account.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        res.status(404).json({
            message: "Entered old password is incorrect",
        });
    } else {
        Account.findByIdAndUpdate(req.params.id, req.body)
            .then((updatedAccount) => {
                res.json(updatedAccount);
                console.log(updatedAccount, " 85");
            })
            .catch((error) => {
                console.log(error);
                res.json(error);
                res.status(404);
            });
        if (req.body.newPassword) {
            Account.findByIdAndUpdate(req.params.id, {
                password: req.body.newPassword,
            })
                .then((newPassword) => {
                    console.log(newPassword);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
});

//https://medium.com/stackfame/how-to-push-or-pop-items-into-mongodb-document-array-via-mongoose-in-node-js-express-js-91b7bbd0d218
router.put("/addJob/:id", async (req, res) => {
    Account.updateOne(
        { _id: req.params.id },
        {
            $push: { postedJobs: req.body.completedJob },
        }
    )
        .then((updatedAccount) => {
            console.log("job added route \n");
            res.json(updatedAccount);
            console.log(updatedAccount, " 181");
        })
        .catch((error) => {
            console.log(error, "Here at 100");
            res.json(error);
        });
});

router.put("/completeJob/:id", async (req, res) => {
    Account.findByIdAndUpdate(
        req.params.id,
        {
            $push: { jobsCompleted: req.body.completedJob },
        }
        // { safe: true, upsert: true }
    )
        .then((updatedAccount) => {
            res.json(updatedAccount);
        })
        .catch((error) => {
            console.log(error);
            res.json(error);
        });
});

router.put("/addRequest/:id", async (req, res) => {
    Account.updateOne(
        { _id: req.params.id },
        { $push: { requests: req.body.jobRequest } }
    )
        .then((updatedAccount) => {
            console.log(updatedAccount, " 142");
            res.json(updatedAccount);
            res.status(200);
        })
        .catch((err) => {
            res.json(err);
            console.log(err, "159nodemon");
            console.log(req.body, " 160");
            res.status(404);
        });
});

router.put("/removeRequest/:id/:id2", async (req, res) => {
    try {
        const updatedJob = await Jobs.updateOne(
            { _id: req.params.id2 },
            { $pull: { requests: req.body.accountId } }
        );

        const updatedAccount = await Account.updateOne(
            { _id: req.params.id },
            { $pull: { requests: req.body.job } }
        );

        res.status(200).json({ account: updatedAccount, job: updatedJob });
    } catch (err) {
        res.status(404).json(err);
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

module.exports = router;
