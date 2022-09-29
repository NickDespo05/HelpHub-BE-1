const mongoose = require("mongoose");
const { Schema } = mongoose;
const consumerAccount = require("./models/consumerAccount");

const paymentInfoSchema = new Schema({
    info: {
        type: () => {
            if (consumerAccount.paymentType.type == "Debit card") {
                return {
                    cardNumber: {
                        type: Number,
                        required: true,
                    },
                    cvv: {
                        type: Number,
                        required: true,
                    },
                    date: {
                        type: Date(),
                        required: true,
                    },
                };
            }
        },
    },
});

const paymentInfo = mongoose.model("paymentInfo", paymentInfoSchema);
module.exports = paymentInfo;
