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
        type: Date,
        default: Date.now,
    },
});

const chatSchema = new mongoose.Schema(
    {
        messages: {
            type: [messageSchema],

            default: [],
        },

        bothParties: {
            type: [Schema.Types.ObjectId],
            type: Schema.Types.ObjectId,
            ref: "memberAccount",
        },
    },
    { toJson: { virtuals: true } }
);

chatSchema.virtual("memberAccount", {
    ref: "memberAccount",
    localField: "_id",
    foreignField: "chat",
});

const chat = mongoose.model("chats", chatSchema);
module.exports = chat;
