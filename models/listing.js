const mongoose = require("mongoose");
const scehma = mongoose.Schema;
const Review = require("./Reviews.js");
const { required } = require("joi");
const ListSchema = scehma({
    title:{
        type: String,
        required:true,
    },

    description:{
        type:String,
    },

    image:{

        url : String,
        filname: String,
    },

    price:{
        type:Number,
    },

    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    listingType:{
        type : String,
    },
    category: {
        type: String,
        enum: ["Trending", "Room", "Iconic Cities", "Mountains",
            "Castles", 
            "Amazing Pools", 
            "Camping",
            "Farms", 
            "Arctic"],
        required: true
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true,
          },
    },
});

ListSchema.post("findOneAndDelete", async(listing) =>{
    if(Listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    } 
});

const Listing = mongoose.model("Listing", ListSchema);
module.exports = Listing;