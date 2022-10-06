const mongoose = require("mongoose");
const memberAccount = require("./memberAccount");
const { Schema } = mongoose;

const jobSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            //to be determined
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
            contentTyps: String,
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
