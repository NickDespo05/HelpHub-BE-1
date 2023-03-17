const mongoose = require("mongoose");
const memberAccount = require("./memberAccount");
const { Schema } = mongoose;

const checkPrice = (price) => {
    const num = Number(price);
    if (num < 20) {
        return false;
    } else {
        return true;
    }
};

const jobSchema = new mongoose.Schema(
    {
        state: {
            type: String,
            enum: [
                "AL",
                "AK",
                "AZ",
                "AR",
                "CA",
                "CO",
                "CT",
                "DE",
                "FL",
                "GA",
                "HI",
                "ID",
                "IL",
                "IN",
                "IA",
                "KS",
                "KY",
                "LA",
                "ME",
                "MD",
                "MA",
                "MI",
                "MN",
                "MS",
                "MO",
                "MT",
                "NE",
                "NV",
                "NH",
                "NJ",
                "NM",
                "NY",
                "NC",
                "ND",
                "OH",
                "OK",
                "OR",
                "PA",
                "RI",
                "SC",
                "SD",
                "TN",
                "TX",
                "UT",
                "VT",
                "VA",
                "WA",
                "WV",
                "WI",
                "WY",
            ],
        },
        address: {
            type: String,
            required: true,
        },
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "memberAccount",
            required: true,
        },
        category: {
            type: String,
            enum: [
                "landscaping",
                "petCare",
                "movingHelp",
                "homeCleaning",
                "miscellaneous",
            ],
            required: true,
        },
        provider: {
            type: String,
        },
        image: {
            data: Buffer,
            contentType: String,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["posted", "in progress", `completed`],
            default: "posted",
            required: true,
        },
        price: {
            type: String,
            default: "$20",
            validate: [checkPrice, "Price must be above $20"],
            required: true,
        },
    },

    { toJson: { virtuals: true } }
);

jobSchema.virtual("memberAccount", {
    ref: "memberAccount",
    localField: "_id",
    foreignField: "job",
});

const job = mongoose.model("job", jobSchema);
module.exports = job;
