// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewsSchema = new Schema({
    comment : String,
    rating : {
        type : Number,
        min : 1,
        max : 5
    },
    date : {
        type : Date,
        default : Date.now()
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
})

const Review = mongoose.model("Review", reviewsSchema);
module.exports =Review; 