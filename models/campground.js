const mongoose = require("mongoose"),
    Comment = require("./comment");

const campgroundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    price: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        username: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);