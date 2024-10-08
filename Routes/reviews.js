const express = require('express');
const router = express.Router({mergeParams: true});
const asyncWrap = require("../utils/asyncWrap.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewValidate, isLoggedIn, isReviewauthor} = require("../middleware.js");
const Review = require("../models/Reviews.js");
const controllerReview = require("../controller/reviews.js");

//Reviews Routes
//post Route
router.post("/", isLoggedIn, reviewValidate,  asyncWrap(controllerReview.createReview));

// Delete Route..
router.delete("/:reviewId", isLoggedIn, isReviewauthor, asyncWrap(controllerReview.destroyReview));

module.exports = router;