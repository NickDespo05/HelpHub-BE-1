const mongoose = require("mongoose");
// const paymentInfo = require("./paymentInfo");

//pulled from https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
//the code below is checking for any of the characters in the variable in the email submitted
//if it they contain them it will throw an error
// const validateEmail = function (email) {
//     var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return re.test(email); //returns true or false
// };

// const validatePassword = (password) => {
//     var re = /[A-Z]/g;
//     return re.test(password);
// };

// //pulled from https://mongoosejs.com/docs/geojson.html
// const locationSchema = new Schema({
//     type: {
//         type: String,
//         enum: ["Point"], //the location.type must be a "point"
//         required: true,
//     },
//     coordinates: {
//         type: [Number],
//         required: true,
//     },
// });

const consumerAccountSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        // trim: true,
        // lowercase: true,
        // unique: true,
        // required: true,
        // validate: [validateEmail, "Please enter a valid email"], //this is the message displayed
        // required: "Email is required",
        // match: [
        //     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        //     "Please fill a valid email address",
        // ],
    },
    password: {
        type: String,
        // required: true,
        // validate: [
        //     validatePassword,
        //     "please enter a password with at least one uppercase character",
        // ],
    },
    // location: {
    //     type: locationSchema,
    // },
    age: {
        type: Number,
        // required: true,
        // min: 18,
        // max: 100,
    },
    paymentType: {
        type: String,
        // info: {
        //     ref: "paymentInfo",
        //     type: Schema.Types.ObjectId,
        //     required: true,
        // },
    },
});

const consumerAccount = mongoose.model(
    "consumerAccount",
    consumerAccountSchema
);
module.exports = consumerAccount;
