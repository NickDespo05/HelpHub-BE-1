const mongoose = require("mongoose");
const memberAccount = require("./memberAccount");
const { Schema } = mongoose;

//creates geoJson location shcema
const geoSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "point",
    },
    coordinates: {
        type: [Number],
        index: "2dsphere",
    },
});

const jobSchema = new mongoose.Schema(
    {
        location: {
            type: Array,
            required: true,
        },
        postedBy: {
            type: Schema.Types.ObjectID,
            ref: "memberAccount",
            required: true,
        },
        category: {
            type: String,
            enum: ["landscaping", "petCare", "movingHelp", "homeCleaning"],
            required: true,
        },
        provider: {
            type: Schema.Types.ObjectID,
            ref: "memberAccount",
            default: null,
        },
        image: {
            data: Buffer,
            contentType: String,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["posted", "in progress", `completed`],
            default: "posted",
            required: true,
        },
    },

    { toJson: { virtuals: true } }
);

jobSchema.virtual("memberAccount", {
    ref: "memberAccount",
    localField: "_id",
    foreignField: "job",
});

const job = mongoose.model("job", jobSchema);
module.exports = job;
