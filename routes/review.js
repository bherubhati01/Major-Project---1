const express = require("express");
const router = express.Router({mergeParams : true})

const wrapAsynce = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { ListingSchema, reviewSchema } = require("../schema.js")
const Listing = require("../models/listing.js")
const Review = require("../models/review.js");
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");
const { createReview, distroyReview } = require("../controllers/review.js");



const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) = el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}


//Post Reviews Route
router.post("/",isLoggedIn, validateReview, wrapAsynce(createReview))

//Delete Reviews Route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsynce(distroyReview))

module.exports = router;