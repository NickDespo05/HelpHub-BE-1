const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = express.Router();
const Account = require("../models/memberAccount");
const Jobs = require("../models/job");
const { create } = require("../models/memberAccount");

//returns not completed jobs in the area
// router.get("/", async (req, res) => {
//   await Jobs.find({ location: req.body.location, notCompleted: true })
//     .lean()
//     .then((jobsFound) => {
//       res.json(jobsFound);
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(404);
//     });
// });

router.get("/", async (req, res) => {
    try {
        const jobs = await Jobs.find();
        res.json(jobs);
    } catch (error) {
        console.log(error);
        res.status(404);
    }
});

//returns a job by its id
router.get("/:id", async (req, res) => {
    try {
        console.log(req.params.id, " 35");
        const job = await Jobs.findById(req.params.id);
        console.log(job);
        res.status(200).json(job);
    } catch (err) {
        res.status(404).json(err);
    }

    // .then((foundJobs) => {
    //     res.json(foundJobs);
    //     console.log(foundJobs, " 37");
    // })
    // .catch((error) => {
    //     console.log(error);
    //     res.json(error);
    //     res.status(404);
    // });
});

//show job posted by specific user
router.get("/postedby/:postedBy", async (req, res) => {
    await Jobs.find({ postedBy: req.params.postedBy })
        .lean()
        .then((foundPoster) => {
            res.json(foundPoster);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

router.get("/provider/:provider", async (req, res) => {
    await Jobs.find({ provider: req.params.provider })
        .lean()
        .then((foundWorker) => {
            res.json(foundWorker);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

//show job by category
router.get("/category/:category", async (req, res) => {
    await Jobs.find({ category: req.params.category })
        .lean()
        .then((foundMatching) => {
            res.json(foundMatching);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

//creates a job
router.post("/", (req, res) => {
    Jobs.create(req.body)
        .then((createdJob) => {
            console.log(createdJob);
            res.status(200).json(createdJob);
        })
        .catch((error) => {
            console.log("error job Post \n");
            console.log(req.body);
            console.log(error);
            res.status(404).json(error);
        });
});

//updates a job and its info
router.put("/:id", async (req, res) => {
    if (req.body.providerId != undefined && req.body.providerId != null) {
        Jobs.updateOne(
            { _id: req.params.id },
            { providerId: req.params.providerId, status: "in progress" }
        )
            .then((updatedJob) => {
                console.log("107");
                res.json(updatedJob);
                console.log(updatedJob);
            })
            .catch((error) => {
                console.log(error, "Here at 100");
                console.log(req.body);
                res.json(error);
            });
    } else {
        Jobs.findByIdAndUpdate(req.params.id, req.body)
            .then((updatedJob) => {
                res.json(updatedJob);
                console.log(updatedJob);
            })
            .catch((error) => {
                res.json(error);
                res.status(400);
                console.log(error);
            });
    }
});

router.get("/requests/:id", async (req, res) => {
    Jobs.findById(req.params.id)
        .then((foundJob) => {
            res.status(200).json(foundJob.requests);
            console.log(foundJob.requests);
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });
});

//deletes a job
router.delete("/:id", (req, res) => {
    Jobs.findByIdAndDelete(req.params.id)
        .then((deletedJob) => {
            console.log(deletedJob);
            res.status(200).json(deletedJob);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

module.exports = router;
