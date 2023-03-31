const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new mongoose.Schema(
    {
        order: { type: Schema.Types.Mixed },
    },
    {
        toJson: { virtuals: true },
    }
);

const order = mongoose.model("order", orderSchema);
module.exports = order;
