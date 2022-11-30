const mongoose = require("mongoose");
//const memberAccount = require("./memberAccount");
const { Schema } = mongoose;

const chatSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    messages: {
      type: [{ type: Array }],
      default: [],
    },
    time: {
      type: String,
      contentType: String,
    },
    job_id: {
      type: Schema.Types.ObjectId,
      ref: "job",
    },
    jobOwner: {
      type: Schema.Types.ObjectId,
      ref: "memberAccount",
    },
    jobWorker: {
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
