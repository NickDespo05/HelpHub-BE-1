const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = express.Router();
const Account = require("../models/memberAccount");
const bcrypt = require("bcrypt");
const jwt = require("json-web-token");

/**
 * @TODO : (Frontend)
 * for the locations we need to access them via user input through a req.body through
 * a fetch request
 */

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
    Account.create(req.body, (err, createdAccount) => {
        console.log(req.body);
        res.json(createdAccount);
        console.log(createdAccount);
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
            console.log(updatedAccount);
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

//OLD STUFF JUST HERE IN CASE IT ENDS UP BREAKING
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!(email && password)) {
//       res.status(400).send("All input is required");
//     }

//     const user = await Account.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       const token = jwt.sign(
//         { user_id: user._id, email },
//         process.env.JWT_SECRET,
//         { expiresIn: "2h" }
//       );

//       user.token = token;

//       res.status(200).json(user);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

//route for login of user with the response being a json object excluding the id and password
//code pulled from: https://www.codegrepper.com/code-examples/javascript/mongoose+exclude+field+from+..find
// https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
// router.post("/login", async (req, res) => {
//   try {
//     Account.findOne({ email: req.body.email }, (err, foundAccount) => {
//       if (err) {
//         console.log(req.body);
//         throw err;
//       }

//       foundAccount.comparePassword(req.body.password, (err, isMatch) => {
//         if (err) throw err;
//         else if (isMatch == true) {
//           Account.findOne({ email: req.body.email })
//             .select("-password -_id")
//             .then((foundAccount) => {
//               res.json({ foundAccount });
//             });
//         } else {
//           res.status(404);
//         }
//       });
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

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
