const Listing = require("../models/listing")
module.exports.search = async(req,res)=>{
    // console.log(req.body.search)
    const allListing = await Listing.find(
        { $text: { $search: `"${req.body.search}"` } },
        { score: { $meta: "textScore" } } // Include text score
    ).sort({ score: { $meta: "textScore" } }); // Sort by score
    // console.log(allListing.length)
    res.render("./index/index", {allListing})
}

module.exports.tags = async (req,res)=>{
    // console.log(req.params.id)
    let tag = req.params.id;
    console.log(tag)
    let allListing = await Listing.find({tags : tag})
    console.log(allListing)
    res.render("tags", {allListing})
    // res.send("j")
}