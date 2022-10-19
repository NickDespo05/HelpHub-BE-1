const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = express.Router();
const Account = require("../models/memberAccount");
const Jobs = require("../models/job");

//returns jobs in the area
router.get("/", async (req, res) => {
    await Jobs.find(
        Jobs.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [
                            parseFloat(req.query.lng),
                            parseFloat(req.query.lat),
                        ],
                    },
                    distanceField: "dist.calculated",
                    maxDistance: 2,
                    query: { category: "Parks" },
                    includeLocs: "dist.location",
                    spherical: true,
                },
            },
        ])
    )
        .lean()
        .then((jobsFound) => {
            res.json(jobsFound);
        })
        .catch((error) => {
            console.log(error);
            res.status(404);
        });
});

//[parseFloat(req.query.lng), parseFloat(req.query.lat)]

//returns a job by its id
router.get("/:id", async (req, res) => {
    await Jobs.findById(req.params.id)
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
    Jobs.findByIdAndDelete(req.params.id)
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
