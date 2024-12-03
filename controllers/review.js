const Listing = require("../models/listing.js")
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params._id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    // res.redirect("/listings/:_id")
    console.log("new REviews saved!")
    req.flash("success", "new review created!")
    res.redirect(`/listings/${listing._id}`)
}

module.exports.distroyReview = async (req, res) => {
    let { _id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(_id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!")
    res.redirect(`/listings/${_id}`)
}