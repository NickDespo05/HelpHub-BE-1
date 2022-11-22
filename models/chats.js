const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageLimit = (i) => {
    return i.length <= 10;
};

const chatSchema = new mongoose.Schema(
    {
        providerAccount: {
            type: Schema.Types.ObjectID,
            ref: "memberAccount",
            default: undefined,
        },
        consumerAccount: {
            type: Schema.Types.ObjectID,
            ref: "memberAccount",
            default: undefined,
        },
        lastMessages: {
            type: [String],
            validate: [
                messageLimit,
                "ERROR more than 10 in the lastMessages array",
            ],
            default: [String],
        },
    },
    { toJson: { virtuals: true } }
);

chatSchema.virtual("memberAccount", {
    ref: "memberAccount",
    localField: "_id",
    foreignField: "chats",
});

const chat = mongoose.model("chats", chatSchema);
module.exports = chat;
