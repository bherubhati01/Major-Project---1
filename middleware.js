const Listing = require("./models/listing");
const Review = require("./models/review");
const user = require("./models/user");

module.exports.isLoggedIn = (req, res, next) => {
    res.locals.currUser = req.user;
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must Login First!");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async(req, res, next) =>{
    let { _id } = req.params;
    let listing = await Listing.findById(_id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You Don't have Permission")
        return res.redirect(`/listings/${_id}`)
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) =>{
    let {_id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You Don't have Permission")
        return res.redirect(`/listings/${_id}`)
    }
    next();
}