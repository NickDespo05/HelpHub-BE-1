const mongoose = require("mongoose");
//const memberAccount = require("./memberAccount");
const { Schema } = mongoose;

const messageSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
});

const chatSchema = new mongoose.Schema(
    {
        messages: [messageSchema],
        job_id: {
            type: Schema.Types.ObjectId,
            ref: "job",
        },
        consumer: {
            type: Schema.Types.ObjectId,
            ref: "memberAccount",
        },
        provider: {
            type: Schema.Types.ObjectId,
            ref: "memberAccount",
        },
    },
    { toJson: { virtuals: true } }
);

chatSchema.virtual("memberAccount", {
    ref: "memberAccount",
    localField: "_id",
    foreignField: "job",
});

const chat = mongoose.model("chats", chatSchema);
module.exports = chat;
