const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const MapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: MapToken });
const maptilerClient = require("@maptiler/client")

maptilerClient.config.apiKey = "ycV99v98AW7SLuHN044s";


module.exports.index = async (req, res, next) => {
    const allListing = await Listing.find({});
    res.render("./index/index.ejs", { allListing, currUser: req.user })
}

module.exports.renderNewForm = (req, res, next) => {
    res.render("./index/new.ejs", { currUser: req.user })
}

module.exports.showListhing = async (req, res) => {
    let { _id } = req.params;
    const listing = await Listing.findById(_id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you Requested for does not exist!")
        res.redirect("/listings")
    }
    // console.log(listing)
    res.render("./index/show.ejs", { listing, currUser: req.user })
}

module.exports.createListing = async (req, res, next) => {
    // comment because the token is invalid
    // let response = await geocodingClient.forwardGeocode({
    //     query: req.body.listing.location,
    //     limit: 1
    //   }).send();
    // in an async function, or as a 'thenable':
    const result = await maptilerClient.geocoding.forward(req.body.listing.location);
    
    const { path: url, filename } = req.file;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }

    console.log(result.features[0].geometry)
    let locationCODE  = result.features[0].geometry;

    newListing.geometry = locationCODE;
    await newListing.save();
    console.log(req.body)
    req.flash("success", "New Listing is created!")
    res.redirect("/listings")
}

module.exports.renderEditForm = async (req, res) => {
    let { _id } = req.params;
    const listing = await Listing.findById(_id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing you Requested for Update does not exist!")
        res.redirect("/listings")
    }

    let originalImageURL = listing.image.url;
    originalImageURL = originalImageURL.replace("/upload","/upload/h_300,w_250")
    res.render("./index/Edit.ejs", { listing, currUser: req.user, originalImageURL })
}

module.exports.updateListing = async (req, res) => {
    let { _id } = req.params;
    let listing = await Listing.findByIdAndUpdate(_id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        const { path: url, filename } = req.file;
        listing.image = { url, filename }
        await listing.save();
    }
    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${_id}`)
}

module.exports.deleteListing = async (req, res) => {
    let { _id } = req.params;
    await Listing.findByIdAndDelete(_id);
    req.flash("success", "Listing is Deleted!")
    res.redirect("/listings")

}