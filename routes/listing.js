const express = require("express");
const router = express.Router()


const wrapAsynce = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { ListingSchema, reviewSchema } = require("../schema.js")
const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner } = require("../middleware.js");
const { index, renderNewForm, showListhing, renderEditForm,createListing, updateListing, deleteListing } = require("../controllers/listing.js");
const multer = require('multer')
const { cloudinary, storage} = require("../cloudConfig.js")
const upload = multer({ storage })


const validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) = el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

router.route("/")
    .get(wrapAsynce(index))
    .post(isLoggedIn, 
        upload.single('listing[image]'), 
        validateListing,
        wrapAsynce(createListing))
    

//create Route
router.get("/new", isLoggedIn, renderNewForm)
router.get("/:_id/edit", isLoggedIn, isOwner, wrapAsynce(renderEditForm))

router.route("/:_id")
    .get(wrapAsynce(showListhing))
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsynce(updateListing))
    .delete(isLoggedIn, isOwner, wrapAsynce(deleteListing))


module.exports = router;