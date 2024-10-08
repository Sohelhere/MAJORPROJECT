const Listing = require("../models/listing");
const Review = require("../models/Reviews");

module.exports.createReview = async(req, res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("Reviw saved!");
    req.flash("success", "Review added!");
    res.redirect(`/listings/${listing._id}`);
}
module.exports.destroyReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    await Review.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Delted!");
    res.redirect(`/listings/${id}`);
}