const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = express.Router();
const Account = require("../models/memberAccount");
const Jobs = require("../models/job");

//returns jobs in the area
router.get("/", async (req, res) => {
    await Jobs.find()
        .lean()
        .then((jobsFound) => {
            res.json(jobsFound);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

//returns a job by its id
router.get("/:id", async (req, res) => {
    await Jobs.findbyId(req.params.id)
        .then((foundJobs) => {
            res.json(foundJobs);
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
            res.status(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

//updates a job
router.put("/:id", (req, res) => {
    Jobs.findByIdAndUpdate(req.params.id)
        .then((updatedJob) => {
            console.log(updatedJob);
            res.status(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

//deletes a job
router.delete("/:id", (req, res) => {
    Jobs.findbyIdAndDelete(req.params.id)
        .then((deletedJob) => {
            console.log(deletedJob);
            res.status(200);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

module.exports = router;
