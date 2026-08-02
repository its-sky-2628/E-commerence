const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },

        mobile: {
            type: String,
            required: true,
            trim: true
        },

        age: {
            type: Number,
            required: true
        },

        gender: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Customer", customerSchema);
