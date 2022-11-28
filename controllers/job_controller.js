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
  await Jobs.findById(req.params.id)
    .then((foundJobs) => {
      res.json(foundJobs);
    })
    .catch((error) => {
      console.log(error);
      res.status(404);
    });
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
      console.log(error);
      res.status(404);
    });
});

//updates a job and its info
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
