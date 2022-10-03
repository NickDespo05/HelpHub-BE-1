const mongoose = require("mongoose");
// const paymentInfo = require("./paymentInfo");

//pulled from https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
//the code below is checking for any of the characters in the variable in the email submitted
//if it they contain them it will throw an error
const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email); //returns true or false
};

const validatePassword = (password) => {
    var re = /[A-Z]/g;
    return re.test(password);
};

const consumerAccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate: [validateEmail, "Please enter a valid email"], //this is the message displayed
        required: "Email is required",
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    password: {
        type: String,
        required: true,
        validate: [
            validatePassword,
            "please enter a password with at least one uppercase character",
        ],
    },
    location: {
        type: String,
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 100,
    },
    paymentType: {
        type: String,
        info: {
            // ref: "paymentInfo",
            enum: ["debitCard", "creaditCard", "payPal", "Venmo"],
            required: true,
        },
    },
});

const consumerAccount = mongoose.model(
    "consumerAccount",
    consumerAccountSchema
);
module.exports = consumerAccount;
