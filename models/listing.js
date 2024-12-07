const mongoose = require("mongoose")
const Shcema = mongoose.Schema;
const Review = require("../models/review.js");
const User = require("../models/user.js");
const { ref } = require("joi");

const listingSchema = new Shcema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url : String,
        filename : String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    geometry : {
        // type: {
        //   type: String, // Don't do `{ location: { type: String } }`
        //   enum: ['Point'], // 'location.type' must, be 'Point'
        //   required: true
        // },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      tags: {
        type: [String],
        enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "farms", "Arctic", "Domes", "Boats"],
        default: []
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({ _id: {$in : listing.reviews} })
    }
})

listingSchema.index({
    title: "text",
    // description: "text",
    // tags: "text"
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;