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

router.put("/setCurrentJob/:id", async (req, res) => {
    await Account.findByIdAndUpdate(req.params.id, {
        currentJob: req.body.currentJob,
    })
        .then((updatedAccount) => {
            console.log(req.body, "   f;hjdf;aklshf");
            res.status(200).json(updatedAccount);
        })
        .catch((err) => {
            console.log(err);
            res.status(404).json(err);
        });
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

router.put("/cancelJob/:id/:id2", async (req, res) => {
    try {
        console.log(req.params.id2);
        await Jobs.updateOne(
            { _id: req.params.id2 },
            {
                provider: "",
                status: "posted",
            }
        )
            .then((job) => console.log(job, "job"))
            .catch((err) => console.log(err));
        const updatedAccount = await Account.updateOne(
            { _id: req.params.id },
            {
                currentJob: "",
                status: "not"
            }
        )
            .then((account) => console.log(account, "account"))
            .catch((err) => console.log(err));
        console.log(req.params.id, "258");
        res.status(200).json(updatedAccount);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.put("/removeJob/:id", async (req, res) => {
    try {
        const acc = await Account.findById(req.params.id);
        const account = await Account.updateOne(
            { _id: req.params.id },
            {
                $pull: {
                    postedJobs: req.body.job,
                },
            }
        );
        console.log(acc, req.body);
        res.status(200).json(account);
        console.log(account, "err");
    } catch (err) {
        console.log(err, " err");
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
    if (id != "undefined" && id != undefined) {
        try {
            Account.find({ _id: req.params.id })
                // .select("-_id -password")
                .then((foundAccount) => {
                    console.log(req.body);
                    res.json(foundAccount);
                    console.log(foundAccount);
                });
        } catch (error) {
            res.status(500).json(error);
            console.log(error);
        }
    } else {
        console.log(req.body);
    }
});

module.exports = router;
