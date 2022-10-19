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
        name: {
            type: String,
            required: true,
        },
        location: {
            type: geoSchema,
            required: true,
        },
        postedBy: {
            type: Schema.Types.ObjectID,
            ref: "memberAccount",
            required: true,
        },

        provider: {
            type: Schema.Types.ObjectID,
            ref: "memberAccount",
        },
        image: {
            data: Buffer,
            contentType: String,
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
