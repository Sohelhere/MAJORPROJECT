const mongoose = require("mongoose");
const scehma = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    comment:String,
    rating: {
        type:Number,
        min:1,
        max:5
    },
    craetedAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    },
});

module.exports = mongoose.model("Review", reviewSchema);