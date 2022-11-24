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
            type: geoSchema,
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
        },
        image: {
            data: Buffer,
            contentType: String,
        },
        notCompleted: {
            type: Boolean,
            default: true,
            required: true,
        },
        chatRoom: {
            type: Schema.Types.ObjectID,
            ref: "chats",
        },
    },
    { toJson: { virtuals: true } }
);

jobSchema.virtual(
    "memberAccount",
    {
        ref: "memberAccount",
        localField: "_id",
        foreignField: "job",
    },
    "chats",
    {
        ref: "chats",
        localField: "_id",
        foreignField: "chat",
    }
);

const job = mongoose.model("job", jobSchema);
module.exports = job;
