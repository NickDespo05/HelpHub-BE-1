const mongoose = require("mongoose");
const { Schema } = mongoose;
const consumerAccount = require("./memberAccount");

const paymentInfoSchema = new Schema({
    info: {},
});

const paymentInfo = mongoose.model("paymentInfo", paymentInfoSchema);
module.exports = paymentInfo;

//this is just here if i need it
// type: () => {
// if (consumerAccount.paymentType.type == "Debit_card") {
//     return {
//         cardNumber: {
//             type: Number,
//             required: true,
//         },
//         cvv: {
//             type: Number,
//             required: true,
//         },
//         date: {
//             type: Date(),
//             required: true,
//         },
//     };
// } else if (consumerAccount.paymentType.type == "paypal") {
//     return {
//        email: {
//           type: String;
//       }
//     };
// }
/*
          My plan is to handle this in the future when needed, I do not know if i will need to 
          push the data myself or if the api i am provided with will do it for me nor the 
          neccesary format I need to store the data in yet ...
          */
//},
