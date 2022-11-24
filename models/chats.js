const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageLimit = (i) => {
    return i.length >= 10;
};

const chatSchema = new mongoose.Schema(
    {
        job: {
            type: Schema.Types.ObjectID,
            ref: "job",
            required: true,
        },
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
        sentBy: {
            type: [String],
        },
    },
    { toJson: { virtuals: true } }
);

chatSchema.virtual(
    "memberAccount",
    {
        ref: "memberAccount",
        localField: "_id",
        foreignField: "chats",
    },
    "job",
    {
        ref: "job",
        localField: "_id",
        foreignField: "chat",
    }
);

const chat = mongoose.model("chats", chatSchema);
module.exports = chat;

//room id = job id
//
