const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
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

const memberAccountSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: true,
            validate: [validateEmail, "Please enter a valid email"], //this is the message displayed
            required: "Email is required",
        },
        password: {
            type: String,
            validate: [
                validatePassword,
                "please enter a password with at least one uppercase character",
            ],
            bcrypt: true,
            required: true,
        },
        location: {
            type: String,
            //prettier-ignore
            enum: ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",  ],
            required: true,
        },
        age: {
            type: Number,
            required: true,
            min: 18,
            max: 100,
        },

        postedJobs: {
            type: { type: Array, type: Schema.Types.ObjectID, ref: "job" },
        },
        jobsCompleted: {
            type: {
                type: Array,
                type: Schema.Types.ObjectID,
                ref: "job",
            },
        },

        accountType: {
            type: String,
            enum: ["consumer", "provider"],
            required: true,
        },
        dateCreated: {
            type: String,
            default: new Date().toLocaleDateString(),
            required: true,
        },
        requests: {
            type: {
                type: Array,
                type: Schema.Types.ObjectId,
                ref: "job",
            },
        },

        accountStatus: {
            type: String,
            enum: ["working", "not"],
        },
        currentJob: {
            type: Schema.Types.ObjectId,
            type: String, 
            ref: "job"
        }
    },
    { toJson: { virtuals: true } }
);

//gets # of jobs completed
memberAccountSchema.methods.getNumberOfJobs = () => {
    return `${this.name} has completed ${this.jobsCompleted.length} jobs.`;
};

//method called for comparison on login of existing user
//reference: https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
memberAccountSchema.methods.comparePassword = function (userPassword, cb) {
    bcrypt.compare(userPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//gets the # of jobs completed of the member
memberAccountSchema.virtual("jobs", {
    ref: "job",
    localField: "_id",
    foreignField: "memberAccount",
});

// plugin so bcrypt can be used
memberAccountSchema.plugin(require("mongoose-bcrypt"), { rounds: 10 });

const memberAccount = mongoose.model("memberAccount", memberAccountSchema);
module.exports = memberAccount;
